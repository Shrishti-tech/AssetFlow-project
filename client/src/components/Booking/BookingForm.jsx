import { useEffect, useState } from "react";
import ResourceSelector from "./ResourceSelector";

const defaultValues = {
  resource: "",
  purpose: "",
  bookingDate: new Date().toISOString().slice(0, 10),
  startTime: "09:00",
  endTime: "10:00",
  remarks: "",
};

export default function BookingForm({
  onSubmit,
  submitLabel = "Create booking",
  employee,
  department,
  initialValues,
}) {
  const [values, setValues] = useState({ ...defaultValues, ...initialValues });

  useEffect(() => {
    setValues({ ...defaultValues, ...initialValues });
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...values,
      resource: values.resource.trim(),
      employee: employee || values.employee,
      department: department || values.department,
      purpose: values.purpose.trim(),
      remarks: values.remarks.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <ResourceSelector value={values.resource} onChange={handleChange} />
      <label>
        Booking Date
        <input
          name="bookingDate"
          type="date"
          value={values.bookingDate}
          onChange={handleChange}
          required
        />
      </label>
      <div className="booking-form-row">
        <label>
          Start Time
          <input
            name="startTime"
            type="time"
            value={values.startTime}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          End Time
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
        Purpose
        <input
          name="purpose"
          value={values.purpose}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Remarks
        <textarea
          name="remarks"
          value={values.remarks}
          onChange={handleChange}
          rows="3"
        />
      </label>
      <button className="booking-submit" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
