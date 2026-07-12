import { Link } from 'react-router-dom'
import { useState } from 'react'
import ForgotPasswordForm from '../components/ForgotPasswordForm'
import { authService } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage } from '../utils/authHelpers'
export default function ForgotPassword() { const { notify } = useAuth(); const [busy, setBusy] = useState(false); const [resetUrl, setResetUrl] = useState(''); const submit = async (form) => { setBusy(true); try { const { data } = await authService.forgotPassword(form); setResetUrl(data.resetUrl || ''); notify(data.message) } catch (error) { notify(getErrorMessage(error), 'error') } finally { setBusy(false) } }; return <div className="auth-card"><p className="eyebrow">ACCOUNT RECOVERY</p><h2>Reset your password</h2><p className="subcopy">We’ll email a secure reset link if your account exists.</p><ForgotPasswordForm onSubmit={submit} busy={busy} />{resetUrl && <a className="dev-reset-link" href={resetUrl}>Development: open generated reset link →</a>}<p className="switch-copy"><Link to="/login">← Back to sign in</Link></p></div> }
