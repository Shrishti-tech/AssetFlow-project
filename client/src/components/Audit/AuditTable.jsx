import AuditStatusBadge from "./AuditStatusBadge";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "-");

export default function AuditTable({ cycles = [], onView }) {
  if (!cycles.length) {
    return <p className="audit-empty">No audit cycles found.</p>;
  }

  return (
    <div className="booking-table-wrap">
      <table className="booking-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Department</th>
            <th>Location</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Created By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cycles.map((cycle) => {
            const id = cycle._id || cycle.id;
            return (
              <tr key={id}>
                <td>{cycle.title}</td>
                <td>{cycle.department || "-"}</td>
                <td>{cycle.location || "-"}</td>
                <td>{formatDate(cycle.startDate)}</td>
                <td>{formatDate(cycle.endDate)}</td>
                <td>
                  <AuditStatusBadge status={cycle.status} />
                </td>
                <td>{cycle.createdBy?.fullName || cycle.createdBy?.email || "-"}</td>
                <td>
                  <div className="booking-table-actions">
                    <button type="button" onClick={() => onView?.(cycle)}>
                      View Report
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
