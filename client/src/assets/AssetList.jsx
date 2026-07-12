import { useMemo, useState } from "react";

const assetsData = [
  {
    id: 1,
    name: "Dell Latitude 7420",
    category: "Laptop",
    tag: "AST-1001",
    serial: "SN-001",
    department: "IT",
    location: "Floor 3, Room 301",
    condition: "Good",
    status: "Assigned",
  },
  {
    id: 2,
    name: "Projector X200",
    category: "AV Equipment",
    tag: "AST-1002",
    serial: "SN-002",
    department: "Operations",
    location: "Conference Hall",
    condition: "Excellent",
    status: "Available",
  },
  {
    id: 3,
    name: "HP LaserJet 410",
    category: "Printer",
    tag: "AST-1003",
    serial: "SN-003",
    department: "Finance",
    location: "Floor 2, Room 220",
    condition: "Needs Repair",
    status: "Maintenance",
  },
];

function AssetList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAssets = useMemo(() => {
    const result = assetsData.filter((asset) => {
      const matchesSearch = `${asset.name} ${asset.tag} ${asset.department}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = category === "All" || asset.category === category;
      return matchesSearch && matchesCategory;
    });

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return a.department.localeCompare(b.department);
    });

    return result;
  }, [search, category, sortBy]);

  const pageSize = 5;
  const totalPages = Math.ceil(filteredAssets.length / pageSize);
  const pagedAssets = filteredAssets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Asset Inventory</h2>
          <p style={{ margin: "4px 0 0", color: "#666" }}>
            Manage and monitor all company assets.
          </p>
        </div>
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
          + Add Asset
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search asset, tag, department"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <option value="All">All Categories</option>
          <option value="Laptop">Laptop</option>
          <option value="AV Equipment">AV Equipment</option>
          <option value="Printer">Printer</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <option value="name">Sort by Name</option>
          <option value="status">Sort by Status</option>
          <option value="department">Sort by Department</option>
        </select>
        <input
          placeholder="QR Search"
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div
        style={{
          overflowX: "auto",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Asset</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Category</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Tag</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Department</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedAssets.map((asset) => (
              <tr key={asset.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{asset.name}</td>
                <td style={{ padding: "12px" }}>{asset.category}</td>
                <td style={{ padding: "12px" }}>{asset.tag}</td>
                <td style={{ padding: "12px" }}>{asset.department}</td>
                <td style={{ padding: "12px" }}>{asset.status}</td>
                <td style={{ padding: "12px" }}>
                  <div
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  >
                    <button
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #94a3b8",
                        background: "white",
                      }}
                    >
                      View
                    </button>
                    <button
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #34d399",
                        background: "#ecfdf5",
                        color: "#047857",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #f87171",
                        background: "#fef2f2",
                        color: "#dc2626",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "16px",
        }}
      >
        <span style={{ color: "#666" }}>
          Showing {pagedAssets.length} of {filteredAssets.length} assets
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            Previous
          </button>
          <span style={{ padding: "8px 12px" }}>
            {currentPage} / {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssetList;
