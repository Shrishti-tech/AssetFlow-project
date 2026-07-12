import maintenanceService from "../services/maintenanceService.js";

export const maintenanceController = {
  async create(req, res, next) {
    try {
      const maintenance = await maintenanceService.create(req.body, req.user, req.ip);
      res.status(201).json(maintenance);
    } catch (error) {
      next(error);
    }
  },

  async list(req, res, next) {
    try {
      const requests = await maintenanceService.list(req.query);
      res.json(requests);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const request = await maintenanceService.getById(req.params.id);
      if (!request) return res.status(404).json({ message: "Maintenance request not found." });
      return res.json(request);
    } catch (error) {
      return next(error);
    }
  },

  async approve(req, res, next) {
    try {
      const request = await maintenanceService.approve(req.params.id, req.body, req.user, req.ip);
      if (!request) return res.status(404).json({ message: "Maintenance request not found." });
      return res.json(request);
    } catch (error) {
      return next(error);
    }
  },

  async reject(req, res, next) {
    try {
      const request = await maintenanceService.reject(req.params.id, req.body, req.user, req.ip);
      if (!request) return res.status(404).json({ message: "Maintenance request not found." });
      return res.json(request);
    } catch (error) {
      return next(error);
    }
  },

  async assign(req, res, next) {
    try {
      const request = await maintenanceService.assignTechnician(req.params.id, req.body, req.user, req.ip);
      if (!request) return res.status(404).json({ message: "Maintenance request not found." });
      return res.json(request);
    } catch (error) {
      return next(error);
    }
  },

  async start(req, res, next) {
    try {
      const request = await maintenanceService.startRepair(req.params.id, req.body, req.user, req.ip);
      if (!request) return res.status(404).json({ message: "Maintenance request not found." });
      return res.json(request);
    } catch (error) {
      return next(error);
    }
  },

  async complete(req, res, next) {
    try {
      const request = await maintenanceService.completeRepair(req.params.id, req.body, req.user, req.ip);
      if (!request) return res.status(404).json({ message: "Maintenance request not found." });
      return res.json(request);
    } catch (error) {
      return next(error);
    }
  },

  async history(req, res, next) {
    try {
      const history = await maintenanceService.history(req.params.id);
      res.json(history);
    } catch (error) {
      next(error);
    }
  },

  async technicians(_req, res, next) {
    try {
      const technicians = await maintenanceService.availableTechnicians();
      res.json({ technicians });
    } catch (error) {
      next(error);
    }
  },
};

export default maintenanceController;
