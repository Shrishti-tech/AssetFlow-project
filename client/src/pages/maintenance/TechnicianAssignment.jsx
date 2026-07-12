import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TechnicianSelector from "../../components/Maintenance/TechnicianSelector";
import StatusBadge from "../../components/Maintenance/StatusBadge";
import {
  assignTechnician,
  getAvailableTechnicians,
  getMaintenanceById,
} from "../../services/maintenanceService";

export default function TechnicianAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [technician, setTechnician] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    try {
      const [request, technicianData] = await Promise.all([
        getMaintenanceById(id),
        getAvailableTechnicians(),
      ]);
      setMaintenance(request);
      setTechnicians(technicianData.technicians || []);
    } catch (error) {
      setNotice("Unable to load technician assignment details.");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAssign = async (event) => {
    event.preventDefault();
    try {
      await assignTechnician(id, { technician });
      setNotice("Technician assigned. Status updated.");
      await load();
      setTechnician("");
    } catch (error) {
      setNotice(error?.response?.data?.message || "Failed to assign technician.");
    }
  };

  return (
    <main className="booking-page">
      <div className="booking-page-head">
        <div>
          <p className="booking-kicker">Phase 7</p>
          <h1>Technician Assignment</h1>
        </div>
        {notice ? <p className="booking-message">{notice}</p> : null}
      </div>
      <div className="booking-workspace">
        <section className="booking-details-card">
          <h3>Request ID</h3>
          <p>{id}</p>
          {maintenance ? (
            <dl>
              <div>
                <dt>Asset</dt>
                <dd>{maintenance.asset?.name || maintenance.asset?.assetTag || "-"}</dd>
              </div>
              <div>
                <dt>Issue</dt>
                <dd>{maintenance.issue}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusBadge status={maintenance.status} />
                </dd>
              </div>
            </dl>
          ) : null}
          <button type="button" onClick={() => navigate(`/maintenance/${id}`)}>
            Back to details
          </button>
        </section>
        <aside className="booking-form-card">
          <h2>Available Technicians</h2>
          {maintenance?.status !== "Approved" ? (
            <p className="booking-empty">
              Technicians can only be assigned once the request is Approved.
            </p>
          ) : (
            <form onSubmit={handleAssign} className="booking-form">
              <TechnicianSelector
                technicians={technicians}
                value={technician}
                onChange={(event) => setTechnician(event.target.value)}
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
