const express = require('express');
const { checkAvailabilityOfCar, createBooking, getUserBookings, getOwnerBookings, chageBookingStatus } = require('../controllers/bookingController');
const protect = require('../middleware/auth');

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityOfCar)
bookingRouter.post('/create', protect, createBooking)
bookingRouter.get('/user', protect, getUserBookings )
bookingRouter.get('/owner', protect, getOwnerBookings)
bookingRouter.post('/change-status', protect, chageBookingStatus)


module.exports = bookingRouter;