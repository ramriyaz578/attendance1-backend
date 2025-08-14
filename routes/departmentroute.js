const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { getalldepartment, createDepartment } = require('../controllers/departmentcontroller')

router.get('/get-all-department', getalldepartment)
router.post('/create-department', createDepartment)

module.exports = router