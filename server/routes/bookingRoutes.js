// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect , admin} = require('../middleware/auth');   // ✅ protect
// const requireRole = require('../middleware/requireRole'); // ✅ role-based

// --- User routes ---
router.post('/', protect, bookingController.createBooking);              
router.get('/me', protect, bookingController.getMyBookings);             
router.patch('/:id/cancel', protect, bookingController.cancelBooking);   

// --- Admin routes ---
router.get('/admin', protect, admin, bookingController.adminBookings);
router.patch('/:id/status', protect, admin, bookingController.updateBookingStatus);
router.get('/user/vehicle/:vehicleId', protect, bookingController.getVehicleBookings);
router.get('/admin/vehicle/:vehicleId', protect, admin, bookingController.getVehicleBookingsAdmin);

module.exports = router;
