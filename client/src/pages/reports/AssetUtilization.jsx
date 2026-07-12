import { useEffect, useMemo, useState } from "react";
import { ReportTabs } from "./ReportsDashboard";
import ChartCard from "../../components/Reports/ChartCard";
import BarChart from "../../components/Reports/BarChart";
import ReportTable from "../../components/Reports/ReportTable";
import ExportButton from "../../components/Reports/ExportButton";
import { getAssetUtilization } from "../../services/reportsService";
import "./reports.css";

const columns = [
  { key: "assetTag", label: "Asset Tag" },
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "department", label: "Department" },
  { key: "allocatedDays", label: "Allocated Days" },
  { key: "totalDays", label: "Total Days" },
  { key: "utilization", label: "Utilization %", render: (row) => `${row.utilization}%` },
];

export default function AssetUtilization() {
  const [rows, setRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [filters, setFilters] = useState({ category: "", department: "", startDate: "", endDate: "" });

  const loadRows = async (query) => {
    setLoading(true);
    try {
      const data = await getAssetUtilization(query);
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setNotice("Unable to load asset utilization.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAssetUtilization().then((data) => setAllRows(Array.isArray(data) ? data : [])).catch(() => {});
  }, []);

  useEffect(() => {
    const query = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    loadRows(query);
  }, [filters]);

  const categories = useMemo(() => [...new Set(allRows.map((row) => row.category).filter(Boolean))].sort(), [allRows]);
  const departments = useMemo(() => [...new Set(allRows.map((row) => row.department).filter(Boolean))].sort(), [allRows]);

  const chartData = useMemo(
    () => rows.slice(0, 10).map((row) => ({ label: row.name, value: row.utilization })),
    [rows],
  );

  const setFilter = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Reports & Analytics</p>
          <h1>Asset Utilization</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>
      <ReportTabs />
      <div className="report-filters">
        <select value={filters.category} onChange={setFilter("category")}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select value={filters.department} onChange={setFilter("department")}>
          <option value="">All departments</option>
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
        <input type="date" value={filters.startDate} onChange={setFilter("startDate")} />
        <input type="date" value={filters.endDate} onChange={setFilter("endDate")} />
      </div>
      <ChartCard
        title="Utilization by asset"
        subtitle="Allocated days as a share of total days (top 10)"
        actions={<ExportButton report="assets" filters={filters} />}
      >
        {loading ? <p className="booking-empty">Loading utilization...</p> : <BarChart data={chartData} max={100} valueSuffix="%" />}
      </ChartCard>
      <ChartCard title="All assets">
        <ReportTable columns={columns} rows={rows} emptyMessage="No assets match these filters." />
      </ChartCard>
    </main>
  );
}
