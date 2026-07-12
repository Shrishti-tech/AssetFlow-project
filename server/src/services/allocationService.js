import { Allocation } from "../models/Allocation.js";
import { AllocationHistory } from "../models/AllocationHistory.js";
import { Asset } from "../models/Asset.js";
import { TransferRequest } from "../models/TransferRequest.js";

const createHistoryEntry = async (
  allocationId,
  action,
  performedBy,
  details = {},
) => {
  return AllocationHistory.create({
    allocation: allocationId,
    action,
    performedBy,
    details,
  });
};

const getAllocationWithOverdueFlag = (allocation) => {
  const doc = allocation.toObject ? allocation.toObject() : allocation;
  const now = new Date();
  doc.isOverdue =
    doc.status === "active" &&
    Boolean(doc.expectedReturnDate) &&
    new Date(doc.expectedReturnDate) < now;
  return doc;
};

export const allocationService = {
  async list(query = {}) {
    const allocations = await Allocation.find(query)
      .populate("asset assignedTo assignedBy")
      .sort({ createdAt: -1 });

    return allocations.map(getAllocationWithOverdueFlag);
  },

  async getById(id) {
    const allocation = await Allocation.findById(id).populate(
      "asset assignedTo assignedBy",
    );
    return allocation ? getAllocationWithOverdueFlag(allocation) : null;
  },

  async create(data) {
    const asset = await Asset.findById(data.asset);
    if (!asset) {
      throw new Error("Asset not found.");
    }

    const activeAllocation = await Allocation.findOne({
      asset: data.asset,
      status: { $ne: "returned" },
    });

    if (activeAllocation) {
      throw new Error("Asset is already allocated.");
    }

    if (asset.status !== "available") {
      throw new Error("Only available assets can be allocated.");
    }

    const allocation = await Allocation.create({
      ...data,
      status: data.status || "active",
    });

    asset.status = "allocated";
    await asset.save();

    await createHistoryEntry(allocation._id, "created", data.assignedBy, {
      data,
    });
    return allocation;
  },

  async update(id, data) {
    const allocation = await Allocation.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (allocation) {
      await createHistoryEntry(
        allocation._id,
        "updated",
        data.updatedBy || null,
        { data },
      );
    }
    return allocation;
  },

  async remove(id) {
    const allocation = await Allocation.findByIdAndDelete(id);
    if (allocation) {
      await AllocationHistory.deleteMany({ allocation: allocation._id });
    }
    return allocation;
  },

  async returnAllocation(id, data = {}) {
    const allocation = await Allocation.findById(id);
    if (!allocation) {
      return null;
    }

    if (allocation.status === "returned") {
      return allocation;
    }

    const updatedAllocation = await Allocation.findByIdAndUpdate(
      id,
      {
        status: "returned",
        returnedAt: new Date(),
        ...data,
      },
      { new: true, runValidators: true },
    );

    if (updatedAllocation) {
      const asset = await Asset.findById(updatedAllocation.asset);
      if (asset) {
        asset.status = "available";
        await asset.save();
      }

      await createHistoryEntry(
        updatedAllocation._id,
        "returned",
        data.performedBy || null,
        {
          returnedAt: updatedAllocation.returnedAt,
        },
      );
    }

    return updatedAllocation;
  },

  async requestTransfer(data) {
    const allocation = await Allocation.findOne({
      asset: data.asset,
      status: { $ne: "returned" },
    });

    if (!allocation) {
      throw new Error("No active allocation found for the requested asset.");
    }

    const transferRequest = await TransferRequest.create(data);
    await createHistoryEntry(
      transferRequest._id,
      "transferred",
      data.requestedBy,
      {
        transferRequest: transferRequest._id,
      },
    );
    return transferRequest;
  },

  async approveTransfer(id, data = {}) {
    const transferRequest = await TransferRequest.findByIdAndUpdate(
      id,
      {
        status: "approved",
        reviewedAt: new Date(),
        ...data,
      },
      { new: true, runValidators: true },
    );

    if (transferRequest) {
      const allocation = await Allocation.findOneAndUpdate(
        { asset: transferRequest.asset, status: { $ne: "returned" } },
        {
          assignedTo: transferRequest.toUser,
          department: transferRequest.toDepartment || undefined,
          status: "active",
        },
        { new: true },
      );

      if (allocation) {
        await createHistoryEntry(
          allocation._id,
          "status_changed",
          data.reviewedBy || null,
          {
            transferRequest: transferRequest._id,
            status: "approved",
          },
        );
      }

      const asset = await Asset.findById(transferRequest.asset);
      if (asset) {
        asset.status = "allocated";
        await asset.save();
      }
    }

    return transferRequest;
  },

  async rejectTransfer(id, data = {}) {
    const transferRequest = await TransferRequest.findByIdAndUpdate(
      id,
      {
        status: "rejected",
        reviewedAt: new Date(),
        ...data,
      },
      { new: true, runValidators: true },
    );

    if (transferRequest) {
      const allocation = await Allocation.findOne({
        asset: transferRequest.asset,
        status: { $ne: "returned" },
      });
      if (allocation) {
        await createHistoryEntry(
          allocation._id,
          "status_changed",
          data.reviewedBy || null,
          {
            transferRequest: transferRequest._id,
            status: "rejected",
          },
        );
      }
    }

    return transferRequest;
  },

  async getHistory(allocationId) {
    return AllocationHistory.find({ allocation: allocationId }).sort({
      createdAt: -1,
    });
  },

  async getDashboardSummary() {
    const now = new Date();
    const upcomingWindow = new Date();
    upcomingWindow.setDate(now.getDate() + 7);

    const [
      assetsAvailable,
      assetsAllocated,
      pendingTransfers,
      upcomingReturns,
      overdueReturns,
    ] = await Promise.all([
      Asset.countDocuments({ status: "available" }),
      Asset.countDocuments({ status: "allocated" }),
      TransferRequest.countDocuments({ status: "pending" }),
      Allocation.countDocuments({
        status: "active",
        expectedReturnDate: { $gte: now, $lte: upcomingWindow },
      }),
      Allocation.countDocuments({
        status: "active",
        expectedReturnDate: { $lt: now },
      }),
    ]);

    return {
      assetsAvailable,
      assetsAllocated,
      pendingTransfers,
      upcomingReturns,
      overdueReturns,
    };
  },
};

export default allocationService;
