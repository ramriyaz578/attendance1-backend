const mongoose = require('mongoose');
const express = require('express');
const { getuserreporttoday, postattendance,  putAttendance, getuserreportmonth, getAttendanceByDate } = require('../controllers/atttendancecontroller');
const upload = require('../middleware/mulder');
const authMiddleware = require('../middleware/authmiddleware');
const router = express.Router();


router.get("/get-report-today", authMiddleware,   getuserreporttoday)
router.get("/get-report-today-admin", getAttendanceByDate)
router.get("/get-report-today-admin", getAttendanceByDate)
router.get("/get-report-month", authMiddleware, getuserreportmonth )
router.post("/post-checkin", authMiddleware, upload.single("checkinimg"),  postattendance)
router.post("/post-checkout", authMiddleware, upload.single("checkoutimg"),  putAttendance)


module.exports = router; 