import { Allocation } from "../models/Allocation.js";
import { AllocationHistory } from "../models/AllocationHistory.js";
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

export const allocationService = {
  async list(query = {}) {
    return Allocation.find(query)
      .populate("asset assignedTo assignedBy")
      .sort({ createdAt: -1 });
  },

  async getById(id) {
    return Allocation.findById(id).populate("asset assignedTo assignedBy");
  },

  async create(data) {
    const allocation = await Allocation.create(data);
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

  async requestTransfer(data) {
    return TransferRequest.create(data);
  },

  async getHistory(allocationId) {
    return AllocationHistory.find({ allocation: allocationId }).sort({
      createdAt: -1,
    });
  },
};

export default allocationService;
