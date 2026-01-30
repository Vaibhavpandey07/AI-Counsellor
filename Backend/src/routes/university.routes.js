import { Router } from "express";
import { authToken } from "../middleware/auth.middleware.js";
import { getAllUniversities,searchUniversity,searchUniversitySuggestions , getUniversitiesByAcceptanceScore } from "../controllers/university.controller.js";

const router = Router();

router.get('/allUniversities',authToken,getAllUniversities);
router.get('/searchUniversities',authToken,searchUniversity);
router.get('/searchSuggestions',authToken,searchUniversitySuggestions);
router.get('/getUniversitiesByUserProfile',authToken,getUniversitiesByAcceptanceScore);


export default router;