const EventService = require("../services/event.service");
const OrganizationService = require("../services/organization.service");
const { extractUserId } = require("../utils/auth.util");
const crypto = require("crypto");
//const sanitizeBigInt = require("../utils/sanitiseBigInt.util");

class EventController {
  // create a new event
  async createEvent(req, res) {
    try {
      const owner_id = extractUserId(req);
      if (!owner_id)
        return res.status(403).json({ message: "User not authenticated!" });

      const { organization_id } = req.params;
      const { title, expires_at } = req.body;

      // Verify that the user owns the organization
      const org = await OrganizationService.getOrganizationById(
        organization_id
      );
      if (!org || org.owner_id.toString() !== owner_id.toString()) {
        return res.status(403).json({
          message: "Not authorized to create event for this organization",
        });
      }

      // Generate 9-digit hexadecimal string (e.g., "1a2b3c4d5")
      const id = crypto.randomBytes(5).toString("hex").slice(0, 9);

      const event = await EventService.createEvent({
        id,
        title,
        expires_at,
        organization_id,
      });

      return res.status(201).json({ message: "Event created", data: event });
    } catch (error) {
      console.error("Create event error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getEventById(req, res) {
    try {
      const { event_id } = req.params;

      const event = await EventService.getEventById(event_id);
      if (!event) return res.status(404).json({ message: "Event not found" });

      return res.status(200).json({ message: "Event fetched", data: event });
    } catch (error) {
      console.error("Get event by ID error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getEventsByOrganization(req, res) {
    try {
      const { organization_id } = req.params;

      const events = await EventService.getEventsByOrganizationId(
        organization_id
      );
      return res.status(200).json({ message: "Events fetched", data: events });
    } catch (error) {
      console.error("Get events error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getActiveEventsByOrganization(req, res) {
    try {
      const { organization_id } = req.params;
      const events = await EventService.getActiveEventsByOrganizationId(
        organization_id
      );
      return res
        .status(200)
        .json({ message: "Active events fetched", data: events });
    } catch (error) {
      console.error("Get active events error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateEvent(req, res) {
    try {
      const { event_id } = req.params;

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "No data provided for update" });
      }

      const { title, expires_at } = req.body;

      const event = await EventService.getEventById(event_id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      if (event.is_expired) {
        return res
          .status(403)
          .json({ message: "Cannot edit an expired event" });
      }

      const dataToUpdate = {};
      if (title !== undefined) dataToUpdate.title = title;
      if (expires_at !== undefined) dataToUpdate.expires_at = expires_at;

      const updated = await EventService.updateEvent(event_id, dataToUpdate);

      return res.status(200).json({ message: "Event updated", data: updated });
    } catch (error) {
      console.error("Update event error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteEvent(req, res) {
    try {
      const { event_id } = req.params;

      await EventService.deleteEvent(event_id);
      return res.status(200).json({ message: "Event deleted" });
    } catch (error) {
      console.error("Delete event error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async expireEvent(req, res) {
    try {
      const { event_id } = req.params;

      const now = new Date();

      const expired = await EventService.expireEventById(event_id, now);
      return res.status(200).json({ message: "Event expired", data: expired });
    } catch (error) {
      console.error("Expire event error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new EventController();
