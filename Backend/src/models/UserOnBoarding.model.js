import mongoose, { Schema } from "mongoose";


const userOnBoardingSchema = new Schema({
    user_id :{type:String, required:true },
    currentEducationLevel :{type:String, required:true },
    major :{type:String, required:true },
    yearOfGraduation :{type:Number, required:true},
    marks :{type:String },

    degreeToAchieve :{type:String, required:true },
    degreeField :{type:String, required:true },
    intake :{type:String, required:true },
    intakeYear :{type:Number, required:true},

    budget : {type:Number, required:true},
    targetCountries :[{type:String}],
    fundingPlan :{type:String, required:true },
    haveScholarship :{type:Boolean, required:true},

    examGiven :{type:String, required:true },
    examScore :{type:Number, required:true},
    otherExamGiven :{type:String },

},{timestamps:true})


const UserOnBoarding = mongoose.model('UserOnBoardings',userOnBoardingSchema);


export {UserOnBoarding}