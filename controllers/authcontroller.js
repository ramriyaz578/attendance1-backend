const { uploadFileToS3 } = require("../utils/s3uploader");
const Userschema = require("../models/users");
const Branch = require("../models/branch");
const District = require("../models/district");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registercontroller = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      phone,
      dateOfBirth,
      address,
      role,
      branchId,
      department
    } = req.body;
    console.log("Register controller initialized");

    
    if (!username || !password) {
      return res
        .status(500)
        .json({ message: "Username and password are required" });
    }

    const existinguser = await Userschema.findOne({
      email: email,
    });
    if (existinguser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!branchId) {
      return res.status(500).json({ message: "branch is required" });
    }

    const branch = await Branch.findById(branchId);
    console.log("Branch found:", branch);
    if (!branch) {
      return res.status(400).json({ message: "Branch not found" });
    }
    const district = await District.findById(branch.districtid);
    console.log("District found:", district);
    const hashedPassword = await bcrypt.hash(password, 10);
    const imageUrl = await uploadFileToS3(req.file);

    const newUser = new Userschema({
      username: username,
      email: email,
      password: hashedPassword,
      phone: phone,
      role: role,
      dateOfBirth: dateOfBirth,
      address: address,
      image: imageUrl,
      branch: branch,
      district: district,
      department:department 
    });
    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        dateOfBirth: newUser.dateOfBirth,
        address: newUser.address,
        image: newUser.image,
        branch: {
          _id: branch._id,
          branchname: branch.branchname,
          code: branch.code,
          district: {
            _id: district._id,
            name: district.name,
            state: district.state,
            region: district.region,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error in register controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const logincontroller = async (req, res) => {
//   const { email, password} = req.body;
//   try {
//     if (!email || !password ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const User = await Userschema.findOne({ email });
//     if (!User) {
//       return res.status(400).json({ message: "User not found" });
//     }
//     res.status(201).json({ message: "User registered", user: newUser });
//   } catch (error) {
//     console.error("Error in register controller:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await Userschema.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Compare input password with hashed password

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match status:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      status: true,
      message: "Login successful",

      user: {
        username: user.username,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        image: user.image,
      },
      token: token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registercontroller, loginController };
