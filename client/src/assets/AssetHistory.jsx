function AssetHistory() {
  const timeline = [
    {
      title: "Created",
      date: "01 Jan 2025",
      note: "Asset registered in the system",
    },
    {
      title: "Allocated",
      date: "15 Jan 2025",
      note: "Assigned to IT department",
    },
    {
      title: "Returned",
      date: "02 Feb 2025",
      note: "Returned for reassignment",
    },
    {
      title: "Maintenance",
      date: "14 Mar 2025",
      note: "Battery replacement completed",
    },
    {
      title: "Transferred",
      date: "20 Apr 2025",
      note: "Moved to Finance department",
    },
    {
      title: "Audit Verified",
      date: "10 Jun 2025",
      note: "Audit check passed",
    },
    { title: "Retired", date: "01 Jul 2026", note: "Marked for disposal" },
  ];

  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "8px" }}>Asset History Timeline</h2>
      <p style={{ color: "#666", marginTop: 0 }}>
        Track the asset lifecycle from creation to retirement.
      </p>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {timeline.map((item, index) => (
          <div
            key={item.title}
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: index === timeline.length - 1 ? 0 : "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: "#2563eb",
                }}
              />
              {index < timeline.length - 1 && (
                <div
                  style={{
                    width: "2px",
                    flex: 1,
                    background: "#cbd5e1",
                    marginTop: "4px",
                  }}
                />
              )}
            </div>
            <div>
              <h4 style={{ margin: "0 0 4px" }}>{item.title}</h4>
              <div style={{ color: "#64748b", marginBottom: "4px" }}>
                {item.date}
              </div>
              <div>{item.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssetHistory;
