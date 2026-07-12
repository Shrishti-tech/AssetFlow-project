import FAQCard from './components/FAQCard'

export default function FAQ({ items, openId, onOpenChange }) {
  return <section className="help-section">
    <div className="help-section-heading"><h2>Frequently Asked Questions</h2><p>Quick answers to the questions we hear most.</p></div>
    <div className="faq-list">
      {items.map((item) => <FAQCard key={item.id} item={item} open={openId === item.id} onToggle={() => onOpenChange(openId === item.id ? null : item.id)} />)}
      {!items.length && <p className="empty-state">No FAQs match your search.</p>}
    </div>
  </section>
}
