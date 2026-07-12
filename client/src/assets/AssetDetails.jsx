function AssetDetails() {
  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "8px" }}>Asset Details</h2>
      <p style={{ color: "#666", marginTop: 0 }}>
        Complete overview of the selected asset.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "220px",
              background: "#e2e8f0",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
            }}
          >
            Asset Image Placeholder
          </div>
          <h3 style={{ marginTop: 0 }}>Asset Information</h3>
          <p>
            <strong>Name:</strong> Dell Latitude 7420
          </p>
          <p>
            <strong>Category:</strong> Laptop
          </p>
          <p>
            <strong>Asset Tag:</strong> AST-1001
          </p>
          <p>
            <strong>Serial Number:</strong> SN-001
          </p>
          <p>
            <strong>Department:</strong> IT
          </p>
          <p>
            <strong>Location:</strong> Floor 3, Room 301
          </p>
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Allocation Status</h3>
            <p>Assigned to: John Smith</p>
            <p>Status: In Use</p>
          </div>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Maintenance Status</h3>
            <p>Last Service: 12 Jun 2026</p>
            <p>Condition: Good</p>
          </div>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>QR Code</h3>
            <div
              style={{
                width: "120px",
                height: "120px",
                background: "#111827",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              QR
            </div>
          </div>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Documents</h3>
            <ul>
              <li>Purchase Invoice.pdf</li>
              <li>Warranty Card.pdf</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "16px" }}>
        <button
          style={{
            padding: "10px 14px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
          }}
        >
          View History
        </button>
      </div>
    </div>
  );
}

export default AssetDetails;
