import allocationService from "../services/allocationService.js";

export const allocationController = {
  async list(req, res, next) {
    try {
      const allocations = await allocationService.list(req.query);
      res.json(allocations);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const allocation = await allocationService.getById(req.params.id);
      if (!allocation) {
        return res.status(404).json({ message: "Allocation not found." });
      }
      return res.json(allocation);
    } catch (error) {
      return next(error);
    }
  },

  async create(req, res, next) {
    try {
      const allocation = await allocationService.create(req.body);
      res.status(201).json(allocation);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const allocation = await allocationService.update(
        req.params.id,
        req.body,
      );
      if (!allocation) {
        return res.status(404).json({ message: "Allocation not found." });
      }
      return res.json(allocation);
    } catch (error) {
      return next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const allocation = await allocationService.remove(req.params.id);
      if (!allocation) {
        return res.status(404).json({ message: "Allocation not found." });
      }
      return res.json({ message: "Allocation removed." });
    } catch (error) {
      return next(error);
    }
  },

  async returnAllocation(req, res, next) {
    try {
      const allocation = await allocationService.returnAllocation(
        req.params.id,
        req.body,
      );
      if (!allocation) {
        return res.status(404).json({ message: "Allocation not found." });
      }
      return res.json(allocation);
    } catch (error) {
      return next(error);
    }
  },

  async requestTransfer(req, res, next) {
    try {
      const transferRequest = await allocationService.requestTransfer(req.body);
      res.status(201).json(transferRequest);
    } catch (error) {
      next(error);
    }
  },

  async approveTransfer(req, res, next) {
    try {
      const transferRequest = await allocationService.approveTransfer(
        req.params.id,
        req.body,
      );
      if (!transferRequest) {
        return res.status(404).json({ message: "Transfer request not found." });
      }
      return res.json(transferRequest);
    } catch (error) {
      return next(error);
    }
  },

  async rejectTransfer(req, res, next) {
    try {
      const transferRequest = await allocationService.rejectTransfer(
        req.params.id,
        req.body,
      );
      if (!transferRequest) {
        return res.status(404).json({ message: "Transfer request not found." });
      }
      return res.json(transferRequest);
    } catch (error) {
      return next(error);
    }
  },

  async history(req, res, next) {
    try {
      const history = await allocationService.getHistory(req.params.id);
      res.json(history);
    } catch (error) {
      next(error);
    }
  },
};

export default allocationController;
