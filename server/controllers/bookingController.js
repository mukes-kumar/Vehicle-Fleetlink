// controllers/bookingController.js
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const { calculateRideDurationHours } = require('../utils/rideDuration');

const createBooking = async (req, res) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime } = req.body;
    const customerId = req.user.id;

    if (!vehicleId || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const estimatedRideDurationHours = calculateRideDurationHours(fromPincode, toPincode);
    const start = new Date(startTime);
    const end = new Date(start.getTime() + estimatedRideDurationHours * 3600 * 1000);

    const overlapQuery = {
      vehicleId: vehicle._id,
      startTime: { $lt: end },
      endTime: { $gt: start },
      status: { $in: ['PENDING', 'APPROVED'] }
    };

    const conflicting = await Booking.findOne(overlapQuery);
    if (conflicting) {
      return res.status(409).json({ message: 'Vehicle already booked for overlapping time' });
    }

    const booking = await Booking.create({
      vehicleId: vehicle._id,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
      customerId,                   // user who booked
      ownerId: vehicle.createdBy,   // admin who added vehicle
      estimatedRideDurationHours,
      status: 'PENDING'
    });

    return res.status(201).json({ booking });
  } catch (err) {
    console.error('createBooking error', err);
    return res.status(500).json({ message: err.message });
  }
};




const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body; // APPROVED | REJECTED | CANCELLED
    const adminId = req.user.id;

    if (!['APPROVED','REJECTED','CANCELLED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(bookingId).populate('vehicleId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Verify admin owns the vehicle
    if (String(booking.vehicleId.createdBy) !== String(adminId)) {
      return res.status(403).json({ message: 'Not authorized to manage this booking' });
    }

    // If approving, double-check for conflicts (only APPROVED conflicts matter)
    if (status === 'APPROVED') {
      const overlapping = await Booking.findOne({
        _id: { $ne: booking._id },
        vehicleId: booking.vehicleId._id,
        startTime: { $lt: booking.endTime },
        endTime: { $gt: booking.startTime },
        status: 'APPROVED'
      });
      if (overlapping) {
        return res.status(409).json({ message: 'Cannot approve: overlapping approved booking exists' });
      }
    }

    booking.status = status;
    await booking.save();

    // optional: send notifications to customer/admin here

    return res.json({ booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};



// GET /api/admin/bookings?status=PENDING&page=1&limit=20
const adminBookings = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { status, page = 1, limit = 20 } = req.query;

    const query = { ownerId: adminId };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('vehicleId')
      .populate('customerId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.json({ bookings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};



const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate('vehicleId', 'name capacityKg tyres imageUrl') // populate vehicle details
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Cancel Booking (only if booking belongs to user)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found or not yours' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Bookings for a Vehicle (Admin only)
const getVehicleBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ vehicleId: req.params.vehicleId })
      .populate('customerId', 'name email')           // show user who booked
      .populate('vehicleId', 'name capacityKg tyres') // show vehicle info
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




const getVehicleBookingsAdmin = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Ensure vehicle belongs to this admin
    const vehicle = await Vehicle.findOne({ _id: req.params.vehicleId, createdBy: adminId });
    if (!vehicle) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this vehicle bookings' });
    }

    const bookings = await Booking.find({ vehicleId: vehicle._id })
      .populate('customerId', 'name email')
      .populate('vehicleId', 'name capacityKg tyres')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



module.exports = {
  createBooking,
  updateBookingStatus,
  adminBookings,
  getMyBookings,
  cancelBooking,
  getVehicleBookings,
  getVehicleBookingsAdmin
};