import { useState } from "react";
import ReturnModal from "../components/ReturnModal";
import { returnAllocation } from "../services/allocationService";

export default function ReturnAsset() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(true);

  const handleSubmit = async (values) => {
    try {
      await returnAllocation(values);
      setMessage("Asset returned successfully.");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to return asset.");
    }
  };

  return (
    <div className="allocation-page">
      <h2>Return Asset</h2>
      {message ? <p className="allocation-message">{message}</p> : null}
      <button
        type="button"
        className="allocation-primary-btn"
        onClick={() => setOpen(true)}
      >
        Return Asset
      </button>
      <ReturnModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
