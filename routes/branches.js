const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { registerbrachcontroller, deletebybranchid, getBranchesByDistrict, getallbranchcontroller, getbranchbyid } = require('../controllers/branchcontroller');
const { registercontroller, loginController } = require('../controllers/authcontroller');
const upload = require('../middleware/mulder');


router.post('/add-branch',  registerbrachcontroller);
router.post('/update-branch', loginController);
router.post('/delete-branch', deletebybranchid);
router.post('/get-branch/:id', getbranchbyid);
router.get('/get-branches',  getallbranchcontroller);
// router.post('/add-dist', registerdistrictcontroller);
router.get('/getby-district', getBranchesByDistrict);

module.exports = router;