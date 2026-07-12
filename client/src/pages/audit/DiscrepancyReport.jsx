import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DiscrepancyTable from "../../components/Audit/DiscrepancyTable";
import AuditStatusBadge from "../../components/Audit/AuditStatusBadge";
import { closeAudit, getAuditCycles, getDiscrepancyReport } from "../../services/auditService";
import "./audit.css";

const statuses = ["Verified", "Missing", "Damaged", "Lost"];

export default function DiscrepancyReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [baseReport, setBaseReport] = useState(null);
  const [cycles, setCycles] = useState([]);
  const [filters, setFilters] = useState({ department: "", location: "", status: "" });
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCycles = () => {
    getAuditCycles()
      .then((data) => setCycles(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  const loadReport = async () => {
    setLoading(true);
    try {
      const query = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const data = await getDiscrepancyReport(id, query);
      setReport(data);
    } catch {
      setNotice("Unable to load the discrepancy report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCycles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getDiscrepancyReport(id)
      .then(setBaseReport)
      .catch(() => setBaseReport(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, filters]);

  const departments = useMemo(
    () => [...new Set((baseReport?.results || []).map((item) => item.asset?.department).filter(Boolean))].sort(),
    [baseReport],
  );
  const locations = useMemo(
    () => [...new Set((baseReport?.results || []).map((item) => item.asset?.location).filter(Boolean))].sort(),
    [baseReport],
  );

  const setFilter = (key) => (event) => setFilters((current) => ({ ...current, [key]: event.target.value }));

  const handleCycleChange = (event) => {
    navigate(`/audits/${event.target.value}/report`);
  };

  const handleClose = async () => {
    try {
      await closeAudit(id);
      setNotice("Audit cycle closed.");
      await loadReport();
    } catch (error) {
      setNotice(error?.response?.data?.message || "Failed to close audit cycle.");
    }
  };

  const isClosed = report?.cycle?.status === "Completed" || report?.cycle?.status === "Cancelled";

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Asset Audit</p>
          <h1>Discrepancy Report</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>
      <div className="audit-filters">
        <select value={id} onChange={handleCycleChange}>
          {cycles.map((cycle) => (
            <option key={cycle._id || cycle.id} value={cycle._id || cycle.id}>
              {cycle.title}
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
        <select value={filters.location} onChange={setFilter("location")}>
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <select value={filters.status} onChange={setFilter("status")}>
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      {report?.cycle ? (
        <div className="audit-summary-grid">
          <div className="audit-stat">
            <span>Cycle Status</span>
            <strong>
              <AuditStatusBadge status={report.cycle.status} />
            </strong>
          </div>
          <div className="audit-stat">
            <span>Verified</span>
            <strong>{report.summary?.verified ?? 0}</strong>
          </div>
          <div className="audit-stat">
            <span>Missing</span>
            <strong>{report.summary?.missing ?? 0}</strong>
          </div>
          <div className="audit-stat">
            <span>Damaged</span>
            <strong>{report.summary?.damaged ?? 0}</strong>
          </div>
          <div className="audit-stat">
            <span>Lost</span>
            <strong>{report.summary?.lost ?? 0}</strong>
          </div>
        </div>
      ) : null}
      <section className="booking-history-card" style={{ padding: "18px" }}>
        {loading ? (
          <p className="audit-empty">Loading discrepancy report...</p>
        ) : (
          <DiscrepancyTable results={report?.results || []} />
        )}
      </section>
      {!isClosed && report?.cycle ? (
        <div style={{ marginTop: 16 }}>
          <button className="booking-submit" type="button" onClick={handleClose}>
            Close Audit Cycle
          </button>
        </div>
      ) : null}
    </main>
  );
}
