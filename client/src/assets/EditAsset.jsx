import { useState } from "react";

function EditAsset() {
  const [form, setForm] = useState({
    assetTag: "AST-1001",
    location: "Floor 3, Room 301",
    condition: "Good",
    category: "Laptop",
    status: "Assigned",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "8px" }}>Edit Asset</h2>
      <p style={{ color: "#666", marginTop: 0 }}>
        Only editable fields are enabled for this asset.
      </p>

      <form
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <label>
            <div>Asset Tag</div>
            <input
              name="assetTag"
              value={form.assetTag}
              readOnly
              style={{ ...inputStyle, background: "#f8fafc" }}
            />
          </label>
          <label>
            <div>Location</div>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label>
            <div>Condition</div>
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Needs Repair">Needs Repair</option>
            </select>
          </label>
          <label>
            <div>Category</div>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Laptop">Laptop</option>
              <option value="Printer">Printer</option>
              <option value="AV Equipment">AV Equipment</option>
            </select>
          </label>
          <label>
            <div>Status</div>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Assigned">Assigned</option>
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
          </label>
          <label>
            <div>Images</div>
            <input type="file" accept="image/*" multiple style={inputStyle} />
          </label>
        </div>

        <button
          type="button"
          style={{
            marginTop: "20px",
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#16a34a",
            color: "white",
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: "6px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
};

export default EditAsset;
