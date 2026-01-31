import mongoose from "mongoose";
import ApiError from "../utlis/ApiErrors.util.js";
import { LockedUniversity } from "../models/LockedUniversity.model.js";
import { Universities } from "../models/universities.model.js";
import { ApiResponse } from "../utlis/ApiResponse.util.js";
import { UserOtherDetails } from "../models/UserOtherDetails.model.js";

const generateRandomDeadline = () => {
  const today = new Date();

  const minDays = 21; // 3 weeks
  const maxDays = 28; // 4 weeks

  const randomDays =
    Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;

  const deadline = new Date(today);
  deadline.setDate(today.getDate() + randomDays);

  return deadline;
};

const lockUniversity = async(req,res)=>{
    const userId = new mongoose.Types.ObjectId(req.userId);
    const universityId = new mongoose.Types.ObjectId(req.body.universityId);

    try{
        const targetUniversity = await LockedUniversity.findOne({user_id:userId});
        if(targetUniversity){
            throw new ApiError(409,"Can not lock 2 Universities at a time",[]);
        }
        const university = await Universities.findOne({_id:universityId});

        if(!university){
            throw new ApiError(404,"University Does not exist",[]);
        }



        const dataTosave = {
              user_id :userId,
              university_id : universityId,
              Stages : [ "Create Studielink account", "Select programs (up to 4 per cycle)", "Upload required documents", "Submit application by deadline", "Wait for decision (4-8 weeks)", "Accept offer and pay tuition deposit"],
              currentStage :1,
              deadline :generateRandomDeadline(),
        }
        await LockedUniversity.insertOne(dataTosave);
        await UserOtherDetails.findOneAndUpdate({user_id:userId},{$set:{currentStage:4}});
        return res.status(200).send(new ApiResponse(200,"University Locked Successfully"));
        
    }catch(err){
        throw new ApiError(500, err.message);
    }
}

const updateStage = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);

  try {
    const lockedUniversity = await LockedUniversity.findOne({ user_id: userId });

    if (!lockedUniversity) {
      throw new ApiError(404, "No locked university found for this user", []);
    }

    lockedUniversity.currentStage +=1;
    await lockedUniversity.save({validationBeforeSave:false});

    return res
      .status(200)
      .send(new ApiResponse(200, "University unlocked successfully"));

  } catch (err) {
    throw new ApiError(500, err.message);
  }
};

const unlockUniversity = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);

  try {
    const lockedUniversity = await LockedUniversity.findOne({ user_id: userId });

    if (!lockedUniversity) {
      throw new ApiError(404, "No locked university found for this user", []);
    }
    const userDetails = await UserOtherDetails.findOne({user_id:userId});
    (userDetails.shortlistedUniversities.length>0?userDetails.currentStage=3:userDetails.currentStage=2);

    await LockedUniversity.deleteOne({ user_id: userId });

    return res
      .status(200)
      .send(new ApiResponse(200, "University unlocked successfully"));

  } catch (err) {
    throw new ApiError(500, err.message);
  }
};

const getLockedUniversityDetails = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);

  try {
    /* ----------------------------
       1. Fetch locked university
    -----------------------------*/
    const lockedUniversity = await LockedUniversity.findOne(
      { user_id: userId },
      { __v: 0, createdAt: 0, updatedAt: 0 }
    ).lean();

    if (!lockedUniversity) {
      throw new ApiError(404, "No locked university found for this user");
    }

    /* ----------------------------
       2. Fetch user details
    -----------------------------*/
    const userDetails = await UserOtherDetails.findOne(
      { user_id: userId },
      { universitiesAcceptanceScore: 1 }
    ).lean();

    /* ----------------------------
       3. Fetch university
    -----------------------------*/
    const university = await Universities.findById(
      lockedUniversity.university_id,
      { __v: 0, createdAt: 0, updatedAt: 0 }
    ).lean();

    if (!university) {
      throw new ApiError(404, "University not found");
    }

    /* ----------------------------
       4. Get acceptance data
    -----------------------------*/
    const acceptanceData =
      userDetails?.universitiesAcceptanceScore?.find((u) =>
        u.university_id.toString() ===
        lockedUniversity.university_id.toString()
      ) || {};

    /* ----------------------------
       5. Build final response
    -----------------------------*/
    const responseData = {
      ...university,
      acceptanceScore: acceptanceData.acceptanceScore ?? 0,
      likelihood: acceptanceData.likelihood ?? "Not evaluated",
      reasons: acceptanceData.reasons ?? [],
      deadline: lockedUniversity.deadline,
      stages: lockedUniversity.Stages,
      currentStage: lockedUniversity.currentStage,
    };

    return res.status(200).send(
      new ApiResponse(200, "Locked University data", responseData)
    );
  } catch (err) {
    console.error(err);
    throw new ApiError(500, err.message);
  }
};

export {lockUniversity,unlockUniversity, getLockedUniversityDetails, updateStage};