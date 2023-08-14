import express from "express";
import { protect } from "../middleware/authMiddleWare.js";
import {
  addToGroup,
  createGroup,
  removeFromGroup,
  renameGroup,
} from "../controllers/groupController.js";

const router = express.Router();

router.post("/", protect, createGroup);
router.put("/", protect, renameGroup);
router.put("/user", protect, addToGroup);
router.delete("/user", protect, removeFromGroup);

export default router;
