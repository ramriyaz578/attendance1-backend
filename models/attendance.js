const mongoose = require("mongoose");

const daySchema = new mongoose.Schema({
  date: { type: String, required: true },
  checkin: {
    type: String,
  },
  checkinlat: { type: String },
  checkinlong: { type: String },
  checkout: { type: String, default: null },
  checkoutlat: {
    type: String,
    default: null,
  },
  checkoutong: {
    type: String,
    default: null,
  },
  ispressent: {
    type: Boolean,
    default: true,
  },
  islatecheckIn: {
    type: Boolean,
    default: false,
  },
  daytype: {
    type: String,
    enum: ["present", "loseofpay", "casualleave"],
    require: true
  },   
  Workedhours: {
    type: String,
    default: null,
  },
  overtimehours: {
    type: String,
    default: null,
  },
  checkinimg: {
    type: String,
    default: null,
  },
  checkoutimg: {
    type: String,
    default: null,
  },
 
});

const monthSchema = new mongoose.Schema(
  {
    jan: [daySchema],
    feb: [daySchema],
    mar: [daySchema],
    apr: [daySchema],
    may: [daySchema],
    jun: [daySchema],
    jul: [daySchema],
    aug: [daySchema],
    sep: [daySchema],
    oct: [daySchema],
    nov: [daySchema],
    dec: [daySchema],
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendance: {
      type: Map,
      of: monthSchema, // year => { jan: [...], feb: [...] }
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
