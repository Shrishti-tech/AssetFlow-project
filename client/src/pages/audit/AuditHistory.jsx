import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuditTable from "../../components/Audit/AuditTable";
import { AuditTabs } from "./AuditCycle";
import { getAuditCycles } from "../../services/auditService";
import "./audit.css";

export default function AuditHistory() {
  const navigate = useNavigate();
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    getAuditCycles()
      .then((data) => setCycles(Array.isArray(data) ? data : []))
      .catch(() => setNotice("Unable to load audit history."))
      .finally(() => setLoading(false));
  }, []);

  const pastCycles = cycles.filter((cycle) => cycle.status === "Completed" || cycle.status === "Cancelled");

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Asset Audit</p>
          <h1>Audit History</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>
      <AuditTabs />
      <section className="booking-history-card" style={{ padding: "18px" }}>
        {loading ? (
          <p className="audit-empty">Loading audit history...</p>
        ) : (
          <AuditTable
            cycles={pastCycles}
            onView={(cycle) => navigate(`/audits/${cycle._id || cycle.id}/report`)}
          />
        )}
      </section>
    </main>
  );
}
