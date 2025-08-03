const express = require("express");
const router = express.Router();
const AnalyticsController = require("../controllers/analytics.controller");

// Get attendance trend over a date range for an organization
router.get("/:organization_id/trend", AnalyticsController.getAttendanceTrend);

// Get count and trend of first-timers within a date range
router.get(
  "/:organization_id/first-timers",
  AnalyticsController.getFirstTimerStats
);

// Get list of inactive members in a given timeframe
router.get(
  "/:organization_id/inactive",
  AnalyticsController.getInactiveMembers
);

// Get individual member attendance profile
router.get(
  "/member/:member_id/profile",
  AnalyticsController.getIndividualMemberProfile
);

// Get gender distribution (male vs female) in the organization
router.get(
  "/:organization_id/gender",
  AnalyticsController.getGenderDistribution
);

// Get breakdown of attendance per event
router.get(
  "/:organization_id/event-breakdown",
  AnalyticsController.getEventAttendanceBreakdown
);

// Compare number of unique visitors vs registered members
router.get(
  "/:organization_id/unique-vs-members",
  AnalyticsController.getUniqueVisitorsVsMembers
);

// Get retention stats: new, retained, and returning members
router.get(
  "/:organization_id/retention",
  AnalyticsController.getRetentionStats
);

// route to fetch all members details
router.get("/:organization_id", AnalyticsController.getMembersByOrganization);

module.exports = router;
