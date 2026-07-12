import { Link } from "react-router-dom";
import AuditStatusBadge from "./AuditStatusBadge";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "-");

export default function AuditCard({ cycle }) {
  const id = cycle._id || cycle.id;

  return (
    <div className="audit-card">
      <div className="audit-card-top">
        <h3>{cycle.title}</h3>
        <AuditStatusBadge status={cycle.status} />
      </div>
      {cycle.scope ? <p>{cycle.scope}</p> : null}
      <div className="audit-card-meta">
        {cycle.department ? <span>{cycle.department}</span> : null}
        {cycle.location ? <span>{cycle.location}</span> : null}
        <span>
          {formatDate(cycle.startDate)} – {formatDate(cycle.endDate)}
        </span>
      </div>
      <div className="audit-card-actions">
        <Link to={`/audits/${id}/assign`}>Assign Auditors</Link>
        <Link to={`/audits/${id}/verify`}>Verify Assets</Link>
        <Link to={`/audits/${id}/report`}>Discrepancy Report</Link>
      </div>
    </div>
  );
}
