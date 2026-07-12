import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

const assetName = (maintenance) =>
  maintenance.asset?.name || maintenance.asset?.assetTag || maintenance.asset || "-";
const requestedByName = (maintenance) =>
  maintenance.requestedBy?.fullName ||
  maintenance.requestedBy?.email ||
  maintenance.requestedBy ||
  "-";
const requestedDate = (maintenance) =>
  maintenance.requestedDate
    ? new Date(maintenance.requestedDate).toLocaleDateString()
    : "-";

export default function MaintenanceTable({
  requests = [],
  onView,
  onApprove,
  onReject,
}) {
  if (!requests.length) {
    return <p className="booking-empty">No maintenance requests found.</p>;
  }

  return (
    <div className="booking-table-wrap">
      <table className="booking-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Requested By</th>
            <th>Issue</th>
            <th>Priority</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request._id || request.id}>
              <td>{assetName(request)}</td>
              <td>{requestedByName(request)}</td>
              <td>{request.issue}</td>
              <td>
                <PriorityBadge priority={request.priority} />
              </td>
              <td>{requestedDate(request)}</td>
              <td>
                <StatusBadge status={request.status} />
              </td>
              <td>
                <div className="booking-table-actions">
                  <button type="button" onClick={() => onView?.(request)}>
                    View
                  </button>
                  {request.status === "Pending" ? (
                    <>
                      <button type="button" onClick={() => onApprove?.(request)}>
                        Approve
                      </button>
                      <button
                        type="button"
                        className="danger"
                        onClick={() => onReject?.(request)}
                      >
                        Reject
                      </button>
                    </>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
