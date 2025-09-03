const express = require('express');
const { protect, admin } = require('../middleware/auth'); // Assuming these middlewares are correctly implemented
const { getAllUsers, updateUserRole , loginUser , registerUser, getProfile , updateProfile} = require('../controllers/userController');
const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.patch('/update-profile', protect, updateProfile);


// Routes are correctly protected
router.get('/', protect, admin, getAllUsers);
router.patch('/:id/role', protect, admin, updateUserRole);
module.exports = router;