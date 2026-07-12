export default function HelpCard({ guide, onOpen }) {
  return <button className="help-guide-card" onClick={onOpen}>
    <span className="help-guide-icon">{guide.icon}</span>
    <b>{guide.title}</b>
    <p>{guide.summary}</p>
  </button>
}
