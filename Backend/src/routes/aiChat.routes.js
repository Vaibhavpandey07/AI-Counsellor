import { Router } from "express";
import { authToken } from "../middleware/auth.middleware.js";
import { aiChatController } from "../controllers/aiChat.controller.js";

const router = Router();

router.post('/aiChatBot',authToken,aiChatController);


export default router;