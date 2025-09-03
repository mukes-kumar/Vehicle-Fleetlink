// utils/ownership.js
const Vehicle = require('../models/Vehicle');

async function assertOwnerOrAdmin(req, res, next) {
  const { id } = req.params;
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
  if (vehicle.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not owner' });
  req.vehicle = vehicle; // pass forward
  next();
}
module.exports = { assertOwnerOrAdmin };
