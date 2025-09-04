const User = require("../models/User.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendMail } = require("./mailController.js");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


// Register User
const registerUser = async (req, res) => {
  try {
    // Do not destructure 'role' from the body
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.json({ success: false, message: 'Fill all the fields properly and password will be 8 character !!' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user without passing the role. The schema will apply the 'user' default.
    
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user._id.toString());

    await sendMail({ body: { email } }, { 
      status: () => ({ json: () => {} }) // 👈 fake res since sendMail expects req,res
    });

    res.json({ success: true, message: "Registration successful & email sent!", token });
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




const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  // This list should match the schema enum to avoid errors.
  const allowed = ['admin', 'user'];

  if (!allowed.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
};




const getProfile = async (req, res) => {
  try {
    // req.user is already set by protect middleware (decoded from token)
    const user = await User.findById(req.user.id).select('-password'); // exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update current user
const updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {};
    const allowedFields = ['name', 'email']; // ✅ define what can be updated

    allowedFields.forEach(field => {
      if (req.body[field]) fieldsToUpdate[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
      select: '-password'
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserRole,
  getProfile,
  updateProfile
};
