const { uploadFileToS3 } = require("../utils/s3uploader");
const attendanceSchema = require("../models/attendance");
const Userschema = require("../models/users");
const Branch = require("../models/branch");
const District = require("../models/district");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query; // expected format: "2025/08/15"
    console.log(date);

    if (!date) return res.status(400).json({ message: "Date is required" });

    // Extract year and month
    const [year, month, _day] = date.split("/");

    console.log(year, month, _day);

    const monthMap = {
      "01": "jan",
      "02": "feb",
      "03": "mar",
      "04": "apr",
      "05": "may",
      "06": "jun",
      "07": "jul",
      "08": "aug",
      "09": "sep",
      "10": "oct",
      "11": "nov",
      "12": "dec",
    };

    const monthKey = monthMap[month];

    console.log(monthKey);

    if (!monthKey) {
      return res.status(400).json({ message: "Invalid month in date" });
    }

    // ✅ Step 1: Get all records where that month exists
    const allRecords = await attendanceSchema
      .find({ [`attendance.${year}.${monthKey}`]: { $exists: true } })
      .populate("userId", "name empId role");
    const presentemplyees = [];
    const lopemplyess = [];
    const casualemployee = [];

    console.log(allRecords);

    for (const record of allRecords) {
      const user = record.userId;
      const persondetail = await Userschema.findById(user._id);
      const yearData = record.attendance?.get(year);
      const monthData = yearData?.[monthKey] || [];

      console.log(monthData);

      const present = monthData.find(
        (entry) => entry.date === date && entry.daytype === "present"
      );
      const lop = monthData.find(
        (entry) => entry.date === date && entry.daytype === "loseofpay"
      );
      const casual = monthData.find(
        (entry) => entry.date === date && entry.daytype === "casualleave"
      );

      if (present) {
        presentemplyees.push({
          name: persondetail.username,
          image: persondetail.image,
          attendance: present,
        });
      }
      if (lop) {
        lopemplyess.push({
          name: persondetail.username,
          image: persondetail.image,
          attendance: lop,
        });
      }
      if (casual) {
        casualemployee.push({
          name: persondetail.username,
          image: persondetail.image,
          attendance: casual,
        });
      }
    }

    res.json({
      date,
      presentemplyees: presentemplyees.length,
      lopemplyess: lopemplyess.length,
      casualemployee: casualemployee.length,
      attendance: {
        presentemplyees,
        lopemplyess,
        casualemployee,
      },
    });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// const getAttendanceByDate = async (req, res) => {
//   try {
//     const { date } = req.query; // expected format: "2025/08/15"
//     console.log(date);
//     if (!date) return res.status(400).json({ message: "Date is required" });

//     // Extract year and month
//     const [year, month, _day] = date.split("/"); // "2025/08/15"
//     const monthMap = {
//       "01": "jan",
//       "02": "feb",
//       "03": "mar",
//       "04": "apr",
//       "05": "may",
//       "06": "jun",
//       "07": "jul",
//       "08": "aug",
//       "09": "sep",
//       10: "oct",
//       11: "nov",
//       12: "dec",
//     };

//     console.log();

//     const monthKey = monthMap[month];
//     const result = [];

//     const targetDate = "2025/08/15";
//     const results = [];

//     for (const record of allRecords) {
//       const user = record.userId;
//       const monthEntries = record.attendance?.[year]?.[monthKey] || [];
//       const match = monthEntries.find((entry) => entry.date === targetDate);
//       if (match) {
//         results.push({
//           userId: user._id,
//           name: user.name,
//           empId: user.empId,
//           role: user.role,
//           ...match,
//         });
//       }
//     }
//     console.log(results);
//     res.json({ date, total: result.length, attendance: result });
//   } catch (err) {
//     console.error("Error fetching attendance:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

const getuserreporttoday = async (req, res) => {
  try {
    const { date } = req.query;
    console.log(date);

    const userId = await Userschema.findById({ _id: req.user.id });
    console.log(userId);

    if (!date) {
      return res.status(400).json({ message: "date params is required" });
    }

    // Parse date
    const [year, monthIndex, day] = date.split("/");
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    const month = months[parseInt(monthIndex, 10) - 1];

    const attendance = await attendanceSchema.findOne({ userId });

    if (!attendance || !attendance.attendance.has(year)) {
      return res.status(404).json({ message: "No attendance for this year" });
    }

    const yearData = attendance.attendance.get(year);

    if (!yearData[month]) {
      return res.status(404).json({ message: "No attendance for this month" });
    }

    const todayEntry = yearData[month].find((entry) => entry.date === date);

    if (!todayEntry) {
      return res.status(200).json({
        status: false,
        message: "No attendance found for today",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Attendance found for today",
      data: todayEntry,
    });
  } catch (err) {
    res;
  }
};

const getuserreportmonth = async (req, res) => {
  try {
    const { month, year } = req.query;
    console.log(month, year);

    const userId = await Userschema.findById({ _id: req.user.id });
    console.log(userId);

    if (!month || !year) {
      return res
        .status(400)
        .json({ message: "month name and year is required" });
    }

    const attendance = await attendanceSchema.findOne({ userId });

    if (!attendance || !attendance.attendance.has(year)) {
      return res.status(404).json({ message: "No attendance for this year" });
    }

    console.log(attendance);

    const yearData = attendance.attendance.get(year);

    if (!yearData[month]) {
      return res.status(404).json({ message: "No attendance for this month" });
    }

    const todayEntry = yearData[month];

    console.log(todayEntry);

    if (!todayEntry) {
      return res.status(200).json({
        status: false,
        message: "No attendance found for today",
        data: null,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Attendance found for today",
      data: todayEntry,
    });
  } catch (err) {
    res;
  }
};

const postattendance = async (req, res) => {
  try {
    const user = await Userschema.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const empid = user._id;
    const { date, checkin, checkinlat, checkinlong, islatecheckIn, daytype } =
      req.body;

    if (!date || !checkin) {
      return res
        .status(400)
        .json({ message: "Date and checkin time are required" });
    }

    // Parse date
    const [year, monthIndex, day] = date.split("/");
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    const month = months[parseInt(monthIndex, 10) - 1];

    let checkinimg = "";
    checkinimg = await uploadFileToS3(req.file);

    const attendanceData = {
      date,
      checkin,
      checkinlat: checkinlat || null,
      checkinlong: checkinlong || null,
      checkinimg: checkinimg,
      islatecheckIn: islatecheckIn || false,
      daytype: daytype,
    };

    let attendance = await attendanceSchema.findOne({ userId: empid });

    if (!attendance) {
      // First time creation
      const monthObject = {
        [month]: [attendanceData],
      };

      attendance = new attendanceSchema({
        userId: empid,
        attendance: {
          [year]: monthObject,
        },
      });
    } else {
      // Already exists, update
      if (!attendance.attendance.has(year)) {
        attendance.attendance.set(year, {});
      }

      const yearData = attendance.attendance.get(year);

      if (!yearData[month]) {
        yearData[month] = [];
      }

      const duplicate = yearData[month].find((entry) => entry.date === date);
      if (duplicate) {
        return res.status(400).json({
          status: false,
          message: `Already checked in on ${date}`,
          data: duplicate,
        });
      }

      yearData[month].push(attendanceData);
      attendance.attendance.set(year, yearData);
    }

    await attendance.save();

    res.status(200).json({
      status: true,
      message: "Attendance saved successfully",
      data: attendanceData,
    });
  } catch (error) {
    console.error("Error in postattendance:", error);
    res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// const postattendance = async (req, res) => {
//   try {
//     const user = await Userschema.findById({ _id: req.user.id });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const empid = user._id;
//     const { date, checkin, checkinlat, checkinlong, checkinimg, islatecheckIn } = req.body;

//     const [year, monthIndex] = date.split("/"); // assuming "2025/01/01"
//     const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
//     const month = months[parseInt(monthIndex, 10) - 1];

//     const attendanceData = {
//       date,
//       checkin,
//       checkinlat,
//       checkinlong,
//       checkinimg,
//       islatecheckIn,
//     };

//     let attendance = await attendanceSchema.findOne({ userId: empid });

//     if (!attendance) {
//       // New document
//       attendance = new attendanceSchema({
//         userId: empid,
//         year: {
//           [year]: {
//             [month]: [attendanceData],
//           },
//         },
//       });
//     } else {
//       // Existing document
//       if (!attendance.year) {
//         attendance.year = {};
//       }
//       if (!attendance.year[year]) {
//         attendance.year[year] = {};
//       }
//       if (!attendance.year[year][month]) {
//         attendance.year[year][month] = [];
//       }

//       attendance.year[year][month].push(attendanceData);
//     }

//     await attendance.save();

//     res.status(200).send({
//       status: true,
//       message: "Attendance saved successfully",
//       data: attendance,
//     });
//   } catch (error) {
//     console.error("Error in register controller:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const postattendance = async (req, res) => {
//   try {
//     const userId = await Userschema.findById({ _id: req.user.id });
//     console.log(userId);
//     const empid = userId._id
//     const { date, checkin, checkinlat, checkinlong, checkinimg, islatecheckIn  } = req.body;

//     const [year, monthIndex, day] = date.split("/"); // 2025/01/01
//     const months = [
//       "jan",
//       "feb",
//       "mar",
//       "apr",
//       "may",
//       "jun",
//       "jul",
//       "aug",
//       "sep",
//       "oct",
//       "nov",
//       "dec",
//     ];
//     const month = months[parseInt(monthIndex, 10) - 1];

//     const attendanceData = {
//       date,
//       checkin,
//       checkinlat,
//       checkinlong,
//       checkinimg,
//       islatecheckIn,
//       // Other fields like checkout, checkoutlat etc. will be null by default
//     };

//     let attendance = await attendanceSchema.findOne({ userId });

//     if (!attendance) {
//       // Create new attendance if not exists
//       attendance = new attendanceSchema({
//         userId,
//         year: {
//           [year]: {
//             [month]: [attendanceData],
//           },
//         },
//       });
//     } else {
//       if (!attendance.year.has(year)) {
//         attendance.year.set(year, {});
//       }

//       const monthData = attendance.year.get(year)[month] || [];
//       monthData.push(attendanceData);
//       attendance.year.get(year)[month] = monthData;
//     }

//     await attendance.save();

//     res.status(200).send({
//       status: true,
//       message: "attedance get suceesfully",
//       data: {},
//     });
//   } catch (error) {
//     console.error("Error in register controller:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const putAttendance = async (req, res) => {
  try {
    const user = await Userschema.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const empid = user._id;
    const {
      date,
      checkoutlat,
      checkoutong,
      checkout,
      Workedhours,
      overtimehours,
    } = req.body;

    const [year, monthIndex, day] = date.split("/"); // "2025/08/02"
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    const month = months[parseInt(monthIndex, 10) - 1];

    let attendance = await attendanceSchema.findOne({ userId: empid });

    console.log(attendance);

    // Find the user's attendance
    // const attendance = await attendanceSchema.findById({ userId: empid });

    if (!attendance) {
      return res.status(404).json({
        status: false,
        message: "Attendance record not found",
      });
    }

    // console.log(`attendance found ${attendance}`);

    if (!attendance.attendance.has(year)) {
      return res.status(404).json({
        status: false,
        message: `No attendance for year ${year}`,
      });
    }

    const yearData = attendance.attendance.get(year);

    if (!yearData[month]) {
      return res.status(404).json({
        status: false,
        message: `No attendance for month ${month}`,
      });
    }

    const dayEntry = yearData[month].find((entry) => entry.date === date);

    console.log(dayEntry);

    if (!dayEntry) {
      return res.status(404).json({
        status: false,
        message: `No attendance entry found for date ${date}`,
      });
    }

    let checkoutimg = "";
    checkoutimg = await uploadFileToS3(req.file);

    // Update fields
    dayEntry.checkout = checkout || null;
    dayEntry.checkoutlat = checkoutlat || null;
    dayEntry.checkoutong = checkoutong || null;
    dayEntry.checkoutimg = checkoutimg || null;
    dayEntry.Workedhours = Workedhours || null;
    dayEntry.overtimehours = overtimehours || null;

    // // Set back year data and save
    // attendance.attendance.set(year, yearData);
    await attendance.save();

    res.status(200).json({
      status: true,
      message: "Checkout updated successfully",
      data: dayEntry,
    });
  } catch (error) {
    console.error("Error updating checkout:", error);
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// const putAttendance = async (req, res) => {
//   const { employeeId, date, checkoutlat, checkoutong, checkout, checkoutimg, Workedhours, overtimehours   } =
//     req.body;

//   const [year, monthIndex, day] = date.split("/"); // 2025/01/01
//   const months = [
//     "jan",
//     "feb",
//     "mar",
//     "apr",
//     "may",
//     "jun",
//     "jul",
//     "aug",
//     "sep",
//     "oct",
//     "nov",
//     "dec",
//   ];
//   const month = months[parseInt(monthIndex, 10) - 1];

//   const attendanceData = {
//     checkout,
//     checkoutlat,
//     checkoutong,
//     checkoutimg,
//     Workedhours,
//     overtimehours,
//   };

//   try {
//     let attendance = await attendanceSchema.findOne({ employeeId });

//     attendance = new attendanceSchema({
//         employeeId,
//         year: {
//           [year]: {
//             [month]: [attendanceData],
//           },
//         },
//       });
//     await attendance.save();

//     res.status(200).json({
//       status: true,
//       message: "Attendance recorded successfully",
//       data: attendance,
//     });
//   } catch (error) {
//     console.error("Error saving attendance:", error);
//     res.status(500).json({ status: false, message: "Server error", error });
//   }
// };

const updateattendance = async (req, res) => {
  try {
    const userId = await Userschema.findById({ _id: req.user.id });
    console.log(userId);

    res.status(200).send({
      status: true,
      message: "attedance get suceesfully",
      data: {},
    });
  } catch (error) {
    console.error("Error in register controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getuserreporttoday,
  getAttendanceByDate,
  postattendance,
  putAttendance,
  getuserreportmonth,
  getAttendanceByDate,
};
