import { useState } from "react";

export default function ReturnModal({ open, onClose, onSubmit }) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.({ reason });
    onClose?.();
  };

  return (
    <div className="allocation-modal-backdrop">
      <div className="allocation-modal">
        <h3>Return Asset</h3>
        <form onSubmit={handleSubmit} className="allocation-form">
          <label>
            <span>Return Notes</span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows="4"
              placeholder="Optional notes"
            />
          </label>
          <div className="allocation-form-actions">
            <button
              type="button"
              className="allocation-btn allocation-btn--secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="allocation-primary-btn">
              Confirm Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
