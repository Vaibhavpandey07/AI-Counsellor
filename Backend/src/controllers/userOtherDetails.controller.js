import mongoose from "mongoose";
import { UserOnBoarding } from "../models/UserOnBoarding.model.js";
import { UserOtherDetails } from "../models/UserOtherDetails.model.js";
import ApiError from "../utlis/ApiErrors.util.js";
import { ApiResponse } from "../utlis/ApiResponse.util.js";
import { Universities } from "../models/universities.model.js";


const getUserProfileDetails = async(req,res)=>{
    try{
        const userOnBoarding = await UserOnBoarding.findOne({user_id:req.userId});
        const userOtherdetails = await UserOtherDetails.findOne({user_id:req.userId});
        if(!userOnBoarding || !userOtherdetails ){
            throw new ApiError(404, "User Has not Onboarded",[]);
        }
        const dataTosend = {
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

        return res.status(200).send(new ApiResponse(200,"Success",dataTosend));

    }catch(err){
        throw new ApiError(500,err.message);
    }
}

const shortlistUniversity = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const universityId = new mongoose.Types.ObjectId(req.body.universityId);

    const userDetails = await UserOtherDetails.findOne(
      { user_id: userId },
      { shortlistedUniversities: 1, currentStage: 1 }
    );

    if (!userDetails) {
      throw new ApiError(404, "User details not found");
    }

    /* ----------------------------
       Check if already shortlisted
    -----------------------------*/
    const alreadyShortlisted = userDetails.shortlistedUniversities?.some(
      (id) => id.equals(universityId)
    );

    if (alreadyShortlisted) {
      return res
        .status(409)
        .send(new ApiResponse(409, "University already shortlisted"));
    }

    /* ----------------------------
       Add to shortlist
    -----------------------------*/
    await UserOtherDetails.updateOne(
      { user_id: userId },
      {
        $addToSet: { shortlistedUniversities: universityId },
        $set: {
          currentStage:
            userDetails.currentStage > 3 ? userDetails.currentStage : 3,
        },
      }
    );

    return res
      .status(200)
      .send(new ApiResponse(200, "University added to shortlist"));
  } catch (err) {
    console.error(err);
    throw new ApiError(500, err.message);
  }
};

const removeFromShortlist = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const universityId = new mongoose.Types.ObjectId(req.body.universityId);

    const userDetails = await UserOtherDetails.findOne(
      { user_id: userId },
      { shortlistedUniversities: 1, currentStage: 1 }
    );

    if (!userDetails) {
      throw new ApiError(404, "User details not found");
    }

    /* ----------------------------
       Check if university exists
    -----------------------------*/
    const isShortlisted = userDetails.shortlistedUniversities.some((id) =>
      id.equals(universityId)
    );

    if (!isShortlisted) {
      return res
        .status(409)
        .send(new ApiResponse(409, "University not shortlisted"));
    }

    /* ----------------------------
       Stage rollback logic
    -----------------------------*/
    let updatedStage = userDetails.currentStage;

    if (
      userDetails.shortlistedUniversities.length === 1 &&
      userDetails.currentStage === 3
    ) {
      updatedStage = 2;
    }

    /* ----------------------------
       Remove university
    -----------------------------*/
    await UserOtherDetails.updateOne(
      { user_id: userId },
      {
        $pull: { shortlistedUniversities: universityId },
        $set: { currentStage: updatedStage },
      }
    );

    return res
      .status(200)
      .send(new ApiResponse(200, "University removed from shortlist"));
  } catch (err) {
    console.error(err);
    throw new ApiError(500, err.message);
  }
};

const getShortlistedUniversities = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const userId = new mongoose.Types.ObjectId(req.userId);

  try {
    const skip = (page - 1) * limit;

    /* ----------------------------
       Fetch user details
    -----------------------------*/
    const userDetails = await UserOtherDetails.findOne(
      { user_id: userId },
      {
        universitiesAcceptanceScore: 1,
        shortlistedUniversities: 1,
      }
    ).lean();

    if (
      !userDetails ||
      !userDetails.shortlistedUniversities?.length ||
      !userDetails.universitiesAcceptanceScore?.length
    ) {
      return res.status(200).send(
        new ApiResponse(200, "No shortlisted universities", {
          data: [],
          hasMore: false,
          page,
          limit,
        })
      );
    }

    /* ----------------------------
       Filter acceptance scores
       → ONLY shortlisted
    -----------------------------*/
    const shortlistedSet = new Set(
      userDetails.shortlistedUniversities.map((id) => id.toString())
    );

    const shortlistedScores = userDetails.universitiesAcceptanceScore.filter(
      (u) => shortlistedSet.has(u.university_id.toString())
    );

    /* ----------------------------
       Pagination
    -----------------------------*/
    const paginated = shortlistedScores.slice(skip, skip + limit + 1);

    const universityIds = paginated.map((u) => u.university_id);

    /* ----------------------------
       Fetch universities
    -----------------------------*/
    const universities = await Universities.find({
      _id: { $in: universityIds },
    }).lean();

    const uniMap = new Map(
      universities.map((u) => [u._id.toString(), u])
    );

    /* ----------------------------
       Merge data
    -----------------------------*/
    const results = paginated.map((u) => ({
      ...uniMap.get(u.university_id.toString()),
      acceptanceScore: u.acceptanceScore,
      likelihood: u.likelihood,
      reasons: u.reasons,
      shortlisted: true,
    }));

    /* ----------------------------
       hasMore handling
    -----------------------------*/
    const hasMore = results.length > limit;
    if (hasMore) results.pop();

    return res.status(200).send(
      new ApiResponse(
        200,
        results.length
          ? "Shortlisted universities fetched"
          : "No shortlisted universities",
        { data: results, hasMore, page, limit }
      )
    );
  } catch (err) {
    console.error(err);
    throw new ApiError(500, err.message);
  }
};


export {getUserProfileDetails , shortlistUniversity , removeFromShortlist , getShortlistedUniversities}