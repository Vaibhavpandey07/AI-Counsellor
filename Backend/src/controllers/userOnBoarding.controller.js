import mongoose from "mongoose";
import ApiError from "../utlis/ApiErrors.util";
import { UserOnBoarding } from "../models/UserOnBoarding.model";
import { UserOtherDetails } from "../models/UserOtherDetails.model";
import { ApiResponse } from "../utlis/ApiResponse.util";

const onBoarding = async(req,res)=>{
    const data = req.body;
    try{
        const onBoarding = await UserOnBoarding.findOne({user_id : req.userId});
        if(onBoarding){
            throw new ApiError(409,"User Already Submitted Details",[]);
        }

        const dataToSave = {
            user_id : new mongoose.Types.ObjectId(req.userId),
            currentEducationLevel : data?.currentEducationLevel,
            major : data?.major,
            yearOfGraduation : data?.yearOfGraduation,
            marks : data?.marks,

            degreeToAchieve : data?.degreeToAchieve,
            degreeField : data?.degreeField,
            intake : data?.intake,
            intakeYear : data?.intakeYear,

            budget : data?.budget,
            targetCountries :  data?.targetCountries,
            fundingPlan : data?.fundingPlan,
            haveScholarship : data?.haveScholarship,

            examGiven : data?.examGiven,
            examScore : data?.examScore,
            otherExamGiven : data?.otherExamGiven,
        }

        const newOnBoarding = await UserOnBoarding.create(dataToSave);
        await UserOtherDetails.findOneAndUpdate({user_id:req.userId},{$set:{currentStage:2}})
        // AI microService to be called to evalute user profile;
        return new ApiResponse(200,"User OnBoarded Successfully");

    }catch(err){
        throw new ApiError(500,err.message,[]);
    }
}


const updateOnBoarding = async (req,res)=>{
        const data = req.body;
    try{
        const onBoarding = await UserOnBoarding.findOne({user_id : req.userId});
        if(!onBoarding){
            throw new ApiError(404,"Please complete Onboarding",[]);
        }

            data?.currentEducationLevel? onBoarding.currentEducationLevel = data.currentEducationLevel : '';

            data?.major? onBoarding.major = data.major : '';
            data?.yearOfGraduation? onBoarding.yearOfGraduation = data.yearOfGraduation : '';
            data?.marks? onBoarding.marks = data.marks : '';

            data?.degreeToAchieve? onBoarding.degreeToAchieve = data.degreeToAchieve : '';
            data?.degreeField? onBoarding.degreeField = data.degreeField : '';
            data?.intake? onBoarding.intake = data.intake : '';
            data?.intakeYear? onBoarding.intakeYear = data.intakeYear : '';


            data?.budget? onBoarding.budget = data.budget : '';
            data?.targetCountries? onBoarding.targetCountries = data.targetCountries : '';
            data?.fundingPlan? onBoarding.fundingPlan = data.fundingPlan : '';
            data?.haveScholarship? onBoarding.haveScholarship = data.haveScholarship : '';

            data?.examGiven? onBoarding.examGiven = data.examGiven : '';
            data?.examScore? onBoarding.examScore = data.examScore : '';
            data?.otherExamGiven? onBoarding.otherExamGiven = data.otherExamGiven : '';



        await onBoarding.save();
        // AI microService to be called to re-evalute user profile;
        return new ApiResponse(200,"User OnBoarded Details Updated Successfully");

    }catch(err){
        throw new ApiError(500,err.message,[]);
    }
}

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

        return new ApiResponse(200,"Success",dataTosend);

    }catch(err){
        throw new ApiError(500,err.message);
    }
}


export {onBoarding, updateOnBoarding, getUserProfileDetails}