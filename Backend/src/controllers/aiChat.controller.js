import mongoose from "mongoose";
import { Universities } from "../models/universities.model.js";
import { UserOtherDetails } from "../models/UserOtherDetails.model.js";
import ApiError from "../utlis/ApiErrors.util.js";
import { ApiResponse } from "../utlis/ApiResponse.util.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { UserOnBoarding } from "../models/UserOnBoarding.model.js";
import { generateAllUniversitiesScoreOffline } from "../services/generateUniversityScore.service.js";






dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });





const safeJsonParse = (rawText) => {
  if (!rawText || typeof rawText !== "string") return null;

  try {
    // 1️⃣ Remove markdown code fences
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // 2️⃣ Parse JSON
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("JSON parse failed:", rawText);
    return null;
  }
};










export const aiChatController = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const { message } = req.body;

    if (!message) {
      throw new ApiError(400, "Message is required");
    }

    // 1️⃣ Get student profile + acceptance scores
    
    const userOnBoarding = await UserOnBoarding.findOne({user_id:req.userId});
    const userOtherdetails = await UserOtherDetails.findOne({user_id:req.userId});
    if(!userOnBoarding || !userOtherdetails ){
        throw new ApiError(404, "User Has not Onboarded",[]);
    }
    const student = {
        educationBackground : {
                currentEducationLevel : userOnBoarding.currentEducationLevel,
                major : userOnBoarding.major,
                yearOfGraduation : userOnBoarding.yearOfGraduation,
                marks : userOnBoarding.marks,
        },

        targettedCourse :{
            degreeToAchieve : userOnBoarding.degreeToAchieve,
            degreeField : userOnBoarding.degreeField,
            intake : userOnBoarding.intake,
            intakeYear : userOnBoarding.intakeYear,

            budget :userOnBoarding.budget,
            targetCountries :userOnBoarding.targetCountries,
            fundingPlan : userOnBoarding.fundingPlan,
            haveScholarship : userOnBoarding.haveScholarship,
        },

        givenExamDetials :{
            examGiven :userOnBoarding.examGiven,
            examScore :userOnBoarding.examScore,
            otherExamGiven :userOnBoarding.otherExamGiven,
        },

        profileStrength:userOtherdetails.profileStrength,
        profileWeakness:userOtherdetails.profileWeakness,
        currentStage : userOtherdetails.currentStage,
        aiTodoList : userOtherdetails.aiTodoList,
        currentTodoStage : userOtherdetails.currentTodoStage,
        shortlistedUniversities : userOtherdetails.shortlistedUniversities,
        profileScore : userOtherdetails.profileScore,

    }



    let acceptanceScores = userOtherdetails.universitiesAcceptanceScore || [];
    if(acceptanceScores.length ==0){

      const universitiesAcceptanceScore = await  generateAllUniversitiesScoreOffline(student);;
       userOtherdetails.universitiesAcceptanceScore = universitiesAcceptanceScore;
       acceptanceScores = universitiesAcceptanceScore;
       await userOtherdetails.save({validationBeforeSave:false});
    }
    // 2️⃣ Select TOP 5 universities by acceptanceScore


    const topUniversityIds = acceptanceScores
      .sort((a, b) => b.acceptanceScore - a.acceptanceScore)
      .slice(0, 8)
      .map(u => new mongoose.Types.ObjectId(u.university_id));

    // 3️⃣ Fetch full university data

    console.log(topUniversityIds);
    const universities = await Universities.find(
      { _id: { $in: topUniversityIds } },
      {
        code: 1,
        universityName: 1,
        city: 1,
        country: 1,
        countryCode: 1,
        website: 1,
        Description: 1,
        courses: 1,
        scholarships: 1,
        entry_paths: 1,
        numberOfStudents: 1,
        internationStudentsPercent: 1,
        isInTop200: 1,
        feeBand: 1,
        requirements: 1
      }
    ).lean();


const prompt = `
SYSTEM:
You are an AI education counselor.

Rules:
- Respond with ONE valid JSON object only
- Response MUST be JSON.parse compatible
- NO markdown, NO backticks, NO extra text
- Allowed "type" values:
  - "info"
  - "advice"
  - "shortlist_action"

If user intent implies selecting or finalizing universities:
- Return type = "shortlist_action"
- Pick MAX 3 universities
- Only select from TOP UNIVERSITIES provided
- Include university_id exactly as given
- Include a short reason for each

Allowed JSON keys:
- type
- message
- universitiesMentioned

STUDENT PROFILE:
${JSON.stringify(student, null, 2)}

TOP UNIVERSITIES:
${JSON.stringify(
  universities.map(u => ({
    _id: u._id,
    universityName: u.universityName,
    country: u.country,
    isInTop200: u.isInTop200,
    feeBand: u.feeBand,
  })),
  null,
  2
)}

USER QUESTION:
"${message}"
`;
    const result = await model.generateContent(prompt);

    const aiRawResponse = result.response.text();

    // 6️⃣ Parse AI JSON safely
    console.log(aiRawResponse);
    const parsed = safeJsonParse(aiRawResponse);

    if (!parsed) {
      throw new Error("Invalid AI JSON response");
    }

if (parsed.type === "shortlist_action" && parsed.universitiesMentioned) {
  const universityIds = parsed.universitiesMentioned
    .map(u => u.university_id)
    .filter(Boolean);

  // Safety checks
  const validUniversities = await Universities.find({
    _id: { $in: universityIds },
  }).select("_id");

  const validIds = validUniversities.map(u => u._id);

  // Add to shortlist (idempotent)
  await UserOtherDetails.updateOne(
    { user_id: userId },
    {
      $addToSet: {
        shortlistedUniversities: { $each: validIds }
      },
      $set: { currentStage: 3 }
    }
  );

  return res.status(200).send(
    new ApiResponse(
      200,
      "Universities shortlisted successfully",
      parsed
    )
  );
}

    // 7️⃣ Final response
    return res
      .status(200)
      .send(new ApiResponse(200, "AI response generated", parsed));

  } catch (err) {
    console.error("AI CHAT ERROR:", err);
    throw new ApiError(500, err.message);
  }
};