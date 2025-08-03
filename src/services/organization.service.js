const prisma = require("../lib/prisma");

class OrganizationService {
  // create new organization
  async createOrganization(data) {
    return await prisma.organization.create({ data });
  }

  // Fetch organizations owned by user
  async getOrganizationsByOwner(owner_id) {
    return await prisma.organization.findMany({
      where: { owner_id },
    });
  }

  // Fetch organization by id
  async getOrganizationById(id) {
    return await prisma.organization.findUnique({
      where: { id },
    });
  }

  // Update organization by id
  async updateOrganization(id, data) {
    return await prisma.organization.update({
      where: { id },
      data,
    });
  }

  // Delete organization by id
  async deleteOrganization(id) {
    return await prisma.organization.delete({
      where: { id },
    });
  }
}

module.exports = new OrganizationService();
