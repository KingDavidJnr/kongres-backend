const AttendanceService = require("../services/attendance.service");
const prisma = require("../lib/prisma");

class AttendanceController {
  // Create a new attendance record
  async createAttendance(req, res) {
    try {
      const { event_id } = req.params;
      const { name, phone, email, gender, is_first_timer } = req.body;

      if (
        !name ||
        !phone ||
        !email ||
        !gender ||
        typeof is_first_timer === "undefined"
      ) {
        return res.status(400).json({
          message:
            "All fields (name, phone, email, gender, is_first_timer) are required.",
        });
      }

      // Validate and parse is_first_timer
      const lower = String(is_first_timer).toLowerCase();
      if (lower !== "true" && lower !== "false") {
        return res.status(400).json({
          message:
            "Invalid value for is_first_timer. Must be 'true' or 'false'.",
        });
      }

      let validatedFirstTimer = lower === "true";

      // Fetch event, organization ID, and expiration status
      const event = await prisma.event.findUnique({
        where: { id: event_id },
        select: {
          organization_id: true,
          is_expired: true,
        },
      });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      if (event.is_expired) {
        return res.status(410).json({ message: "Event is already expired" });
      }

      // If marked as first timer, validate against members table
      if (validatedFirstTimer) {
        const existingMember = await prisma.member.findFirst({
          where: {
            organization_id: event.organization_id,
            OR: [
              email ? { email } : undefined,
              phone ? { phone } : undefined,
            ].filter(Boolean),
          },
        });

        if (existingMember) {
          validatedFirstTimer = false;
        }
      }

      // Create attendance record
      const attendance = await AttendanceService.createAttendance({
        name,
        phone,
        email,
        gender,
        event_id,
        is_first_timer: validatedFirstTimer,
      });

      // Respond immediately
      res
        .status(201)
        .json({ message: "Attendance recorded", data: attendance });

      // Background: Add to members if not already
      try {
        const existingMember = await prisma.member.findFirst({
          where: {
            organization_id: event.organization_id,
            OR: [
              email ? { email } : undefined,
              phone ? { phone } : undefined,
            ].filter(Boolean),
          },
        });

        if (!existingMember) {
          await prisma.member.create({
            data: {
              name,
              phone: phone || null,
              email: email || null,
              gender: gender || null,
              organization_id: event.organization_id,
            },
          });
        }
      } catch (err) {
        console.error("Background member creation error:", err);
      }
    } catch (error) {
      console.error("Create attendance error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // fetch single attendance record by attendance id
  async getAttendance(req, res) {
    try {
      const { id } = req.params;
      const record = await AttendanceService.getAttendanceById(id);

      if (!record)
        return res.status(404).json({ message: "Attendance record not found" });

      return res
        .status(200)
        .json({ message: "Attendace fetched successfully", data: record });
    } catch (error) {
      console.error("Get attendance error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Fecth attendance records for a event
  async getAttendancesForEvent(req, res) {
    try {
      const { event_id } = req.params;
      const records = await AttendanceService.getAttendancesByEvent(event_id);

      return res
        .status(200)
        .json({ message: "Attendance fetched successfully", data: records });
    } catch (error) {
      console.error("Get attendances error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new AttendanceController();
