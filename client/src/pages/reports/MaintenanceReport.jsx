import { useEffect, useState } from "react";
import { ReportTabs } from "./ReportsDashboard";
import SummaryCards from "../../components/Reports/SummaryCards";
import ChartCard from "../../components/Reports/ChartCard";
import BarChart from "../../components/Reports/BarChart";
import ExportButton from "../../components/Reports/ExportButton";
import { getMaintenanceReport } from "../../services/reportsService";
import "./reports.css";

export default function MaintenanceReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    getMaintenanceReport()
      .then(setReport)
      .catch(() => setNotice("Unable to load the maintenance report."))
      .finally(() => setLoading(false));
  }, []);

  const cards = report
    ? [
        { label: "Open Requests", value: report.openRequests, tone: "warning" },
        { label: "Closed Requests", value: report.closedRequests },
        { label: "Pending", value: report.pendingRequests, tone: "warning" },
        { label: "Completed", value: report.completedRequests, tone: "success" },
        { label: "Avg. Resolution (days)", value: report.averageResolutionTimeDays },
      ]
    : [];

  const repairChart =
    report?.mostFrequentlyRepairedAssets?.map((item) => ({ label: item.name, value: item.repairCount })) || [];

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Reports & Analytics</p>
          <h1>Maintenance Report</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>
      <ReportTabs />
      {loading ? (
        <p className="booking-empty">Loading maintenance report...</p>
      ) : (
        <>
          <SummaryCards items={cards} />
          <ChartCard
            title="Most frequently repaired assets"
            subtitle={
              report?.mostRepairedCategory
                ? `Most repaired category: ${report.mostRepairedCategory.category} (${report.mostRepairedCategory.repairCount} repairs)`
                : undefined
            }
            actions={<ExportButton report="maintenance" />}
          >
            <BarChart data={repairChart} colorMode="single" />
          </ChartCard>
        </>
      )}
    </main>
  );
}
