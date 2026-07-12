import { useState } from 'react'
import IssueForm from './components/IssueForm'
import { useAuth } from '../auth/hooks/useAuth'
import { helpService } from './services/helpService'

export default function ReportIssue() {
  const { user } = useAuth()
  const [notice, setNotice] = useState('')

  const submit = async (data) => {
    try {
      await helpService.submitTicket({ type: 'issue', name: user?.fullName || 'AssetFlow user', email: user?.email || '', subject: data.title, description: data.description, module: data.module, priority: data.priority, screenshotName: data.screenshotName })
      setNotice('Your issue has been reported. Our team will follow up by email.')
    } catch (error) {
      setNotice(error.response?.data?.message || 'Unable to submit your issue right now.')
    }
    window.setTimeout(() => setNotice(''), 4000)
  }

  return <section className="help-section">
    <div className="help-section-heading"><h2>Report an Issue</h2><p>Found a bug or something not working as expected? Let us know.</p></div>
    <IssueForm onSubmit={submit} />
    {notice && <p className="help-notice" role="status">{notice}</p>}
  </section>
}
