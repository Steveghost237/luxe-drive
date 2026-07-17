import { useState } from 'react'
import { Search, CheckCircle2, XCircle, Car, Trash2 } from 'lucide-react'
import useAdminStore from '../../store/adminStore'
import useAuthStore  from '../../store/authStore'

const VALIDATION = {
  valide:     { label:'Validé',     bg:'bg-green-500/10 border-green-500/30 text-green-400'    },
  en_attente: { label:'En attente', bg:'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
  refuse:     { label:'Refusé',     bg:'bg-red-500/10 border-red-500/30 text-red-400'          },
}

const STATUTS_VEH = {
  disponible:  { label:'Disponible',  color:'text-green-400'  },
  en_mission:  { label:'En mission',  color:'text-blue-400'   },
  maintenance: { label:'Maintenance', color:'text-orange-400' },
  bloque:      { label:'Bloqué',      color:'text-red-400'    },
}

export default function AdminVehicules() {
  const { vehicules, proprietaires, chauffeurs, validerVehicule, refuserVehicule } = useAdminStore()
  const adminName = useAuthStore(s => `${s.user?.prenom} ${s.user?.nom}`)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('tous')

  const filtered = vehicules.filter(v => {
    const pr = proprietaires.find(p => p.id === v.proprietaireId)
    const q = `${v.marque} ${v.modele} ${v.plaque} ${pr?.prenom} ${pr?.nom}`.toLowerCase()
    return q.includes(search.toLowerCase()) && (filter === 'tous' || v.validation === filter)
  })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white">Véhicules</h1>
        <p className="text-gray-500 text-sm mt-0.5">{vehicules.length} véhicules enregistrés</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total',       value:vehicules.length,                                          color:'text-white'    },
          { label:'Validés',     value:vehicules.filter(v=>v.validation==='valide').length,        color:'text-green-400'},
          { label:'En attente',  value:vehicules.filter(v=>v.validation==='en_attente').length,   color:'text-yellow-400'},
          { label:'Refusés',     value:vehicules.filter(v=>v.validation==='refuse').length,        color:'text-red-400'  },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Marque, plaque, propriétaire…"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['tous','valide','en_attente','refuse'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-2 rounded-lg border font-medium transition-all ${filter===s?'bg-gold-500/10 text-gold-400 border-gold-500/30':'bg-gray-900 text-gray-500 border-gray-700 hover:border-gray-500'}`}>
              {s === 'tous' ? 'Tous' : VALIDATION[s]?.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-luxe overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800">
              <tr>{['Véhicule','Plaque','Propriétaire','Chauffeur assigné','Statut','Validation','Inscrit le','Actions'].map(h => (
                <th key={h} className="text-left text-gray-600 text-xs uppercase tracking-wider py-4 px-3 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.map(v => {
                const pr = proprietaires.find(p => p.id === v.proprietaireId)
                const ch = chauffeurs.find(c => c.id === v.chauffeurId)
                return (
                  <tr key={v.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-3">
                      <p className="text-white text-xs font-medium">{v.marque} {v.modele}</p>
                      <p className="text-gray-600 text-xs">{v.prixJour} FCFA/jour</p>
                    </td>
                    <td className="py-3.5 px-3 text-gray-400 text-xs font-mono">{v.plaque}</td>
                    <td className="py-3.5 px-3 text-gray-400 text-xs">{pr ? `${pr.prenom} ${pr.nom}` : '—'}</td>
                    <td className="py-3.5 px-3">
                      {ch ? <span className="text-xs text-green-400 font-medium">{ch.prenom} {ch.nom}</span>
                           : <span className="text-gray-600 text-xs">Non assigné</span>}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`text-xs font-medium ${STATUTS_VEH[v.statut]?.color}`}>{STATUTS_VEH[v.statut]?.label || v.statut}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${VALIDATION[v.validation]?.bg}`}>{VALIDATION[v.validation]?.label}</span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-600 text-xs">{v.dateInscription}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex gap-1.5">
                        {v.validation === 'en_attente' && (
                          <button onClick={() => validerVehicule(v.id, adminName)} className="p-1.5 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 transition-all" title="Valider"><CheckCircle2 size={13} /></button>
                        )}
                        {v.validation === 'en_attente' && (
                          <button onClick={() => refuserVehicule(v.id, adminName)} className="p-1.5 bg-red-500/8 hover:bg-red-500/15 rounded-lg text-red-400 transition-all" title="Refuser"><XCircle size={13} /></button>
                        )}
                        {v.validation === 'valide' && (
                          <button onClick={() => refuserVehicule(v.id, adminName)} className="p-1.5 bg-red-500/8 hover:bg-red-500/15 rounded-lg text-red-400 transition-all" title="Révoquer validation"><XCircle size={13} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center"><Car size={36} className="text-gray-700 mx-auto mb-3" /><p className="text-gray-500 text-sm">Aucun véhicule trouvé</p></div>
        )}
      </div>
    </div>
  )
}
