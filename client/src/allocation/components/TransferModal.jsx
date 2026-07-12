import { useState } from "react";

export default function TransferModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    asset: "",
    toUser: "",
    toDepartment: "",
    reason: "",
  });

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(form);
    onClose?.();
  };

  return (
    <div className="allocation-modal-backdrop">
      <div className="allocation-modal">
        <h3>Transfer Request</h3>
        <form onSubmit={handleSubmit} className="allocation-form">
          <label>
            <span>Asset ID</span>
            <input
              value={form.asset}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  asset: event.target.value,
                }))
              }
              required
            />
          </label>
          <label>
            <span>Transfer To User</span>
            <input
              value={form.toUser}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  toUser: event.target.value,
                }))
              }
              required
            />
          </label>
          <label>
            <span>Transfer To Department</span>
            <input
              value={form.toDepartment}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  toDepartment: event.target.value,
                }))
              }
            />
          </label>
          <label>
            <span>Reason</span>
            <textarea
              value={form.reason}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  reason: event.target.value,
                }))
              }
              rows="3"
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
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
