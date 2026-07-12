import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/authHelpers'
export default function Login() { const { login, notify } = useAuth(); const navigate = useNavigate(); const location = useLocation(); const [busy, setBusy] = useState(false); const submit = async (form) => { setBusy(true); try { const user = await login(form); notify(`Welcome back, ${user.fullName.split(' ')[0]}.`); navigate(location.state?.from?.pathname || '/dashboard', { replace: true }) } catch (error) { notify(getErrorMessage(error), 'error') } finally { setBusy(false) } }; return <div className="auth-card"><p className="eyebrow">WELCOME BACK</p><h2>Sign in to your workspace</h2><p className="subcopy">Manage your enterprise assets with confidence.</p><LoginForm onSubmit={submit} busy={busy} /><p className="switch-copy">New to AssetFlow? <Link to="/signup">Create an account</Link></p></div> }
