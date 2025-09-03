// server.js
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./configs/db.js');


const mailRoutes = require('./routes/mailRoutes')

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// ✅ Correct CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://rentmyrider-car.vercel.app/"
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
app.use('/api/user', require("./routes/userRouters.js"));
// app.use('/api/owner', ownerRouter);

app.use('/api/bookings', require("./routes/bookingRoutes"));
app.use("/api/mail", mailRoutes);
// app.use("/api/visitors", visitorRoutes);

app.use("/api/vehicles", require("./routes/vehicleRoutes"));
// app.use("/api/bookings", require("./routes/bookingRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
