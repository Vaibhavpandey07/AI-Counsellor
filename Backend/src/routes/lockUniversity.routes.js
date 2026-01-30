import { Router } from "express";
import { authToken } from "../middleware/auth.middleware.js";
 import {lockUniversity,unlockUniversity, getLockedUniversityDetails} from "../controllers/lockUniversity.controller.js"
const router = Router();

router.post('/lockUniversity',authToken,lockUniversity);
router.delete('/unlockUniversity',authToken,unlockUniversity);
router.get('/getLockedUniversityDetails',authToken,getLockedUniversityDetails);


export default router;