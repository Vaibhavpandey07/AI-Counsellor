import { Universities } from "../models/universities.model.js";


// /* -------------------- HELPERS -------------------- */

// // normalize strings like "Computer Science" → "computer_science"
// const normalize = (val = "") =>
//   val.toString().toLowerCase().replace(/\s+/g, "_");

// // safely convert ANY type to lowercase string
// const toSafeString = (val) => {
//   if (Array.isArray(val)) return val.join(" ").toLowerCase();
//   if (typeof val === "string") return val.toLowerCase();
//   if (val === null || val === undefined) return "";
//   return String(val).toLowerCase();
// };

// /* -------------------- CORE SCORING -------------------- */

// function getUniversityScoreAndLikelihood(student, university) {
//   const reasons = [];

//   const degree = normalize(student?.targettedCourse?.degreeToAchieve);
//   const field = normalize(student?.targettedCourse?.degreeField);
//   const marks = Number(student?.educationBackground?.marks || 0);
//   const entryLevel = normalize(student?.educationBackground?.currentEducationLevel);

//   /* ---------- DEGREE / ENTRY CHECK ---------- */
//   if (!university.entry_paths) {
//     return {
//       universityCode: university.code,
//       universityName: university.universityName,
//       score: 20,
//       likelihood: "Low",
//       reasons: ["Entry path information not available"],
//     };
//   }

//   /* ---------- COURSE MATCH ---------- */
//   const courseMatch = university.courses?.some((c) => {
//     const level = toSafeString(c.level);
//     const category = toSafeString(c.category);

//     return level.includes(degree) && category.includes(field);
//   });

//   const courseScore = courseMatch ? 100 : 60;
//   reasons.push(
//     courseMatch ? "Relevant course available" : "Course match not clear"
//   );

//   /* ---------- ACADEMIC SCORE ---------- */
//   let academicScore = 40;

//   if (degree === "bachelor") {
//     academicScore =
//       marks >= 75 ? 100 : marks >= 65 ? 75 : marks >= 55 ? 50 : 30;
//   }

//   if (degree === "masters") {
//     academicScore = marks >= 65 ? 100 : marks >= 60 ? 70 : 40;
//   }

//   reasons.push(`Academic performance: ${marks}%`);

//   /* ---------- ENGLISH EXAM ---------- */
//   let examScore = 50;
//   const exam = student?.givenExamDetials?.examGiven?.toLowerCase();
//   const examValue = Number(student?.givenExamDetials?.examScore);

//   if (exam === "ielts") {
//     examScore = examValue >= 6.5 ? 100 : examValue >= 6 ? 70 : 40;
//     reasons.push(`IELTS score: ${examValue}`);
//   } else {
//     reasons.push("English proficiency test not provided");
//   }

//   /* ---------- ENTRY BACKGROUND ---------- */
//   let entryPathScore = 40;

//   if (["a_level", "ib", "bachelor", "masters"].includes(entryLevel)) {
//     entryPathScore = 100;
//   } else if (entryLevel === "foundation") {
//     entryPathScore = 85;
//   } else if (["ond", "hnd"].includes(entryLevel)) {
//     entryPathScore = 65;
//   }

//   reasons.push(`Entry qualification: ${entryLevel}`);

//   /* ---------- COMPETITIVENESS ---------- */
//   const competitivenessPenalty =
//     university.Description?.toLowerCase().includes("competitive") ? 10 : 0;

//   /* ---------- FINAL SCORE ---------- */
//   let score =
//     0.35 * academicScore +
//     0.25 * examScore +
//     0.2 * entryPathScore +
//     0.2 * courseScore -
//     competitivenessPenalty;

//   score = Math.max(0, Math.min(100, Math.round(score)));

//   let likelihood = "Low";
//   if (score >= 75) likelihood = "High";
//   else if (score >= 55) likelihood = "Medium";

//   return {
//     universityCode: university.code,
//     universityName: university.universityName,
//     score,
//     likelihood,
//     reasons,
//   };
// }

// /* -------------------- BULK GENERATOR -------------------- */

// const generateAllUniversitiesScore = async (student) => {
//   try {
//     const universities = await Universities.find({}).lean();

//     return universities.map((uni) => {
//       const result = getUniversityScoreAndLikelihood(student, uni);

//       return {
//         university_id: uni._id,
//         acceptanceScore: result.score,
//         likelihood: result.likelihood,
//         reasons: result.reasons,
//       };
//     });
//   } catch (err) {
//     console.error("University scoring error:", err);
//     return [];
//   }
// };

// export { generateAllUniversitiesScore };



// import { Universities } from "../models/universities.model.js";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";
// dotenv.config();
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// /* -------------------- SAFE JSON PARSER -------------------- */
// const safeJsonParse = (text) => {
//   try {
//     const cleaned = text
//       .replace(/```json/gi, "")
//       .replace(/```/g, "")
//       .trim();

//     return JSON.parse(cleaned);
//   } catch {
//     return null;
//   }
// };

// /* -------------------- AI-BASED SCORING FUNCTION -------------------- */

// const generateAllUniversitiesScoreWithAI = async (studentProfile,universities) => {
//   try {
//     if (!studentProfile) {
//       throw new Error("studentProfile missing");
//     }


//     if (!universities.length) return [];

//     /* ---------- PROMPT ---------- */
//     const prompt = `
// You are an expert international admissions counselor.

// TASK:
// For EACH university, calculate:
// - acceptanceScore (0–100)
// - likelihood ("High" | "Medium" | "Low")
// - reasons (short bullet points)

// SCORING LOGIC (GUIDELINES):
// - Academics: 35%
// - English exam: 25%
// - Entry background: 20%
// - Course relevance: 20%
// - Penalize very competitive universities slightly

// OUTPUT RULES (STRICT):
// - Respond with ONE JSON ARRAY only
// - No text outside JSON
// - Each object MUST be in this format:

// {
//   "universityCode": string,
//   "acceptanceScore": number,
//   "likelihood": "High" | "Medium" | "Low",
//   "reasons": string[]
// }

// STUDENT PROFILE:
// ${JSON.stringify(studentProfile, null, 2)}

// UNIVERSITIES:
// ${JSON.stringify(universities, null, 2)}
// `;

//     /* ---------- GEMINI CALL ---------- */
//     const result = await model.generateContent(prompt);
//     const rawText = result.response.text();

//     const aiResponse = safeJsonParse(rawText);
//     console.log(aiResponse);
//     if (!Array.isArray(aiResponse)) {
//       throw new Error("Invalid AI response format");
//     }

//     /* ---------- MAP TO REQUIRED STRUCTURE ---------- */
//     const universityIdMap = new Map(
//       universities.map((u) => [u.code, u._id])
//     );

//     return aiResponse
//       .filter((u) => universityIdMap.has(u.universityCode))
//       .map((u) => ({
//         university_id: universityIdMap.get(u.universityCode),
//         acceptanceScore: Math.max(
//           0,
//           Math.min(100, Math.round(u.acceptanceScore))
//         ),
//         likelihood: u.likelihood,
//         reasons: Array.isArray(u.reasons) ? u.reasons : [],
//       }));

//   } catch (err) {
//     console.error("AI university scoring failed:", err);
//     return [];
//   }
// };

// export { generateAllUniversitiesScoreWithAI };



/* -----------------------------------------------------
   OFFLINE UNIVERSITY EVALUATION ENGINE
----------------------------------------------------- */

/* -------------------- HELPERS -------------------- */

const normalize = (val = "") =>
  val.toString().toLowerCase().replace(/\s+/g, "_");

const safeLower = (val) => {
  if (Array.isArray(val)) return val.map(v => String(v).toLowerCase());
  if (typeof val === "string") return val.toLowerCase();
  if (val === null || val === undefined) return "";
  return String(val).toLowerCase();
};

const clamp = (num, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(num)));

/* -------------------- ACADEMIC SCORE -------------------- */

const calculateAcademicScore = (student, uni, reasons) => {
  const marks = Number(student.educationBackground?.marks || 0);
  const targetDegree = normalize(student.targettedCourse?.degreeToAchieve);

  let score = 40;

  if (targetDegree === "bachelor") {
    score =
      marks >= 80 ? 100 :
      marks >= 70 ? 85 :
      marks >= 60 ? 70 :
      marks >= 50 ? 55 : 35;
  }

  if (targetDegree === "masters") {
    score =
      marks >= 75 ? 100 :
      marks >= 65 ? 85 :
      marks >= 60 ? 70 : 45;
  }

  reasons.push(`Academic score based on ${marks}%`);
  return score;
};

/* -------------------- ENGLISH SCORE -------------------- */

const calculateEnglishScore = (student, uni, reasons) => {
  const exam = safeLower(student.givenExamDetials?.examGiven);
  const scoreVal = Number(student.givenExamDetials?.examScore || 0);

  let score = 40;

  if (exam === "ielts") {
    const required = uni.requirements?.english_language?.ielts_overall || 6.5;

    score =
      scoreVal >= required + 0.5 ? 100 :
      scoreVal >= required ? 85 :
      scoreVal >= required - 0.5 ? 65 : 40;

    reasons.push(`IELTS score: ${scoreVal}`);
  } else {
    reasons.push("English exam not provided");
  }

  return score;
};

/* -------------------- ENTRY PATH SCORE -------------------- */

const calculateEntryPathScore = (student, uni, reasons) => {
  const level = normalize(student.educationBackground?.currentEducationLevel);
  const entryPaths = uni.entry_paths || {};

  let score = 40;

  if (entryPaths[level] === true) score = 100;
  else if (entryPaths[level] === "case_by_case") score = 70;
  else score = 40;

  reasons.push(`Entry qualification: ${level}`);
  return score;
};

/* -------------------- COURSE MATCH SCORE -------------------- */

const calculateCourseScore = (student, uni, reasons) => {
  const degree = normalize(student.targettedCourse?.degreeToAchieve);
  const field = normalize(student.targettedCourse?.degreeField);

  const match = uni.courses?.some(course => {
    const levels = safeLower(course.level);
    const category = safeLower(course.category);

    return (
      levels.includes(degree) &&
      category.includes(field)
    );
  });

  reasons.push(
    match ? "Relevant course available" : "Course relevance unclear"
  );

  return match ? 100 : 60;
};

/* -------------------- COMPETITIVENESS PENALTY -------------------- */

const calculatePenalty = (uni, reasons) => {
  let penalty = 0;

  const desc = safeLower(uni.Description);

  if (desc.includes("competitive")) {
    penalty = 10;
    reasons.push("Highly competitive university");
  } else if (uni.isInTop200) {
    penalty = 5;
    reasons.push("Top-ranked university");
  }

  return penalty;
};

/* -------------------- FINAL SCORE ENGINE -------------------- */

const evaluateUniversity = (student, uni) => {
  const reasons = [];

  const academic = calculateAcademicScore(student, uni, reasons);
  const english = calculateEnglishScore(student, uni, reasons);
  const entry = calculateEntryPathScore(student, uni, reasons);
  const course = calculateCourseScore(student, uni, reasons);
  const penalty = calculatePenalty(uni, reasons);

  let finalScore =
    0.35 * academic +
    0.25 * english +
    0.20 * entry +
    0.20 * course -
    penalty;

  finalScore = clamp(finalScore);

  let likelihood = "Low";
  if (finalScore >= 75) likelihood = "High";
  else if (finalScore >= 55) likelihood = "Medium";

  return {
    university_id: uni._id,
    acceptanceScore: finalScore,
    likelihood,
    reasons,
  };
};

/* -------------------- BULK GENERATOR -------------------- */

const generateAllUniversitiesScoreOffline = async(studentProfile) => {
  if (!studentProfile) return [];
  const universities = await Universities.find({});
  const result = await Promise.all(universities.map(uni =>
    evaluateUniversity(studentProfile, uni)
  ))

  return result;
};

export { generateAllUniversitiesScoreOffline };