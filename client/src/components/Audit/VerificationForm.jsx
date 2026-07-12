import { useState } from "react";

const statuses = ["Verified", "Missing", "Damaged", "Lost"];

const defaultValues = {
  asset: "",
  status: "Verified",
  remarks: "",
};

export default function VerificationForm({ assets = [], onSubmit }) {
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
      remarks: values.remarks.trim(),
      images: images.map((file) => file.name),
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
          <option value="">Select an asset to verify</option>
          {assets.map((asset) => (
            <option key={asset._id || asset.id} value={asset._id || asset.id}>
              {asset.name} ({asset.assetTag})
            </option>
          ))}
        </select>
      </label>
      <label>
        Status
        <select name="status" value={values.status} onChange={handleChange} required>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <label>
        Remarks
        <textarea name="remarks" value={values.remarks} onChange={handleChange} rows="3" />
      </label>
      <label>
        Upload Images
        <input type="file" accept="image/*" multiple onChange={handleImages} />
      </label>
      <button className="booking-submit" type="submit">
        Submit Verification
      </button>
    </form>
  );
}
