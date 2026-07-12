import { useEffect, useState } from "react";
import MaintenanceTable from "../../components/Maintenance/MaintenanceTable";
import PriorityBadge from "../../components/Maintenance/PriorityBadge";
import StatusBadge from "../../components/Maintenance/StatusBadge";
import Timeline from "../../components/Maintenance/Timeline";
import {
  getMaintenanceHistory,
  getMaintenanceRequests,
} from "../../services/maintenanceService";

const idFor = (value) => value?._id || value?.id || value || "";

export default function MaintenanceHistory() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getMaintenanceRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      setRequests([]);
      setNotice("Unable to load maintenance requests.");
    } finally {
      setLoading(false);
    }
  };

  const viewRequest = async (request) => {
    setSelected(request);
    try {
      const data = await getMaintenanceHistory(idFor(request));
      setTimeline(Array.isArray(data) ? data : []);
    } catch (error) {
      setTimeline([]);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Phase 8</p>
          <h1>Maintenance History</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>
      <div className="booking-history-layout">
        <section className="booking-history-card">
          {loading ? (
            <p className="booking-empty">Loading maintenance requests...</p>
          ) : (
            <MaintenanceTable requests={requests} onView={viewRequest} />
          )}
        </section>
        <aside className="booking-history-side">
          {selected ? (
            <section className="booking-details-card">
              <h3>Selected Request</h3>
              <dl>
                <div>
                  <dt>Asset</dt>
                  <dd>{selected.asset?.name || selected.asset?.assetTag || "-"}</dd>
                </div>
                <div>
                  <dt>Priority</dt>
                  <dd>
                    <PriorityBadge priority={selected.priority} />
                  </dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <StatusBadge status={selected.status} />
                  </dd>
                </div>
              </dl>
            </section>
          ) : (
            <p className="booking-empty">Select a request to view its history.</p>
          )}
          <Timeline history={timeline} />
        </aside>
      </div>
    </main>
  );
}
