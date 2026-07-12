import { useState } from "react";

const defaultValues = {
  asset: "",
  assignedTo: "",
  assignedBy: "",
  department: "",
  location: "",
  notes: "",
};

export default function AllocationForm({
  initialValues = {},
  onSubmit,
  submitLabel = "Create Allocation",
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
    <form className="allocation-form" onSubmit={handleSubmit}>
      <label>
        <span>Asset ID</span>
        <input
          value={form.asset}
          onChange={(event) => updateField("asset", event.target.value)}
          placeholder="Asset ID"
          required
        />
      </label>

      <label>
        <span>Assigned To</span>
        <input
          value={form.assignedTo}
          onChange={(event) => updateField("assignedTo", event.target.value)}
          placeholder="User ID"
          required
        />
      </label>

      <label>
        <span>Assigned By</span>
        <input
          value={form.assignedBy}
          onChange={(event) => updateField("assignedBy", event.target.value)}
          placeholder="User ID"
          required
        />
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
          placeholder="Floor 2"
        />
      </label>

      <label>
        <span>Notes</span>
        <textarea
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          rows="4"
          placeholder="Allocation notes"
        />
      </label>

      <div className="allocation-form-actions">
        <button type="submit" className="allocation-primary-btn">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
