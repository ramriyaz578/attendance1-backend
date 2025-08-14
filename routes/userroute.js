const express = require('express');
const mongoose = require('mongoose');
const { usercontroller, updatecontroller, resetpasswordcontroller } = require('../controllers/usercontroller');
const authmiddleware = require('../middleware/authmiddleware');
const upload = require('../middleware/mulder');
const router = express.Router();

router.get("/get-all-user" , usercontroller )
router.get("/get-user", authmiddleware , usercontroller )
router.put("/update-user", authmiddleware , upload.single("image"), updatecontroller )
router.put("/reset-password",  resetpasswordcontroller )



module.exports = router;