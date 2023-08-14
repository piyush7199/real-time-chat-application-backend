import express from "express";
import { protect } from "../middleware/authMiddleWare.js";
import { accessChat, fetchChat } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", protect, accessChat);
router.get("/", protect, fetchChat);
// router.post("/group", "");
// router.put("/rename", "");

export default router;
