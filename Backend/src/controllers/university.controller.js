import mongoose from "mongoose";
import { Universities } from "../models/universities.model.js";
import ApiError from "../utlis/ApiErrors.util.js";
import { ApiResponse } from "../utlis/ApiResponse.util.js";
import { UserOtherDetails } from "../models/UserOtherDetails.model.js";


const getAllUniversities = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const userId = new mongoose.Types.ObjectId(req.userId);

  try {
    const skip = (page - 1) * limit;




      const userDetails = await UserOtherDetails.findOne(
        { user_id: userId },
        { universitiesAcceptanceScore: 1 ,
          shortlistedUniversities :1,
        }
      ).lean();

      if (!userDetails?.universitiesAcceptanceScore?.length) {
        return res.json([]);
      }

      const sorted = [...userDetails.universitiesAcceptanceScore]

      const paginated = sorted.slice(skip, skip + limit+1);

      const universityIds = paginated.map((u) => u.university_id);

      const universities = await Universities.find({
        _id: { $in: universityIds },
      }).lean();

      const uniMap = new Map(universities.map((u) => [u._id.toString(), u]));

           const results = paginated.map((u) => {
        let shortlisted = false;
        if(userDetails.shortlistedUniversities.some(id=>{
            return id.equals(new mongoose.Types.ObjectId(u.university_id));})){
              shortlisted = true;
            }
        return ({
        ...uniMap.get(u.university_id.toString()),
        
        acceptanceScore: u.acceptanceScore,
        likelihood: u.likelihood,
        reasons: u.reasons,
        shortlisted : shortlisted,
      })});
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

const searchUniversity = async (req, res) => {
  const searchQuery = req.query.searchQuery?.trim();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  if (!searchQuery) {
    throw new ApiError(400, "No search query");
  }

  const userId = new mongoose.Types.ObjectId(req.userId);
  const skip = (page - 1) * limit;

  try {
    /* ----------------------------
       1. Get user's acceptance scores
    -----------------------------*/
    const userDetails = await UserOtherDetails.findOne(
      { user_id: userId },
      { universitiesAcceptanceScore: 1 }
    ).lean();

    if (!userDetails?.universitiesAcceptanceScore?.length) {
      return res.status(200).send(
        new ApiResponse(200, "No universities found", {
          data: [],
          hasMore: false,
          page,
          limit
        })
      );
    }

    /* ----------------------------
       2. Sort by acceptance score
    -----------------------------*/
    const sortedScores = [...userDetails.universitiesAcceptanceScore].sort(
      (a, b) => b.acceptanceScore - a.acceptanceScore
    );

    const universityIds = sortedScores.map((u) => u.university_id);

    /* ----------------------------
       3. Search universities (TEXT SEARCH)
    -----------------------------*/
    const matchedUniversities = await Universities.find(
      {
        _id: { $in: universityIds },
        $text: { $search: searchQuery }
      },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .lean();

    if (!matchedUniversities.length) {
      return res.status(200).send(
        new ApiResponse(200, "Search Results not Found", {
          data: [],
          hasMore: false,
          page,
          limit
        })
      );
    }

    /* ----------------------------
       4. Keep acceptanceScore order
    -----------------------------*/
    const scoreMap = new Map(
      sortedScores.map((u) => [u.university_id.toString(), u])
    );

    const merged = matchedUniversities
      .map((uni) => {
        const score = scoreMap.get(uni._id.toString());
        if (!score) return null;
        let shortlisted = false;
        if(userDetails.shortlistedUniversities && userDetails.shortlistedUniversities.some(id=>{
            return id.equals(new mongoose.Types.ObjectId(uni._id));})){
              shortlisted = true;
            }

        return {
          ...uni,
          acceptanceScore: score.acceptanceScore,
          likelihood: score.likelihood,
          reasons: score.reasons,
          shortlisted : shortlisted,
        };
      })
      .filter(Boolean);

    /* ----------------------------
       5. Pagination
    -----------------------------*/
    const paginated = merged.slice(skip, skip + limit + 1);
    const hasMore = paginated.length > limit;
    if (hasMore) paginated.pop();

    return res.status(200).send(
      new ApiResponse(
        200,
        paginated.length ? "Search Results found" : "Search Results not Found",
        { data: paginated, hasMore, page, limit }
      )
    );
  } catch (err) {
    console.error(err);
    throw new ApiError(500, err.message);
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
  const limit = parseInt(req.query.limit) || 5;

  const userId = new mongoose.Types.ObjectId(req.userId);

  try {
    const skip = (page - 1) * limit;




      const userDetails = await UserOtherDetails.findOne(
        { user_id: userId },
        { universitiesAcceptanceScore: 1 }
      ).lean();

      if (!userDetails?.universitiesAcceptanceScore?.length) {
        return res.json([]);
      }

      const sorted = [...userDetails.universitiesAcceptanceScore].sort(
        (a, b) => b.acceptanceScore - a.acceptanceScore
      );

      const paginated = sorted.slice(skip, skip + limit+1);

      const universityIds = paginated.map((u) => u.university_id);

      const universities = await Universities.find({
        _id: { $in: universityIds },
      }).lean();

      const uniMap = new Map(universities.map((u) => [u._id.toString(), u]));

      const results = paginated.map((u) => {
        let shortlisted = false;
        if(userDetails.shortlistedUniversities && userDetails.shortlistedUniversities.some(id=>{
            return id.equals(new mongoose.Types.ObjectId(u.university_id));})){
              shortlisted = true;
            }
        return ({
        ...uniMap.get(u.university_id.toString()),
        
        acceptanceScore: u.acceptanceScore,
        likelihood: u.likelihood,
        reasons: u.reasons,
        shortlisted : shortlisted,

      })});
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