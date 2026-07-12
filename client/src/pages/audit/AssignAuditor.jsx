import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuditorSelector from "../../components/Audit/AuditorSelector";
import AuditStatusBadge from "../../components/Audit/AuditStatusBadge";
import { employeeService } from "../../organization/services/employeeService";
import { assignAuditor, getAuditCycleDetails } from "../../services/auditService";
import "./audit.css";

export default function AssignAuditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [auditor, setAuditor] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    try {
      const [detailData, employeeData] = await Promise.all([
        getAuditCycleDetails(id),
        employeeService.list(),
      ]);
      setDetails(detailData);
      setEmployees((employeeData.data.employees || []).filter((employee) => employee.status === "Active"));
    } catch {
      setNotice("Unable to load audit cycle details.");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const assignedIds = new Set((details?.assignments || []).map((item) => item.auditor?._id || item.auditor?.id));
  const availableEmployees = employees.filter((employee) => !assignedIds.has(employee.id));

  const handleAssign = async (event) => {
    event.preventDefault();
    try {
      await assignAuditor(id, { auditor });
      setNotice("Auditor assigned.");
      setAuditor("");
      await load();
    } catch (error) {
      setNotice(error?.response?.data?.message || "Failed to assign auditor.");
    }
  };

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Asset Audit</p>
          <h1>Assign Auditors</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>
      <div className="booking-workspace">
        <section className="booking-details-card">
          <h3>{details?.cycle?.title || "Audit Cycle"}</h3>
          {details?.cycle ? (
            <dl>
              <div>
                <dt>Status</dt>
                <dd>
                  <AuditStatusBadge status={details.cycle.status} />
                </dd>
              </div>
              <div>
                <dt>Department</dt>
                <dd>{details.cycle.department || "-"}</dd>
              </div>
            </dl>
          ) : null}
          <h3 style={{ marginTop: 18 }}>Current Assignments</h3>
          {details?.assignments?.length ? (
            <ul>
              {details.assignments.map((assignment) => (
                <li key={assignment._id || assignment.id}>
                  {assignment.auditor?.fullName || assignment.auditor?.email} —{" "}
                  <AuditStatusBadge status={assignment.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="audit-empty">No auditors assigned yet.</p>
          )}
          <button type="button" onClick={() => navigate("/audits")}>
            Back to audit cycles
          </button>
        </section>
        <aside className="booking-form-card">
          <h2>Assign Auditor</h2>
          {details?.cycle?.status === "Completed" || details?.cycle?.status === "Cancelled" ? (
            <p className="audit-empty">This audit cycle is read-only and no longer accepting assignments.</p>
          ) : (
            <form onSubmit={handleAssign} className="booking-form">
              <AuditorSelector
                employees={availableEmployees}
                value={auditor}
                onChange={(event) => setAuditor(event.target.value)}
              />
              <button className="booking-submit" type="submit">
                Assign
              </button>
            </form>
          )}
        </aside>
      </div>
    </main>
  );
}
