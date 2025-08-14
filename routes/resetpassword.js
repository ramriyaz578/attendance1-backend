const express = require('express');
const mongoose = require('mongoose');
const { verifyResetCodeAndSetPassword, sendResetCode } = require('../controllers/resetpassword');
const router = express.Router();


router.post("/reset-code",  sendResetCode )
router.post("/reset-password", verifyResetCodeAndSetPassword )


module.exports = router;