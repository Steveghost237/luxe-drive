import { useState, useCallback } from 'react'
import { Search, CheckCircle2, XCircle, Clock, Car, RefreshCw, Loader2, ChevronDown } from 'lucide-react'
import { useAdminReservations } from '../../hooks/useAdminData'

const BADGE = {
  en_attente: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  confirmee:  'bg-green-500/10 border-green-500/30 text-green-400',
  en_cours:   'bg-blue-500/10 border-blue-500/30 text-blue-400',
  terminee:   'bg-gray-500/10 border-gray-500/30 text-gray-400',
  annulee:    'bg-red-500/10 border-red-500/30 text-red-400',
}

const STATUT_LABELS = {
  en_attente: 'En attente',
  confirmee:  'Confirmée',
  en_cours:   'En cours',
  terminee:   'Terminée',
  annulee:    'Annulée',
}

const TYPE_LABELS = {
  location:  'Location',
  chauffeur: 'Chauffeur',
  achat:     'Achat',
}

export default function AdminReservations() {
  const [statutFilter, setStatutFilter] = useState('tous')
  const [search,       setSearch]       = useState('')
  const [actionId,     setActionId]     = useState(null)
  const { data: reservations, loading, refresh } = useAdminReservations(statutFilter === 'tous' ? null : statutFilter)

  const filtered = reservations.filter(r => {
    const q = `${r.client?.prenom || ''} ${r.client?.nom || ''} ${r.client?.telephone || ''} ${r.reference || ''}`.toLowerCase()
    return q.includes(search.toLowerCase())
  })

  const pending = reservations.filter(r => r.statut === 'en_attente').length

  const changeStatut = useCallback(async (id, statut) => {
    setActionId(id)
    try {
      await fetch(`/api/admin/reservations/${id}/statut`, {
        method: 'PATCH', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ statut }),
      })
      await refresh()
    } finally { setActionId(null) }
  }, [refresh])

  const fmtDate = (iso) => {
    if (!iso) return '—'
    try { return new Date(iso).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) }
    catch { return iso }
  }

  const fmtMontant = (n) => n > 0 ? `${n.toLocaleString('fr-FR')} FCFA` : '—'

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Réservations</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {loading ? '…' : `${reservations.length} réservation(s) dans la base de données`}
            {pending > 0 && <span className="ml-2 text-yellow-400 font-semibold">· {pending} en attente</span>}
          </p>
        </div>
        <button onClick={refresh} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-all border border-gray-700">
          <RefreshCw size={13} /> Actualiser
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Client, téléphone, référence…"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['tous','en_attente','confirmee','en_cours','terminee','annulee'].map(s => (
            <button key={s} onClick={() => setStatutFilter(s)}
              className={`text-xs px-3 py-2 rounded-lg border font-medium transition-all ${statutFilter===s?'bg-gold-500/10 text-gold-400 border-gold-500/30':'bg-gray-900 text-gray-500 border-gray-700 hover:border-gray-500'}`}>
              {s === 'tous' ? 'Toutes' : STATUT_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-luxe overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800">
              <tr>{['Référence','Client','Type','Dates','Montant','Statut','Date création','Actions'].map(h => (
                <th key={h} className="text-left text-gray-600 text-xs uppercase tracking-wider py-4 px-3 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading && (
                <tr><td colSpan={8} className="py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 size={16} className="animate-spin" /><span className="text-sm">Chargement…</span>
                  </div>
                </td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={8} className="py-12 text-center">
                  <Clock size={32} className="text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Aucune réservation trouvée.</p>
                </td></tr>
              )}
              {!loading && filtered.map(r => {
                const busy = actionId === r.id
                const client = r.client
                return (
                  <tr key={r.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-3">
                      <p className="text-gold-400 text-xs font-mono font-semibold">{r.reference}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="text-white text-xs font-medium">{client?.prenom} {client?.nom}</p>
                      <p className="text-gray-500 text-xs">{client?.telephone}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300 font-medium">
                        {TYPE_LABELS[r.type_reservation] ?? r.type_reservation}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-500 text-xs">
                      <div>{fmtDate(r.date_debut)}</div>
                      {r.date_fin && <div className="text-gray-600">→ {fmtDate(r.date_fin)}</div>}
                    </td>
                    <td className="py-3.5 px-3 text-gold-400 text-xs font-semibold">{fmtMontant(r.total)}</td>
                    <td className="py-3.5 px-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${BADGE[r.statut] ?? ''}`}>
                        {STATUT_LABELS[r.statut] ?? r.statut}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-600 text-xs">{fmtDate(r.created_at)}</td>
                    <td className="py-3.5 px-3">
                      {busy
                        ? <Loader2 size={14} className="animate-spin text-gray-500" />
                        : (
                          <div className="flex gap-1.5">
                            {r.statut === 'en_attente' && <>
                              <button onClick={() => changeStatut(r.id, 'confirmee')}
                                className="flex items-center gap-1 px-2 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-xs font-semibold transition-all">
                                <CheckCircle2 size={11}/> Confirmer
                              </button>
                              <button onClick={() => changeStatut(r.id, 'annulee')}
                                className="flex items-center gap-1 px-2 py-1.5 bg-red-500/8 hover:bg-red-500/15 border border-red-500/20 rounded-lg text-red-400 text-xs transition-all">
                                <XCircle size={11}/> Annuler
                              </button>
                            </>}
                            {r.statut === 'confirmee' && (
                              <button onClick={() => changeStatut(r.id, 'en_cours')}
                                className="flex items-center gap-1 px-2 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 text-xs transition-all">
                                Démarrer
                              </button>
                            )}
                            {r.statut === 'en_cours' && (
                              <button onClick={() => changeStatut(r.id, 'terminee')}
                                className="flex items-center gap-1 px-2 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 text-xs transition-all">
                                Terminer
                              </button>
                            )}
                          </div>
                        )
                      }
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
