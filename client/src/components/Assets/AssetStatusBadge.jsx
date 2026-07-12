const STATUS_META = {
  available: {
    label: "Available",
    className: "asset-badge asset-badge--available",
  },
  allocated: {
    label: "Allocated",
    className: "asset-badge asset-badge--allocated",
  },
  reserved: {
    label: "Reserved",
    className: "asset-badge asset-badge--reserved",
  },
  maintenance: {
    label: "Maintenance",
    className: "asset-badge asset-badge--maintenance",
  },
  lost: { label: "Lost", className: "asset-badge asset-badge--lost" },
  disposed: {
    label: "Disposed",
    className: "asset-badge asset-badge--disposed",
  },
  retired: { label: "Retired", className: "asset-badge asset-badge--retired" },
};

export default function AssetStatusBadge({ status }) {
  const key = (status || "").toLowerCase().trim();
  const meta = STATUS_META[key] || {
    label: status || "Unknown",
    className: "asset-badge",
  };

  return <span className={meta.className}>{meta.label}</span>;
}
