const prisma = require("../lib/prisma");

class AttendanceService {
  // create attendance record
  async createAttendance(data) {
    return prisma.attendance.create({ data });
  }

  // fetch single attendance record by attendance id
  async getAttendanceById(id) {
    return prisma.attendance.findUnique({ where: { id } });
  }

  // Fecth attendance records for a event
  async getAttendancesByEvent(event_id) {
    return prisma.attendance.findMany({
      where: { event_id },
      orderBy: { created_at: "desc" },
    });
  }
}

module.exports = new AttendanceService();
