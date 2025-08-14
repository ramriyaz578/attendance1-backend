const Userschema = require("../models/users");
const mongoose = require("mongoose");
const DepartmentToken = require("../models/fcmtoken");

const saveDeviceToken = async (req, res) => {
  try {
    const userId = await Userschema.findById({ _id: req.user.id });
    const { departmentId, departmentName,fcmToken, deviceId } =
      req.body;

    if (!departmentId || !departmentName || !userId || !fcmToken || !deviceId) {
      return res.status(400).json({
        status: false,
        message:
          "All fields (departmentId, departmentName, userId, fcmToken, deviceId) are required.",
      });
    }

    let department = await DepartmentToken.findOne({ departmentId });

    let message = "";

    if (!department) {
      // Create new department record
      await DepartmentToken.create({
        departmentId,
        departmentName,
        tokens: [{ userId, fcmToken, deviceId }],
      });
      message = "added for new department";
    } else {
      const index = department.tokens.findIndex(
        (t) => t.userId.toString() === userId && t.deviceId === deviceId
      );

      if (index > -1) {
        department.tokens[index].fcmToken = fcmToken;
        message = "updated for existing device";
      } else {
        department.tokens.push({ userId, fcmToken, deviceId });
        message = "added for existing department";
      }

      await department.save();
    }

    res.status(200).json({
      status: true,
      message: `Device token ${message}`,
      data: {},
    });
  } catch (err) {
    console.error("Error saving device token:", err);
    res
      .status(500)
      .json({ status: false, message: "Server error", error: err.message });
  }
};

module.exports = { saveDeviceToken };
