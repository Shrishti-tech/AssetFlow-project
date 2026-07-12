import { useState } from "react";
import TransferModal from "../components/TransferModal";
import { createTransferRequest } from "../services/allocationService";

export default function TransferRequest() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(true);

  const handleSubmit = async (values) => {
    try {
      await createTransferRequest(values);
      setMessage("Transfer request submitted successfully.");
    } catch (error) {
      setMessage(
        error?.response?.data?.message || "Failed to submit transfer request.",
      );
    }
  };

  return (
    <div className="allocation-page">
      <h2>Transfer Requests</h2>
      {message ? <p className="allocation-message">{message}</p> : null}
      <button
        type="button"
        className="allocation-primary-btn"
        onClick={() => setOpen(true)}
      >
        New Transfer
      </button>
      <TransferModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
