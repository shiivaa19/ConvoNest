import { generateToken } from "../lib/utils.js";
import { findUserByEmail, createUser, findUserById, updateUserProfile } from "../models/userQueries.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs"

//  Signup a new User
export const Signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    const user = await findUserByEmail(email);
    if (user) {
      return res.json({
        success: false,
        message: "Account already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await createUser(fullName, email, hashedPassword, bio || "");

    const token = generateToken(newUser.id);
    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await findUserByEmail(email);

    if (!userData) {
        return res.json({
            success: false,
            message: "User not found"
        });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.json({
        success: false,
        message: "Invalid credentails",
      });
    }

    const token = generateToken(userData.id);
    res.json({
      success: true,
      userData,
      token,
      message: "Login Successful",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//  Controller to check if the user is authenticated
export const checkAuth = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// controller to update user profile details
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user.id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await updateUserProfile(userId, fullName, bio, undefined);
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await updateUserProfile(userId, fullName, bio, upload.secure_url);
    }
    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
