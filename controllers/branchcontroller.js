const Branch = require("../models/branch"); // adjust path as needed
const District = require("../models/district");
const mongoose = require("mongoose");

const registerbrachcontroller = async (req, res) => {
  const { branchname, code, districtId } = req.body;
  console.log("Branch controller initialized");

  try {
    if (!branchname || !code || !districtId) {
      console.log(`${branchname} ${code} ${districtId}`);
      return res
        .status(400)
        .json({ message: "branchname, code and districtId are required" });
    }
    const existingBranchcode = await Branch.findOne({ code: code });
    if (existingBranchcode) {
      return res.status(400).json({ message: "Branch code already exists" });
    }
    const district = await District.findById(districtId);
    if (!district) {
      return res.status(404).json({ message: "District not found" });
    }
    const existingBranchInDistrict = await Branch.findOne({
      branchname: branchname,
      district: districtId,
    });

    if (existingBranchInDistrict) {
      return res
        .status(400)
        .json({ message: "Branch already exists in this district" });
    }

    // Create new branch
    const newBranch = new Branch({
      branchname,
      code,
      district: district.district, // Assuming district is a string field in the Branch model
      districtid: district._id,
    });

    await newBranch.save();

    const branchWithDetails = await Branch.findById(newBranch._id).populate(
      "districtid"
    );

    res.status(201).json({
      message: "Branch registered successfully",
      branch: branchWithDetails,
    });
  } catch (error) {
    console.error("Error in register branch controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatebrachcontroller = async (req, res) => {
  const { branchname, code, branchid } = req.body;
  console.log("Branch controller initialized");

  try {
    // Basic validation
    if (!branchname || !code || !branchid) {
      console.log(`${branchname} ${code}`);
      return res
        .status(400)
        .json({ message: "branchname, code and districtId are required" });
    }

    const existing = await Branch.findById({ _id: branchid });
    if (existing) {
      return res.status(200).json({ message: "Branch is exists" });
    }

    // Check if district exists
    const district = await District.findById(districtId);
    if (!district) {
      return res.status(404).json({ message: "District not found" });
    }

    // Disallow same branchname in same district
    const existingBranchInDistrict = await Branch.findOne({
      branchname: branchname,
      district: districtId,
    });

    if (existingBranchInDistrict) {
      return res
        .status(400)
        .json({ message: "Branch already exists in this district" });
    }

    // Create new branch
    const newBranch = new Branch({
      branchname,
      code,
      // district: district.district, // Assuming district is a string field in the Branch model
      districtid: district._id,
    });

    await newBranch.save();

    const branchWithDetails = await Branch.findById(newBranch._id).populate(
      "districtid"
    );

    res.status(201).json({
      message: "Branch updataed successfully",
      branch: branchWithDetails,
    });
  } catch (error) {
    console.error("Error in register branch controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const Branch = require('../models/branch'); // Adjust the path to your Branch model

const getBranchesByDistrict = async (req, res) => {
  const { id } = req.query;
  console.log(id);
  try {
    console.log(id);
    const branches = await Branch.find({ districtid: id });
    console.log("Branches found:", branches);

    if (!branches || branches.length === 0) {
      return res
        .status(404)
        .json({ message: "No branches found for this district" });
    }
    res.status(200).json({
      status: true,
      message: "Branches fetched successfully",
      data: [
        ...branches.map((branch) => ({
          id: branch._id,
          name: branch.branchname,
        })),
      ],
    });
  } catch (error) {
    console.error("Error fetching branches by district ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getallbranchcontroller = async (req, res) => {
  console.log("User controller initialized")
  try {
    const branchlist = await Branch.find();

    res.status(200).send({
      status: true,
      message: "Available branches list ",
      data: [
        branchlist.map((branch) => ({
           id : branch._id,
           name : branch.branchname
        }))
      ]
          
      ,
    });
  } catch (err) {
    console.error("Error in user controller:", err);
  }
};

const getbranchbyid = async (req, res) => {
  const { id } = req.query;
  // console.log("User controller initialized");
  try {
    const branch = await Branch.findById({ _id: req.user.id });
    if (!branch) {
      return res.status(404).send({
        status: false,
        message: "Branch not found",
      });
    }

    res.status(200).send({
      status: true,
      message: "Branch  successfully",
      data: branch 
    });
  } catch (err) {
    console.error("Error in user controller:", err);
  }
};

const deletebybranchid = async (req, res) => {
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

module.exports = {
  registerbrachcontroller,
  getBranchesByDistrict,
  getallbranchcontroller,
  updatebrachcontroller,
  getbranchbyid,
  deletebybranchid,
};
