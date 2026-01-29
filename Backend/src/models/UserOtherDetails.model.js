import mongoose,{Schema} from "mongoose";
import Users from "./Users.model.js";
import { Universities } from "./universities.model.js";


const userOtherDetailsSchema = new Schema({
    user_id :{type:Schema.Types.ObjectId, required:true , ref:Users},
    profileScore : {type:Number},
    profileStrength : {type:Object},
    profileWeakness : {type:Object},
    currentStage : {type:Number},
    shortlistedUniversities :[{type:Schema.Types.ObjectId, ref:Universities}],
    aiTodoList  : {type:Object},
    currentTodoStage  : {type:Number},
    universitiesAcceptanceScore :[{university_id : {type:Schema.Types.ObjectId, ref:Universities} ,  acceptanceScore :{type:Number} }],

})

const UserOtherDetails = mongoose.model('UserOtherDetails',userOtherDetailsSchema);

export {UserOtherDetails}