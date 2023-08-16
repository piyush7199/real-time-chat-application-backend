import asyncHandler from "express-async-handler";
import { INTERNAL_SERVER_ERROR } from "../utility/utility.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import { Chat } from "../models/chatModel.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.status(400).json({ msg: "Invalid data passed" });
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.user",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

export const getAllMessage = asyncHandler(async (req, res) => {
  try {
    const message = await Message.find({
      chat: req.params.chatId,
    })
      .populate("sender", "name pic email")
      .populate("chat");
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});
