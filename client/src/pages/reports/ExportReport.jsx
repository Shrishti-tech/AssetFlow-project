import { useState } from "react";
import { ReportTabs } from "./ReportsDashboard";
import ChartCard from "../../components/Reports/ChartCard";
import ExportButton from "../../components/Reports/ExportButton";
import "./reports.css";

const reportOptions = [
  { value: "dashboard", label: "Dashboard Summary", description: "Total, allocated, available, maintenance, bookings, overdue." },
  { value: "assets", label: "Asset Utilization", description: "Allocated days vs. total days per asset." },
  { value: "departments", label: "Department Report", description: "Asset counts by department and status." },
  { value: "bookings", label: "Booking Heatmap", description: "Booking frequency by day and hour." },
  { value: "maintenance", label: "Maintenance Report", description: "Most repaired assets and resolution times." },
];

export default function ExportReport() {
  const [report, setReport] = useState("dashboard");
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });

  const setFilter = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));
  const selected = reportOptions.find((option) => option.value === report);

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Reports & Analytics</p>
          <h1>Export Report</h1>
        </div>
      </div>
      <ReportTabs />
      <ChartCard title="Choose a report to export" subtitle="Includes the report title, generated date/time, and any filters applied.">
        <div className="report-filters">
          <select value={report} onChange={(event) => setReport(event.target.value)}>
            {reportOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input type="date" value={filters.startDate} onChange={setFilter("startDate")} />
          <input type="date" value={filters.endDate} onChange={setFilter("endDate")} />
        </div>
        {selected ? <p>{selected.description}</p> : null}
        <ExportButton report={report} filters={filters} />
      </ChartCard>
    </main>
  );
}
