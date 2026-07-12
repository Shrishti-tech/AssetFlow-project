import { useState } from "react";
import { exportReport } from "../../services/reportsService";

const formats = [
  { type: "pdf", label: "PDF" },
  { type: "csv", label: "CSV" },
  { type: "xlsx", label: "Excel" },
];

export default function ExportButton({ report, filters = {} }) {
  const [pending, setPending] = useState("");
  const [error, setError] = useState("");

  const download = async (type) => {
    setPending(type);
    setError("");
    try {
      await exportReport(report, type, filters);
    } catch {
      setError(`Failed to export ${type.toUpperCase()}.`);
    } finally {
      setPending("");
    }
  };

  return (
    <div>
      <div className="report-export-group">
        {formats.map((format) => (
          <button
            key={format.type}
            type="button"
            disabled={Boolean(pending)}
            onClick={() => download(format.type)}
          >
            {pending === format.type ? "Exporting…" : `Export ${format.label}`}
          </button>
        ))}
      </div>
      {error ? <p className="booking-message">{error}</p> : null}
    </div>
  );
}
