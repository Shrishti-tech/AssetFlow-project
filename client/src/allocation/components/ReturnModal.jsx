import { useState } from 'react'
const today = new Date().toISOString().slice(0, 10)
export default function ReturnModal({ allocation, open, onClose, onSubmit, busy }) {
  const [form, setForm] = useState({ returnDate: today, returnCondition: 'Good', damageNotes: '' })
  if (!open || !allocation) return null
  const submit = async (event) => { event.preventDefault(); if (!window.confirm('Are you sure you want to return this asset?')) return; await onSubmit(allocation._id, form) }
  return <div className="allocation-modal-backdrop"><form className="allocation-modal allocation-form" onSubmit={submit}><h3>Return asset</h3><p><b>{allocation.asset?.name}</b> · {allocation.assignedTo?.fullName}</p><label>Return date<input type="date" required value={form.returnDate} onChange={(event) => setForm({ ...form, returnDate: event.target.value })} /></label><label>Condition<select value={form.returnCondition} onChange={(event) => setForm({ ...form, returnCondition: event.target.value })}><option>Excellent</option><option>Good</option><option>Fair</option><option>Damaged</option></select></label><label>Damage notes<textarea value={form.damageNotes} onChange={(event) => setForm({ ...form, damageNotes: event.target.value })} placeholder="Required when damage is found" /></label><div className="allocation-form-actions"><button type="button" onClick={onClose}>Cancel</button><button disabled={busy}>Return asset</button></div></form></div>
}
