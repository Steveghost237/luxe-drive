import { useState } from 'react'
import { Search, UserCheck, UserX, Eye, Building2, Trash2, Car, Hash, Briefcase, Users, Banknote, Calendar, MapPin, Phone, Mail } from 'lucide-react'
import useAdminStore from '../../store/adminStore'
import useAuthStore  from '../../store/authStore'

const STATUTS = {
  actif:      { label:'Actif',      bg:'bg-green-500/10 border-green-500/30 text-green-400'    },
  en_attente: { label:'En attente', bg:'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
  suspendu:   { label:'Suspendu',   bg:'bg-red-500/10 border-red-500/30 text-red-400'          },
}

export default function AdminProprietaires() {
  const { proprietaires, vehicules, validerProprietaire, suspendreCompte, reactiver, supprimerCompte } = useAdminStore()
  const adminName = useAuthStore(s => `${s.user?.prenom} ${s.user?.nom}`)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('tous')
  const [detailId, setDetailId] = useState(null)

  const filtered = proprietaires.filter(p => {
    const q = `${p.prenom} ${p.nom} ${p.email}`.toLowerCase()
    return q.includes(search.toLowerCase()) && (filter === 'tous' || p.statut === filter)
  })

  const detail = proprietaires.find(p => p.id === detailId)
  const detailVehicles = detail ? vehicules.filter(v => detail.vehicules.includes(v.id)) : []

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white">Propriétaires</h1>
        <p className="text-gray-500 text-sm mt-0.5">{proprietaires.length} propriétaires enregistrés</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total',        value:proprietaires.length,                                          color:'text-white'    },
          { label:'Actifs',       value:proprietaires.filter(p=>p.statut==='actif').length,            color:'text-green-400'},
          { label:'En attente',   value:proprietaires.filter(p=>p.statut==='en_attente').length,       color:'text-yellow-400'},
          { label:'Entreprises',  value:proprietaires.filter(p=>p.type==='entreprise').length,         color:'text-blue-400' },
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, email…"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['tous','actif','en_attente','suspendu'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-2 rounded-lg border font-medium transition-all ${filter===s?'bg-gold-500/10 text-gold-400 border-gold-500/30':'bg-gray-900 text-gray-500 border-gray-700 hover:border-gray-500'}`}>
              {s === 'tous' ? 'Tous' : STATUTS[s]?.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card-luxe overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-800">
              <tr>{['Propriétaire','Type','Contact','Véhicules','KYC','Statut','Inscrit le','Actions'].map(h => (
                <th key={h} className="text-left text-gray-600 text-xs uppercase tracking-wider py-4 px-3 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-xs font-bold shrink-0">
                        {p.type === 'entreprise' ? <Building2 size={14} /> : `${p.prenom[0]}${p.nom?.[0] || ''}`}
                      </div>
                      <div>
                        <p className="text-white text-xs font-medium">{p.prenom} {p.nom}</p>
                        <p className="text-gray-600 text-xs">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${p.type === 'entreprise' ? 'bg-blue-500/10 text-blue-400 border-blue-500/25' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                      {p.type === 'entreprise' ? 'Entreprise' : 'Particulier'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-gray-500 text-xs">{p.tel}</td>
                  <td className="py-3.5 px-3">
                    <span className="text-white text-xs font-bold">{p.vehicules.length}</span>
                    <span className="text-gray-500 text-xs ml-1">véhicule{p.vehicules.length > 1 ? 's' : ''}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`text-xs font-medium ${p.kyc === 'verifie' ? 'text-green-400' : 'text-yellow-400'}`}>
                      {p.kyc === 'verifie' ? '✓ Vérifié' : '⏳ En cours'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${STATUTS[p.statut]?.bg}`}>{STATUTS[p.statut]?.label}</span>
                  </td>
                  <td className="py-3.5 px-3 text-gray-600 text-xs">{p.dateInscription}</td>
                  <td className="py-3.5 px-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => setDetailId(p.id)} className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 transition-all" title="Voir flotte"><Eye size={13} /></button>
                      {p.statut === 'en_attente' && (
                        <button onClick={() => validerProprietaire(p.id, adminName)} className="p-1.5 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 transition-all" title="Valider"><UserCheck size={13} /></button>
                      )}
                      {p.statut === 'actif' && (
                        <button onClick={() => suspendreCompte('proprietaires', p.id, adminName)} className="p-1.5 bg-red-500/8 hover:bg-red-500/15 rounded-lg text-red-400 transition-all" title="Suspendre"><UserX size={13} /></button>
                      )}
                      {p.statut === 'suspendu' && (
                        <button onClick={() => reactiver('proprietaires', p.id, adminName)} className="p-1.5 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 transition-all" title="Réactiver"><UserCheck size={13} /></button>
                      )}
                      <button onClick={() => supprimerCompte('proprietaires', p.id, adminName)} className="p-1.5 bg-red-500/8 hover:bg-red-500/15 rounded-lg text-red-400 transition-all" title="Supprimer"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal détail */}
      {detail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold-500/15 flex items-center justify-center">
                  {detail.type === 'entreprise' ? <Building2 size={20} className="text-gold-400"/> : <span className="text-gold-400 font-bold text-sm">{detail.prenom[0]}{detail.nom?.[0]||''}</span>}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{detail.prenom} {detail.nom}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${detail.type === 'entreprise' ? 'bg-blue-500/10 text-blue-400 border-blue-500/25' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                      {detail.type === 'entreprise' ? 'Entreprise' : 'Particulier'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUTS[detail.statut]?.bg}`}>{STATUTS[detail.statut]?.label}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setDetailId(null)} className="text-gray-500 hover:text-white transition-colors text-lg leading-none">✕</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-gray-400"><Phone size={12} className="text-gray-600"/> {detail.tel}</div>
                <div className="flex items-center gap-2 text-gray-400"><Mail size={12} className="text-gray-600"/> {detail.email}</div>
                <div className="flex items-center gap-2 text-gray-400"><MapPin size={12} className="text-gray-600"/> {detail.ville}</div>
                <div className="flex items-center gap-2 text-gray-400"><Calendar size={12} className="text-gray-600"/> Inscrit le {detail.dateInscription}</div>
              </div>

              {/* Enterprise fields */}
              {detail.type === 'entreprise' && (
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-3">Informations entreprise</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { icon:<Briefcase size={12}/>,  label:'Raison sociale',  value:detail.raisonSociale },
                      { icon:<Hash size={12}/>,        label:'Secteur',         value:detail.secteur },
                      { icon:<Hash size={12}/>,        label:'NIF',             value:detail.nif },
                      { icon:<Hash size={12}/>,        label:'RC',              value:detail.rc },
                      { icon:<Users size={12}/>,       label:'Responsable',     value:detail.responsable },
                      { icon:<Users size={12}/>,       label:'Effectif',        value:detail.effectif ? `${detail.effectif} employés` : null },
                      { icon:<Banknote size={12}/>,    label:'Capital social',  value:detail.capitalSocial },
                      { icon:<Calendar size={12}/>,    label:'Date de création',value:detail.dateCreation },
                      { icon:<MapPin size={12}/>,      label:'Siège social',    value:detail.adresseSiege },
                    ].filter(f => f.value).map(f => (
                      <div key={f.label} className="bg-gray-800/50 rounded-xl px-3 py-2.5">
                        <p className="text-gray-600 text-xs flex items-center gap-1.5 mb-0.5">{f.icon} {f.label}</p>
                        <p className="text-white text-xs font-medium">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fleet */}
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-3">Flotte enregistrée ({detailVehicles.length} véhicule{detailVehicles.length > 1 ? 's' : ''})</p>
                {detailVehicles.length === 0
                  ? <p className="text-gray-600 text-sm text-center py-4">Aucun véhicule enregistré.</p>
                  : <div className="space-y-2">
                    {detailVehicles.map(v => (
                      <div key={v.id} className="flex items-center justify-between bg-gray-800/40 rounded-xl px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <Car size={13} className="text-gray-600"/>
                          <div>
                            <p className="text-white text-xs font-medium">{v.marque} {v.modele}</p>
                            <p className="text-gray-500 text-xs">{v.plaque} · {v.prixJour} FCFA/jour</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${v.validation === 'valide' ? 'bg-green-500/10 text-green-400 border-green-500/25' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25'}`}>
                          {v.validation === 'valide' ? 'Validé' : 'En attente'}
                        </span>
                      </div>
                    ))}
                  </div>
                }
              </div>
            </div>

            <div className="px-6 pb-6">
              <button onClick={() => setDetailId(null)} className="btn-ghost w-full py-2.5 text-sm">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
