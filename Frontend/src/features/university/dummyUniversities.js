 const dummyUniversities = [
  {
    code: "U001",
    universityName: "University of Toronto",
    city: "Toronto",
    country: "Canada",
    countryCode: "CA",
    website: "https://www.utoronto.ca",
    Description:
      "The University of Toronto is a globally top-ranked public research university known for academic excellence, innovation, and strong industry connections.",
    courses: [
      "Computer Science",
      "Data Science",
      "Artificial Intelligence",
      "Business Analytics",
    ],
    scholarships: [
      "Ontario Graduate Scholarship",
      "International Scholar Award",
    ],
    entry_paths: ["Direct Entry", "Foundation Program"],
    feeBand: "High",
    requirements: {
      gpa: "3.3+",
      ielts: "6.5",
      gre: "Optional",
    },
    acceptanceScore: 78,
    likelihood: "High",
    reasons: [
      "Strong alignment with your academic background",
      "High acceptance rate for international students",
      "Your GPA and test scores meet recent intake trends",
    ],
  },

  {
    code: "U002",
    universityName: "Technical University of Munich",
    city: "Munich",
    country: "Germany",
    countryCode: "DE",
    website: "https://www.tum.de",
    Description:
      "TUM is one of Europe’s leading technical universities, offering world-class engineering and science programs with low tuition costs.",
    courses: [
      "Mechanical Engineering",
      "Computer Engineering",
      "Robotics",
      "Management & Technology",
    ],
    scholarships: ["Deutschlandstipendium"],
    entry_paths: ["Direct Entry"],
    feeBand: "Low",
    requirements: {
      gpa: "3.0+",
      ielts: "6.0",
      gre: "Not Required",
    },
    acceptanceScore: 64,
    likelihood: "Medium",
    reasons: [
      "Affordable tuition with strong ROI",
      "Your academic profile matches minimum requirements",
      "High competition but solid technical background helps",
    ],
  },

  {
    code: "U003",
    universityName: "University of Melbourne",
    city: "Melbourne",
    country: "Australia",
    countryCode: "AU",
    website: "https://www.unimelb.edu.au",
    Description:
      "The University of Melbourne is a top Australian university known for research-led teaching and strong global employability outcomes.",
    courses: [
      "Information Systems",
      "Data Analytics",
      "Cyber Security",
    ],
    scholarships: ["Melbourne Graduate Scholarship"],
    entry_paths: ["Direct Entry", "Diploma to Degree"],
    feeBand: "Medium",
    requirements: {
      gpa: "3.2+",
      ielts: "6.5",
      gre: "Optional",
    },
    acceptanceScore: 71,
    likelihood: "High",
    reasons: [
      "Balanced academic requirements",
      "Your profile fits recent admission patterns",
      "Strong post-study work opportunities",
    ],
  },

  {
    code: "U004",
    universityName: "New York University",
    city: "New York",
    country: "United States",
    countryCode: "US",
    website: "https://www.nyu.edu",
    Description:
      "NYU is a globally recognized private university offering strong programs in technology, business, and interdisciplinary studies.",
    courses: [
      "Computer Science",
      "Information Technology",
      "Business Intelligence",
    ],
    scholarships: ["Merit-based Partial Scholarships"],
    entry_paths: ["Direct Entry"],
    feeBand: "Very High",
    requirements: {
      gpa: "3.5+",
      ielts: "7.0",
      gre: "Recommended",
    },
    acceptanceScore: 42,
    likelihood: "Low",
    reasons: [
      "Highly competitive admissions",
      "Your GPA is slightly below average intake",
      "Strong profile but limited seats",
    ],
  },
];

const dummyUser = {
  id: "user_001",

  name: "Vaibhav Pandey",
  email: "vaibhav.pandey@gmail.com",
  avatar: "https://i.pravatar.cc/150?img=12",

  educationBackground: {
    currentEducationLevel: "Bachelor's Degree",
    major: "Computer Science",
    yearOfGraduation: 2024,
    marks: 78,
  },

  targettedCourse: {
    degreeToAchieve: "Master's",
    degreeField: "Data Science",
    intake: "Fall",
    intakeYear: 2025,
    budget: "Medium",
    targetCountries: ["USA", "Canada", "Germany"],
    fundingPlan: "Self + Scholarship",
    haveScholarship: false,
  },

  givenExamDetials: {
    examGiven: "IELTS",
    examScore: 7.5,
    otherExamGiven: ["GRE"],
  },

  profileStrength: [
    "Strong academic background in Computer Science",
    "Relevant internships in software development",
    "Good English proficiency score",
  ],

  profileWeakness: [
    "No research publications",
    "Limited extracurricular activities",
  ],

  currentStage: 2, 
  // 0 → Profile Created
  // 1 → Onboarding
  // 2 → University Shortlisting
  // 3 → University Locked

  aiTodoList: [
    "Shortlist universities in Canada",
    "Prepare Statement of Purpose (SOP)",
    "Research scholarship opportunities",
    "Book IELTS retake if needed",
  ],

  currentTodoStage: "University Shortlisting",

  shortlistedUniversities: [
    "University of Toronto",
    "University of British Columbia",
    "Technical University of Munich",
  ],

  profileScore: 82,
};

export {dummyUser , dummyUniversities}