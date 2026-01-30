import mongoose from "mongoose";
import { Universities } from "../models/universities.model.js";

const getAllUniversities = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const {
    country,
    countryCode,
    feeBand
  } = req.query;

  try {
    const skip = (page - 1) * limit;

    const matchStage = {};

    if (country) matchStage.country = country;
    if (countryCode) matchStage.countryCode = countryCode;
    if (feeBand) matchStage.feeBand = feeBand;


    const universities = await Universities.aggregate([
      { $match: matchStage },

      { $sort: { universityName: 1 } }, // alphabetical
      { $skip: skip },
      { $limit: limit + 1 },

      {
        $project: {
          _id: 1,
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
      }
    ]);

    const hasMore = universities.length > limit;
    if (hasMore) universities.pop();

    return res.status(200).send(
      new ApiResponse(
        200,
        universities.length ? "Universities fetched successfully" : "No universities found",
        { data: universities, hasMore, page, limit }
      )
    );

  } catch (err) {
    console.error(err);
    throw new ApiError(500, err.message);
  }
};

const searchUniversity = async(req,res)=>{
    const searchQuery = `${req.query.searchQuery?.trim()}`;
    const page = parseInt(req.query.page)|| 1;
    const limit = parseInt(req.query.limit) || 10;

    const userId = new mongoose.Types.ObjectId(req.userId);

    if(!searchQuery){
        throw new ApiError(200, "No search query");
    }
    
    try{
        const skip = (page-1)*limit;


        const searchResults = await Universities.aggregate([

        {
            $match: {
            $text: { $search: searchQuery }
            }
        },

        {
            $addFields: {
            textScore: { $meta: "textScore" }
            }
        },

        {
            $sort: { textScore: -1 }
        },

        {
            $skip: skip
        },

        {
            $limit: limit + 1
        },

        {
            $lookup: {
                from: "userotherdetails",
                let: { 
                universityId: "$_id",
                userId: userId
                },
                pipeline: [
                {
                    $match: {
                    $expr: { $eq: ["$userId", "$$userId"] }
                    }
                },
                { $unwind: "$universitiesAcceptanceScore" },
                {
                    $match: {
                    $expr: {
                        $eq: [
                        "$universitiesAcceptanceScore.university_id",
                        "$$universityId"
                        ]
                    }
                    }
                },
                {
                    $project: {
                    _id: 0,
                    acceptanceScore: "$universitiesAcceptanceScore.acceptanceScore",
                    likelihood: "$universitiesAcceptanceScore.likelihood",
                    reasons: "$universitiesAcceptanceScore.reasons"
                    }
                }
                ],
                as: "acceptance"
            }
            },

        {
            $unwind: {
            path: "$acceptance",
            preserveNullAndEmptyArrays: true
            }
        },


        {
            $project: {
            _id: 1,
            code: 1,
            universityName: 1,
            city: 1,
            country: 1,
            countryCode: 1,
            website: 1,
            Description: 1,
            courses: 1,
            scholarships:  1,
            entry_paths: 1,
            numberOfStudents: 1,
            internationStudentsPercent: 1,
            isInTop200: 1,
            feeBand: 1,
            requirements: 1,
            acceptanceScore: { $ifNull: ["$acceptance.acceptanceScore", 0] },
            likelihood: { $ifNull: ["$acceptance.likelihood", "Not evaluated"] },
            reasons: { $ifNull: ["$acceptance.reasons", "Profile not evaluated yet"] }
            }
        }
        ]);



        const hasMore = searchResults.length>limit?true:false;
        if(hasMore){searchResults.pop()};



        res.status(200).send(new ApiResponse(200,(searchResults.length>0)?"Search Results found":"Search Results not Found",{"data" : searchResults,"hasMore":hasMore,page,limit}));
        
    
    }catch(err){
        console.log(err);
        throw new ApiError(500,err.message);
    }
};


const searchUniversitySuggestions = async (req, res) => {
  const searchQuery = req.query.searchQuery?.trim();

  if (!searchQuery) {
    throw new ApiError(200, "no query found");
  }

  try {
    const results = await Universities.aggregate([
      {
        $match: {
          $or: [
            { universityName: { $regex: `^${searchQuery}`, $options: "i" } },
            { code: { $regex: `^${searchQuery}`, $options: "i" } },
            { city: { $regex: `^${searchQuery}`, $options: "i" } },
            { country: { $regex: `^${searchQuery}`, $options: "i" } }
          ]
        }
      },

      { $limit: 5 },

      {
        $project: {
          _id: 0,
          university_id: "$_id",
          universityName: 1,
          city: 1,
          country: 1,
          code: 1
        }
      }
    ]);

    res
      .status(200)
      .send(new ApiResponse(200, "university suggestions", results));
  } catch (err) {
    throw new ApiError(500, err.message);
  }
};


const getUniversitiesByAcceptanceScore = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const userId = new mongoose.Types.ObjectId(req.userId);

  try {
    const skip = (page - 1) * limit;

    const results = await Universities.aggregate([
      /* ----------------------------
         1. Join user acceptance scores
      -----------------------------*/
      {
        $lookup: {
          from: "userotherdetails",
          let: { universityId: "$_id", userId: userId },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$userId", "$$userId"] }
              }
            },
            { $unwind: "$universitiesAcceptanceScore" },
            {
              $match: {
                $expr: {
                  $eq: [
                    "$universitiesAcceptanceScore.university_id",
                    "$$universityId"
                  ]
                }
              }
            },
            {
              $project: {
                _id: 0,
                acceptanceScore:
                  "$universitiesAcceptanceScore.acceptanceScore",
                likelihood:
                  "$universitiesAcceptanceScore.likelihood",
                reasons:
                  "$universitiesAcceptanceScore.reasons"
              }
            }
          ],
          as: "acceptance"
        }
      },

      /* ----------------------------
         2. Flatten acceptance
      -----------------------------*/
      {
        $unwind: {
          path: "$acceptance",
          preserveNullAndEmptyArrays: false
        }
      },

      /* ----------------------------
         3. Sort by acceptance score
      -----------------------------*/
      {
        $sort: {
          "acceptance.acceptanceScore": -1
        }
      },

      /* ----------------------------
         4. Pagination
      -----------------------------*/
      { $skip: skip },
      { $limit: limit + 1 },

      /* ----------------------------
         5. Final projection
      -----------------------------*/
      {
        $project: {
          _id: 1,
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
          requirements: 1,

          acceptanceScore: "$acceptance.acceptanceScore",
          likelihood: "$acceptance.likelihood",
          reasons: "$acceptance.reasons"
        }
      }
    ]);

    /* ----------------------------
       Pagination handling
    -----------------------------*/
    const hasMore = results.length > limit;
    if (hasMore) results.pop();

    return res.status(200).send(
      new ApiResponse(
        200,
        results.length
          ? "Universities sorted by acceptance score"
          : "No universities found",
        { data: results, hasMore, page, limit }
      )
    );
  } catch (err) {
    console.error(err);
    throw new ApiError(500, err.message);
  }
};






export {getAllUniversities,searchUniversity,searchUniversitySuggestions , getUniversitiesByAcceptanceScore}