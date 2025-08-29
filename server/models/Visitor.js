const mongoose =require("mongoose");

const visitorSchema = new mongoose.Schema({
  ip: String,
  userAgent: String,
  referrer: String,
  timestamp: { type: Date, default: Date.now }
});

const Visitor = mongoose.model("Visitor", visitorSchema);

module.exports = Visitor;
