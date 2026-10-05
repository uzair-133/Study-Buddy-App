const userModel = require("../models/userModel");
const { uploadFile } = require("../services/storage.service");

// 1. Profile Picture Update Controller
const updateProfile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Please select an image file" });
    }

    // File ko ImageKit par upload karein
    const result = await uploadFile(
      file.buffer.toString("base64"),
      file.originalname || "avatar.jpg",
      "/studyBuddy/avatars"
    );

    // Database me user ka profile image update karein
    const userId = req.user.id || req.user._id;
    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        { profileImage: result.url },
        { returnDocument: "after" }
      )
      .select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

// 2. Delete User Controller
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Update Name Controller
const updateName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Check karein ke is naam ka koi aur user to nahi
    const nameExist = await userModel.findOne({
      name,
      _id: { $ne: req.user.id },
    });
    if (nameExist) {
      return res.status(400).json({ message: "User already exists with this name" });
    }

    // Name update karein
    const updatedUser = await userModel
      .findByIdAndUpdate(req.user.id, { name }, { returnDocument: "after" })
      .select("-password");

    res.status(200).json({
      message: "Name updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateProfile,
  deleteUser,
  updateName,
};
