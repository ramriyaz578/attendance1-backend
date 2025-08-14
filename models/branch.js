const mongoose = require("mongoose");
const district = require("./district");

const branch = new mongoose.Schema(
  {
    branchname: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    district: {
      type: String,
      required: true,
    },
    districtid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Branch", branch, "branches");
