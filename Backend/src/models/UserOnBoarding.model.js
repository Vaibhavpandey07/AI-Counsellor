import mongoose, { Schema } from "mongoose";


const userOnBoardingSchema = new Schema({
    user_id :{type:String, required:true },
    currentEducationLevel :{type:String, required:true },
    major :{type:String, required:true },
    yearOfGraduation :{type:Number, required:true},
    marks :{type:String },

    degreeToAchieve :{type:String},
    degreeField :{type:String},
    intake :{type:String },
    intakeYear :{type:Number},

    budget : {type:Number},
    targetCountries :[{type:String}],
    fundingPlan :{type:String },
    haveScholarship :{type:Boolean},

    examGiven :{type:String},
    examScore :{type:Number},
    otherExamGiven :{type:String },

},{timestamps:true})


const UserOnBoarding = mongoose.model('UserOnBoardings',userOnBoardingSchema);


export {UserOnBoarding}