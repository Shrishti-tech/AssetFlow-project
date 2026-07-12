import { useEffect, useState } from "react";
import MaintenanceForm from "../../components/Maintenance/MaintenanceForm";
import MaintenanceCard from "../../components/Maintenance/MaintenanceCard";
import { useAuth } from "../../auth/hooks/useAuth";
import { allocationService } from "../../services/allocationService";
import {
  createMaintenanceRequest,
  getMaintenanceRequests,
} from "../../services/maintenanceService";

const idFor = (value) => value?._id || value?.id || value;

export default function RaiseRequest() {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [message, setMessage] = useState("");

  const loadAllocatedAssets = async () => {
    try {
      const allocations = (await allocationService.list()).data;
      const myActiveAssets = (Array.isArray(allocations) ? allocations : [])
        .filter(
          (allocation) =>
            allocation.status === "active" &&
            idFor(allocation.assignedTo) === idFor(user),
        )
        .map((allocation) => allocation.asset)
        .filter(Boolean);
      setAssets(myActiveAssets);
    } catch (error) {
      setAssets([]);
    }
  };

  const loadRecentRequests = async () => {
    try {
      const data = await getMaintenanceRequests();
      setRecentRequests(Array.isArray(data) ? data.slice(0, 8) : []);
    } catch (error) {
      setRecentRequests([]);
    }
  };

  useEffect(() => {
    loadAllocatedAssets();
    loadRecentRequests();
  }, [user]);

  const handleSubmit = async (values) => {
    try {
      await createMaintenanceRequest(values);
      setMessage("Maintenance request raised successfully.");
      await loadRecentRequests();
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to raise maintenance request.");
    }
  };

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Phase 6</p>
          <h1>Raise Maintenance Request</h1>
        </div>
        {message ? <p className="booking-message">{message}</p> : null}
      </div>
      <div className="booking-workspace">
        <section className="booking-history-card" style={{ padding: "18px" }}>
          <h2>Recent Requests</h2>
          {recentRequests.length ? (
            recentRequests.map((request) => (
              <MaintenanceCard maintenance={request} key={request._id || request.id} />
            ))
          ) : (
            <p className="booking-empty">No maintenance requests yet.</p>
          )}
        </section>
        <aside className="booking-form-card">
          <h2>Maintenance Form</h2>
          {assets.length ? (
            <MaintenanceForm assets={assets} onSubmit={handleSubmit} />
          ) : (
            <p className="booking-empty">
              You have no allocated assets available for a maintenance request.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
