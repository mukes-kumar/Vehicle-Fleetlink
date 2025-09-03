const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  fromPincode: { type: String, required: true },
  toPincode: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // user who booked
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },   // admin who owns the vehicle
  estimatedRideDurationHours: { type: Number, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
    default: 'PENDING'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
