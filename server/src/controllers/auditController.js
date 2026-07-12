import auditService from "../services/auditService.js";

export const auditController = {
  async create(req, res, next) {
    try {
      const cycle = await auditService.createCycle(req.body, req.user);
      res.status(201).json(cycle);
    } catch (error) {
      next(error);
    }
  },

  async list(req, res, next) {
    try {
      const cycles = await auditService.list(req.query);
      res.json(cycles);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const details = await auditService.getDetails(req.params.id);
      if (!details) return res.status(404).json({ message: "Audit cycle not found." });
      return res.json(details);
    } catch (error) {
      return next(error);
    }
  },

  async assign(req, res, next) {
    try {
      const assignment = await auditService.assignAuditor(req.params.id, req.body, req.user);
      if (!assignment) return res.status(404).json({ message: "Audit cycle not found." });
      return res.status(201).json(assignment);
    } catch (error) {
      return next(error);
    }
  },

  async verify(req, res, next) {
    try {
      const result = await auditService.verifyAsset(req.params.id, req.body, req.user);
      if (!result) return res.status(404).json({ message: "Audit cycle not found." });
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  },

  async close(req, res, next) {
    try {
      const cycle = await auditService.closeAudit(req.params.id, req.user);
      if (!cycle) return res.status(404).json({ message: "Audit cycle not found." });
      return res.json(cycle);
    } catch (error) {
      return next(error);
    }
  },

  async report(req, res, next) {
    try {
      const report = await auditService.getDiscrepancyReport(req.params.id, req.query);
      if (!report) return res.status(404).json({ message: "Audit cycle not found." });
      return res.json(report);
    } catch (error) {
      return next(error);
    }
  },
};

export default auditController;
