export default function ActivityTable({ logs = [] }) {
  if (!logs.length) {
    return <p className="booking-empty">No activity found.</p>;
  }

  return (
    <div className="booking-table-wrap">
      <table className="booking-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>User</th>
            <th>Module</th>
            <th>Action</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id || log.id}>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
              <td>{log.user?.fullName || log.user?.email || "-"}</td>
              <td>{log.module}</td>
              <td>{log.action}</td>
              <td>{log.description || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
