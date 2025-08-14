const mongoose = require('mongoose');

const TokenSubSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fcmToken: {
    type: String,
    required: true
  },
  deviceId: {
    type: String,
    required: true
  }
}, { _id: false });

const DepartmentTokenSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
    unique: true
  },
  departmentName: {
    type: String,
    required: true
  },
  tokens: [TokenSubSchema]
});

module.exports = mongoose.model('DepartmentToken', DepartmentTokenSchema);
