import { useState } from 'react'
import ContactForm from './components/ContactForm'
import { useAuth } from '../auth/hooks/useAuth'
import { helpService } from './services/helpService'

export default function ContactSupport() {
  const { user } = useAuth()
  const [notice, setNotice] = useState('')

  const submit = async (data) => {
    try {
      await helpService.submitTicket({ type: 'contact', name: data.name, email: data.email, subject: data.subject, description: data.message, priority: 'Medium' })
      setNotice("Thanks for reaching out. Our support team will get back to you shortly.")
    } catch (error) {
      setNotice(error.response?.data?.message || 'Unable to send your message right now.')
    }
    window.setTimeout(() => setNotice(''), 4000)
  }

  return <section className="help-section">
    <div className="help-section-heading"><h2>Contact Support</h2><p>Send us a message and we'll respond by email.</p></div>
    <ContactForm initial={{ name: user?.fullName || '', email: user?.email || '' }} onSubmit={submit} />
    {notice && <p className="help-notice" role="status">{notice}</p>}
  </section>
}
