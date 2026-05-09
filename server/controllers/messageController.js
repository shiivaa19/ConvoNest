import { getAllUsersExcept, getUnseenMessagesCount, getMessagesForUsers, markMessagesAsSeen, createMessage, markMessageAsSeen as markMessageAsSeenDb } from "../models/messageQueries.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

// get all users except the logged in user
export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.json({
        success: false,
        message: "User ID not found",
      });
    }

    const filteredUsers = await getAllUsersExcept(userId);

    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const count = await getUnseenMessagesCount(user.id, userId);
      if (count > 0) {
        unseenMessages[user.id] = count;
      }
    });
    await Promise.all(promises);
    res.json({
      success: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.log("getUserForSidebar error:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// get all messages for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user?.id;

    if (!myId || !selectedUserId) {
      return res.json({
        success: false,
        message: "Invalid user IDs",
      });
    }

    const messages = await getMessagesForUsers(myId, selectedUserId);

    await markMessagesAsSeen(selectedUserId, myId);

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log("getMessages error:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.json({
        success: false,
        message: "Message ID required",
      });
    }
    await markMessageAsSeenDb(id);
    res.json({ success: true });
  } catch (error) {
    console.log("markMessageAsSeen error:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user?.id;

    if (!senderId || !receiverId) {
      return res.json({
        success: false,
        message: "Invalid user IDs",
      });
    }

    if (!text && !image) {
      return res.json({
        success: false,
        message: "Message must contain text or image",
      });
    }

    let imageUrl;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (err) {
        console.log("Cloudinary upload error:", err.message);
        imageUrl = null;
      }
    }

    const newMessage = await createMessage(senderId, receiverId, text, imageUrl);

    if (!newMessage) {
      return res.json({
        success: false,
        message: "Failed to create message",
      });
    }

    // Emit the new message to the receivers's socket
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log("sendMessage error:", error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
