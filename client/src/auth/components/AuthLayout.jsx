import { Link, Outlet } from 'react-router-dom'
import { useState } from 'react'

export function AuthLayout() {
  const [dark, setDark] = useState(() => localStorage.getItem('assetflow_theme') === 'dark')
  const toggleTheme = () => { const next = !dark; setDark(next); localStorage.setItem('assetflow_theme', next ? 'dark' : 'light') }
  return <main className={`auth-shell ${dark ? 'dark' : ''}`}><section className="brand-panel">
    <Link to="/" className="brand"><span className="brand-mark">AF</span><span>AssetFlow<small>Enterprise Asset Management</small></span></Link>
    <div className="brand-copy"><p className="eyebrow">ERP PLATFORM</p><h1>Every asset.<br />In perfect flow.</h1><p>Securely manage assets, resources, and teams from one intelligent workspace.</p></div>
    <div className="feature-list"><span>● Role-based access</span><span>● Enterprise-ready security</span><span>● Real-time visibility</span></div>
  </section><section className="auth-panel"><button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle colour theme">{dark ? '☀' : '☾'}</button><Outlet /></section></main>
}
