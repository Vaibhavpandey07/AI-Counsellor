import mongoose from "mongoose";
import { Universities } from "../models/universities.model.js";
import { UserOtherDetails } from "../models/UserOtherDetails.model.js";
import ApiError from "../utlis/ApiErrors.util.js";
import { ApiResponse } from "../utlis/ApiResponse.util.js";
import model from "../utlis/gemini.util.js";



export const aiChatController = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const { message } = req.body;

    if (!message) {
      throw new ApiError(400, "Message is required");
    }

    // 1️⃣ Get student profile + acceptance scores
    const userDetails = await UserOtherDetails.findOne({ user_id: userId });
    if (!userDetails) {
      throw new ApiError(404, "User profile not found");
    }

    const acceptanceScores = userDetails.universitiesAcceptanceScore || [];

    // 2️⃣ Select TOP 10 universities by acceptanceScore
    const topUniversityIds = acceptanceScores
      .sort((a, b) => b.acceptanceScore - a.acceptanceScore)
      .slice(0, 10)
      .map(u => new mongoose.Types.ObjectId(u.university_id));

    // 3️⃣ Fetch full university data
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

    // 4️⃣ Prepare AI prompt
    const systemPrompt = `
You are an AI education counselor.

Rules:
- Respond with ONE JSON object only
- JSON keys allowed:
  - type (recommendation | comparison | followup | general | explanation)
  - message (markdown supported, single message)
  - universitiesMentioned (array of university names)
- Mention university names only if relevant
- Do NOT invent universities
- Be concise, helpful, and student-friendly
`;

    const userPrompt = `
Student Profile:
${JSON.stringify(userDetails.studentProfile, null, 2)}

Top Universities (pre-filtered for this student):
${JSON.stringify(universities, null, 2)}

User Question:
"${message}"

Respond based on intent.
`;

    const result = await model.generateContent([
      { role: "system", parts: [{ text: systemPrompt }] },
      { role: "user", parts: [{ text: userPrompt }] }
    ]);

    const aiRawResponse = result.response.text();

    // 6️⃣ Parse AI JSON safely
    let aiResponse;
    try {
      aiResponse = JSON.parse(aiRawResponse);
    } catch (err) {
      throw new ApiError(500, "AI response format error");
    }

    // 7️⃣ Final response
    return res
      .status(200)
      .send(new ApiResponse(200, "AI response generated", aiResponse));

  } catch (err) {
    console.error("AI CHAT ERROR:", err);
    throw new ApiError(500, err.message);
  }
};