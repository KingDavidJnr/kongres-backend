const express = require("express");
const router = express.Router();
const OrganizationController = require("../controllers/organization.controller");

// route to create new organiation
router.post("/", OrganizationController.createOrganization);

// route to fetch all organization owned by user
router.get("/", OrganizationController.getOrganizations);

// route to fetch single organization by id
router.get("/:organization_id", OrganizationController.getOrganizationById);

// route to update single organization by id
router.patch("/:organization_id", OrganizationController.updateOrganization);

// route to delete single orgnization by id
router.delete("/:organization_id", OrganizationController.deleteOrganization);

module.exports = router;
