const express = require("express");
const router = express.Router();
const { sendNotification } = require("../controllers/notificationController");

router.get("/send", sendNotification);

module.exports = router;
