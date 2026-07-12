export default function ReportTable({ columns = [], rows = [], emptyMessage = "No records found." }) {
  return (
    <div className="booking-table-wrap">
      <table className="booking-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || row._id || index}>
              {columns.map((column) => (
                <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length ? <p className="booking-empty">{emptyMessage}</p> : null}
    </div>
  );
}
