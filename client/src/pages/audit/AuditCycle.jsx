import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AuditCard from "../../components/Audit/AuditCard";
import AuditForm from "../../components/Audit/AuditForm";
import { useAuth } from "../../auth/hooks/useAuth";
import { createAuditCycle, getAuditCycles } from "../../services/auditService";
import "./audit.css";

export const auditTabs = [
  { to: "/audits", label: "Audit Cycles", end: true },
  { to: "/audits/history", label: "History" },
];

export function AuditTabs() {
  return (
    <nav className="audit-tabs">
      {auditTabs.map((tab) => (
        <NavLink key={tab.to} to={tab.to} end={tab.end} className={({ isActive }) => (isActive ? "active" : "")}>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AuditCycle() {
  const { user } = useAuth();
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const isAdmin = user?.role === "Admin";

  const loadCycles = async () => {
    setLoading(true);
    try {
      const data = await getAuditCycles();
      setCycles(Array.isArray(data) ? data : []);
    } catch {
      setNotice("Unable to load audit cycles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCycles();
  }, []);

  const handleCreate = async (values) => {
    try {
      await createAuditCycle(values);
      setNotice("Audit cycle created.");
      await loadCycles();
    } catch (error) {
      setNotice(error?.response?.data?.message || "Failed to create audit cycle.");
    }
  };

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Asset Audit</p>
          <h1>Audit Cycles</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>
      <AuditTabs />
      <div className="booking-workspace">
        <section className="booking-history-card" style={{ padding: "18px" }}>
          <h2>Active &amp; Scheduled Cycles</h2>
          {loading ? (
            <p className="audit-empty">Loading audit cycles...</p>
          ) : (
            <div className="audit-card-grid">
              {cycles
                .filter((cycle) => cycle.status !== "Completed" && cycle.status !== "Cancelled")
                .map((cycle) => (
                  <AuditCard cycle={cycle} key={cycle._id || cycle.id} />
                ))}
              {!cycles.length ? <p className="audit-empty">No audit cycles yet.</p> : null}
            </div>
          )}
        </section>
        <aside className="booking-form-card">
          <h2>New Audit Cycle</h2>
          {isAdmin ? (
            <AuditForm onSubmit={handleCreate} />
          ) : (
            <p className="audit-empty">Only an Admin can create an audit cycle.</p>
          )}
        </aside>
      </div>
    </main>
  );
}
