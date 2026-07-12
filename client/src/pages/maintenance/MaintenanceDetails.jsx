import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PriorityBadge from "../../components/Maintenance/PriorityBadge";
import StatusBadge from "../../components/Maintenance/StatusBadge";
import Timeline from "../../components/Maintenance/Timeline";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  approveMaintenance,
  completeRepair,
  getMaintenanceById,
  getMaintenanceHistory,
  rejectMaintenance,
  startRepair,
} from "../../services/maintenanceService";

const display = (value) => value || "-";
const personName = (value) => value?.fullName || value?.email || display(value);
const assetName = (value) => value?.name || value?.assetTag || display(value);

export default function MaintenanceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [maintenance, setMaintenance] = useState(null);
  const [history, setHistory] = useState([]);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const canManage = ["Admin", "Asset Manager"].includes(user?.role);

  const load = async () => {
    setLoading(true);
    try {
      const [request, timeline] = await Promise.all([
        getMaintenanceById(id),
        getMaintenanceHistory(id),
      ]);
      setMaintenance(request);
      setHistory(Array.isArray(timeline) ? timeline : []);
    } catch (error) {
      setNotice("Unable to load this maintenance request.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const approve = async () => {
    try {
      await approveMaintenance(id);
      setNotice("Maintenance request approved.");
      await load();
    } catch (error) {
      setNotice(error?.response?.data?.message || "Failed to approve request.");
    }
  };

  const reject = async () => {
    try {
      await rejectMaintenance(id);
      setNotice("Maintenance request rejected.");
      await load();
    } catch (error) {
      setNotice(error?.response?.data?.message || "Failed to reject request.");
    }
  };

  const start = async () => {
    try {
      await startRepair(id);
      setNotice("Repair started.");
      await load();
    } catch (error) {
      setNotice(error?.response?.data?.message || "Failed to start repair.");
    }
  };

  const complete = async () => {
    try {
      await completeRepair(id);
      setNotice("Repair completed.");
      await load();
    } catch (error) {
      setNotice(error?.response?.data?.message || "Failed to complete repair.");
    }
  };

  if (loading) {
    return (
      <main className="booking-page">
        <p className="booking-empty">Loading maintenance request...</p>
      </main>
    );
  }

  if (!maintenance) {
    return (
      <main className="booking-page">
        <p className="booking-empty">{notice || "Maintenance request not found."}</p>
      </main>
    );
  }

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Phase 5</p>
          <h1>Maintenance Details</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>
      <div className="booking-history-layout">
        <section className="booking-details-card">
          <h3>Request Details</h3>
          <dl>
            <div>
              <dt>Asset</dt>
              <dd>{assetName(maintenance.asset)}</dd>
            </div>
            <div>
              <dt>Requested By</dt>
              <dd>{personName(maintenance.requestedBy)}</dd>
            </div>
            <div>
              <dt>Approved By</dt>
              <dd>{maintenance.approvedBy ? personName(maintenance.approvedBy) : "-"}</dd>
            </div>
            <div>
              <dt>Technician</dt>
              <dd>{maintenance.technician?.name || "-"}</dd>
            </div>
            <div>
              <dt>Issue</dt>
              <dd>{display(maintenance.issue)}</dd>
            </div>
            <div>
              <dt>Priority</dt>
              <dd>
                <PriorityBadge priority={maintenance.priority} />
              </dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <StatusBadge status={maintenance.status} />
              </dd>
            </div>
            <div>
              <dt>Remarks</dt>
              <dd>{display(maintenance.remarks)}</dd>
            </div>
          </dl>

          {canManage ? (
            <div className="booking-table-actions" style={{ marginTop: "16px" }}>
              {maintenance.status === "Pending" ? (
                <>
                  <button type="button" onClick={approve}>
                    Approve
                  </button>
                  <button type="button" className="danger" onClick={reject}>
                    Reject
                  </button>
                </>
              ) : null}
              {maintenance.status === "Approved" ? (
                <button
                  type="button"
                  onClick={() => navigate(`/maintenance/${id}/assign`)}
                >
                  Assign Technician
                </button>
              ) : null}
              {maintenance.status === "Technician Assigned" ? (
                <button type="button" onClick={start}>
                  Start Repair
                </button>
              ) : null}
              {maintenance.status === "In Progress" ? (
                <button type="button" onClick={complete}>
                  Complete Repair
                </button>
              ) : null}
            </div>
          ) : null}
        </section>
        <aside className="booking-history-side">
          <Timeline history={history} />
        </aside>
      </div>
    </main>
  );
}
