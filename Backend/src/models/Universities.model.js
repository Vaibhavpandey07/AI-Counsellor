import mongoose, { Schema } from "mongoose";

const universitiesSchema = new Schema({
  code: { type: String, required: true, unique: true, index: true },

  universityName: { type: String },
  city: { type: String },
  country: { type: String },
  countryCode: { type: String },

  website: { type: String },

  Description: { type: String },

  courses: [
    {
      name: String,
      category: String,
      level: [String]
    }
  ],

  scholarships: [{ type: Object }],
  entry_paths: { type: Object },

  numberOfStudents: { type: Number },
  internationStudentsPercent: { type: Number },
  isInTop200: { type: Boolean },
  feeBand: { type: String },

  requirements: { type: Object }

}, { timestamps: true });


universitiesSchema.index(
  {
    universityName: "text",
    city: "text",
    country: "text",
    Description: "text",
    "courses.name": "text",
    "courses.category": "text"
  },
  {
    weights: {
      universityName: 10,
      "courses.name": 8,
      Description: 5,
      country: 3,
      city: 2
    },
    name: "UniversityTextSearchIndex"
  }
);

const Universities = mongoose.model("Universities", universitiesSchema);

export { Universities };
