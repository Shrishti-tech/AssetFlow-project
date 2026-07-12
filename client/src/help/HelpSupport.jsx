import { useEffect, useMemo, useState } from 'react'
import FAQ from './FAQ'
import UserGuide from './UserGuide'
import ReportIssue from './ReportIssue'
import ContactSupport from './ContactSupport'
import { helpService } from './services/helpService'
import './styles/help.css'

const tabs = [['center', 'Help Center'], ['faq', 'FAQ'], ['guide', 'User Guide'], ['issue', 'Report Issue'], ['contact', 'Contact Support']]
const quickLinks = [
  ['📖', 'User Guide', 'Step-by-step walkthroughs for every module.', 'guide'],
  ['❓', 'Frequently Asked Questions', 'Quick answers to common questions.', 'faq'],
  ['🐞', 'Report an Issue', 'Tell us about a bug or unexpected behavior.', 'issue'],
  ['📩', 'Contact Support', 'Reach the AssetFlow support team directly.', 'contact'],
  ['📄', 'System Documentation', 'Browse detailed module documentation.', 'guide'],
]

export default function HelpSupport() {
  const [tab, setTab] = useState('center')
  const [search, setSearch] = useState('')
  const [faqs, setFaqs] = useState([])
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [jump, setJump] = useState({ faqId: null, guideId: null })

  useEffect(() => {
    let active = true
    Promise.all([helpService.getFaqs(), helpService.getGuides()])
      .then(([faqRes, guideRes]) => { if (active) { setFaqs(faqRes.data.faqs || []); setGuides(guideRes.data.guides || []) } })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const query = search.trim().toLowerCase()
  const visibleFaqs = useMemo(() => faqs.filter((item) => !query || `${item.question} ${item.answer}`.toLowerCase().includes(query)), [faqs, query])
  const visibleGuides = useMemo(() => guides.filter((item) => !query || `${item.title} ${item.summary}`.toLowerCase().includes(query)), [guides, query])
  const searchResults = query ? [
    ...visibleFaqs.slice(0, 4).map((item) => ({ kind: 'faq', id: item.id, label: item.question })),
    ...visibleGuides.slice(0, 4).map((item) => ({ kind: 'guide', id: item.id, label: item.title })),
  ] : []

  const openResult = (result) => {
    if (result.kind === 'faq') { setJump({ faqId: result.id, guideId: null }); setTab('faq') }
    else { setJump({ faqId: null, guideId: result.id }); setTab('guide') }
    setSearch('')
  }

  return <main className="help-page">
    <div className="help-hero">
      <div><p>SUPPORT CENTER</p><h1>Help & Support</h1><span>Find answers, browse guides, or reach out to the AssetFlow team.</span></div>
      <div className="help-search">
        <span>🔍</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Help..." />
        {searchResults.length > 0 && <div className="help-search-results">
          {searchResults.map((result) => <button key={`${result.kind}-${result.id}`} onClick={() => openResult(result)}><i>{result.kind === 'faq' ? '❓' : '📖'}</i>{result.label}</button>)}
        </div>}
      </div>
    </div>

    <div className="help-tabs" role="tablist">{tabs.map(([id, label]) => <button role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)} key={id}>{label}</button>)}</div>

    {loading ? <p className="empty-state">Loading help center…</p> : <>
      {tab === 'center' && <section className="help-section">
        <div className="help-section-heading"><h2>How can we help?</h2><p>Jump straight to what you need.</p></div>
        <div className="help-quick-grid">
          {quickLinks.map(([icon, title, desc, target]) => <button key={title} className="help-quick-card" onClick={() => setTab(target)}><span className="help-guide-icon">{icon}</span><b>{title}</b><p>{desc}</p></button>)}
        </div>
      </section>}
      {tab === 'faq' && <FAQ items={visibleFaqs} openId={jump.faqId} onOpenChange={(id) => setJump((current) => ({ ...current, faqId: id }))} />}
      {tab === 'guide' && <UserGuide items={visibleGuides} openId={jump.guideId} onOpenChange={(id) => setJump((current) => ({ ...current, guideId: id }))} />}
      {tab === 'issue' && <ReportIssue />}
      {tab === 'contact' && <ContactSupport />}
    </>}
  </main>
}
