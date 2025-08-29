const express = require("express");
const { trackVisit, getVisitorsCount, getAllVisitors } =require("../controllers/visitorController.js");

const router = express.Router();

// POST - track a new visit
router.post("/track", trackVisit);

// GET - visitors count
router.get("/count", getVisitorsCount);

// GET - all visitors (optional)
router.get("/", getAllVisitors);

module.exports = router;
