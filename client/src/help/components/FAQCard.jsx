export default function FAQCard({ item, open, onToggle }) {
  return <div className={`faq-card ${open ? 'open' : ''}`}>
    <button className="faq-question" onClick={onToggle} aria-expanded={open}>
      <span>{item.question}</span>
      <i>{open ? '−' : '+'}</i>
    </button>
    {open && <p className="faq-answer">{item.answer}</p>}
  </div>
}
