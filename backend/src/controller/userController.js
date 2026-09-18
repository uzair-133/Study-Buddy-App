const userModel = require("../models/userModel");
const { uploadFile } = require("../services/storage.service");

const updateProfile = async (req, res) => {
  try {
    const file = req.file || (req.files && req.files[0]);
    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    const result = await uploadFile(file.buffer.toString("base64"), file.originalname || "avatar.jpg");

    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.user.id,
        { profileImage: result.url || result.fileUrl },
        { returnDocument: 'after' }
      )
      .select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "internal server error" });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await userModel.findByIdAndDelete(userId);
    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const nameExist = await userModel.findOne({
      name,
      _id: { $ne: req.user.id },
    });
    if (nameExist) {
      return res.status(400).json({
        message: "User Already Exist By This Name",
      });
    }

    const updateN = await userModel
      .findByIdAndUpdate(req.user.id, { name }, { returnDocument: 'after' })
      .select("-password");
    res.status(200).json({
      message: "Name Updated Successfully",
      user: updateN,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server Error",
    });
  }
};

module.exports = {
  updateProfile,
  deleteUser,
  updateName,
};
