import { Asset } from "../models/Asset.js";
import { Allocation } from "../models/Allocation.js";
import { Booking } from "../models/Booking.js";
import { Maintenance } from "../models/Maintenance.js";
import { buildCsv, buildPdf, buildXlsx } from "../utils/reportExport.js";

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const OPEN_MAINTENANCE_STATUSES = ["Pending", "Approved", "Technician Assigned", "In Progress"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const fail = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  throw error;
};

const daysBetween = (start, end) => Math.max(0, (end.getTime() - start.getTime()) / MS_PER_DAY);

const isoWeekKey = (date) => {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNumber + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((target - firstThursday) / MS_PER_DAY - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${target.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
};

export const reportsService = {
  async getDashboardSummary() {
    const now = new Date();
    const [
      totalAssets,
      allocatedAssets,
      availableAssets,
      underMaintenance,
      activeBookings,
      overdueReturns,
    ] = await Promise.all([
      Asset.countDocuments(),
      Asset.countDocuments({ status: "allocated" }),
      Asset.countDocuments({ status: "available" }),
      Asset.countDocuments({ status: "maintenance" }),
      Booking.countDocuments({ status: { $in: ["Upcoming", "Ongoing"] } }),
      Allocation.countDocuments({ status: "active", expectedReturnDate: { $lt: now } }),
    ]);

    return {
      totalAssets,
      allocatedAssets,
      availableAssets,
      underMaintenance,
      activeBookings,
      overdueReturns,
    };
  },

  async getAssetUtilization(query = {}) {
    const filter = {};
    if (query.category) filter.category = query.category;
    if (query.department) filter.department = query.department;

    const rangeEnd = query.endDate ? new Date(query.endDate) : new Date();
    const explicitStart = query.startDate ? new Date(query.startDate) : null;

    const assets = await Asset.find(filter).sort({ name: 1 });

    const rows = await Promise.all(
      assets.map(async (asset) => {
        const rangeStart = explicitStart || asset.acquisitionDate || asset.createdAt;
        const totalDays = Math.max(1, Math.round(daysBetween(rangeStart, rangeEnd)));

        const allocations = await Allocation.find({
          asset: asset._id,
          allocatedAt: { $lte: rangeEnd },
          $or: [{ returnedAt: null }, { returnedAt: { $gte: rangeStart } }],
        }).select("allocatedAt returnedAt");

        const allocatedDays = allocations.reduce((sum, allocation) => {
          const start = allocation.allocatedAt > rangeStart ? allocation.allocatedAt : rangeStart;
          const rawEnd = allocation.returnedAt && allocation.returnedAt < rangeEnd ? allocation.returnedAt : rangeEnd;
          return sum + daysBetween(start, rawEnd);
        }, 0);

        const utilization = totalDays > 0 ? Math.min(100, (allocatedDays / totalDays) * 100) : 0;

        return {
          assetId: asset._id,
          assetTag: asset.assetTag,
          name: asset.name,
          category: asset.category,
          department: asset.department,
          status: asset.status,
          totalDays,
          allocatedDays: Math.round(allocatedDays * 10) / 10,
          utilization: Math.round(utilization * 10) / 10,
        };
      }),
    );

    return rows;
  },

  async getDepartmentReport() {
    const rows = await Asset.aggregate([
      {
        $group: {
          _id: "$department",
          totalAssets: { $sum: 1 },
          allocated: { $sum: { $cond: [{ $eq: ["$status", "allocated"] }, 1, 0] } },
          available: { $sum: { $cond: [{ $eq: ["$status", "available"] }, 1, 0] } },
          maintenance: { $sum: { $cond: [{ $eq: ["$status", "maintenance"] }, 1, 0] } },
          retired: { $sum: { $cond: [{ $eq: ["$status", "retired"] }, 1, 0] } },
          disposed: { $sum: { $cond: [{ $eq: ["$status", "disposed"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return rows.map((row) => ({
      department: row._id || "Unassigned",
      totalAssets: row.totalAssets,
      allocated: row.allocated,
      available: row.available,
      maintenance: row.maintenance,
      retired: row.retired,
      disposed: row.disposed,
    }));
  },

  async getBookingHeatmap(query = {}) {
    const filter = { status: { $ne: "Cancelled" } };
    if (query.startDate || query.endDate) {
      filter.bookingDate = {};
      if (query.startDate) filter.bookingDate.$gte = new Date(query.startDate);
      if (query.endDate) filter.bookingDate.$lte = new Date(query.endDate);
    }

    const bookings = await Booking.find(filter).select("bookingDate startTime");

    const cellCounts = new Map();
    const byDay = Object.fromEntries(DAY_NAMES.map((day) => [day, 0]));
    const byHour = {};
    const byWeek = {};

    bookings.forEach((booking) => {
      const day = DAY_NAMES[new Date(booking.bookingDate).getDay()];
      const hour = Number(String(booking.startTime).split(":")[0]);
      const week = isoWeekKey(new Date(booking.bookingDate));

      const cellKey = `${day}|${hour}`;
      cellCounts.set(cellKey, (cellCounts.get(cellKey) || 0) + 1);
      byDay[day] += 1;
      byHour[hour] = (byHour[hour] || 0) + 1;
      byWeek[week] = (byWeek[week] || 0) + 1;
    });

    const heatmap = [...cellCounts.entries()].map(([key, count]) => {
      const [day, hour] = key.split("|");
      return { day, hour: Number(hour), count };
    });

    return {
      heatmap,
      byDay: DAY_NAMES.map((day) => ({ day, count: byDay[day] })),
      byHour: Object.entries(byHour)
        .map(([hour, count]) => ({ hour: Number(hour), count }))
        .sort((a, b) => a.hour - b.hour),
      byWeek: Object.entries(byWeek)
        .map(([week, count]) => ({ week, count }))
        .sort((a, b) => a.week.localeCompare(b.week)),
    };
  },

  async getMaintenanceReport() {
    const [openRequests, closedRequests, pendingRequests, completedRequests] = await Promise.all([
      Maintenance.countDocuments({ status: { $in: OPEN_MAINTENANCE_STATUSES } }),
      Maintenance.countDocuments({ status: { $in: ["Resolved", "Rejected"] } }),
      Maintenance.countDocuments({ status: "Pending" }),
      Maintenance.countDocuments({ status: "Resolved" }),
    ]);

    const resolved = await Maintenance.find({ status: "Resolved", completedDate: { $ne: null } })
      .select("requestedDate completedDate asset")
      .populate("asset", "name assetTag category");

    const averageResolutionTimeDays = resolved.length
      ? Math.round(
          (resolved.reduce((sum, item) => sum + (item.completedDate - item.requestedDate), 0) /
            resolved.length /
            MS_PER_DAY) *
            10,
        ) / 10
      : 0;

    const assetCounts = new Map();
    const categoryCounts = new Map();

    resolved.forEach((item) => {
      if (!item.asset) return;
      const assetKey = item.asset._id.toString();
      const entry = assetCounts.get(assetKey) || { asset: item.asset, count: 0 };
      entry.count += 1;
      assetCounts.set(assetKey, entry);
      categoryCounts.set(item.asset.category, (categoryCounts.get(item.asset.category) || 0) + 1);
    });

    const mostFrequentlyRepairedAssets = [...assetCounts.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(({ asset, count }) => ({
        assetId: asset._id,
        name: asset.name,
        assetTag: asset.assetTag,
        repairCount: count,
      }));

    const topCategory = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0];

    return {
      openRequests,
      closedRequests,
      pendingRequests,
      completedRequests,
      averageResolutionTimeDays,
      mostFrequentlyRepairedAssets,
      mostRepairedCategory: topCategory ? { category: topCategory[0], repairCount: topCategory[1] } : null,
    };
  },

  async buildExportPayload(report, filters) {
    switch (report) {
      case "dashboard": {
        const summary = await this.getDashboardSummary();
        return {
          title: "Dashboard Summary Report",
          columns: [
            { key: "metric", label: "Metric" },
            { key: "value", label: "Value" },
          ],
          rows: Object.entries(summary).map(([metric, value]) => ({ metric, value })),
        };
      }
      case "assets": {
        const rows = await this.getAssetUtilization(filters);
        return {
          title: "Asset Utilization Report",
          columns: [
            { key: "assetTag", label: "Asset Tag" },
            { key: "name", label: "Name" },
            { key: "category", label: "Category" },
            { key: "department", label: "Department" },
            { key: "status", label: "Status" },
            { key: "allocatedDays", label: "Allocated Days" },
            { key: "totalDays", label: "Total Days" },
            { key: "utilization", label: "Utilization %" },
          ],
          rows,
        };
      }
      case "departments": {
        const rows = await this.getDepartmentReport();
        return {
          title: "Department Report",
          columns: [
            { key: "department", label: "Department" },
            { key: "totalAssets", label: "Total Assets" },
            { key: "allocated", label: "Allocated" },
            { key: "available", label: "Available" },
            { key: "maintenance", label: "Under Maintenance" },
            { key: "retired", label: "Retired" },
            { key: "disposed", label: "Disposed" },
          ],
          rows,
        };
      }
      case "bookings": {
        const { heatmap } = await this.getBookingHeatmap(filters);
        return {
          title: "Booking Heatmap Report",
          columns: [
            { key: "day", label: "Day" },
            { key: "hour", label: "Hour" },
            { key: "count", label: "Bookings" },
          ],
          rows: heatmap,
        };
      }
      case "maintenance": {
        const summary = await this.getMaintenanceReport();
        return {
          title: "Maintenance Report",
          columns: [
            { key: "assetTag", label: "Asset Tag" },
            { key: "name", label: "Asset Name" },
            { key: "repairCount", label: "Repair Count" },
          ],
          rows: summary.mostFrequentlyRepairedAssets,
          summary,
        };
      }
      default:
        return fail("Unsupported report type.");
    }
  },

  async exportReport(type, report, filters = {}) {
    const payload = await this.buildExportPayload(report, filters);
    const meta = {
      title: payload.title,
      generatedAt: new Date().toISOString(),
      filters,
      columns: payload.columns,
      rows: payload.rows,
    };
    const fileName = `${report}-report-${new Date().toISOString().slice(0, 10)}`;

    if (type === "csv") {
      return { buffer: buildCsv(meta), contentType: "text/csv", extension: "csv", fileName };
    }
    if (type === "xlsx") {
      return {
        buffer: await buildXlsx(meta),
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        extension: "xlsx",
        fileName,
      };
    }
    if (type === "pdf") {
      return { buffer: await buildPdf(meta), contentType: "application/pdf", extension: "pdf", fileName };
    }
    return fail("Unsupported export type.");
  },
};

export default reportsService;
