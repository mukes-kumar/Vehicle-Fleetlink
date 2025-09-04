// models/Notification.js
const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who should receive
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who triggered it (booking user)
  type: { type: String, enum: ['booking_request','booking_approved','booking_rejected'], required: true },
  data: { type: Object }, // free-form: { bookingId, vehicleId, message }
  read: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Notification', notificationSchema);
