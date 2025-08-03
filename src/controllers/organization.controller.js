const OrganizationService = require("../services/organization.service");
const { extractUserId } = require("../utils/auth.util");
const sanitizeBigInt = require("../utils/sanitiseBigInt.util");

class OrganizationController {
  // Create new organization
  async createOrganization(req, res) {
    try {
      const owner_id = extractUserId(req);
      if (!owner_id)
        return res.status(403).json({ message: "User not authenticated!" });

      // Check existing org count for the user
      const existingOrgs = await OrganizationService.getOrganizationsByOwner(
        owner_id
      );
      if (existingOrgs.length >= 5) {
        return res.status(400).json({
          message:
            "Organization limit reached. You can only own up to 5 organizations.",
        });
      }

      const { name, phone } = req.body;
      const org = await OrganizationService.createOrganization({
        name,
        phone,
        owner_id,
      });

      // Convert BigInt to string for safe JSON serialization
      const sanitizedOrg = {
        ...org,
        owner_id: org.owner_id.toString(),
        created_at: org.created_at, // datetime serializes fine
        updated_at: org.updated_at,
      };

      return res
        .status(201)
        .json({ message: "Organization created", data: sanitizedOrg });
    } catch (error) {
      console.error("Create org error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Fetch all organizations owned by user
  async getOrganizations(req, res) {
    try {
      const owner_id = extractUserId(req);
      if (!owner_id)
        return res.status(403).json({ message: "User not authenticated!" });

      const orgs = await OrganizationService.getOrganizationsByOwner(owner_id);

      const sanitizedOrgs = sanitizeBigInt(orgs);

      return res.status(200).json({
        message: "Organizations fetched successfully",
        data: sanitizedOrgs,
      });
    } catch (error) {
      console.error("Get orgs error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Fetch organization by id
  async getOrganizationById(req, res) {
    try {
      const id = req.params.organization_id;
      const owner_id = extractUserId(req);

      if (!owner_id)
        return res.status(403).json({ message: "User not authenticated!" });

      const org = await OrganizationService.getOrganizationById(id);

      if (!org)
        return res.status(404).json({ message: "Organization not found" });

      if (org.owner_id.toString() !== owner_id.toString())
        return res.status(403).json({ message: "Not authorized" });

      const sanitizedOrg = sanitizeBigInt(org);

      return res.status(200).json({
        message: "Organization fetched successfully",
        data: sanitizedOrg,
      });
    } catch (error) {
      console.error("Get org by id error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Update organization by id
  async updateOrganization(req, res) {
    try {
      const id = req.params.organization_id;
      const owner_id = extractUserId(req);

      if (!owner_id)
        return res.status(403).json({ message: "User not authenticated!" });

      const existingOrg = await OrganizationService.getOrganizationById(id);
      if (
        !existingOrg ||
        existingOrg.owner_id.toString() !== owner_id.toString()
      ) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const { name, phone } = req.body;

      const dataToUpdate = {};
      if (name) dataToUpdate.name = name;
      if (phone) dataToUpdate.phone = phone;

      const updated = await OrganizationService.updateOrganization(
        id,
        dataToUpdate
      );

      const sanitized = sanitizeBigInt(updated);

      return res
        .status(200)
        .json({ message: "Organization updated", data: sanitized });
    } catch (error) {
      console.error("Update org error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Delete organization by id
  async deleteOrganization(req, res) {
    try {
      const id = req.params.organization_id;
      const owner_id = extractUserId(req);
      if (!owner_id)
        return res.status(403).json({ message: "User not authenticated!" });

      const existingOrg = await OrganizationService.getOrganizationById(id);
      if (
        !existingOrg ||
        existingOrg.owner_id.toString() !== owner_id.toString()
      ) {
        return res.status(403).json({ message: "Not authorized" });
      }

      await OrganizationService.deleteOrganization(id);
      return res.status(200).json({ message: "Organization deleted" });
    } catch (error) {
      console.error("Delete org error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new OrganizationController();
