import { useState, useCallback } from 'react'
import { Search, UserCheck, UserX, Shield, RefreshCw, Loader2, Trash2, ChevronDown } from 'lucide-react'
import { useAdminUtilisateurs } from '../../hooks/useAdminData'

const ROLES = {
  client:      { label:'Client',       color:'text-blue-400',   bg:'bg-blue-500/10 border-blue-500/25' },
  chauffeur:   { label:'Chauffeur',    color:'text-green-400',  bg:'bg-green-500/10 border-green-500/25' },
  admin:       { label:'Admin',        color:'text-red-400',    bg:'bg-red-500/10 border-red-500/25' },
  super_admin: { label:'Super-Admin',  color:'text-orange-400', bg:'bg-orange-500/10 border-orange-500/25' },
}

export default function AdminUtilisateurs() {
  const [roleFilter, setRoleFilter] = useState('tous')
  const [search, setSearch]         = useState('')
  const [actionUserId, setActionId] = useState(null)
  const { data: users, loading, refresh } = useAdminUtilisateurs(roleFilter, search)

  const suspend = useCallback(async (id) => {
    setActionId(id)
    try {
      await fetch(`/api/admin/utilisateurs/${id}/statut`, {
        method: 'PATCH', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ est_actif: false }),
      })
      await refresh()
    } finally { setActionId(null) }
  }, [refresh])

  const activate = useCallback(async (id) => {
    setActionId(id)
    try {
      await fetch(`/api/admin/utilisateurs/${id}/statut`, {
        method: 'PATCH', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ est_actif: true }),
      })
      await refresh()
    } finally { setActionId(null) }
  }, [refresh])

  const remove = useCallback(async (id) => {
    if (!confirm('Supprimer ce compte définitivement ?')) return
    setActionId(id)
    try {
      await fetch(`/api/admin/utilisateurs/${id}`, { method: 'DELETE' })
      await refresh()
    } finally { setActionId(null) }
  }, [refresh])

  const fmtDate = (iso) => {
    if (!iso) return '—'
    try { return new Date(iso).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) }
    catch { return iso }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Utilisateurs</h1>
          <p className="text-gray-500 text-sm mt-0.5">{loading ? '…' : `${users.length} comptes dans la base de données`}</p>
        </div>
        <button onClick={refresh} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-all border border-gray-700">
          <RefreshCw size={13} /> Actualiser
        </button>
      </div>

      {/* KPI mini-cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total',      value: users.length,                                        color:'text-white' },
          { label:'Clients',    value: users.filter(u=>u.role==='client').length,           color:'text-blue-400' },
          { label:'Chauffeurs', value: users.filter(u=>u.role==='chauffeur').length,        color:'text-green-400' },
          { label:'Admins',     value: users.filter(u=>['admin','super_admin'].includes(u.role)).length, color:'text-red-400' },
        ].map(s => (
          <div key={s.label} className="card-luxe p-4 text-center">
            {loading
              ? <div className="h-7 w-10 bg-gray-800 rounded animate-pulse mx-auto mb-1" />
              : <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>}
            <p className="text-gray-600 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, téléphone, email…"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['tous','client','chauffeur','admin'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`text-xs px-3 py-2 rounded-lg border font-medium transition-all ${roleFilter===r?'bg-gold-500/10 text-gold-400 border-gold-500/30':'bg-gray-900 text-gray-500 border-gray-700 hover:border-gray-500'}`}>
              {r === 'tous' ? 'Tous' : ROLES[r]?.label ?? r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-luxe overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800">
              <tr>{['Utilisateur','Téléphone','Email','Rôle','Vérifié','Statut','Inscrit le','Actions'].map(h => (
                <th key={h} className="text-left text-gray-600 text-xs uppercase tracking-wider py-4 px-3 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading && (
                <tr><td colSpan={8} className="py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 size={16} className="animate-spin" /><span className="text-sm">Chargement depuis la base de données…</span>
                  </div>
                </td></tr>
              )}
              {!loading && users.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center text-gray-600 text-sm">Aucun utilisateur trouvé.</td></tr>
              )}
              {!loading && users.map(u => {
                const role = ROLES[u.role] ?? { label: u.role, color:'text-gray-400', bg:'bg-gray-800 border-gray-700' }
                const busy = actionUserId === u.id
                return (
                  <tr key={u.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 text-xs font-bold shrink-0">
                          {(u.prenom?.[0] || u.telephone?.[0] || '?').toUpperCase()}
                        </div>
                        <p className="text-white text-xs font-medium">{u.prenom} {u.nom}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 text-xs">{u.telephone}</td>
                    <td className="py-3.5 px-3 text-gray-500 text-xs">{u.email || '—'}</td>
                    <td className="py-3.5 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${role.bg} ${role.color} font-medium`}>{role.label}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`text-xs flex items-center gap-1 ${u.est_verifie ? 'text-green-400' : 'text-yellow-400'}`}>
                        <Shield size={11} /> {u.est_verifie ? 'Vérifié' : 'Non vérifié'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`text-xs font-semibold ${u.est_actif ? 'text-green-400' : 'text-red-400'}`}>
                        {u.est_actif ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-600 text-xs">{fmtDate(u.created_at)}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex gap-1.5">
                        {busy
                          ? <Loader2 size={14} className="animate-spin text-gray-500 m-1" />
                          : <>
                              {u.est_actif
                                ? <button onClick={() => suspend(u.id)} title="Suspendre"
                                    className="p-1.5 bg-red-500/8 hover:bg-red-500/20 rounded-lg text-red-400 transition-all">
                                    <UserX size={13} />
                                  </button>
                                : <button onClick={() => activate(u.id)} title="Réactiver"
                                    className="p-1.5 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 transition-all">
                                    <UserCheck size={13} />
                                  </button>
                              }
                              <button onClick={() => remove(u.id)} title="Supprimer"
                                className="p-1.5 bg-gray-800 hover:bg-red-500/10 rounded-lg text-gray-600 hover:text-red-400 transition-all">
                                <Trash2 size={13} />
                              </button>
                            </>
                        }
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
