const express = require("express");
const router = express.Router();
const AnalyticsController = require("../controllers/analytics.controller");

// Mock up routes below

/*
GET /analytics/:organization_id/trend
GET /analytics/:organization_id/first-timers
GET /analytics/:organization_id/inactive
GET /analytics/member/:member_id/profile
GET /analytics/:organization_id/gender-distribution
GET /analytics/:organization_id/event-breakdown
GET /analytics/:organization_id/unique-vs-members
GET /analytics/:organization_id/retention
*/

module.exports = router;
