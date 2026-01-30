import mongoose from "mongoose";
import { UserOnBoarding } from "../models/UserOnBoarding.model.js";
import { UserOtherDetails } from "../models/UserOtherDetails.model.js";
import ApiError from "../utlis/ApiErrors.util.js";

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

const shortlistUniversity = async(req,res)=>{
    try{
        const userId = new mongoose.Types.ObjectId(req.userId);
        const universityId = new mongoose.Types.ObjectId(req.body.universityId);
        const userDetails = await UserOtherDetails.findOne({"user_id":new mongoose.Types.ObjectId(userId)});

         if(  userDetails.shortlistedUniversities.some(id=>{
            return id.equals(universityId);} )) {

            return res.status(409).send(new ApiResponse(409,"University already Shortlisted"));
        }


        await UserOtherDetails.findOneAndUpdate({"user_id":new mongoose.Types.ObjectId(userId)} , 
        {$addToSet:{shortlistedUniversities:{ universityId: universityId }} , $set:{currentStage:(userDetails.currentStage>3?userDetails.currentStage:3)}}, {upsert: false});

        return res.status(200).send(new ApiResponse(200,"University Added In Shortlist"));


    }catch(err){
        throw new ApiError(500,err.message);
    }
}

const removeFromShortlist = async(req,res)=>{
    try{
        const userId = req.userId;
        const universityId = new mongoose.Types.ObjectId(req.body.universityId);
        
        const userDetails = await UserOtherDetails.findOne({"user_id":new mongoose.Types.ObjectId(userId)});

         if(  userDetails.shortlistedUniversities.some(id=>{
            return id.equals(universityId);} )) {
             
            if(userDetails.shortlistedUniversities.length==1 && userDetails.currentStage==3){
                userDetails.currentStage = 2;
            }

            await UserOtherDetails.findOneAndUpdate({user_id:userId},{$pull:{shortlistedUniversities:{ universityId: universityId } }, $set:{currentStage:userDetails.currentStage}});
            return res.status(200).send(new ApiResponse(200,"University Removed from Shortlist"));
            
        }else{

            return res.status(409).send(new ApiResponse(409,"University not Shortlisted"));

        }



    }catch(err){
        throw new ApiError(500,err.message);

    }
}

const getShortlistedUniversities = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);

  try {
    const result = await UserOtherDetails.aggregate([
      {
        $match: { userId }
      },
      {
        $unwind: "$shortlistedUniversities"
      },
      {
        $lookup: {
          from: "universities",
          localField: "shortlistedUniversities",
          foreignField: "_id",
          as: "university"
        }
      },
      {
        $unwind: "$university"
      },
      {
        $project: {
          _id: 0,
          university: {
            _id: "$university._id",
            code: "$university.code",
            universityName: "$university.universityName",
            city: "$university.city",
            country: "$university.country",
            countryCode: "$university.countryCode",
            website: "$university.website",
            Description: "$university.Description",
            courses: "$university.courses",
            scholarships: "$university.scholarships",
            entry_paths: "$university.entry_paths",
            numberOfStudents: "$university.numberOfStudents",
            internationStudentsPercent: "$university.internationStudentsPercent",
            isInTop200: "$university.isInTop200",
            feeBand: "$university.feeBand",
            requirements: "$university.requirements"
          }
        }
      }
    ]);

    res.status(200).json(
      new ApiResponse(200, "Shortlisted universities fetched", result)
    );

  } catch (err) {
    console.error(err);
    throw new ApiError(500, err.message);
  }
};


export {getUserProfileDetails , shortlistUniversity , removeFromShortlist , getShortlistedUniversities}