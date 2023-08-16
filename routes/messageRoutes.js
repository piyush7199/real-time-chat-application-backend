import express from "express";
import {
  getAllMessage,
  sendMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

// router.post()
router.post("/", protect, sendMessage);
router.get("/:chatId", getAllMessage);

export default router;
