import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/hooks/useAuth'
import './Dashboard.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import KPICards from './components/KPICards'
import QuickActions from './components/QuickActions'
import RecentActivity from './components/RecentActivity'
import UpcomingReturns from './components/UpcomingReturns'
import NotificationPanel from './components/NotificationPanel'
import DashboardCharts from './components/DashboardCharts'
import { api } from '../auth/services/authService'

const notifications = [
  { id: 1, title: 'Return due tomorrow', text: 'Dell Latitude 7420 is due from Priya Sharma.', time: '12 min ago', type: 'warning', read: false },
  { id: 2, title: 'Maintenance completed', text: 'Projector X200 is available for allocation.', time: '1 hr ago', type: 'success', read: false },
  { id: 3, title: 'Transfer approved', text: 'Three monitors were assigned to Finance.', time: '3 hrs ago', type: 'info', read: true },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [activePage, setActivePage] = useState('Overview')
  const [search, setSearch] = useState('')
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [items, setItems] = useState(notifications)
  const [actionMessage, setActionMessage] = useState('')

  const unreadCount = useMemo(() => items.filter((item) => !item.read).length, [items])
  useEffect(() => { api.get('/notifications').then(({ data }) => { if (data.notifications?.length) setItems(data.notifications.map((item) => ({ id: item._id, title: item.title, text: item.message, time: new Date(item.createdAt).toLocaleString(), type: item.type, read: item.read }))) }).catch(() => {}) }, [])
  const signOut = async () => { await logout(); navigate('/login') }
  const routes = { Overview: '/dashboard', Assets: '/assets', Allocation: '/allocation', Bookings: '/bookings', Maintenance: '/maintenance', Transfers: '/transfers', Organization: '/organization', Reports: '/reports', Notifications: '/notifications', 'Help & support': '/help' }
  const selectPage = (page) => { setActivePage(page); setSidebarOpen(false); navigate(routes[page] || '/dashboard') }
  const runAction = (label) => {
    const actionRoutes = { 'Register Asset': '/assets/new', 'Book Resource': '/bookings/new', 'Raise Maintenance Request': '/maintenance/new' }
    const destination = actionRoutes[label]
    if (destination) return navigate(destination)
    setActionMessage(`${label} workspace is ready for you.`)
    window.setTimeout(() => setActionMessage(''), 3200)
  }

  return <div className={`erp-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
    <Sidebar activePage={activePage} isOpen={sidebarOpen} collapsed={collapsed} onSelect={selectPage} onClose={() => setSidebarOpen(false)} onToggle={() => setCollapsed((value) => !value)} />
    <div className="erp-main">
      <Navbar user={user} search={search} onSearch={setSearch} unreadCount={unreadCount} notificationsOpen={noticeOpen} onToggleNotifications={() => setNoticeOpen((value) => !value)} onMenu={() => setSidebarOpen(true)} onLogout={signOut} />
      <main className="erp-content">
        <div className="page-intro">
          <div><p className="page-kicker">{activePage === 'Overview' ? 'OPERATIONS OVERVIEW' : 'WORKSPACE'}</p><h1>{activePage === 'Overview' ? `Good morning, ${user?.fullName?.split(' ')[0] || 'there'}` : activePage}</h1><p>Here’s what’s happening across your organization today.</p></div>
          <button className="date-chip" type="button">◷ Today, 12 Jul 2026</button>
        </div>
        <KPICards search={search} onSelect={(label) => runAction(`${label} details`)} />
        <section className="dashboard-grid-main">
          <DashboardCharts />
          <NotificationPanel open={noticeOpen} items={items} onClose={() => setNoticeOpen(false)} onRead={(id) => { api.put(`/notifications/${id}/read`).catch(() => {}); setItems((current) => current.map((item) => item.id === id ? { ...item, read: true } : item)) }} onReadAll={() => setItems((current) => current.map((item) => ({ ...item, read: true })))} />
          <QuickActions onAction={runAction} />
          <UpcomingReturns />
          <RecentActivity />
        </section>
      </main>
    </div>
    {actionMessage && <div className="dashboard-toast" role="status">✓ {actionMessage}</div>}
  </div>
}
