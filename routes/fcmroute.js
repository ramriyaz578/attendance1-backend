const express = require('express');
const mongoose = require('mongoose');
const { saveDeviceToken } = require('../controllers/fcmcontroller');
const authMiddleware = require('../middleware/authmiddleware');
const router = express.Router();


router.post("/save-fcm-token" , authMiddleware, saveDeviceToken);


module.exports = router