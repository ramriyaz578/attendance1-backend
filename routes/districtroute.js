const mongoose = require('mongoose');
const express = require('express');
const { registerdistrictcontroller, getdistrictscontroller, editdistrictcontroller, removeDistrictController, deletedistrictcontroller } = require('../controllers/districtcontroller');
const { get } = require('./userroute');
const router = express.Router(); 

router.post("/register", registerdistrictcontroller);
router.get("/getall-dist", getdistrictscontroller);
// router.get("/getby-district/:id", ),
router.post("/edit-district", editdistrictcontroller );
router.delete("/remove-district/", deletedistrictcontroller);

module.exports = router;
