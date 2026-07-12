import { useState } from "react";

function AddAsset() {
  const [form, setForm] = useState({
    assetName: "",
    category: "Laptop",
    assetTag: "AST-1004",
    serialNumber: "",
    acquisitionDate: "",
    acquisitionCost: "",
    location: "",
    department: "IT",
    condition: "Good",
    sharedResource: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Asset registration submitted");
  };

  return (
    <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "8px" }}>Asset Registration</h2>
      <p style={{ color: "#666", marginTop: 0 }}>
        Register new assets with full lifecycle details.
      </p>

      <form
        onSubmit={handleSubmit}
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
            <div>Asset Name</div>
            <input
              name="assetName"
              value={form.assetName}
              onChange={handleChange}
              required
              style={inputStyle}
            />
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
              <option value="Furniture">Furniture</option>
            </select>
          </label>
          <label>
            <div>Asset Tag (Auto Generated)</div>
            <input
              name="assetTag"
              value={form.assetTag}
              readOnly
              style={{ ...inputStyle, background: "#f8fafc" }}
            />
          </label>
          <label>
            <div>Serial Number</div>
            <input
              name="serialNumber"
              value={form.serialNumber}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label>
            <div>Acquisition Date</div>
            <input
              name="acquisitionDate"
              type="date"
              value={form.acquisitionDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </label>
          <label>
            <div>Acquisition Cost</div>
            <input
              name="acquisitionCost"
              type="number"
              value={form.acquisitionCost}
              onChange={handleChange}
              style={inputStyle}
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
            <div>Department</div>
            <input
              name="department"
              value={form.department}
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
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "24px",
            }}
          >
            <input
              type="checkbox"
              name="sharedResource"
              checked={form.sharedResource}
              onChange={handleChange}
            />
            Shared Resource
          </label>
        </div>

        <div style={{ marginTop: "20px", display: "grid", gap: "12px" }}>
          <label>
            <div>Upload Image</div>
            <input type="file" accept="image/*" />
          </label>
          <label>
            <div>Upload Documents</div>
            <input type="file" multiple />
          </label>
        </div>

        <button
          type="submit"
          style={{
            marginTop: "20px",
            padding: "10px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
          }}
        >
          Register Asset
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

export default AddAsset;
