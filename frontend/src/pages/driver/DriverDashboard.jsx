import { NavLink, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import {
  LayoutDashboard, Car, TrendingUp, Calendar,
  Star, Bell, Settings, LogOut, ChevronRight,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import ChatBubble from '../../components/ChatBubble'
import DashboardHome    from './DashboardHome'
import MissionsPage     from './MissionsPage'
import PerformancePage  from './PerformancePage'
import PlanningPage     from './PlanningPage'
import EvaluationsPage  from './EvaluationsPage'
import NotificationsPage from './NotificationsPage'
import ProfilChauffeur  from './ProfilChauffeur'

const NAV = [
  { to: '.',             end: true, icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: 'missions',                 icon: Car,             label: 'Mes missions',  badge: 2 },
  { to: 'performance',             icon: TrendingUp,       label: 'Performance'   },
  { to: 'planning',                icon: Calendar,         label: 'Planning'      },
  { to: 'evaluations',             icon: Star,             label: 'Évaluations'   },
  { to: 'notifications',           icon: Bell,             label: 'Notifications', badge: 3 },
  { to: 'profil',                  icon: Settings,         label: 'Mon profil'    },
]

function Sidebar({ user, onLogout }) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-gray-900/95 border-r border-gray-800 flex flex-col z-40">
      <div className="p-6 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center">
            <span className="font-display font-bold text-black text-xs">LD</span>
          </div>
          <span className="font-display font-bold text-white">Luxe<span className="text-gold-400"> Drive</span></span>
        </Link>
        <p className="text-gray-600 text-xs mt-1.5 uppercase tracking-widest">Espace Chauffeur</p>
      </div>

      {/* Avatar */}
      <div className="px-4 py-4 border-b border-gray-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shrink-0">
            <span className="text-black text-sm font-bold">
              {(user?.prenom?.[0] || 'C').toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.prenom} {user?.nom}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs">Disponible</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, end, icon: Icon, label, badge }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                  : 'text-gray-500 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <Icon size={16} className="shrink-0" />
            <span className="flex-1">{label}</span>
            {badge ? (
              <span className="bg-gold-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {badge}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 text-gray-600 hover:text-red-400 text-sm px-3 py-2 rounded-lg hover:bg-red-500/5 transition-all">
          <LogOut size={15} /> Déconnexion
        </button>
      </div>
    </aside>
  )
}

export default function DriverDashboard() {
  const { user, logout } = useAuthStore()

  useEffect(() => {
    if (!user?.id) return
    const beat = () => fetch('/api/auth/heartbeat', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ user_id: user.id }),
    }).catch(() => {})
    beat()
    const t = setInterval(beat, 30_000)
    return () => clearInterval(t)
  }, [user?.id])

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar user={user} onLogout={logout} />
      <main className="ml-60 flex-1 overflow-auto">
        <Routes>
          <Route index              element={<DashboardHome />} />
          <Route path="missions"    element={<MissionsPage />} />
          <Route path="performance" element={<PerformancePage />} />
          <Route path="planning"    element={<PlanningPage />} />
          <Route path="evaluations" element={<EvaluationsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profil"      element={<ProfilChauffeur />} />
        </Routes>
      </main>

      {/* Chat Luxe Drive — canal Chauffeurs & Management */}
      <ChatBubble canal="chauffeur_channel" label="Chauffeurs · Management Luxe Drive" />
    </div>
  )
}
