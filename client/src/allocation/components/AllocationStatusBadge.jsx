const STATUS_META = {
  active: {
    label: "Active",
    className: "allocation-badge allocation-badge--active",
  },
  returned: {
    label: "Returned",
    className: "allocation-badge allocation-badge--returned",
  },
  pending: {
    label: "Pending",
    className: "allocation-badge allocation-badge--pending",
  },
  maintenance: {
    label: "Maintenance",
    className: "allocation-badge allocation-badge--maintenance",
  },
  lost: { label: "Lost", className: "allocation-badge allocation-badge--lost" },
  disposed: {
    label: "Disposed",
    className: "allocation-badge allocation-badge--disposed",
  },
};

export default function AllocationStatusBadge({ status }) {
  const key = (status || "").toLowerCase().trim();
  const meta = STATUS_META[key] || {
    label: status || "Unknown",
    className: "allocation-badge",
  };
  return <span className={meta.className}>{meta.label}</span>;
}
