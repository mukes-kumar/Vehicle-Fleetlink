const Vehicle = require('../models/Vehicle');
const imagekit = require('../utils/imageKit');

const Booking = require('../models/Booking');
const { calculateRideDurationHours } = require('../utils/rideDuration');



exports.addVehicle = async (req, res) => {
  try {
    const { name, capacityKg, tyres } = req.body;
    if (!name || !capacityKg || !tyres) return res.status(400).json({ message: 'Missing fields' });

    let imageUrl = null, imageFileId = null;
    if (req.file) {
      // imagekit requires base64
      const upload = await imagekit.upload({
        file: req.file.buffer.toString('base64'),
        fileName: req.file.originalname
      });
      imageUrl = upload.url;
      imageFileId = upload.fileId;
    }

    const vehicle = await Vehicle.create({
      name, capacityKg, tyres,
      imageUrl, imageFileId,
      createdBy: req.user._id
    });
    return res.status(201).json(vehicle);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getAllVehicles = async (req, res) => {
  const vehicles = await Vehicle.find().sort({ createdAt: -1 });
  res.json(vehicles);
};

// update: if image replaced, delete old image via imagekit.deleteFile(fileId)
// delete: delete image via imagekit then remove vehicle doc


exports.getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ message: 'Missing query params' });
    }

    const rideDuration = calculateRideDurationHours(fromPincode, toPincode);
    const start = new Date(startTime);
    const end = new Date(start.getTime() + rideDuration * 3600 * 1000);

    // Candidate vehicles
    const candidates = await Vehicle.find({ capacityKg: { $gte: Number(capacityRequired) } });

    if (!candidates || candidates.length === 0) {
      return res.json({ estimatedRideDurationHours: rideDuration, vehicles: [] });
    }

    const candidateIds = candidates.map(v => v._id);

    // Find overlapping bookings
    const overlapping = await Booking.find({
      vehicleId: { $in: candidateIds },
      startTime: { $lt: end },
      endTime: { $gt: start }
    }).select('vehicleId');

    const bookedIds = new Set(overlapping.map(b => b.vehicleId.toString()));

    // Filter available vehicles
    const availableVehicles = candidates
      .filter(v => !bookedIds.has(v._id.toString()))
      .map(v => ({
        _id: v._id,
        name: v.name,
        capacityKg: v.capacityKg,
        tyres: v.tyres,
        imageUrl: v.imageUrl
      }));

    return res.json({ estimatedRideDurationHours: rideDuration, vehicles: availableVehicles });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};



// UPDATE vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacityKg, tyres } = req.body;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // agar image upload hui hai toh purani delete karke nayi upload karo
    if (req.file) {
      // delete old image if exists
      if (vehicle.imageFileId) {
        try {
          await imagekit.deleteFile(vehicle.imageFileId);
        } catch (err) {
          console.error("ImageKit delete error:", err.message);
        }
      }

      const upload = await imagekit.upload({
        file: req.file.buffer.toString('base64'),
        fileName: req.file.originalname
      });
      vehicle.imageUrl = upload.url;
      vehicle.imageFileId = upload.fileId;
    }

    if (name) vehicle.name = name;
    if (capacityKg) vehicle.capacityKg = capacityKg;
    if (tyres) vehicle.tyres = tyres;

    await vehicle.save();
    return res.json(vehicle);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// DELETE vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // delete image from ImageKit if exists
    if (vehicle.imageFileId) {
      try {
        await imagekit.deleteFile(vehicle.imageFileId);
      } catch (err) {
        console.error("ImageKit delete error:", err.message);
      }
    }

    await vehicle.deleteOne();
    return res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



exports.getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ createdBy: req.user.id });
    res.status(200).json({ success: true,  vehicles });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vehicles", error: error.message });
  }
};
