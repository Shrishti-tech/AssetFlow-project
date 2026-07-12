import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import SummaryCards from "../../components/Reports/SummaryCards";
import ChartCard from "../../components/Reports/ChartCard";
import BarChart from "../../components/Reports/BarChart";
import { getDashboardSummary } from "../../services/reportsService";
import "./reports.css";

export const reportTabs = [
  { to: "/reports", label: "Overview", end: true },
  { to: "/reports/assets", label: "Asset Utilization" },
  { to: "/reports/departments", label: "Departments" },
  { to: "/reports/bookings", label: "Booking Heatmap" },
  { to: "/reports/maintenance", label: "Maintenance" },
  { to: "/reports/export", label: "Export" },
];

export function ReportTabs() {
  return (
    <nav className="report-tabs">
      {reportTabs.map((tab) => (
        <NavLink key={tab.to} to={tab.to} end={tab.end} className={({ isActive }) => (isActive ? "active" : "")}>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function ReportsDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setLoading(true);
    getDashboardSummary()
      .then(setSummary)
      .catch(() => setNotice("Unable to load the reports dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const cards = summary
    ? [
        { label: "Total Assets", value: summary.totalAssets },
        { label: "Allocated", value: summary.allocatedAssets },
        { label: "Available", value: summary.availableAssets, tone: "success" },
        { label: "Under Maintenance", value: summary.underMaintenance, tone: "warning" },
        { label: "Active Bookings", value: summary.activeBookings },
        { label: "Overdue Returns", value: summary.overdueReturns, tone: "danger" },
      ]
    : [];

  const breakdown = summary
    ? [
        { label: "Allocated", value: summary.allocatedAssets },
        { label: "Available", value: summary.availableAssets },
        { label: "Under Maintenance", value: summary.underMaintenance },
      ]
    : [];

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Reports & Analytics</p>
          <h1>Reports Dashboard</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>
      <ReportTabs />
      {loading ? (
        <p className="booking-empty">Loading dashboard summary...</p>
      ) : (
        <>
          <SummaryCards items={cards} />
          <ChartCard title="Asset status breakdown" subtitle="Allocated vs. available vs. under maintenance">
            <BarChart data={breakdown} colorMode="categorical" />
          </ChartCard>
        </>
      )}
    </main>
  );
}
