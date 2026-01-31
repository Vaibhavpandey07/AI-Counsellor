function calculateStudentProfile(student) {
  let score = 0;
  const strength = [];
  const weakness = [];

  const marks = student.educationBackground.marks || 0;

  if (marks >= 75) {
    score += 40;
    strength.push("Strong academic performance (75%+)");
  } else if (marks >= 65) {
    score += 30;
    strength.push("Good academic performance (65–74%)");
  } else if (marks >= 55) {
    score += 20;
    weakness.push("Average academics (55–64%)");
  } else {
    score += 10;
    weakness.push("Low academic performance (<55%)");
  }


  const exam = student.givenExamDetials.examGiven;
  const examScore = student.givenExamDetials.examScore;

  if (exam === "ielts") {
    if (examScore >= 7) {
      score += 25;
      strength.push("Strong IELTS score (7.0+)");
    } else if (examScore >= 6.5) {
      score += 20;
      strength.push("Meets most university requirements (IELTS 6.5)");
    } else if (examScore >= 6) {
      score += 15;
      weakness.push("Minimum English score (IELTS 6.0)");
    } else {
      score += 5;
      weakness.push("English score below requirements");
    }
  } else {
    score += 10;
    weakness.push("No standardized English test provided");
  }


  const level = student.educationBackground.currentEducationLevel;

  if (["bachelor", "masters"].includes(level)) {
    score += 15;
    strength.push("Recognized higher education background");
  } else if (["a_level", "ib", "foundation"].includes(level)) {
    score += 12;
    strength.push("Internationally accepted qualification");
  } else if (["ond", "hnd"].includes(level)) {
    score += 8;
    weakness.push("Qualification may require pathway programs");
  } else {
    score += 5;
    weakness.push("Unclear education background");
  }

  if (
    student.targettedCourse.degreeToAchieve &&
    student.targettedCourse.degreeField
  ) {
    score += 10;
    strength.push("Clear academic goals and degree selection");
  } else {
    score += 5;
    weakness.push("Course or degree goal not clearly defined");
  }


  const budget = student.targettedCourse.budget;
  const fundingPlan = student.targettedCourse.fundingPlan;

  if (budget >= 30000) {
    score += 10;
    strength.push("Strong financial capacity");
  } else if (budget >= 20000) {
    score += 7;
    strength.push("Moderate budget suitable for mid-range universities");
  } else if (budget >= 12000) {
    score += 5;
    weakness.push("Limited budget; scholarships required");
  } else {
    score += 2;
    weakness.push("Budget may be insufficient for most universities");
  }

  if (fundingPlan === "loan" || student.targettedCourse.haveScholarship) {
    strength.push("Additional funding plan available");
  }

  score = Math.min(100, Math.round(score));

  return {
    profileScore: score,
    profileStrength: strength,
    profileWeakness: weakness
  };
}

export {calculateStudentProfile}