import AllocationStatusBadge from "./AllocationStatusBadge";

export default function AllocationTable({
  allocations = [],
  onView,
  onReturn,
  onTransfer,
}) {
  return (
    <div className="allocation-table-card">
      <div className="allocation-table-head">
        <h3>Allocations</h3>
        <span>{allocations.length} records</span>
      </div>

      <div className="allocation-table-wrap">
        <table className="allocation-table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Assigned To</th>
              <th>Department</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((allocation) => (
              <tr key={allocation._id || allocation.id}>
                <td>
                  {allocation.asset?.name || allocation.asset?.assetTag || "—"}
                </td>
                <td>
                  {allocation.assignedTo?.name ||
                    allocation.assignedTo?.email ||
                    "—"}
                </td>
                <td>{allocation.department || "—"}</td>
                <td>{allocation.location || "—"}</td>
                <td>
                  <AllocationStatusBadge status={allocation.status} />
                </td>
                <td>
                  <div className="allocation-actions">
                    {onView ? (
                      <button
                        type="button"
                        className="allocation-btn"
                        onClick={() => onView(allocation)}
                      >
                        View
                      </button>
                    ) : null}
                    {onReturn ? (
                      <button
                        type="button"
                        className="allocation-btn allocation-btn--secondary"
                        onClick={() => onReturn(allocation)}
                      >
                        Return
                      </button>
                    ) : null}
                    {onTransfer ? (
                      <button
                        type="button"
                        className="allocation-btn allocation-btn--ghost"
                        onClick={() => onTransfer(allocation)}
                      >
                        Transfer
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
