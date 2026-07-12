import { useEffect, useState } from "react";
import { getDashboardSummary } from "../../services/dashboardService";

export default function KPICards({ search, onSelect }) {
  const [summary, setSummary] = useState({
    assetsAvailable: 0,
    assetsAllocated: 0,
    pendingTransfers: 0,
    upcomingReturns: 0,
    overdueReturns: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  const kpis = [
    {
      label: "Assets Available",
      value: summary.assetsAvailable,
      change: "ready for allocation",
      icon: "▣",
      tone: "blue",
    },
    {
      label: "Assets Allocated",
      value: summary.assetsAllocated,
      change: "currently in use",
      icon: "◫",
      tone: "purple",
    },
    {
      label: "Pending Transfers",
      value: summary.pendingTransfers,
      change: "awaiting approval",
      icon: "⇄",
      tone: "pink",
    },
    {
      label: "Upcoming Returns",
      value: summary.upcomingReturns,
      change: "due soon",
      icon: "↩",
      tone: "green",
    },
    {
      label: "Overdue Returns",
      value: summary.overdueReturns,
      change: "needs attention",
      icon: "⚠",
      tone: "orange",
    },
  ];

  const visible = kpis.filter((kpi) =>
    kpi.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="kpi-grid">
      {visible.length ? (
        visible.map((kpi) => (
          <button
            className="kpi-card"
            key={kpi.label}
            onClick={() => onSelect(kpi.label)}
          >
            <span className={`kpi-icon ${kpi.tone}`}>{kpi.icon}</span>
            <span className="kpi-copy">
              <small>{kpi.label}</small>
              <strong>{kpi.value}</strong>
              <em>{kpi.change}</em>
            </span>
            <span className="kpi-arrow">→</span>
          </button>
        ))
      ) : (
        <p className="no-results">No KPI cards match “{search}”.</p>
      )}
    </section>
  );
}
