import { useState, useCallback } from 'react'
import { Search, UserX, UserCheck, Loader2, RefreshCw, Shield, Trash2 } from 'lucide-react'
import { useAdminUtilisateurs } from '../../hooks/useAdminData'

export default function AdminClients() {
  const [search,   setSearch]   = useState('')
  const [actionId, setActionId] = useState(null)
  const { data: clients, loading, refresh } = useAdminUtilisateurs('client', search)

  const actifs   = clients.filter(c => c.est_actif).length
  const inactifs = clients.filter(c => !c.est_actif).length
  const verifies = clients.filter(c => c.est_verifie).length

  const doAction = useCallback(async (id, est_actif) => {
    setActionId(id)
    try {
      await fetch(`/api/admin/utilisateurs/${id}/statut`, {
        method: 'PATCH', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ est_actif }),
      })
      await refresh()
    } finally { setActionId(null) }
  }, [refresh])

  const doDelete = useCallback(async (id) => {
    if (!confirm('Supprimer ce client ?')) return
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Clients</h1>
          <p className="text-gray-500 text-sm mt-0.5">{loading ? '…' : `${clients.length} clients dans la base de données`}</p>
        </div>
        <button onClick={refresh} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-all border border-gray-700">
          <RefreshCw size={13} /> Actualiser
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total',     value: loading ? '…' : clients.length, color:'text-white'     },
          { label:'Actifs',    value: loading ? '…' : actifs,          color:'text-green-400' },
          { label:'Inactifs',  value: loading ? '…' : inactifs,        color:'text-red-400'   },
          { label:'Vérifiés',  value: loading ? '…' : verifies,        color:'text-gold-400'  },
        ].map(s => (
          <div key={s.label} className="card-luxe p-4 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-600 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, téléphone, email…"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
        </div>
      </div>

      <div className="card-luxe overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800">
              <tr>{['Client','Téléphone','Email','Vérifié','Statut','Inscrit le','Actions'].map(h => (
                <th key={h} className="text-left text-gray-600 text-xs uppercase tracking-wider py-4 px-3 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading && (
                <tr><td colSpan={7} className="py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 size={16} className="animate-spin" /><span className="text-sm">Chargement…</span>
                  </div>
                </td></tr>
              )}
              {!loading && clients.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-gray-600 text-sm">Aucun client trouvé.</td></tr>
              )}
              {!loading && clients.map(c => {
                const busy = actionId === c.id
                return (
                  <tr key={c.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold shrink-0">
                          {(c.prenom?.[0] || '?').toUpperCase()}{(c.nom?.[0] || '').toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-xs font-medium">{c.prenom} {c.nom}</p>
                          <p className="text-gray-600 text-xs">{fmtDate(c.created_at)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 text-xs font-mono">{c.telephone}</td>
                    <td className="py-3.5 px-3 text-gray-500 text-xs">{c.email || '—'}</td>
                    <td className="py-3.5 px-3">
                      <span className={`text-xs flex items-center gap-1 ${c.est_verifie ? 'text-green-400' : 'text-yellow-400'}`}>
                        <Shield size={11} /> {c.est_verifie ? 'Vérifié' : 'Non vérifié'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`text-xs font-semibold ${c.est_actif ? 'text-green-400' : 'text-red-400'}`}>
                        {c.est_actif ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-600 text-xs">{fmtDate(c.created_at)}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex gap-1.5">
                        {busy
                          ? <Loader2 size={14} className="animate-spin text-gray-500 m-1" />
                          : <>
                              {c.est_actif
                                ? <button onClick={() => doAction(c.id, false)} title="Suspendre"
                                    className="p-1.5 bg-red-500/8 hover:bg-red-500/15 rounded-lg text-red-400 transition-all"><UserX size={13} /></button>
                                : <button onClick={() => doAction(c.id, true)} title="Réactiver"
                                    className="p-1.5 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 transition-all"><UserCheck size={13} /></button>
                              }
                              <button onClick={() => doDelete(c.id)} title="Supprimer"
                                className="p-1.5 bg-gray-800 hover:bg-red-500/10 rounded-lg text-gray-600 hover:text-red-400 transition-all"><Trash2 size={13} /></button>
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
