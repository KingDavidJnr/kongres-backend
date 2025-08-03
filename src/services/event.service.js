const prisma = require("../lib/prisma");

class EventService {
  async createEvent(data) {
    return await prisma.event.create({
      data,
    });
  }

  async getEventById(id) {
    return await prisma.event.findUnique({
      where: { id },
    });
  }

  async getEventsByOrganizationId(organization_id) {
    return await prisma.event.findMany({
      where: { organization_id },
      orderBy: { created_at: "desc" },
    });
  }

  async updateEvent(id, data) {
    return await prisma.event.update({
      where: { id },
      data,
    });
  }

  async deleteEvent(id) {
    return await prisma.event.delete({
      where: { id },
    });
  }

  async expireEventById(event_id, currentTime) {
    return await prisma.event.update({
      where: { id: event_id },
      data: {
        is_expired: true,
        expires_at: currentTime,
      },
    });
  }

  async getActiveEventsByOrganizationId(organization_id) {
    return await prisma.event.findMany({
      where: {
        organization_id,
        is_expired: false,
      },
      orderBy: { created_at: "desc" },
    });
  }
}

module.exports = new EventService();
