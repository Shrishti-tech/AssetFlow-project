import { useEffect, useState } from "react";
import ActivityTable from "../../components/Notifications/ActivityTable";
import { employeeService } from "../../organization/services/employeeService";
import { getActivityLogs } from "../../services/notificationService";

const modules = ["Allocation", "Booking", "Maintenance", "Audit"];

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({ module: "", action: "", user: "", date: "" });
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const query = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const data = await getActivityLogs(query);
      setLogs(data.logs || []);
    } catch {
      setNotice("Unable to load activity logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    employeeService
      .list()
      .then(({ data }) => setEmployees(data.employees || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const setFilter = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Notifications &amp; Activity</p>
          <h1>Activity Logs</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>

      <div className="booking-calendar-toolbar" style={{ marginBottom: "12px" }}>
        <select value={filters.module} onChange={setFilter("module")}>
          <option value="">All modules</option>
          {modules.map((module) => (
            <option key={module} value={module}>
              {module}
            </option>
          ))}
        </select>
        <select value={filters.user} onChange={setFilter("user")}>
          <option value="">All users</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.fullName}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Action..."
          value={filters.action}
          onChange={setFilter("action")}
        />
        <input type="date" value={filters.date} onChange={setFilter("date")} />
      </div>

      <section className="booking-history-card" style={{ padding: "18px" }}>
        {loading ? <p className="booking-empty">Loading activity logs...</p> : <ActivityTable logs={logs} />}
      </section>
    </main>
  );
}
