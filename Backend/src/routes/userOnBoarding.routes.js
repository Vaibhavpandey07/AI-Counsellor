import { Router } from "express";
import { authToken } from "../middleware/auth.middleware.js";
import { onBoarding, updateOnBoarding } from "../controllers/userOnBoarding.controller.js";

const router = Router();

router.post('/onBoarding',authToken,onBoarding);
router.patch('/updateOnBoarding',authToken, updateOnBoarding);

export default router