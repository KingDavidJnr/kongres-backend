const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes");
const organizationRoutes = require("./organization.route");
const eventRoutes = require("./event.route");
const attendanceRoutes = require("./attendance.route");
const analyticsRoutes = require("./analytics.route");

// Use user routes
router.use("/user", userRoutes);

// Use organization routes
router.use("/organization", organizationRoutes);

// use event routes
router.use("/event", eventRoutes);

// Use attendance routes
router.use("/attendance", attendanceRoutes);

// Use analytics routes
router.use("/", analyticsRoutes);

module.exports = router;
