// configs/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log("Database Connected"));
    await mongoose.connect(`${process.env.MONGODB_URI}/Vehicle-booking-system`);
  } catch (error) {
    console.log("DB Error:", error.message);
  }
};

module.exports = connectDB;
