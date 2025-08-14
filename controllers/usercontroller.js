const Userschema = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadFileToS3 } = require("../utils/s3uploader");

const usercontroller = async (req, res) => {
  console.log("User controller initialized");
  try {
    const userId = await Userschema.findById({ _id: req.user.id });

    res.status(200).send({
      status: true,
      message: "User controller is working",
      data: {
        username: userId.username,
        email: userId.email,
        phone: userId.phone,
        dateOfBirth: userId.dateOfBirth,
        address: userId.address,
        image: userId.image,
      },
    });
  } catch (err) {
    console.error("Error in user controller:", err);
  }
};

const updatecontroller = async (req, res) => {
  console.log("User controller initialized");
  try {
    const userId = await Userschema.findById({ _id: req.user.id });
    if (!userId) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }

    // Update user details
    const { username, email, phone, dateOfBirth, address} = req.body;

     let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadFileToS3(req.file);
    }
   

    userId.username = username || userId.username;
    userId.email = email || userId.email;
    userId.phone = phone || userId.phone;
    userId.dateOfBirth = dateOfBirth || userId.dateOfBirth;
    userId.address = address || userId.address;
    userId.image = imageUrl;
    await userId.save();

    // Respond with updated user details
    console.log("User details updated successfully");

    res.status(200).send({
      status: true,
      message: "User details updated successfully",
      data: {
        username: userId.username,
        email: userId.email,
        phone: userId.phone,
        dateOfBirth: userId.dateOfBirth,
        address: userId.address,
        image: userId.image,
      },
    });
  } catch (err) {
    console.error("Error in user controller:", err);
  }
};

const resetpasswordcontroller = async (req, res) => {
  console.log("resetpasswordcontroller initialized");
  const { email, phone, dateOfBirth, password } = req.body;
  try {
    const userId = await Userschema.findOne({ email, phone, dateOfBirth });

    if (!userId) {
      return res.status(404).send({
        status: false,
        message: "User not found",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    userId.password = hashedPassword;

    await userId.save();
    console.log("User details updated successfully");

    res.status(200).send({
      status: true,
      message: "User details updated successfully",
      data: {
        username: userId.username,
        email: userId.email,
        phone: userId.phone,
        dateOfBirth: userId.dateOfBirth,
        address: userId.address,
        image: userId.image,
      },
    });
  } catch (err) {
    console.error("Error in user controller:", err);
  }
};

module.exports = { usercontroller, updatecontroller, resetpasswordcontroller };
