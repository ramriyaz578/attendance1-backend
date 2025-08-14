const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
    district: {
    type: String,
    required: true,
    
  },
  state: {
    type: String,
    default: "Tamil Nadu",
  }
}, { timestamps: true });


module.exports =  mongoose.model('District', districtSchema, 'districts');


