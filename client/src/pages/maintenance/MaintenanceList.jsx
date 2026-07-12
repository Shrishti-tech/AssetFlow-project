import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MaintenanceTable from "../../components/Maintenance/MaintenanceTable";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  approveMaintenance,
  getMaintenanceRequests,
  rejectMaintenance,
} from "../../services/maintenanceService";

const statuses = ["Pending", "Approved", "Technician Assigned", "In Progress", "Resolved", "Rejected"];
const priorities = ["Low", "Medium", "High", "Critical"];

export default function MaintenanceList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const canManage = ["Admin", "Asset Manager"].includes(user?.role);

  const loadRequests = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await getMaintenanceRequests(filters);
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      setRequests([]);
      setNotice("Unable to load maintenance requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests({ status: status || undefined, priority: priority || undefined });
  }, [status, priority]);

  const viewRequest = (request) => {
    navigate(`/maintenance/${request._id || request.id}`);
  };

  const approveRequest = async (request) => {
    try {
      await approveMaintenance(request._id || request.id);
      setNotice("Maintenance request approved.");
      await loadRequests({ status: status || undefined, priority: priority || undefined });
    } catch (error) {
      setNotice(error?.response?.data?.message || "Failed to approve request.");
    }
  };

  const rejectRequest = async (request) => {
    try {
      await rejectMaintenance(request._id || request.id);
      setNotice("Maintenance request rejected.");
      await loadRequests({ status: status || undefined, priority: priority || undefined });
    } catch (error) {
      setNotice(error?.response?.data?.message || "Failed to reject request.");
    }
  };

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Phase 5</p>
          <h1>Maintenance Requests</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>
      <div className="booking-calendar-toolbar" style={{ marginBottom: "12px" }}>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option value="">All priorities</option>
          {priorities.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <section className="booking-history-card">
        {loading ? (
          <p className="booking-empty">Loading maintenance requests...</p>
        ) : (
          <MaintenanceTable
            requests={requests}
            onView={viewRequest}
            onApprove={canManage ? approveRequest : undefined}
            onReject={canManage ? rejectRequest : undefined}
          />
        )}
      </section>
    </main>
  );
}
