import asyncHandler from "express-async-handler";
import { Chat } from "../models/chatModel.js";
import { INTERNAL_SERVER_ERROR, generatedToken } from "../utility/utility.js";

export const createGroup = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({ msg: "Please fill all the fields" });
  }

  var users = req.body.users.split(",");

  if (users.length < 2) {
    return res.status(400).json({ msg: "More than 2 users required." });
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json(fullChat);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

export const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const chat = await Chat.findById(chatId);
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    return res.status(500).json({ msg: INTERNAL_SERVER_ERROR });
  } else {
    return res.status(200).json(updatedChat);
  }
});

export const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    return res.status(500).json({ msg: "Chat not found" });
  } else {
    return res.status(200).json(added);
  }
});

export const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    return res.status(500).json({ msg: "Chat not found" });
  } else {
    return res.status(200).json(removed);
  }
});
