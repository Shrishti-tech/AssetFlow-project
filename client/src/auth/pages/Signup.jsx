import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import SignupForm from '../components/SignupForm'
import { authService } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/authHelpers'
export default function Signup() { const { notify } = useAuth(); const navigate = useNavigate(); const [busy, setBusy] = useState(false); const submit = async (form) => { setBusy(true); try { const { data } = await authService.signup(form); notify(data.message); navigate('/login') } catch (error) { notify(getErrorMessage(error), 'error') } finally { setBusy(false) } }; return <div className="auth-card"><p className="eyebrow">GET STARTED</p><h2>Create your AssetFlow account</h2><p className="subcopy">Start with secure, employee-level access.</p><SignupForm onSubmit={submit} busy={busy} /><p className="switch-copy">Already have access? <Link to="/login">Sign in</Link></p></div> }
