import { useEffect, useState } from "react";
import { ReportTabs } from "./ReportsDashboard";
import ChartCard from "../../components/Reports/ChartCard";
import Heatmap from "../../components/Reports/Heatmap";
import BarChart from "../../components/Reports/BarChart";
import ExportButton from "../../components/Reports/ExportButton";
import { getBookingHeatmap } from "../../services/reportsService";
import "./reports.css";

export default function BookingHeatmap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [filters, setFilters] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    setLoading(true);
    const query = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    getBookingHeatmap(query)
      .then(setData)
      .catch(() => setNotice("Unable to load the booking heatmap."))
      .finally(() => setLoading(false));
  }, [filters]);

  const setFilter = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));

  const byDayChart = data?.byDay?.map((entry) => ({ label: entry.day.slice(0, 3), value: entry.count })) || [];

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Reports & Analytics</p>
          <h1>Booking Heatmap</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>
      <ReportTabs />
      <div className="report-filters">
        <input type="date" value={filters.startDate} onChange={setFilter("startDate")} />
        <input type="date" value={filters.endDate} onChange={setFilter("endDate")} />
      </div>
      {loading ? (
        <p className="booking-empty">Loading booking activity...</p>
      ) : (
        <>
          <ChartCard
            title="Peak usage by day and hour"
            subtitle="Darker cells indicate a higher booking frequency"
            actions={<ExportButton report="bookings" filters={filters} />}
          >
            <Heatmap cells={data?.heatmap || []} />
          </ChartCard>
          <ChartCard title="Bookings by day of week">
            <BarChart data={byDayChart} colorMode="single" />
          </ChartCard>
        </>
      )}
    </main>
  );
}
