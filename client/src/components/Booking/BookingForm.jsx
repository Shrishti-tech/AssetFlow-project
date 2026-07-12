import { useState } from "react";

const initialValues = {
  resource: "",
  employee: "",
  department: "",
  purpose: "",
  bookingDate: new Date().toISOString().slice(0, 10),
  startTime: "09:00",
  endTime: "10:00",
  remarks: "",
};

export default function BookingForm({
  onSubmit,
  submitLabel = "Create booking",
}) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...values,
      resource: values.resource.trim(),
      employee: values.employee.trim(),
      department: values.department.trim(),
      purpose: values.purpose.trim(),
      remarks: values.remarks.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: "0.75rem", maxWidth: "640px" }}
    >
      <label>
        Resource ID
        <input
          name="resource"
          value={values.resource}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Employee ID
        <input
          name="employee"
          value={values.employee}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Department
        <input
          name="department"
          value={values.department}
          onChange={handleChange}
        />
      </label>
      <label>
        Purpose
        <input
          name="purpose"
          value={values.purpose}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Booking date
        <input
          name="bookingDate"
          type="date"
          value={values.bookingDate}
          onChange={handleChange}
          required
        />
      </label>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "0.75rem",
        }}
      >
        <label>
          Start time
          <input
            name="startTime"
            type="time"
            value={values.startTime}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          End time
          <input
            name="endTime"
            type="time"
            value={values.endTime}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <label>
        Remarks
        <textarea
          name="remarks"
          value={values.remarks}
          onChange={handleChange}
          rows="3"
        />
      </label>
      <button type="submit">{submitLabel}</button>
    </form>
  );
}
