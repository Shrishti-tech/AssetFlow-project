import { AuditCycle } from "../models/AuditCycle.js";
import { AuditAssignment } from "../models/AuditAssignment.js";
import { AuditResult } from "../models/AuditResult.js";
import { Asset } from "../models/Asset.js";
import { User } from "../../models/User.js";
import notificationService from "./notificationService.js";

const openCycleStatuses = ["Scheduled", "In Progress"];

const fail = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};

const populateCycle = (query) => query.populate("createdBy", "fullName email");
const populateAssignment = (query) =>
  query.populate("auditor", "fullName email department").populate("assignedBy", "fullName email");
const populateResult = (query) =>
  query
    .populate("asset", "name assetTag category department location status")
    .populate("auditor", "fullName email");

export const auditService = {
  async createCycle(data, user) {
    if (!data.title || !data.startDate || !data.endDate) {
      fail("Title, start date and end date are required.");
    }
    if (new Date(data.startDate) > new Date(data.endDate)) {
      fail("Start date must be before end date.");
    }

    const cycle = await AuditCycle.create({
      title: data.title,
      scope: data.scope,
      department: data.department,
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
      createdBy: user._id,
    });

    await notificationService.createForAudit("Audit Cycle Created", cycle, user._id);
    return this.getById(cycle._id);
  },

  async list(query = {}) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.department) filter.department = query.department;
    if (query.location) filter.location = query.location;

    return populateCycle(AuditCycle.find(filter).sort({ startDate: -1, createdAt: -1 }));
  },

  async getById(id) {
    return populateCycle(AuditCycle.findById(id));
  },

  async getDetails(id) {
    const cycle = await this.getById(id);
    if (!cycle) return null;

    const [assignments, results] = await Promise.all([
      populateAssignment(AuditAssignment.find({ auditCycle: id }).sort({ assignedDate: -1 })),
      populateResult(AuditResult.find({ auditCycle: id }).sort({ verifiedAt: -1 })),
    ]);

    const assetCount = await Asset.countDocuments(
      cycle.department ? { department: cycle.department } : {},
    );

    const summary = {
      totalAssignments: assignments.length,
      totalVerified: results.length,
      verified: results.filter((item) => item.status === "Verified").length,
      missing: results.filter((item) => item.status === "Missing").length,
      damaged: results.filter((item) => item.status === "Damaged").length,
      lost: results.filter((item) => item.status === "Lost").length,
      assetsInScope: assetCount,
    };

    return { cycle, assignments, results, summary };
  },

  async assignAuditor(cycleId, data, user) {
    if (!data.auditor) fail("Auditor is required.");

    const cycle = await AuditCycle.findById(cycleId);
    if (!cycle) return null;
    if (!openCycleStatuses.includes(cycle.status)) {
      fail("Auditors can only be assigned to a scheduled or in-progress audit cycle.");
    }

    const auditor = await User.findById(data.auditor);
    if (!auditor || auditor.status !== "Active") fail("Select an active auditor.", 404);

    if (await AuditAssignment.exists({ auditCycle: cycleId, auditor: auditor._id })) {
      fail("This auditor is already assigned to the audit cycle.", 409);
    }

    const assignment = await AuditAssignment.create({
      auditCycle: cycleId,
      auditor: auditor._id,
      assignedBy: user._id,
      assignedDate: new Date(),
    });

    await notificationService.createForAudit("Auditor Assigned", cycle, auditor._id);

    if (cycle.status === "Scheduled") {
      cycle.status = "In Progress";
      await cycle.save();
      await notificationService.createForAudit("Audit Started", cycle, cycle.createdBy);
    }

    return populateAssignment(AuditAssignment.findById(assignment._id));
  },

  async verifyAsset(cycleId, data, user) {
    if (!data.asset || !data.status) fail("Asset and verification status are required.");

    const cycle = await AuditCycle.findById(cycleId);
    if (!cycle) return null;
    if (cycle.status === "Completed" || cycle.status === "Cancelled") {
      fail("This audit cycle is read-only and can no longer be verified.");
    }

    const assignment = await AuditAssignment.findOne({
      auditCycle: cycleId,
      auditor: user._id,
      status: { $in: ["Assigned", "Accepted"] },
    });
    if (!assignment) fail("Only auditors assigned to this cycle can verify assets.", 403);

    const asset = await Asset.findById(data.asset);
    if (!asset) fail("Asset must exist.", 404);

    if (await AuditResult.exists({ auditCycle: cycleId, asset: asset._id })) {
      fail("This asset has already been verified for this audit cycle.", 409);
    }

    const result = await AuditResult.create({
      auditCycle: cycleId,
      asset: asset._id,
      auditor: user._id,
      status: data.status,
      remarks: data.remarks,
      images: data.images || [],
      verifiedAt: new Date(),
    });

    if (assignment.status === "Assigned") {
      assignment.status = "Accepted";
      await assignment.save();
    }

    await notificationService.createForAudit(
      data.status === "Verified" ? "Asset Verified" : "Discrepancy Detected",
      cycle,
      cycle.createdBy,
      data.status === "Verified"
        ? undefined
        : `${asset.name} (${asset.assetTag}) was marked ${data.status} during "${cycle.title}".`,
    );

    return populateResult(AuditResult.findById(result._id));
  },

  async closeAudit(cycleId, user) {
    const cycle = await AuditCycle.findById(cycleId);
    if (!cycle) return null;
    if (cycle.status === "Completed") fail("This audit cycle is already completed.");
    if (cycle.status === "Cancelled") fail("A cancelled audit cycle cannot be closed.");

    const lostResults = await AuditResult.find({ auditCycle: cycleId, status: "Lost" });
    await Promise.all(
      lostResults.map((result) => Asset.findByIdAndUpdate(result.asset, { status: "lost" })),
    );

    cycle.status = "Completed";
    await cycle.save();

    await AuditAssignment.updateMany(
      { auditCycle: cycleId, status: { $ne: "Completed" } },
      { status: "Completed" },
    );

    const assignments = await AuditAssignment.find({ auditCycle: cycleId });
    const recipients = new Set([cycle.createdBy.toString(), ...assignments.map((item) => item.auditor.toString())]);
    await Promise.all(
      [...recipients].map((recipient) => notificationService.createForAudit("Audit Completed", cycle, recipient)),
    );

    return this.getById(cycleId);
  },

  async getDiscrepancyReport(cycleId, query = {}) {
    const cycle = await AuditCycle.findById(cycleId);
    if (!cycle) return null;

    const filter = { auditCycle: cycleId };
    if (query.status) filter.status = query.status;

    let results = await populateResult(AuditResult.find(filter).sort({ verifiedAt: -1 }));

    if (query.department) {
      results = results.filter((item) => item.asset?.department === query.department);
    }
    if (query.location) {
      results = results.filter((item) => item.asset?.location === query.location);
    }

    return {
      cycle,
      results,
      summary: {
        total: results.length,
        verified: results.filter((item) => item.status === "Verified").length,
        missing: results.filter((item) => item.status === "Missing").length,
        damaged: results.filter((item) => item.status === "Damaged").length,
        lost: results.filter((item) => item.status === "Lost").length,
      },
    };
  },
};

export default auditService;
