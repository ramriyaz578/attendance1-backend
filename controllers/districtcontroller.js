const districtschema = require("../models/district");
const mongoose = require("mongoose");

const registerdistrictcontroller = async (req, res) => {
  try {
    const { district } = req.body;
    console.log(district);

    const existing = await districtschema.findOne({ district: district });
    if (existing) {
      return res.status(400).json({ message: "District already exists" });
    }

    const newDistrict = new districtschema({ district: district });
    await newDistrict.save();

    res
      .status(201)
      .json({
          status : true,
         message: "District added successfully", data: newDistrict });
  } catch (error) {
    console.error("Error in register controller:", error);
    res.status(500).json({
       status : false,
       message: "Server error" 
      });
  }
};

const getdistrictscontroller = async (req, res) => {
  try {
    const districts = await districtschema.find();
    res.status(200).json({
      status : true,
      message: "Districts retrieved successfully",
      //   data : districts
      data: [
        ...districts.map((district) => ({
          id: district._id,
          district: district.district,
        })),
      ],
    });
  } catch (error) {
    console.error("Error in get districts controller:", error);
    res.status(500).json({
       status : false,
       message: "Server error" });
  }
};

const editdistrictcontroller = async (req, res) => {
  try {
    const { districtId, districtname } = req.body;

    const existingdistrict = await districtschema.findById(districtId);
    if (!existingdistrict) {
      return res.status(404).json({ message: "District not found" });
    }

    // Update district details
    existingdistrict.district = districtname;
    await existingdistrict.save();

    // Respond with updated district details
    res.status(200).json({
      status: true,
      message: "District updated successfully",
      data: {
        id: existingdistrict._id,
        district: existingdistrict.district,
      },
    });
  } catch (error) {
    console.error("Error in edit district controller:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

// const removeDistrictController = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const district = await districtschema.findByIdAndDelete(id);
//     if (!district) {
//       return res.status(404).json({ message: "District not found" });
//     }
//     res.status(200).json({ message: "District removed successfully" });
//   } catch (error) {
//     console.error("Error in remove district controller:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


const deletedistrictcontroller =  async (req, res) => {
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid district ID" });
  }

  try {
    const deleted = await districtschema.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "District not found" });
    }
    return res.status(200).json({ message: "District deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}




module.exports = {
  registerdistrictcontroller,
  getdistrictscontroller,
  editdistrictcontroller,
  deletedistrictcontroller
};
