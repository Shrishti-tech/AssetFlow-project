import { useState } from 'react'

const modules = ['Assets', 'Allocation', 'Booking', 'Maintenance', 'Audit', 'Reports', 'Other']
const priorities = ['Low', 'Medium', 'High', 'Critical']
const empty = { title: '', module: modules[0], description: '', priority: 'Medium' }

export default function IssueForm({ onSubmit }) {
  const [form, setForm] = useState(empty)
  const [screenshot, setScreenshot] = useState(null)
  const [sending, setSending] = useState(false)
  const change = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setSending(true)
    try {
      await onSubmit({ ...form, screenshotName: screenshot?.name || '' })
      setForm(empty)
      setScreenshot(null)
    } finally { setSending(false) }
  }

  return <form className="help-form" onSubmit={submit}>
    <label>Issue Title<input value={form.title} onChange={change('title')} required /></label>
    <label>Module<select value={form.module} onChange={change('module')}>{modules.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
    <label>Description<textarea value={form.description} onChange={change('description')} required /></label>
    <label>Priority<select value={form.priority} onChange={change('priority')}>{priorities.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
    <label>Screenshot Upload<input type="file" accept="image/*" onChange={(event) => setScreenshot(event.target.files?.[0] || null)} />{screenshot && <span className="help-file-name">{screenshot.name}</span>}</label>
    <button className="help-button" type="submit" disabled={sending}>{sending ? 'Submitting…' : 'Submit'}</button>
  </form>
}
