import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, Routes, Route, useNavigate, Link } from 'react-router-dom'
import {
  Car, Users, CalendarCheck, CreditCard, TrendingUp, LogOut,
  Settings, DollarSign, Shield, UserCheck, AlertTriangle,
  FileText, Zap, LayoutDashboard, UserCog, Images, RefreshCw, Loader2,
  MapPin, Wifi, WifiOff, Clock, Navigation,
} from 'lucide-react'
import useAuthStore  from '../../store/authStore'
import useAdminStore from '../../store/adminStore'
import { useAdminStats, useConnectedUsers, useChauffeurLocations, useAdminMissionsLive } from '../../hooks/useAdminData'
import ChatBubble from '../../components/ChatBubble'
import AdminChauffeurs    from './AdminChauffeurs'
import AdminProprietaires from './AdminProprietaires'
import AdminClients       from './AdminClients'
import AdminVehicules     from './AdminVehicules'
import AdminPaiements     from './AdminPaiements'
import AdminParametres    from './AdminParametres'
import AdminReservations       from './AdminReservations'
import AdminVehiculesGalerie  from './AdminVehiculesGalerie'
import AdminUtilisateurs     from './AdminUtilisateurs'

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color, badge, to }) => {
  const inner = (
    <>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs">{label}</p>
        <p className="text-white text-2xl font-bold mt-0.5">{value ?? '—'}</p>
        {sub && <p className="text-gray-600 text-xs mt-0.5">{sub}</p>}
        {to && <p className="text-gold-500 text-xs mt-1 font-medium">Voir détail →</p>}
      </div>
      {badge > 0 && (
        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </>
  )
  if (to) return (
    <Link to={to} className="card-luxe p-5 flex items-start gap-4 relative overflow-hidden hover:border-gold-500/30 cursor-pointer transition-all">
      {inner}
    </Link>
  )
  return <div className="card-luxe p-5 flex items-start gap-4 relative overflow-hidden">{inner}</div>
}

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUT_MISSION = {
  en_attente: { label: 'En attente',  cls: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25' },
  confirmee:  { label: 'Confirmée',   cls: 'bg-blue-500/15 text-blue-300 border-blue-500/25'       },
  en_cours:   { label: 'En cours',    cls: 'bg-green-500/15 text-green-300 border-green-500/25'    },
  terminee:   { label: 'Terminée',    cls: 'bg-gray-600 text-gray-300 border-gray-500'             },
  annulee:    { label: 'Annulée',     cls: 'bg-red-500/15 text-red-300 border-red-500/25'          },
}

// ── Overview tab ──────────────────────────────────────────────────────────────
function Overview() {
  const { stats, loading, lastRefresh, refresh } = useAdminStats()
  const { data: connected,   loading: loadConn  } = useConnectedUsers()
  const { data: locations,   loading: loadLoc   } = useChauffeurLocations()
  const { data: missions,    loading: loadMiss  } = useAdminMissionsLive()

  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`

  const u = stats?.utilisateurs ?? {}
  const r = stats?.reservations ?? {}
  const v = stats?.vehicules    ?? {}

  const missionsActives = missions.filter(m => ['en_attente','confirmee','en_cours'].includes(m.statut))
  const connClients    = connected.filter(u => u.role === 'client')
  const connChauf      = connected.filter(u => u.role === 'chauffeur')
  const connAdmins     = connected.filter(u => ['admin','super_admin'].includes(u.role))

  const fmtTime = (iso) => {
    if (!iso) return '—'
    try { return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
    catch { return '—' }
  }
  const timeSince = (iso) => {
    if (!iso) return ''
    const d = Math.round((Date.now() - new Date(iso)) / 60000)
    if (d < 1) return 'à l\'instant'
    if (d === 1) return 'il y a 1 min'
    if (d < 60) return `il y a ${d} min`
    return `il y a ${Math.floor(d/60)}h`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Tableau de bord</h1>
          <p className="text-gray-500 text-sm mt-0.5">Données en temps réel — Luxe Drive</p>
        </div>
        <div className="flex items-center gap-3">
          {r.en_attente > 0 && (
            <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/25 rounded-xl px-3 py-2">
              <AlertTriangle size={14} className="text-yellow-400" />
              <span className="text-yellow-400 text-sm font-semibold">{r.en_attente} en attente</span>
            </div>
          )}
          <button onClick={refresh} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white bg-gray-800 px-3 py-2 rounded-lg border border-gray-700 transition-all">
            <RefreshCw size={12} />{loading ? 'Chargement…' : 'Forcer MAJ'}
          </button>
        </div>
      </div>

      {/* Live clock */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-gray-500 text-xs font-mono">{timeStr}</span>
        </div>
        {lastRefresh && <span className="text-gray-700 text-xs">Sync : {lastRefresh.toLocaleTimeString('fr-FR')}</span>}
        {loading && <Loader2 size={13} className="animate-spin text-gray-600" />}
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users}        label="Total utilisateurs"  value={loading ? '…' : u.total}      color="bg-white/5 text-white"           to="utilisateurs" />
        <StatCard icon={Users}        label="Clients"             value={loading ? '…' : u.clients}    color="bg-blue-500/10 text-blue-400"    to="utilisateurs" />
        <StatCard icon={Users}        label="Chauffeurs"          value={loading ? '…' : u.chauffeurs} color="bg-green-500/10 text-green-400"  to="chauffeurs" />
        <StatCard icon={Car}          label="Véhicules"           value={loading ? '…' : v.total}      color="bg-gold-500/10 text-gold-400"    to="vehicules" />
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={CalendarCheck} label="Total réservations"  value={loading ? '…' : r.total}        color="bg-purple-500/10 text-purple-400" badge={r.en_attente} to="reservations" />
        <StatCard icon={AlertTriangle} label="En attente"          value={loading ? '…' : r.en_attente}   color="bg-yellow-500/10 text-yellow-400" to="reservations" />
        <StatCard icon={Navigation}    label="En cours"            value={loading ? '…' : r.en_cours}     color="bg-green-500/10 text-green-400"   to="reservations" />
        <StatCard icon={DollarSign}    label="Revenu (FCFA)"       value={loading ? '…' : (r.revenu_total??0).toLocaleString('fr-FR')} color="bg-gold-500/10 text-gold-400" />
      </div>

      {/* Row: Missions live + Connectés */}
      <div className="grid xl:grid-cols-2 gap-6">

        {/* ── Missions live ─────────────────────────────────────────────────── */}
        <div className="card-luxe p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <h3 className="font-semibold text-white text-sm">Missions actives</h3>
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{missionsActives.length}</span>
            </div>
            <NavLink to="reservations" className="text-xs text-gold-400 hover:text-gold-300">Tout voir →</NavLink>
          </div>
          {loadMiss
            ? <div className="space-y-2">{[...Array(3)].map((_,i) => <div key={i} className="h-10 bg-gray-800 rounded-lg animate-pulse" />)}</div>
            : missionsActives.length === 0
              ? <p className="text-gray-600 text-sm text-center py-6">Aucune mission active pour le moment</p>
              : <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {missionsActives.map(m => {
                    const st = STATUT_MISSION[m.statut] || STATUT_MISSION.en_attente
                    return (
                      <div key={m.id} className="flex items-center justify-between bg-gray-900/60 rounded-lg px-3 py-2.5 border border-gray-800">
                        <div className="min-w-0">
                          <p className="text-white text-xs font-medium truncate">{m.reference || m.id?.slice(0,8)}</p>
                          <p className="text-gray-600 text-[11px] truncate">
                            {m.client?.prenom} {m.client?.nom} · {fmtTime(m.created_at)}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${st.cls}`}>{st.label}</span>
                      </div>
                    )
                  })}
                </div>
          }
        </div>

        {/* ── Utilisateurs connectés ────────────────────────────────────────── */}
        <div className="card-luxe p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <h3 className="font-semibold text-white text-sm">En ligne maintenant</h3>
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{connected.length}</span>
          </div>
          {loadConn
            ? <div className="space-y-2">{[...Array(3)].map((_,i) => <div key={i} className="h-8 bg-gray-800 rounded-lg animate-pulse" />)}</div>
            : connected.length === 0
              ? (
                <div className="flex flex-col items-center gap-2 py-6">
                  <WifiOff size={24} className="text-gray-700" />
                  <p className="text-gray-600 text-sm">Aucun utilisateur connecté récemment</p>
                  <p className="text-gray-700 text-xs">Les connexions apparaissent via heartbeat (web/mobile)</p>
                </div>
              )
              : (
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {connected.map(u => {
                    const roleStyle = u.role === 'super_admin' ? 'text-red-400' : u.role === 'admin' ? 'text-gold-400' : u.role === 'chauffeur' ? 'text-blue-400' : 'text-gray-400'
                    return (
                      <div key={u.id} className="flex items-center gap-2.5 bg-gray-900/60 rounded-lg px-2.5 py-2 border border-gray-800">
                        <div className="relative shrink-0">
                          <div className={`w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold ${roleStyle}`}>
                            {(u.prenom?.[0]||'?').toUpperCase()}
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-gray-950" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white text-xs font-medium truncate">{u.prenom} {u.nom}</p>
                          <p className={`text-[10px] ${roleStyle}`}>{u.role}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-gray-600 text-[10px]">{timeSince(u.last_seen)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
          }
          <div className="flex gap-4 mt-3 pt-3 border-t border-gray-800">
            {[
              { label:'Clients', count:connClients.length,  color:'text-gray-400' },
              { label:'Chauffeurs', count:connChauf.length, color:'text-blue-400' },
              { label:'Admins', count:connAdmins.length,    color:'text-gold-400' },
            ].map(s => (
              <div key={s.label} className="flex-1 text-center">
                <p className={`text-lg font-bold ${s.color}`}>{s.count}</p>
                <p className="text-gray-600 text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Localisation chauffeurs ────────────────────────────────────────── */}
      <div className="card-luxe p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-gold-400" />
            <h3 className="font-semibold text-white text-sm">Localisation chauffeurs en temps réel</h3>
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{locations.length} chauffeurs</span>
          </div>
          <NavLink to="chauffeurs" className="text-xs text-gold-400 hover:text-gold-300">Gérer →</NavLink>
        </div>
        {loadLoc
          ? <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">{[...Array(4)].map((_,i)=><div key={i} className="h-20 bg-gray-800 rounded-xl animate-pulse" />)}</div>
          : locations.length === 0
            ? <p className="text-gray-600 text-sm text-center py-6">Aucun chauffeur enregistré</p>
            : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {locations.map(c => {
                  const hasGps = c.latitude != null && c.longitude != null
                  const isOnline = c.last_seen && (Date.now() - new Date(c.last_seen)) < 10 * 60 * 1000
                  return (
                    <div key={c.id} className={`rounded-xl p-3.5 border ${ c.est_disponible ? 'border-green-500/25 bg-green-500/5' : 'border-gray-800 bg-gray-900/50'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gold-400 shrink-0">
                          {(c.prenom?.[0]||'?').toUpperCase()}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${ c.est_disponible ? 'bg-green-500/15 text-green-300 border-green-500/25' : 'bg-gray-700 text-gray-400 border-gray-600'}`}>
                            {c.est_disponible ? 'Dispo' : 'Occupé'}
                          </span>
                          {isOnline && <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /><span className="text-green-400 text-[9px]">En ligne</span></span>}
                        </div>
                      </div>
                      <p className="text-white text-xs font-medium truncate">{c.prenom} {c.nom}</p>
                      <p className="text-gray-600 text-[10px] truncate mb-2">{c.telephone}</p>
                      {hasGps
                        ? <div className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 rounded-lg px-2 py-1">
                            <Navigation size={9} className="text-blue-400 shrink-0" />
                            <span className="text-[9px] text-blue-300 font-mono truncate">{c.latitude?.toFixed(4)}, {c.longitude?.toFixed(4)}</span>
                          </div>
                        : <div className="flex items-center gap-1 bg-gray-800 rounded-lg px-2 py-1">
                            <MapPin size={9} className="text-gray-600 shrink-0" />
                            <span className="text-[10px] text-gray-600">GPS non disponible</span>
                          </div>
                      }
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-gray-600">{c.nombre_courses} courses</span>
                        <span className="text-[10px] text-gold-400 font-semibold">★ {c.note_moyenne?.toFixed(1)||'—'}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
        }
      </div>

      {/* Alertes */}
      {r.en_attente > 0 && (
        <div className="card-luxe p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} className="text-yellow-400" />
            <h3 className="font-semibold text-white text-sm">Actions requises</h3>
          </div>
          <div className="space-y-2">
            <AlertRow label={`${r.en_attente} réservation(s) en attente de traitement`} link="reservations" />
          </div>
        </div>
      )}
    </div>
  )
}

function AlertRow({ label, link, urgent }) {
  return (
    <div className={`flex items-center justify-between rounded-lg px-3 py-2 ${urgent ? 'bg-red-500/8 border border-red-500/20' : 'bg-yellow-500/5 border border-yellow-500/15'}`}>
      <span className={`text-xs ${urgent ? 'text-red-300' : 'text-yellow-300'}`}>{label}</span>
      <NavLink to={link} className={`text-xs font-semibold ${urgent ? 'text-red-400 hover:text-red-300' : 'text-yellow-400 hover:text-yellow-300'}`}>Traiter →</NavLink>
    </div>
  )
}

// ── Main layout ───────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, logout } = useAuthStore()
  const navigate          = useNavigate()
  const isSA              = user?.role === 'super_admin'

  useEffect(() => {
    if (!user?.id) return
    const beat = () => fetch('/api/auth/heartbeat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id }),
    }).catch(() => {})
    beat()
    const t = setInterval(beat, 30_000)
    return () => clearInterval(t)
  }, [user?.id])

  const NAV = [
    { to:'.', end:true, icon:LayoutDashboard, label:'Tableau de bord',  roles:['admin','super_admin'] },
    { to:'utilisateurs', icon:Users,           label:'Utilisateurs (DB)', roles:['admin','super_admin'] },
    { to:'chauffeurs',   icon:Users,           label:'Chauffeurs',        roles:['admin','super_admin'] },
    { to:'proprietaires',icon:UserCheck,       label:'Propriétaires',     roles:['admin','super_admin'] },
    { to:'clients',      icon:Users,           label:'Clients',           roles:['admin','super_admin'] },
    { to:'vehicules',    icon:Car,             label:'Véhicules',         roles:['admin','super_admin'] },
    { to:'galerie',      icon:Images,          label:'Galeries photos',   roles:['admin','super_admin'] },
    { to:'reservations', icon:CalendarCheck,   label:'Réservations',      roles:['admin','super_admin'] },
    { to:'paiements',    icon:DollarSign,      label:'Finances',          roles:['admin','super_admin'] },
    { to:'moteur',       icon:Zap,             label:'Contrôle moteur',   roles:['super_admin'] },
    { to:'administrateurs',icon:UserCog,       label:'Administrateurs',   roles:['super_admin'] },
    { to:'parametres',   icon:Settings,        label:'Paramètres',        roles:['admin','super_admin'] },
  ].filter(n => n.roles.includes(user?.role))

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-60 bg-gray-900 border-r border-gray-800 flex flex-col z-30">
        <div className="p-5 border-b border-gray-800">
          <span className="font-display text-lg font-bold text-gold-400">Luxe Drive</span>
          <div className="flex items-center gap-1.5 mt-1">
            <Shield size={11} className={isSA ? 'text-red-400' : 'text-blue-400'} />
            <p className="text-xs font-semibold" style={{ color: isSA ? '#f87171' : '#60a5fa' }}>
              {isSA ? 'Super-Administrateur' : 'Administrateur'}
            </p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, end, icon:Icon, label }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gold-500/10 text-gold-400 border border-gold-500/15'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }>
              <Icon size={14} className="shrink-0" /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2.5 mb-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isSA ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{user?.prenom} {user?.nom}</p>
              <p className="text-gray-600 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 text-gray-500 hover:text-red-400 text-xs transition-colors px-2 py-1.5 rounded-lg hover:bg-red-500/5">
            <LogOut size={13} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-60 flex-1 overflow-auto min-h-screen">
        <Routes>
          <Route index               element={<Overview />} />
          <Route path="chauffeurs"   element={<AdminChauffeurs />} />
          <Route path="proprietaires"element={<AdminProprietaires />} />
          <Route path="clients"      element={<AdminClients />} />
          <Route path="utilisateurs" element={<AdminUtilisateurs />} />
          <Route path="vehicules"    element={<AdminVehicules />} />
          <Route path="galerie"      element={<AdminVehiculesGalerie />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="paiements"    element={<AdminPaiements />} />
          <Route path="moteur"       element={<AdminMoteur />} />
          <Route path="administrateurs" element={<AdminAdmins />} />
          <Route path="parametres"   element={<AdminParametres />} />
        </Routes>
      </main>

      {/* Chat Luxe Drive — canal exclusif Admin / Super-Admin */}
      <ChatBubble canal="admin_internal" label="Communication Admin · Super Admin" />
    </div>
  )
}

// ── Contrôle moteur (super_admin) ─────────────────────────────────────────────
function AdminMoteur() {
  const { engineRequests, vehicules, approuverCoupureMoteur, refuserCoupureMoteur, demanderCoupureMoteur } = useAdminStore()
  const adminName = useAuthStore(s => `${s.user?.prenom} ${s.user?.nom}`)
  const [reason, setReason] = useState('')
  const [selVehicle, setSelVehicle] = useState('')

  const validVehicles = vehicules.filter(v => v.validation === 'valide' && v.statut !== 'bloque')

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2"><Zap size={20} className="text-red-400" /> Contrôle moteur à distance</h1>
        <p className="text-gray-500 text-sm mt-1">Réservé au Super-Administrateur. Chaque action est journalisée.</p>
      </div>

      {/* Demandes en attente */}
      <div className="card-luxe p-6 mb-6">
        <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2"><AlertTriangle size={14} className="text-yellow-400" />Demandes en attente</h3>
        {engineRequests.filter(r => r.statut === 'en_attente').length === 0
          ? <p className="text-gray-600 text-sm text-center py-6">Aucune demande en attente.</p>
          : engineRequests.filter(r => r.statut === 'en_attente').map(r => (
            <div key={r.id} className="flex items-start justify-between gap-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl mb-3">
              <div>
                <p className="text-white text-sm font-semibold">{r.vehicleName}</p>
                <p className="text-gray-400 text-xs mt-0.5">Demande de : <span className="text-white">{r.requester}</span></p>
                <p className="text-gray-500 text-xs mt-0.5">Motif : {r.reason}</p>
                <p className="text-gray-600 text-xs mt-0.5">{r.date}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => approuverCoupureMoteur(r.id, adminName)} className="px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 rounded-lg text-red-400 text-xs font-semibold transition-all">Couper moteur</button>
                <button onClick={() => refuserCoupureMoteur(r.id, adminName)} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 text-xs transition-all">Refuser</button>
              </div>
            </div>
          ))
        }
      </div>

      {/* Initier une demande */}
      <div className="card-luxe p-6 mb-6">
        <h3 className="font-semibold text-white text-sm mb-4">Initier une coupure moteur</h3>
        <div className="flex gap-3 flex-wrap">
          <select value={selVehicle} onChange={e => setSelVehicle(e.target.value)} className="flex-1 min-w-[200px] bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-gold-500/50 outline-none">
            <option value="">Sélectionner un véhicule…</option>
            {validVehicles.map(v => <option key={v.id} value={v.id}>{v.marque} {v.modele} · {v.plaque}</option>)}
          </select>
          <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Motif de la coupure…" className="flex-1 min-w-[200px] bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
          <button disabled={!selVehicle || !reason} onClick={() => { demanderCoupureMoteur(selVehicle, reason, adminName); setSelVehicle(''); setReason('') }} className="btn-gold px-5 py-2.5 text-sm disabled:opacity-40">Envoyer demande</button>
        </div>
      </div>

      {/* Historique */}
      <div className="card-luxe p-6">
        <h3 className="font-semibold text-white text-sm mb-4">Historique des demandes</h3>
        <div className="space-y-2">
          {engineRequests.filter(r => r.statut !== 'en_attente').map(r => (
            <div key={r.id} className="flex items-center gap-3 text-xs py-2 border-b border-gray-800/60 last:border-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${r.statut === 'approuve' ? 'bg-red-400' : 'bg-gray-500'}`} />
              <span className="text-gray-400">{r.date}</span>
              <span className="text-white">{r.vehicleName}</span>
              <span className={`ml-auto font-semibold ${r.statut === 'approuve' ? 'text-red-400' : 'text-gray-500'}`}>{r.statut === 'approuve' ? 'Approuvé' : 'Refusé'}</span>
            </div>
          ))}
          {engineRequests.filter(r => r.statut !== 'en_attente').length === 0 && <p className="text-gray-600 text-sm text-center py-6">Aucun historique.</p>}
        </div>
      </div>
    </div>
  )
}

// ── Gestion admins (super_admin) ──────────────────────────────────────────────
function AdminAdmins() {
  const { admins, creerAdmin, suspendreAdmin, supprimerAdmin } = useAdminStore()
  const adminName = useAuthStore(s => `${s.user?.prenom} ${s.user?.nom}`)
  const [form, setForm] = useState({ prenom:'', nom:'', email:'', permissions:[] })
  const [showForm, setShowForm] = useState(false)

  const PERMS = ['chauffeurs','proprietaires','clients','vehicules','finances']

  const togglePerm = (p) => setForm(f => ({
    ...f,
    permissions: f.permissions.includes(p) ? f.permissions.filter(x=>x!==p) : [...f.permissions, p]
  }))

  const handleCreate = () => {
    if (!form.prenom || !form.nom || !form.email) return
    creerAdmin(form, adminName)
    setForm({ prenom:'', nom:'', email:'', permissions:[] })
    setShowForm(false)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2"><UserCog size={20} className="text-blue-400" />Gestion des administrateurs</h1>
          <p className="text-gray-500 text-sm mt-1">Seul le Super-Administrateur peut gérer les admins.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-gold px-4 py-2 text-sm">+ Nouvel admin</button>
      </div>

      {showForm && (
        <div className="card-luxe p-6 mb-6">
          <h3 className="font-semibold text-white text-sm mb-4">Créer un administrateur</h3>
          <div className="grid sm:grid-cols-3 gap-3 mb-4">
            {['prenom','nom','email'].map(f => (
              <input key={f} placeholder={f.charAt(0).toUpperCase()+f.slice(1)} value={form[f]} onChange={e => setForm(p=>({...p,[f]:e.target.value}))}
                className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
            ))}
          </div>
          <div className="mb-4">
            <p className="text-gray-500 text-xs mb-2">Permissions</p>
            <div className="flex flex-wrap gap-2">
              {PERMS.map(p => (
                <button key={p} onClick={() => togglePerm(p)} className={`text-xs px-3 py-1.5 rounded-lg border transition-all capitalize ${form.permissions.includes(p) ? 'bg-gold-500/10 text-gold-400 border-gold-500/30' : 'bg-gray-900 text-gray-500 border-gray-700'}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCreate} className="btn-gold px-4 py-2 text-sm">Créer l'administrateur</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost px-4 py-2 text-sm">Annuler</button>
          </div>
        </div>
      )}

      <div className="card-luxe overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800">
            <tr>{['Administrateur','Email','Rôle','Permissions','Créé le','Statut','Actions'].map(h => (
              <th key={h} className="text-left text-gray-600 text-xs uppercase tracking-wider py-4 px-3 font-medium">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {admins.map(a => (
              <tr key={a.id} className="hover:bg-white/2">
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${a.role === 'super_admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{a.prenom[0]}{a.nom[0]}</div>
                    <p className="text-white text-xs font-medium">{a.prenom} {a.nom}</p>
                  </div>
                </td>
                <td className="py-3.5 px-3 text-gray-500 text-xs">{a.email}</td>
                <td className="py-3.5 px-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${a.role === 'super_admin' ? 'bg-red-500/10 text-red-400 border-red-500/25' : 'bg-blue-500/10 text-blue-400 border-blue-500/25'}`}>{a.role === 'super_admin' ? 'Super-Admin' : 'Admin'}</span>
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex flex-wrap gap-1">
                    {a.permissions.includes('*') ? <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/25 px-2 py-0.5 rounded-full">Tous les droits</span>
                      : a.permissions.map(p => <span key={p} className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded capitalize">{p}</span>)}
                  </div>
                </td>
                <td className="py-3.5 px-3 text-gray-600 text-xs">{a.creeLe}</td>
                <td className="py-3.5 px-3"><span className={`text-xs font-semibold ${a.statut==='actif'?'text-green-400':'text-red-400'}`}>{a.statut}</span></td>
                <td className="py-3.5 px-3">
                  {a.role !== 'super_admin' && (
                    <div className="flex gap-2">
                      {a.statut === 'actif' && <button onClick={() => suspendreAdmin(a.id, adminName)} className="p-1.5 bg-yellow-500/8 hover:bg-yellow-500/15 rounded-lg text-yellow-400 text-xs transition-all" title="Suspendre">⏸</button>}
                      <button onClick={() => supprimerAdmin(a.id, adminName)} className="p-1.5 bg-red-500/8 hover:bg-red-500/15 rounded-lg text-red-400 text-xs transition-all" title="Supprimer">✕</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

