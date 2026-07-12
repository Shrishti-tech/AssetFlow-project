import HelpCard from './components/HelpCard'

export default function UserGuide({ items, openId, onOpenChange }) {
  const open = items.find((item) => item.id === openId)
  return <section className="help-section">
    <div className="help-section-heading"><h2>User Guide</h2><p>Step-by-step walkthroughs for every module.</p></div>
    <div className="help-guide-grid">
      {items.map((item) => <HelpCard key={item.id} guide={item} onOpen={() => onOpenChange(item.id)} />)}
      {!items.length && <p className="empty-state">No guides match your search.</p>}
    </div>
    {open && <div className="help-modal-backdrop" role="presentation" onClick={() => onOpenChange(null)}>
      <div className="help-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <div className="help-modal-heading">
          <div><span className="help-guide-icon">{open.icon}</span><h2>{open.title}</h2></div>
          <button onClick={() => onOpenChange(null)}>×</button>
        </div>
        <p>{open.summary}</p>
        <ol className="help-guide-steps">{open.steps.map((step, index) => <li key={index}>{step}</li>)}</ol>
      </div>
    </div>}
  </section>
}
