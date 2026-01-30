import { Router} from "express";
import { authToken } from "../middleware/auth.middleware.js";
import {getUserProfileDetails , shortlistUniversity , removeFromShortlist , getShortlistedUniversities} from "../controllers/userOtherDetails.controller.js";


const router = Router();

router.get('/getProfileDetails',authToken,getUserProfileDetails);
router.patch('/shortlistUniversity',authToken,shortlistUniversity);

router.patch('/removeFromShortlist',authToken,removeFromShortlist);
router.get('/getShortlistedUniversities',authToken,getShortlistedUniversities);





export default router; 