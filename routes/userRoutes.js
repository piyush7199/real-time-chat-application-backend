import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", protect, getUsers);

export default router;
