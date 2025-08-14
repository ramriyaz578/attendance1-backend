const mongoose = require('mongoose');
const { array } = require('../middleware/mulder');

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  roles : [
     Array
  ]
});

module.exports = mongoose.model('Department', DepartmentSchema);
