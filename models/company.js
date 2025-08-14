const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  companyname: {
    type: String,
    required: true,
    
  },
  district: {
    type: String,
    default: "Tamil Nadu",
  }
}, { timestamps: true });


module.exports =  mongoose.model('Company', districtSchema, 'Company');