import AuditStatusBadge from "./AuditStatusBadge";

const formatDate = (value) => (value ? new Date(value).toLocaleString() : "-");

export default function DiscrepancyTable({ results = [] }) {
  if (!results.length) {
    return <p className="audit-empty">No verification results match these filters.</p>;
  }

  return (
    <div className="booking-table-wrap">
      <table className="booking-table">
        <thead>
          <tr>
            <th>Asset Tag</th>
            <th>Asset Name</th>
            <th>Department</th>
            <th>Auditor</th>
            <th>Status</th>
            <th>Remarks</th>
            <th>Verified Date</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result._id || result.id}>
              <td>{result.asset?.assetTag || "-"}</td>
              <td>{result.asset?.name || "-"}</td>
              <td>{result.asset?.department || "-"}</td>
              <td>{result.auditor?.fullName || result.auditor?.email || "-"}</td>
              <td>
                <AuditStatusBadge status={result.status} />
              </td>
              <td>{result.remarks || "-"}</td>
              <td>{formatDate(result.verifiedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
