import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import { INTERNAL_SERVER_ERROR, generatedToken } from "../utility/utility.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name) {
    return res.status(400).json({ msg: "Please provide name" });
  }

  if (!email) {
    return res.status(400).json({ msg: "Please provide email" });
  }

  if (!password) {
    return res.status(400).json({ msg: "Please provide password" });
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ msg: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generatedToken(user._id),
    });
  } else {
    res.status(500).json({ msg: INTERNAL_SERVER_ERROR });
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ msg: "Please provide email" });
  }

  if (!password) {
    return res.status(400).json({ msg: "Please provide password" });
  }
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generatedToken(user._id),
    });
  } else {
    res.status(401).json({ msg: "Invalid Email or Password" });
  }
});

export const getUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password")
    .select("-updatedAt")
    .select("-__v")
    .select("-createdAt");
  res.send(users);
});
