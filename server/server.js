// server.js
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./configs/db.js');
const  userRouter  = require('./routes/userRouters.js');
const oownerRouter = require('./routes/ownerRoutes.js');
const bookingRouter = require('./routes/bookingRoutes.js');

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send("Server is running"));
app.use('/api/user', userRouter)
app.use('/api/owner', oownerRouter)
app.use('/api/bookings', bookingRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
