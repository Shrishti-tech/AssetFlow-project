import { useState } from 'react'
import { isValidEmail } from '../utils/authHelpers'

export default function SignupForm({ onSubmit, busy }) {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' }); const [errors, setErrors] = useState({})
  const submit = (event) => { event.preventDefault(); const next = {}; if (form.fullName.trim().length < 2) next.fullName = 'Enter your full name.'; if (!isValidEmail(form.email)) next.email = 'Enter a valid email address.'; if (form.password.length < 8) next.password = 'Use at least 8 characters.'; if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match.'; setErrors(next); if (!Object.keys(next).length) onSubmit(form) }
  const field = (key, label, type = 'text', autoComplete) => <label>{label}<input type={type} autoComplete={autoComplete} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />{errors[key] && <em>{errors[key]}</em>}</label>
  return <form onSubmit={submit} noValidate>{field('fullName', 'Full name', 'text', 'name')}{field('email', 'Work email', 'email', 'email')}{field('password', 'Password', 'password', 'new-password')}{field('confirmPassword', 'Confirm password', 'password', 'new-password')}<p className="form-note">New accounts are created as active Employees. Roles are assigned by an administrator.</p><button className="primary-button" disabled={busy}>{busy ? <i className="spinner" /> : 'Create secure account'}</button></form>
}
