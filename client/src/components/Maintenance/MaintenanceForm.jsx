import { useState } from "react";

const priorities = ["Low", "Medium", "High", "Critical"];

const defaultValues = {
  asset: "",
  issue: "",
  priority: "Medium",
  remarks: "",
};

export default function MaintenanceForm({ assets = [], onSubmit }) {
  const [values, setValues] = useState(defaultValues);
  const [images, setImages] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleImages = (event) => {
    setImages(Array.from(event.target.files || []));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...values,
      issue: values.issue.trim(),
      remarks: values.remarks.trim(),
      attachments: images.map((file) => file.name),
    });
    setValues(defaultValues);
    setImages([]);
    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <label>
        Asset
        <select name="asset" value={values.asset} onChange={handleChange} required>
          <option value="">Select an allocated asset</option>
          {assets.map((asset) => (
            <option key={asset._id || asset.id} value={asset._id || asset.id}>
              {asset.name || asset.assetTag}
            </option>
          ))}
        </select>
      </label>
      <label>
        Issue Description
        <textarea
          name="issue"
          value={values.issue}
          onChange={handleChange}
          rows="4"
          required
        />
      </label>
      <label>
        Priority
        <select name="priority" value={values.priority} onChange={handleChange}>
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </label>
      <label>
        Upload Images
        <input type="file" accept="image/*" multiple onChange={handleImages} />
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
        Raise Request
      </button>
    </form>
  );
}
