const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacityKg: { type: Number, required: true },
  tyres: { type: String, required: true }, // <-- This line requires a number
  imageUrl: { type: String },
  imageFileId: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // owner/admin
}, { timestamps: true });
module.exports = mongoose.model('Vehicle', vehicleSchema);