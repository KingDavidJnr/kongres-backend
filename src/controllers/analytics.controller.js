const AnalyticsService = require("../services/analytics.service");
const { subDays, startOfDay, endOfDay } = require("date-fns");

class AnalyticsController {
  async getAttendanceTrend(req, res) {
    try {
      const { organization_id } = req.params;
      let { start_date, end_date } = req.query;

      // Set default range to last 30 days if not provided
      const today = new Date();
      if (!end_date) end_date = endOfDay(today).toISOString();
      if (!start_date)
        start_date = startOfDay(subDays(today, 30)).toISOString();

      const data = await AnalyticsService.getAttendanceTrend(organization_id, {
        start_date,
        end_date,
      });

      res.status(200).json({
        message: "Analytics trend fetched successfully",
        data,
      });
    } catch (error) {
      console.error("Error fetching attendance trend", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getFirstTimerStats(req, res) {
    try {
      const { organization_id } = req.params;
      const { start_date, end_date } = req.query;

      const data = await AnalyticsService.getFirstTimerStats(organization_id, {
        start_date,
        end_date,
      });

      res.status(200).json({
        message: "First-timer stats fetched successfully",
        data,
      });
    } catch (error) {
      console.error("Error fetching first-timer stats", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getInactiveMembers(req, res) {
    try {
      const { organization_id } = req.params;
      const { timeframe } = req.query;

      const data = await AnalyticsService.getInactiveMembers(
        organization_id,
        timeframe
      );

      res.status(200).json({
        message: "Inactive members fetched successfully",
        data,
      });
    } catch (error) {
      console.error("Error fetching inactive members", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getIndividualMemberProfile(req, res) {
    try {
      const { member_id } = req.params;
      const data = await AnalyticsService.getIndividualMemberProfile(member_id);
      res.status(200).json({
        message: "Member profile fetched successfully",
        data,
      });
    } catch (error) {
      console.error("Error fetching member profile", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getGenderDistribution(req, res) {
    try {
      const { organization_id } = req.params;
      const data = await AnalyticsService.getGenderDistribution(
        organization_id
      );
      res.status(200).json({
        message: "Gender distribution fetched successfully",
        data,
      });
    } catch (error) {
      console.error("Error fetching gender distribution", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getEventAttendanceBreakdown(req, res) {
    try {
      const { organization_id } = req.params;
      const data = await AnalyticsService.getEventAttendanceBreakdown(
        organization_id
      );
      res.status(200).json({
        message: "Event attendance breakdown fetched successfully",
        data,
      });
    } catch (err) {
      console.error("Error fetching event breakdown", err);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getUniqueVisitorsVsMembers(req, res) {
    try {
      const { organization_id } = req.params;
      const { start_date, end_date } = req.query;

      const data = await AnalyticsService.getUniqueVisitorsVsMembers(
        organization_id,
        { start_date, end_date }
      );

      res.status(200).json({
        message: "Unique visitors vs members comparison fetched successfully",
        data,
      });
    } catch (err) {
      console.error("Error comparing visitors vs members", err);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getRetentionStats(req, res) {
    try {
      const { organization_id } = req.params;
      const { start_date, end_date } = req.query;

      const data = await AnalyticsService.getRetentionStats(organization_id, {
        start_date,
        end_date,
      });

      res.status(200).json({
        message: "Retention stats fetched successfully",
        data,
      });
    } catch (err) {
      console.error("Error fetching retention stats", err);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  async getMembersByOrganization(req, res) {
    try {
      const { organization_id } = req.params;

      if (!organization_id) {
        return res.status(400).json({ message: "Organization ID is required" });
      }

      const members = await AnalyticsService.getAllMembersByOrganization(
        organization_id
      );

      return res.status(200).json({
        message: "Members fetched successfully",
        data: members,
      });
    } catch (error) {
      console.error("Error fetching members:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = new AnalyticsController();
