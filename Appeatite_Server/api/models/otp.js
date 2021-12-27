const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user_id: Number,
  otp: Number,
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

module.exports = mongoose.model('Otp', otpSchema);
