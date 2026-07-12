import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";

const assetName = (maintenance) =>
  maintenance.asset?.name || maintenance.asset?.assetTag || maintenance.asset || "Asset";

export default function MaintenanceCard({ maintenance }) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "0.75rem",
        padding: "1rem",
        marginBottom: "0.75rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
        <strong>{assetName(maintenance)}</strong>
        <PriorityBadge priority={maintenance.priority} />
      </div>
      <p style={{ margin: "0.4rem 0", color: "#475569" }}>{maintenance.issue}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <StatusBadge status={maintenance.status} />
        <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
          {maintenance.requestedDate
            ? new Date(maintenance.requestedDate).toLocaleDateString()
            : ""}
        </span>
      </div>
    </div>
  );
}
