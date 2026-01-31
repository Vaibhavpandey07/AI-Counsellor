import mongoose from "mongoose";
import ApiError from "../utlis/ApiErrors.util.js";
import { UserOnBoarding } from "../models/UserOnBoarding.model.js";
import { UserOtherDetails } from "../models/UserOtherDetails.model.js";
import { ApiResponse } from "../utlis/ApiResponse.util.js";
import {  generateAllUniversitiesScoreOffline } from "../services/generateUniversityScore.service.js";
import { calculateStudentProfile } from "../services/generateProfileDetails.service.js";

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

            budget : (data?.budget),
            targetCountries :  data?.targetCountries,
            fundingPlan : data?.fundingPlan,
            haveScholarship : data?.haveScholarship,

            examGiven : data?.examGiven,
            examScore : data?.examScore,
            otherExamGiven : data?.otherExamGiven,
        }

        const newOnBoarding = await UserOnBoarding.create(dataToSave);
        const student = {
            educationBackground : {
                    currentEducationLevel : newOnBoarding.currentEducationLevel,
                    major : newOnBoarding.major,
                    yearOfGraduation : newOnBoarding.yearOfGraduation,
                    marks : newOnBoarding.marks,
            },

            targettedCourse :{
                degreeToAchieve : newOnBoarding.degreeToAchieve,
                degreeField : newOnBoarding.degreeField,
                intake : newOnBoarding.intake,
                intakeYear : newOnBoarding.intakeYear,

                budget :newOnBoarding.budget,
                targetCountries :newOnBoarding.targetCountries,
                fundingPlan : newOnBoarding.fundingPlan,
                haveScholarship : newOnBoarding.haveScholarship,
            },

            givenExamDetials :{
                examGiven :newOnBoarding.examGiven,
                examScore :newOnBoarding.examScore,
                otherExamGiven :newOnBoarding.otherExamGiven,
            },

        }
        // Evalution of student profile;
        const studnetProfileDetails = await calculateStudentProfile(student);
        // University score calculation
        const universitiesAcceptanceScore = await generateAllUniversitiesScoreOffline(student);

        await UserOtherDetails.findOneAndUpdate({user_id:req.userId},{$set:{currentStage:2,universitiesAcceptanceScore:universitiesAcceptanceScore , profileScore:studnetProfileDetails.profileScore , profileStrength:studnetProfileDetails.profileStrength, profileWeakness:studnetProfileDetails.profileWeakness}})
        return res.status(200).send(new ApiResponse(200,"User OnBoarded Successfully"));

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

        const student = {
            educationBackground : {
                    currentEducationLevel : onBoarding.currentEducationLevel,
                    major : onBoarding.major,
                    yearOfGraduation : onBoarding.yearOfGraduation,
                    marks : onBoarding.marks,
            },

            targettedCourse :{
                degreeToAchieve : onBoarding.degreeToAchieve,
                degreeField : onBoarding.degreeField,
                intake : onBoarding.intake,
                intakeYear : onBoarding.intakeYear,

                budget :onBoarding.budget,
                targetCountries :onBoarding.targetCountries,
                fundingPlan : onBoarding.fundingPlan,
                haveScholarship : onBoarding.haveScholarship,
            },

            givenExamDetials :{
                examGiven :onBoarding.examGiven,
                examScore :onBoarding.examScore,
                otherExamGiven :onBoarding.otherExamGiven,
            },

        }
        // Evalution of student profile;
        const studnetProfileDetails = await calculateStudentProfile(student);
        // University score calculation
        const universitiesAcceptanceScore = await generateAllUniversitiesScore(student);

        await UserOtherDetails.findOneAndUpdate({user_id:req.userId},{$set:{universitiesAcceptanceScore:universitiesAcceptanceScore , profileScore:studnetProfileDetails.profileScore , profileStrength:studnetProfileDetails.profileStrength, profileWeakness:studnetProfileDetails.profileWeakness}})


        return res.status(200).send( new ApiResponse(200,"User OnBoarded Details Updated Successfully"));

    }catch(err){
        throw new ApiError(500,err.message,[]);
    }
}




export {onBoarding, updateOnBoarding}