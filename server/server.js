// server.js
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./configs/db.js');
const userRouter = require('./routes/userRouters.js');
const ownerRouter = require('./routes/ownerRoutes.js');
const bookingRouter = require('./routes/bookingRoutes.js');

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// ✅ CORS Configuration
const allowedOrigins = [
  "https://rentmyrider-car.vercel.app", // your frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // if you’re using cookies / authentication
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send("Server is running ✅"));
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/bookings', bookingRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
