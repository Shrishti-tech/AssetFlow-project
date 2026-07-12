import { Allocation } from "../models/Allocation.js";
import { Asset } from "../models/Asset.js";
import { Maintenance } from "../models/Maintenance.js";
import { MaintenanceHistory } from "../models/MaintenanceHistory.js";
import { Technician } from "../models/Technician.js";
import notificationService, { activityLogService } from "./notificationService.js";

const openStatuses = ["Pending", "Approved", "Technician Assigned", "In Progress"];
const assetMaintenanceStatus = "maintenance";

const fail = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};

const createHistory = (maintenance, action, performedBy, details = {}) =>
  MaintenanceHistory.create({
    maintenance,
    action,
    performedBy,
    details,
  });

const populateMaintenance = (query) =>
  query.populate("asset requestedBy approvedBy technician");

export const maintenanceService = {
  async list(query = {}) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.asset) filter.asset = query.asset;

    return populateMaintenance(
      Maintenance.find(filter).sort({ requestedDate: -1, createdAt: -1 }),
    );
  },

  async getById(id) {
    return populateMaintenance(Maintenance.findById(id));
  },

  async create(data, user, ipAddress) {
    const asset = await Asset.findById(data.asset);
    if (!asset) fail("Asset must exist.", 404);

    const activeAllocation = await Allocation.findOne({
      asset: data.asset,
      assignedTo: user._id,
      status: "active",
    });
    if (!activeAllocation) {
      fail("Only the currently allocated employee can raise maintenance requests.", 403);
    }

    const activeMaintenance = await Maintenance.findOne({
      asset: data.asset,
      status: { $in: openStatuses },
    });
    if (activeMaintenance || asset.status === assetMaintenanceStatus) {
      fail("Asset is already under maintenance.", 409);
    }

    const maintenance = await Maintenance.create({
      asset: data.asset,
      requestedBy: user._id,
      issue: data.issue,
      priority: data.priority || "Medium",
      attachments: data.attachments || [],
      remarks: data.remarks,
      requestedDate: new Date(),
    });

    await createHistory(maintenance._id, "Maintenance Created", user._id, { data });
    await notificationService.createForMaintenance(
      "Maintenance Request Raised",
      maintenance,
    );
    await activityLogService.log({
      user: user._id,
      action: "Maintenance Request Raised",
      module: "Maintenance",
      resourceId: maintenance._id,
      description: `Raised a maintenance request for ${asset.name} (${asset.assetTag}).`,
      ipAddress,
    });
    return this.getById(maintenance._id);
  },

  async approve(id, data, user, ipAddress) {
    const maintenance = await Maintenance.findById(id);
    if (!maintenance) return null;
    if (maintenance.status !== "Pending") fail("Only pending requests can be approved.");

    const asset = await Asset.findById(maintenance.asset);
    if (!asset) fail("Asset must exist.", 404);

    maintenance.status = "Approved";
    maintenance.approvedBy = user._id;
    maintenance.approvedDate = new Date();
    maintenance.remarks = data.remarks || maintenance.remarks;
    await maintenance.save();

    asset.status = assetMaintenanceStatus;
    await asset.save();

    await createHistory(maintenance._id, "Approved", user._id, { data });
    await notificationService.createForMaintenance("Maintenance Approved", maintenance);
    await activityLogService.log({
      user: user._id,
      action: "Maintenance Approved",
      module: "Maintenance",
      resourceId: maintenance._id,
      description: `Approved maintenance request for ${asset.name} (${asset.assetTag}).`,
      ipAddress,
    });
    return this.getById(id);
  },

  async reject(id, data, user, ipAddress) {
    const maintenance = await Maintenance.findById(id);
    if (!maintenance) return null;
    if (maintenance.status !== "Pending") fail("Only pending requests can be rejected.");

    maintenance.status = "Rejected";
    maintenance.approvedBy = user._id;
    maintenance.approvedDate = new Date();
    maintenance.remarks = data.remarks || maintenance.remarks;
    await maintenance.save();

    await createHistory(maintenance._id, "Rejected", user._id, { data });
    await notificationService.createForMaintenance("Maintenance Rejected", maintenance);
    await activityLogService.log({
      user: user._id,
      action: "Maintenance Rejected",
      module: "Maintenance",
      resourceId: maintenance._id,
      description: `Rejected maintenance request.`,
      ipAddress,
    });
    return this.getById(id);
  },

  async assignTechnician(id, data, user, ipAddress) {
    const maintenance = await Maintenance.findById(id);
    if (!maintenance) return null;
    if (maintenance.status !== "Approved") {
      fail("Only approved requests can receive a technician.");
    }

    const technician = await Technician.findById(data.technician);
    if (!technician) fail("Technician must exist.", 404);
    if (technician.status !== "Available") {
      fail("Technician must be available before assignment.", 409);
    }

    maintenance.technician = technician._id;
    maintenance.status = "Technician Assigned";
    maintenance.remarks = data.remarks || maintenance.remarks;
    await maintenance.save();

    technician.status = "Busy";
    await technician.save();

    await createHistory(maintenance._id, "Technician Assigned", user._id, {
      technician: technician._id,
      remarks: data.remarks,
    });
    await notificationService.createForMaintenance("Technician Assigned", maintenance);
    await activityLogService.log({
      user: user._id,
      action: "Technician Assigned",
      module: "Maintenance",
      resourceId: maintenance._id,
      description: `Assigned technician ${technician.name} to maintenance request.`,
      ipAddress,
    });
    return this.getById(id);
  },

  async startRepair(id, data, user, ipAddress) {
    const maintenance = await Maintenance.findById(id);
    if (!maintenance) return null;
    if (maintenance.status !== "Technician Assigned") {
      fail("Repair can start only after technician assignment.");
    }

    maintenance.status = "In Progress";
    maintenance.remarks = data.remarks || maintenance.remarks;
    await maintenance.save();

    await createHistory(maintenance._id, "Repair Started", user._id, { data });
    await notificationService.createForMaintenance("Repair Started", maintenance);
    await activityLogService.log({
      user: user._id,
      action: "Repair Started",
      module: "Maintenance",
      resourceId: maintenance._id,
      description: `Repair started on maintenance request.`,
      ipAddress,
    });
    return this.getById(id);
  },

  async completeRepair(id, data, user, ipAddress) {
    const maintenance = await Maintenance.findById(id);
    if (!maintenance) return null;
    if (maintenance.status !== "In Progress") {
      fail("Only in-progress repairs can be completed.");
    }

    maintenance.status = "Resolved";
    maintenance.completedDate = new Date();
    maintenance.remarks = data.remarks || maintenance.remarks;
    await maintenance.save();

    const asset = await Asset.findById(maintenance.asset);
    if (asset) {
      asset.status = "available";
      await asset.save();
    }

    if (maintenance.technician) {
      await Technician.findByIdAndUpdate(maintenance.technician, {
        status: "Available",
      });
    }

    await createHistory(maintenance._id, "Completed", user._id, { data });
    await notificationService.createForMaintenance("Repair Completed", maintenance);
    await activityLogService.log({
      user: user._id,
      action: "Repair Completed",
      module: "Maintenance",
      resourceId: maintenance._id,
      description: `Repair completed${asset ? ` for ${asset.name} (${asset.assetTag})` : ""}.`,
      ipAddress,
    });
    return this.getById(id);
  },

  async history(id) {
    return MaintenanceHistory.find({ maintenance: id })
      .populate("performedBy", "fullName email")
      .sort({ createdAt: 1 });
  },

  async availableTechnicians() {
    return Technician.find({ status: "Available" }).sort({ name: 1 });
  },
};

export default maintenanceService;
