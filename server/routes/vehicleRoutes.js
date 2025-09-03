const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
// Assuming 'protect' middleware correctly authenticates the user and attaches them to req.user
const { protect, admin } = require('../middleware/auth'); 
const vehicleController = require('../controllers/vehicleController');

// It's recommended to protect routes that modify data
router.post('/add', protect, upload.single('image'), vehicleController.addVehicle);
router.get('/available', vehicleController.getAvailableVehicles);
router.get('/', vehicleController.getAllVehicles);

// These should also be protected
router.put('/:id', protect, upload.single('image'), vehicleController.updateVehicle);
router.delete('/:id', protect, vehicleController.deleteVehicle); // This route was commented out in the prompt

router.get('/my-vehicles', protect, admin, vehicleController.getMyVehicles);





module.exports = router;