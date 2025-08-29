const Visitor =require("../models/Visitor.js");

// ✅ Track a new visit
 const trackVisit = async (req, res) => {
  try {
    const { ip, userAgent, referrer } = req.body;

    const visitor = new Visitor({ ip, userAgent, referrer });
    await visitor.save();

    res.status(201).json({ message: "Visit tracked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving visitor", error });
  }
};

// ✅ Get total visitors
 const getVisitorsCount = async (req, res) => {
  try {
    const count = await Visitor.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error fetching visitors count", error });
  }
};

// ✅ Get all visitors (optional, for admin dashboard)
 const getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ timestamp: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching visitors", error });
  }
};


module.exports = {
  trackVisit,
  getAllVisitors,
  getVisitorsCount,
};