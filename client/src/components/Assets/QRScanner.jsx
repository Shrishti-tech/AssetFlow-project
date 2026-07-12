import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function QRScanner({ defaultValue = "" }) {
  const [value, setValue] = useState(defaultValue);
  const navigate = useNavigate();

  const handleScan = (event) => {
    event.preventDefault();
    const tag = value.trim();
    if (!tag) return;
    navigate(`/assets/${encodeURIComponent(tag)}`);
  };

  return (
    <form className="asset-qr-card" onSubmit={handleScan}>
      <h3>Scan Asset QR</h3>
      <p>Scan or enter an asset tag to open its details page.</p>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="AF-00124"
      />
      <button type="submit" className="asset-primary-btn">
        Open Asset Details
      </button>
    </form>
  );
}
