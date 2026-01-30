function calculateStudentProfile(student) {
  let score = 0;
  const strength = {};
  const weakness = {};

  const marks = student.educationBackground.marks || 0;

  if (marks >= 75) {
    score += 40;
    strength.academics = "Strong academic performance (75%+)";
  } else if (marks >= 65) {
    score += 30;
    strength.academics = "Good academic performance (65–74%)";
  } else if (marks >= 55) {
    score += 20;
    weakness.academics = "Average academics (55–64%)";
  } else {
    score += 10;
    weakness.academics = "Low academic performance (<55%)";
  }


  const exam = student.givenExamDetials.examGiven;
  const examScore = student.givenExamDetials.examScore;

  if (exam === "ielts") {
    if (examScore >= 7) {
      score += 25;
      strength.english = "Strong IELTS score (7.0+)";
    } else if (examScore >= 6.5) {
      score += 20;
      strength.english = "Meets most university requirements (IELTS 6.5)";
    } else if (examScore >= 6) {
      score += 15;
      weakness.english = "Minimum English score (IELTS 6.0)";
    } else {
      score += 5;
      weakness.english = "English score below requirements";
    }
  } else {
    score += 10;
    weakness.english = "No standardized English test provided";
  }


  const level = student.educationBackground.currentEducationLevel;

  if (["bachelor", "masters"].includes(level)) {
    score += 15;
    strength.educationLevel = "Recognized higher education background";
  } else if (["a_level", "ib", "foundation"].includes(level)) {
    score += 12;
    strength.educationLevel = "Internationally accepted qualification";
  } else if (["ond", "hnd"].includes(level)) {
    score += 8;
    weakness.educationLevel = "Qualification may require pathway programs";
  } else {
    score += 5;
    weakness.educationLevel = "Unclear education background";
  }

  if (
    student.targettedCourse.degreeToAchieve &&
    student.targettedCourse.degreeField
  ) {
    score += 10;
    strength.goalClarity = "Clear academic goals and degree selection";
  } else {
    score += 5;
    weakness.goalClarity = "Course or degree goal not clearly defined";
  }


  const budget = student.targettedCourse.budget;
  const fundingPlan = student.targettedCourse.fundingPlan;

  if (budget >= 30000) {
    score += 10;
    strength.finances = "Strong financial capacity";
  } else if (budget >= 20000) {
    score += 7;
    strength.finances = "Moderate budget suitable for mid-range universities";
  } else if (budget >= 12000) {
    score += 5;
    weakness.finances = "Limited budget; scholarships required";
  } else {
    score += 2;
    weakness.finances = "Budget may be insufficient for most universities";
  }

  if (fundingPlan === "loan" || student.targettedCourse.haveScholarship) {
    strength.funding = "Additional funding plan available";
  }

  score = Math.min(100, Math.round(score));

  return {
    profileScore: score,
    profileStrength: strength,
    profileWeakness: weakness
  };
}

export {calculateStudentProfile}