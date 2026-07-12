import { useEffect, useMemo, useState } from "react";
import { ReportTabs } from "./ReportsDashboard";
import ChartCard from "../../components/Reports/ChartCard";
import BarChart from "../../components/Reports/BarChart";
import PieChart from "../../components/Reports/PieChart";
import ReportTable from "../../components/Reports/ReportTable";
import ExportButton from "../../components/Reports/ExportButton";
import { getDepartmentReport } from "../../services/reportsService";
import "./reports.css";

const columns = [
  { key: "department", label: "Department" },
  { key: "totalAssets", label: "Total Assets" },
  { key: "allocated", label: "Allocated" },
  { key: "available", label: "Available" },
  { key: "maintenance", label: "Maintenance" },
  { key: "retired", label: "Retired" },
  { key: "disposed", label: "Disposed" },
];

export default function DepartmentReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    getDepartmentReport()
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch(() => setNotice("Unable to load the department report."))
      .finally(() => setLoading(false));
  }, []);

  const totalsChart = useMemo(
    () => rows.map((row) => ({ label: row.department, value: row.totalAssets })),
    [rows],
  );
  const allocationShare = useMemo(
    () => rows.map((row) => ({ label: row.department, value: row.allocated })),
    [rows],
  );

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Reports & Analytics</p>
          <h1>Department Report</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>
      <ReportTabs />
      {loading ? (
        <p className="booking-empty">Loading department report...</p>
      ) : (
        <>
          <ChartCard title="Assets by department" actions={<ExportButton report="departments" />}>
            <BarChart data={totalsChart} />
          </ChartCard>
          <ChartCard title="Allocation share by department" subtitle="Share of allocated assets across departments">
            <PieChart data={allocationShare} />
          </ChartCard>
          <ChartCard title="All departments">
            <ReportTable columns={columns} rows={rows} emptyMessage="No department data available." />
          </ChartCard>
        </>
      )}
    </main>
  );
}
