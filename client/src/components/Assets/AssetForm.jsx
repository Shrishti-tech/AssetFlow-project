import { useState } from "react";

const defaultValues = {
  name: "",
  assetTag: "",
  category: "",
  status: "Available",
  department: "",
  location: "",
  condition: "Good",
  purchaseDate: "",
  serialNumber: "",
  value: "",
  description: "",
};

export default function AssetForm({
  initialValues = {},
  onSubmit,
  submitLabel = "Save Asset",
}) {
  const [form, setForm] = useState({ ...defaultValues, ...initialValues });

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form className="asset-form" onSubmit={handleSubmit}>
      <div className="asset-form-grid">
        <label>
          <span>Asset Name</span>
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="e.g. Dell Latitude 7420"
            required
          />
        </label>

        <label>
          <span>Asset Tag</span>
          <input
            value={form.assetTag}
            onChange={(event) => updateField("assetTag", event.target.value)}
            placeholder="AF-00124"
            required
          />
        </label>

        <label>
          <span>Category</span>
          <input
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
            placeholder="Laptop"
            required
          />
        </label>

        <label>
          <span>Status</span>
          <select
            value={form.status}
            onChange={(event) => updateField("status", event.target.value)}
          >
            <option value="Available">Available</option>
            <option value="Allocated">Allocated</option>
            <option value="Reserved">Reserved</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Lost">Lost</option>
            <option value="Disposed">Disposed</option>
            <option value="Retired">Retired</option>
          </select>
        </label>

        <label>
          <span>Department</span>
          <input
            value={form.department}
            onChange={(event) => updateField("department", event.target.value)}
            placeholder="IT"
          />
        </label>

        <label>
          <span>Location</span>
          <input
            value={form.location}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="Floor 2 / Room 12"
          />
        </label>

        <label>
          <span>Condition</span>
          <select
            value={form.condition}
            onChange={(event) => updateField("condition", event.target.value)}
          >
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </label>

        <label>
          <span>Purchase Date</span>
          <input
            type="date"
            value={form.purchaseDate}
            onChange={(event) =>
              updateField("purchaseDate", event.target.value)
            }
          />
        </label>

        <label>
          <span>Serial Number</span>
          <input
            value={form.serialNumber}
            onChange={(event) =>
              updateField("serialNumber", event.target.value)
            }
            placeholder="SN-12345"
          />
        </label>

        <label>
          <span>Value</span>
          <input
            type="number"
            value={form.value}
            onChange={(event) => updateField("value", event.target.value)}
            placeholder="1500"
          />
        </label>
      </div>

      <label>
        <span>Description</span>
        <textarea
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          rows="4"
          placeholder="Add notes about the asset"
        />
      </label>

      <div className="asset-form-actions">
        <button type="submit" className="asset-primary-btn">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
