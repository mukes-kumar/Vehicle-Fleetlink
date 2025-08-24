const User = require("../models/User.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Car = require("../models/Car.js");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.json({ success: false, message: 'Fill all the fields properly' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user._id.toString());

    res.json({ success: true, token });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());
    res.json({ success: true, token });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};



// Get user data using token (after protect middleware)
const getUserData = async (req, res) => {
  try {
    const user = req.user; // user is already populated by the protect middleware
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// get Cars list for the frontend
const getCars = async (req, res) => {
  try {
    const cars = await Car.find({isAvaliable: true})
    res.json({success: true, cars})
  } catch (error) {
    
  }
}



module.exports = {
  registerUser,
  loginUser,
  getUserData,
  getCars
};
