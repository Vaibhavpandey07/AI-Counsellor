import { Universities } from "../models/universities.model.js";

function getUniversityScoreAndLikelihood(student, university) {
  let reasons = [];
  let score = 0;

  const degree = normalize(student.targettedCourse.degreeToAchieve);
  const field = normalize(student.targettedCourse.degreeField);
  const marks = student.educationBackground.marks || 0;
  const entryLevel = normalize(student.educationBackground.currentEducationLevel);


  if (!university.entry_paths?.[degree]) {
    return {
      universityCode: university.code,
      score: 20,
      likelihood: "Low",
      reasons: ["Degree not offered by university"]
    };
  }

  const courseMatch = university.courses?.some(c =>
    c.level.includes(degree) &&
    normalize(c.category) === field
  );

  let courseScore = courseMatch ? 100 : 60;
  if (courseMatch) reasons.push("Relevant course available");
  else reasons.push("Course availability unclear");

  let academicScore = 0;

  if (degree === "bachelor") {
    if (marks >= 75) academicScore = 100;
    else if (marks >= 65) academicScore = 75;
    else if (marks >= 55) academicScore = 50;
    else academicScore = 30;
  }

  if (degree === "masters") {
    if (marks >= 65) academicScore = 100;
    else if (marks >= 60) academicScore = 70;
    else academicScore = 40;
  }

  reasons.push(`Academic score evaluated at ${marks}%`);


  let examScore = 50; // default = conditional

  if (student.givenExamDetials.examGiven === "ielts") {
    const ielts = student.givenExamDetials.examScore;
    if (ielts >= 6.5) examScore = 100;
    else if (ielts >= 6.0) examScore = 70;
    else examScore = 40;

    reasons.push(`IELTS score: ${ielts}`);
  } else {
    reasons.push("English test not provided (conditional)");
  }

  let entryPathScore = 40;

  if (["a_level", "ib", "bachelor", "masters"].includes(entryLevel)) {
    entryPathScore = 100;
  } else if (entryLevel === "foundation") {
    entryPathScore = 85;
  } else if (["ond", "hnd"].includes(entryLevel)) {
    entryPathScore = 65;
  }

  reasons.push(`Entry background: ${entryLevel}`);

  let competitivenessPenalty = 0;

  if (university.Description?.toLowerCase().includes("competitive")) {
    competitivenessPenalty = 10;
  }


  score =
    0.35 * academicScore +
    0.25 * examScore +
    0.2 * entryPathScore +
    0.2 * courseScore -
    competitivenessPenalty;

  score = Math.max(0, Math.min(100, Math.round(score)));


  let likelihood = "Low";
  if (score >= 75) likelihood = "High";
  else if (score >= 55) likelihood = "Medium";

  return {
    universityCode: university.code,
    universityName: university.universityName,
    score,
    likelihood,
    reasons
  };
}






const generateAllUniversitiesScore = async(student)=>{

    try{

        const universities = await Universities.find({});
        const universitiesAcceptanceScore = await Promise.all(
            universities.map(async(ele)=>{

                const result = await getUniversityScoreAndLikelihood(student,ele);

                const dataToSave = {
                    university_id : ele._id,
                    acceptanceScore : result.score,
                    likelihood :result.likelihood,
                    reasons :result.reasons,
                }

                return universitiesAcceptanceScore.push(dataToSave);

            })
        )


        return universitiesAcceptanceScore;

    }catch(err){
        console.log(err);
        return [];
    }


}









export {generateAllUniversitiesScore}