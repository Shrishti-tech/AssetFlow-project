import reportsService from "../services/reportsService.js";

export const reportsController = {
  async dashboard(_req, res, next) {
    try {
      res.json(await reportsService.getDashboardSummary());
    } catch (error) {
      next(error);
    }
  },

  async assetUtilization(req, res, next) {
    try {
      res.json(await reportsService.getAssetUtilization(req.query));
    } catch (error) {
      next(error);
    }
  },

  async departments(_req, res, next) {
    try {
      res.json(await reportsService.getDepartmentReport());
    } catch (error) {
      next(error);
    }
  },

  async bookingHeatmap(req, res, next) {
    try {
      res.json(await reportsService.getBookingHeatmap(req.query));
    } catch (error) {
      next(error);
    }
  },

  async maintenance(_req, res, next) {
    try {
      res.json(await reportsService.getMaintenanceReport());
    } catch (error) {
      next(error);
    }
  },

  async exportReport(req, res, next) {
    try {
      const { type, report = "dashboard", ...filters } = req.query;
      const { buffer, contentType, extension, fileName } = await reportsService.exportReport(
        type,
        report,
        filters,
      );
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}.${extension}"`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  },
};

export default reportsController;
