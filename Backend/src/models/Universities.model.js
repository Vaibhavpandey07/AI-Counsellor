import mongoose, { Schema } from "mongoose";

const universitiesSchema = new Schema({
        code :{type:String,required:true},
        universityName  :{type:String},
        city :{type:String},
        country  :{type:String},
        website :{type:String},
       
        Description :{type:String},
        courses : [{type:Object}],
        numberOfStudents :{type:Number},
        internationStudentsPercent :{type:Number},
        isInTop200 :{type:Boolean},
        feeBand :{type:String},

},{timestamps:true});

const Universities = mongoose.model('Universities',universitiesSchema);

export {Universities};