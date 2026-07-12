import { useEffect, useState } from 'react'

const blank = { asset: '', assignedTo: '', department: '', expectedReturnDate: '', notes: '' }
const today = new Date().toISOString().slice(0, 10)

export default function AllocationForm({ assets = [], employees = [], departments = [], onSubmit, busy }) {
  const [form, setForm] = useState(blank)
  const [error, setError] = useState('')
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  useEffect(() => {
    const employee = employees.find((item) => item._id === form.assignedTo)
    if (employee?.department) update('department', employee.department)
  }, [form.assignedTo])
  const submit = async (event) => {
    event.preventDefault()
    if (!form.asset || !form.assignedTo || !form.expectedReturnDate) return setError('Asset, employee, and expected return date are required.')
    if (form.expectedReturnDate < today) return setError('Expected return date cannot be before today.')
    setError('')
    const saved = await onSubmit(form)
    if (saved) setForm(blank)
  }
  return <form className="allocation-form" onSubmit={submit}>
    {error && <p className="allocation-error">{error}</p>}
    <label>Asset<select value={form.asset} onChange={(event) => update('asset', event.target.value)} required><option value="">Select an available asset</option>{assets.map((asset) => <option value={asset._id} key={asset._id}>{asset.assetTag} — {asset.name}</option>)}</select></label>
    <label>Employee<select value={form.assignedTo} onChange={(event) => update('assignedTo', event.target.value)} required><option value="">Select an employee</option>{employees.map((employee) => <option value={employee._id} key={employee._id}>{employee.fullName} {employee.department ? `(${employee.department})` : ''}</option>)}</select></label>
    <label>Department<select value={form.department} onChange={(event) => update('department', event.target.value)}><option value="">Select department</option>{departments.map((department) => <option key={department}>{department}</option>)}</select></label>
    <label>Expected return date<input type="date" min={today} value={form.expectedReturnDate} onChange={(event) => update('expectedReturnDate', event.target.value)} required /></label>
    <label>Notes / remarks<textarea value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Optional allocation notes" /></label>
    <div className="allocation-form-actions"><button type="reset" className="allocation-btn allocation-btn--secondary" onClick={() => { setForm(blank); setError('') }}>Reset</button><button disabled={busy} className="allocation-primary-btn">{busy ? 'Allocating…' : 'Allocate asset'}</button></div>
  </form>
}
