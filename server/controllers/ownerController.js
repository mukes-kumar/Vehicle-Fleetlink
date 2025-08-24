const fs = require('fs');
const imageKit = require('../configs/imageKit'); // fix the path if needed
const Car = require('../models/Car'); // assuming Car model pathconst User = require("../models/User");
const Booking = require('../models/Booking');
const User = require('../models/User');


// Api to change the role
const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" })
    res.json({ success: true, message: "Now you can list cars" })
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message })

  }
}




// API to List Car


const addCar = async (req, res) => {

  console.log('ImageKit instance:', imageKit);
  console.log('Type of imagekit.upload:', typeof imageKit.upload); // Should be 'function'

  try {
    const { _id } = req.user;
    let car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    // Upload Image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path)
    const response = await imageKit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: '/cars'
    })


    // optimization through imagekit URL transformation
    var optimizedImageUrl = imageKit.url({
      path: response.filePath,
      transformation: [
        { width: '1280' },   // width resizing
        { quality: 'auto' }, // Auto compression
        { format: 'webp' }  // convert to modern format
      ]
    });

    const image = optimizedImageUrl;
    await Car.create({ ...car, owner: _id, image })

    res.json({ success: true, message: "Car Added" })

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message })
  }
}


// API to List Owner Cars
const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id })
    res.json({ success: true, cars })
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message })
  }
}


// API to Toggle Car Availibility
const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user; // from JWT auth
    const { carId } = req.body;

    // find car
    const car = await Car.findById(carId);
    if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }

    // check ownership
    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // toggle availability
    car.isAvaliable = !car.isAvaliable; // ✅ fixed spelling too
    await car.save();

    res.json({ success: true, message: "Availability Toggled" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};



// API to delet the car 
const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body
    const car = await Car.findById(carId)

    // Checking is car belong to the uset
    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.owner = null;
    car.isAvaliable = false;

    await car.save()
    res.json({ success: true, message: "Car Removed" })

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message })
  }
}


// API to get Dashboard Data
// API to delet the car 
const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== 'owner') {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner:  _id })
    
    const bookings = await Booking.find({ owner:  _id}).populate('car').sort({ createdAt: -1 });

    const pendingBookings = await Booking.find({ owner:  _id, status: 'pending' })
    const completedBooking = await Booking.find({ owner:  _id, status: 'confirmed' })

    // console.log(' _id.toString()', _id, bookings);

    // Calculate monthlyRevenue from bookings where status is confirmed 
    const monthlyRevenue = bookings.slice().filter(booking => booking.status === 'confirmed').reduce((acc, booking) => acc + booking.price, 0)


    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBooking: completedBooking.length,
      recentBooking: bookings.slice(0, 3),
      monthlyRevenue
    }

    res.json({ success: true, dashboardData });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message })
  }
}



// API to Update Userr Image
const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;

    const imageFile = req.file;

    // Upload Image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path)
    const response = await imageKit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: '/cars'
    })


    // optimization through imagekit URL transformation
    var optimizedImageUrl = imageKit.url({
      path: response.filePath,
      transformation: [
        { width: '400' },   // width resizing
        { quality: 'auto' }, // Auto compression
        { format: 'webp' }  // convert to modern format
      ]
    });

    const image = optimizedImageUrl;

    await User.findByIdAndUpdate(_id, {image});
    res.json({success: true, message: "Image Updated"});

  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: error.message })
  }
}



module.exports = {
  changeRoleToOwner,
  addCar,
  getOwnerCars,
  toggleCarAvailability,
  deleteCar,
  getDashboardData,
  updateUserImage,
}
