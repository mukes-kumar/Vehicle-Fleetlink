
const express = require('express');
const protect = require('../middleware/auth');
// const { changeRoleToOwner, addCar, getOwnerCars, toggleCarAvailability, deleteCar, getDashboardData, updateUserImage } = require('../controllers/ownerController');
const upload = require('../middleware/multer');

const oownerRouter = express.Router();

// oownerRouter.post("/change-role", protect, changeRoleToOwner);

// oownerRouter.post("/add-car", upload.single("image"), protect, addCar );



// oownerRouter.get("/dashboard", protect, getDashboardData );
// oownerRouter.post("/update-image", upload.single("image"), protect, updateUserImage );


module.exports = oownerRouter