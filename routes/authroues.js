const mongoose = require('mongoose');
const express = require('express');
const { registercontroller, loginController } = require('../controllers/authcontroller');
const upload = require('../middleware/mulder');
const router = express.Router();

router.post('/register', upload.single('image'), registercontroller);
router.post('/login', loginController);

module.exports = router;