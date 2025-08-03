const AnalyticsService = require("../services/analytics.service");

class AnalyticsController {
  async getAttendanceTrend(req, res) {
    try {
      const { organization_id } = req.params;
      const { start_date, end_date } = req.query;
      const data = await AnalyticsService.getAttendanceTrend(organization_id, {
        start_date,
        end_date,
      });
      res.status(200).json({ success: true, data });
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          message: "Error fetching attendance trend",
          error: err.message,
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
      res.status(200).json({ success: true, data });
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          message: "Error fetching first-timer stats",
          error: err.message,
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
      res.status(200).json({ success: true, data });
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          message: "Error fetching inactive members",
          error: err.message,
        });
    }
  }

  async getIndividualMemberProfile(req, res) {
    try {
      const { member_id } = req.params;
      const data = await AnalyticsService.getIndividualMemberProfile(member_id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          message: "Error fetching member profile",
          error: err.message,
        });
    }
  }

  async getGenderDistribution(req, res) {
    try {
      const { organization_id } = req.params;
      const data = await AnalyticsService.getGenderDistribution(
        organization_id
      );
      res.status(200).json({ success: true, data });
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          message: "Error fetching gender distribution",
          error: err.message,
        });
    }
  }

  async getEventAttendanceBreakdown(req, res) {
    try {
      const { organization_id } = req.params;
      const data = await AnalyticsService.getEventAttendanceBreakdown(
        organization_id
      );
      res.status(200).json({ success: true, data });
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          message: "Error fetching event breakdown",
          error: err.message,
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
      res.status(200).json({ success: true, data });
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          message: "Error comparing visitors vs members",
          error: err.message,
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
      res.status(200).json({ success: true, data });
    } catch (err) {
      res
        .status(500)
        .json({
          success: false,
          message: "Error fetching retention stats",
          error: err.message,
        });
    }
  }
}

module.exports = new AnalyticsController();
