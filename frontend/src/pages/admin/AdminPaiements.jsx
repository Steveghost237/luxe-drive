import { useState } from 'react'
import { Search, Download, DollarSign, TrendingUp, Clock, ArrowUpRight } from 'lucide-react'

const PAIEMENTS = [
  { id:'P001', ref:'LXD-2025-0891', type:'Location', client:'Pierre Atangana',   proprietaire:'Jean-Pierre Nkomo', montant:750000, commission:75000, net:675000, methode:'Orange Money', statut:'verse',    date:'08 Juin 2025' },
  { id:'P002', ref:'LXD-2025-0879', type:'Location', client:'Ambassade France',  proprietaire:'Alice Fogue',      montant:875000, commission:87500, net:787500, methode:'Virement',    statut:'sequestre', date:'03 Juin 2025' },
  { id:'P003', ref:'LXD-2025-0870', type:'Location', client:'ONG Croix-Rouge',   proprietaire:'Jean-Pierre Nkomo', montant:320000, commission:32000, net:288000, methode:'MTN MoMo',    statut:'verse',    date:'01 Juin 2025' },
  { id:'P004', ref:'LXD-2025-0862', type:'Location', client:'Sylvie Nkomo',      proprietaire:'Marie Mbeki',       montant:250000, commission:25000, net:225000, methode:'Orange Money', statut:'verse',    date:'28 Mai 2025' },
  { id:'P005', ref:'LXD-2025-0851', type:'Chauffeur',client:'Alain Tchoupo',     proprietaire:null,               montant:180000, commission:18000, net:162000, methode:'MTN MoMo',    statut:'verse',    date:'24 Mai 2025' },
  { id:'P006', ref:'LXD-2025-0840', type:'Location', client:'Min. des Finances', proprietaire:'Paul Essomba',      montant:600000, commission:60000, net:540000, methode:'Chèque cert.',statut:'annule',   date:'20 Mai 2025' },
]

const STATUTS = {
  verse:     { label:'Versé',     bg:'bg-green-500/10 border-green-500/30 text-green-400'   },
  sequestre: { label:'Séquestre', bg:'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'},
  en_cours:  { label:'En cours',  bg:'bg-blue-500/10 border-blue-500/30 text-blue-400'      },
  annule:    { label:'Annulé',    bg:'bg-red-500/10 border-red-500/30 text-red-400'         },
}

export default function AdminPaiements() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('tous')

  const filtered = PAIEMENTS.filter(p => {
    const q = `${p.ref} ${p.client} ${p.methode}`.toLowerCase()
    return q.includes(search.toLowerCase()) && (filter === 'tous' || p.statut === filter)
  })

  const totalVerse = PAIEMENTS.filter(p => p.statut === 'verse').reduce((s, p) => s + p.montant, 0)
  const totalSeq = PAIEMENTS.filter(p => p.statut === 'sequestre').reduce((s, p) => s + p.montant, 0)
  const totalComm = PAIEMENTS.reduce((s, p) => s + (p.statut !== 'annule' ? p.commission : 0), 0)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Paiements</h1>
          <p className="text-gray-500 text-sm mt-0.5">Suivi des transactions et commissions</p>
        </div>
        <button className="flex items-center gap-2 text-sm px-4 py-2.5 bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 rounded-xl transition-all">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-6">
        {[
          { label:'Volume versé',   value:`${(totalVerse/1000).toFixed(0)}K FCFA`,  icon:DollarSign,  color:'text-green-400',  bg:'bg-green-500/10 border-green-500/20' },
          { label:'En séquestre',   value:`${(totalSeq/1000).toFixed(0)}K FCFA`,    icon:Clock,       color:'text-yellow-400', bg:'bg-yellow-500/10 border-yellow-500/20'},
          { label:'Commissions',    value:`${(totalComm/1000).toFixed(0)}K FCFA`,   icon:TrendingUp,  color:'text-gold-400',   bg:'bg-gold-500/10 border-gold-500/20'   },
          { label:'Transactions',   value:PAIEMENTS.filter(p=>p.statut!=='annule').length, icon:ArrowUpRight, color:'text-blue-400',  bg:'bg-blue-500/10 border-blue-500/20' },
        ].map(({ label, value, icon:Icon, color, bg }) => (
          <div key={label} className={`card-luxe ${bg} p-5 flex items-center gap-4`}>
            <Icon className={color} size={20} />
            <div>
              <p className="text-gray-500 text-xs">{label}</p>
              <p className={`${color} font-bold text-lg mt-0.5`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Réf., client, méthode…"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
        </div>
        <div className="flex gap-2">
          {['tous','verse','sequestre','en_cours','annule'].map(s => (
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
              <tr>{['Réf.','Type','Client','Propriétaire','Montant','Commission (10%)','Net propriétaire','Méthode','Statut','Date'].map(h => (
                <th key={h} className="text-left text-gray-600 text-xs uppercase tracking-wider py-4 px-3 font-medium">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-3.5 px-3 text-gray-500 text-xs font-mono">{p.ref}</td>
                  <td className="py-3.5 px-3 text-gray-400 text-xs">{p.type}</td>
                  <td className="py-3.5 px-3 text-white text-xs font-medium">{p.client}</td>
                  <td className="py-3.5 px-3 text-gray-400 text-xs">{p.proprietaire || '—'}</td>
                  <td className="py-3.5 px-3 text-white text-xs font-bold">{p.montant.toLocaleString('fr-FR')} F</td>
                  <td className="py-3.5 px-3 text-gold-400 text-xs font-semibold">{p.commission.toLocaleString('fr-FR')} F</td>
                  <td className="py-3.5 px-3 text-green-400 text-xs font-semibold">{p.net.toLocaleString('fr-FR')} F</td>
                  <td className="py-3.5 px-3 text-gray-500 text-xs">{p.methode}</td>
                  <td className="py-3.5 px-3"><span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${STATUTS[p.statut]?.bg}`}>{STATUTS[p.statut]?.label}</span></td>
                  <td className="py-3.5 px-3 text-gray-600 text-xs">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
