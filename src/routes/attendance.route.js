const express = require("express");
const router = express.Router();

const AttendanceController = require("../controllers/attendance.controller");

// route for creating attendance record
router.post("/:event_id", AttendanceController.createAttendance);

// route for fetching details for single attendance record
router.get("/:id", AttendanceController.getAttendance);

// route for fetching attendance records for an event
router.get("/event/:event_id", AttendanceController.getAttendancesForEvent);

module.exports = router;
