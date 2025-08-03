const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes");
const organizationRoutes = require("./organization.route");

// Use user routes
router.use("/user", userRoutes);

// Use organization routes
router.use("/organization", organizationRoutes);

module.exports = router;
