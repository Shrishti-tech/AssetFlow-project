import { useState } from "react";

const defaultValues = {
  title: "",
  scope: "",
  department: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
};

export default function AuditForm({ onSubmit }) {
  const [values, setValues] = useState(defaultValues);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
    setValues(defaultValues);
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <label>
        Title
        <input name="title" value={values.title} onChange={handleChange} required />
      </label>
      <label>
        Scope
        <input
          name="scope"
          value={values.scope}
          onChange={handleChange}
          placeholder="e.g. Full inventory, IT assets"
        />
      </label>
      <div className="booking-form-row">
        <label>
          Department
          <input name="department" value={values.department} onChange={handleChange} />
        </label>
        <label>
          Location
          <input name="location" value={values.location} onChange={handleChange} />
        </label>
      </div>
      <div className="booking-form-row">
        <label>
          Start Date
          <input type="date" name="startDate" value={values.startDate} onChange={handleChange} required />
        </label>
        <label>
          End Date
          <input type="date" name="endDate" value={values.endDate} onChange={handleChange} required />
        </label>
      </div>
      <label>
        Description
        <textarea name="description" value={values.description} onChange={handleChange} rows="3" />
      </label>
      <button className="booking-submit" type="submit">
        Create Audit Cycle
      </button>
    </form>
  );
}
