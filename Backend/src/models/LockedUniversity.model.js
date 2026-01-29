import mongoose, { Schema } from "mongoose";
import Users from "./Users.model.js";
import { Universities } from "./universities.model.js";

const lockedUnversitySchema = new Schema({

  user_id :{type:Schema.Types.ObjectId, required :true , ref : Users},
  university_id :{type:Schema.Types.ObjectId, required :true , ref : Universities },
  Stages : {type:Object},
  currentStage :{type:Number},
  deadline :{type:Date}


},{timestamps:true});


const LockedUniversity = mongoose.model('LockedUniversity' , lockedUnversitySchema);

export {LockedUniversity}