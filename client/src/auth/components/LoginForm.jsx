import { useState } from 'react'
import { Link } from 'react-router-dom'
import { isValidEmail } from '../utils/authHelpers'

export default function LoginForm({ onSubmit, busy }) {
  const [form, setForm] = useState({ email: '', password: '' }); const [errors, setErrors] = useState({})
  const submit = (event) => { event.preventDefault(); const next = {}; if (!isValidEmail(form.email)) next.email = 'Enter a valid email address.'; if (!form.password) next.password = 'Password is required.'; setErrors(next); if (!Object.keys(next).length) onSubmit(form) }
  return <form onSubmit={submit} noValidate><label>Email address<input autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" />{errors.email && <em>{errors.email}</em>}</label><label>Password<input type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />{errors.password && <em>{errors.password}</em>}</label><div className="form-row"><span /><Link to="/forgot-password">Forgot password?</Link></div><button className="primary-button" disabled={busy}>{busy ? <i className="spinner" /> : 'Sign in to AssetFlow'}</button></form>
}
