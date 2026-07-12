import { useState } from 'react'

const empty = { name: '', email: '', subject: '', message: '' }

export default function ContactForm({ initial, onSubmit }) {
  const [form, setForm] = useState({ ...empty, ...initial })
  const [sending, setSending] = useState(false)
  const change = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setSending(true)
    try { await onSubmit(form); setForm({ ...empty, ...initial }) } finally { setSending(false) }
  }

  return <form className="help-form" onSubmit={submit}>
    <label>Name<input value={form.name} onChange={change('name')} required /></label>
    <label>Email<input type="email" value={form.email} onChange={change('email')} required /></label>
    <label>Subject<input value={form.subject} onChange={change('subject')} required /></label>
    <label>Message<textarea value={form.message} onChange={change('message')} required /></label>
    <button className="help-button" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send'}</button>
  </form>
}
