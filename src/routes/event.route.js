const express = require("express");
const router = express.Router();
const EventController = require("../controllers/event.controller");

// route to create new event
router.post("/:organization_id", EventController.createEvent);

// route to fetch event by id
router.get("/:event_id", EventController.getEventById);

// fetch all events for organization
router.get("/:organization_id/fetch", EventController.getEventsByOrganization);

// fetch active events by organization
router.get(
  "/:organization_id/active",
  EventController.getActiveEventsByOrganization
);

// Update an active event
router.patch("/:event_id", EventController.updateEvent);

// Delete an event
router.delete("/:event_id", EventController.deleteEvent);

module.exports = router;
