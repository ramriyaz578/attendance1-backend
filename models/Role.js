const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true 
  },
  comapnyname: {

  }
}, { timestamps: true });


module.exports =  mongoose.model('Roles', roleSchema, 'Roles');