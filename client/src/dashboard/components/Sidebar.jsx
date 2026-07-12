const items = [['Overview', '⌂'], ['Assets', '▣'], ['Allocation', '⇄'], ['Bookings', '◷'], ['Maintenance', '⌁'], ['Transfers', '↗'], ['Organization', '♙'], ['Reports', '▤'], ['Audits', '✓']]

export default function Sidebar({ activePage, isOpen, collapsed, onSelect, onClose, onToggle }) {
  return <aside className={`erp-sidebar ${isOpen ? 'is-open' : ''}`}>
    <div className="sidebar-brand"><span className="sidebar-logo">AF</span><span className="sidebar-brand-copy">AssetFlow<small>ERP WORKSPACE</small></span><button className="mobile-close" onClick={onClose} aria-label="Close menu">×</button></div>
    <nav className="sidebar-nav">{items.map(([label, icon]) => <button key={label} className={activePage === label ? 'active' : ''} onClick={() => onSelect(label)} title={label}><span>{icon}</span><b>{label}</b>{label === 'Maintenance' && <i>3</i>}</button>)}</nav>
    <div className="sidebar-bottom"><button onClick={() => onSelect('Help & support')}><span>?</span><b>Help & support</b></button><button onClick={onToggle} className="collapse-button"><span>‹</span><b>Collapse menu</b></button></div>
  </aside>
}
