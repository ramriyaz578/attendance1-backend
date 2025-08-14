const bcrypt = require("bcryptjs");
const Userschema = require("../models/users");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require("dotenv").config();

const verifyResetCodeAndSetPassword = async (req, res) => {
  const { email, code, newPassword, phone } = req.body;
  try {
    const user = await Userschema.findOne({ email, phone });
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log("User found:", user);
    // if (user.resetCode !== code || user.resetCodeExpires < new Date()) {
    //   return res.status(400).json({ message: "Invalid or expired code" });
    // }
    if (
      !user.resetCode ||
      user.resetCode !== code ||
      user.resetCodeExpires < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }
    console.log("Reset code is valid");
    console.log(newPassword);
    console.log();
    
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetCode = "";
    user.resetCodeExpires = Date.now();
     // Clear reset code and expiry
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const sendResetCode = async (req, res) => {
  const { email, phone } = req.body;
  try {
    const user = await Userschema.findOne({ email, });

    if (!user) return res.status(404).json({ message: "Email not found" });
   console.log("User found:", user);
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.resetCode = code;
    user.resetCodeExpires = expiry;
    await user.save();

    //  

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL}>`,
      to: email,
      subject: "Reset Your Password",
      text: `Your reset code is ${code}. It expires in 10 minutes.`
    });

    res.status(200).json({ message: "Reset code sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { verifyResetCodeAndSetPassword, sendResetCode };