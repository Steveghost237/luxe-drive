import { DollarSign, TrendingUp, Clock, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react'

const TRANSACTIONS = [
  { ref:'LXD-2025-0891', vehicule:'Mercedes S 580', client:'Min. Finances',    montant:540000, statut:'versé',     date:'08 Juin 2025', duree:'3 jours' },
  { ref:'LXD-2025-0887', vehicule:'Range Rover',    client:'Pierre Atangana',  montant:200000, statut:'sequestre', date:'06 Juin 2025', duree:'1 jour' },
  { ref:'LXD-2025-0879', vehicule:'Audi A8',        client:'Ambassade France', montant:875000, statut:'sequestre', date:'03 Juin 2025', duree:'4 jours' },
  { ref:'LXD-2025-0870', vehicule:'BMW Serie 7',    client:'ONG Croix-Rouge',  montant:320000, statut:'versé',     date:'01 Juin 2025', duree:'2 jours' },
  { ref:'LXD-2025-0862', vehicule:'Mercedes S 580', client:'Sylvie Nkomo',     montant:250000, statut:'versé',     date:'28 Mai 2025',  duree:'1 jour' },
  { ref:'LXD-2025-0851', vehicule:'Range Rover',    client:'Alain Tchoupo',    montant:600000, statut:'versé',     date:'24 Mai 2025',  duree:'3 jours' },
]

const PAYMT = {
  versé:     'bg-green-500/10 text-green-400 border-green-500/30',
  sequestre: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
}

const MONTHLY = [
  { mois:'Janv', rev:850000 }, { mois:'Févr', rev:1200000 }, { mois:'Mars', rev:980000 },
  { mois:'Avr',  rev:1450000 },{ mois:'Mai',  rev:1680000 }, { mois:'Juin', rev:1935000 },
]

const maxRev = Math.max(...MONTHLY.map(m => m.rev))

export default function FleetRevenus() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Revenus</h1>
          <p className="text-gray-500 text-sm mt-0.5">Suivi financier de votre flotte</p>
        </div>
        <button className="flex items-center gap-2 text-sm px-4 py-2.5 bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 rounded-xl transition-all">
          <Download size={14} /> Exporter PDF
        </button>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {[
          { label:'Ce mois',          value:'1 935 000 FCFA', icon:TrendingUp,  color:'text-gold-400',   bg:'bg-gold-500/10 border-gold-500/20',   trend:'+14%' },
          { label:'En séquestre',     value:'1 075 000 FCFA', icon:Clock,       color:'text-yellow-400', bg:'bg-yellow-500/10 border-yellow-500/20',trend:null },
          { label:'Disponible',       value:'860 000 FCFA',   icon:DollarSign,  color:'text-green-400',  bg:'bg-green-500/10 border-green-500/20',  trend:null },
          { label:'Total annuel',     value:'9 135 000 FCFA', icon:ArrowUpRight,color:'text-blue-400',   bg:'bg-blue-500/10 border-blue-500/20',    trend:'+32%' },
        ].map(({ label, value, icon:Icon, color, bg, trend }) => (
          <div key={label} className={`card-luxe ${bg} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <Icon className={color} size={18} />
              {trend && <span className="text-xs font-semibold text-green-400 flex items-center gap-0.5"><ArrowUpRight size={11} />{trend}</span>}
            </div>
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            <p className={`${color} font-bold text-lg leading-tight`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card-luxe p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold">Évolution des revenus — 2025</h2>
          <span className="text-gray-600 text-xs">6 derniers mois</span>
        </div>
        <div className="flex items-end gap-3 h-40">
          {MONTHLY.map(m => (
            <div key={m.mois} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-gray-600 text-xs">{(m.rev/1000).toFixed(0)}K</span>
              <div className="w-full rounded-t-lg bg-gradient-to-t from-gold-600 to-gold-400 transition-all hover:opacity-80"
                style={{ height: `${(m.rev / maxRev) * 100}%`, minHeight: 4 }} />
              <span className="text-gray-500 text-xs">{m.mois}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="card-luxe p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">Historique des transactions</h2>
          <span className="text-gray-600 text-xs">{TRANSACTIONS.length} transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {['Référence','Véhicule','Client','Durée','Montant','Statut','Date'].map(h => (
                  <th key={h} className="text-left text-gray-600 text-xs uppercase tracking-wider py-2 pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {TRANSACTIONS.map(t => (
                <tr key={t.ref} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 pr-4 text-gray-500 text-xs font-mono">{t.ref}</td>
                  <td className="py-3 pr-4 text-white text-xs font-medium">{t.vehicule}</td>
                  <td className="py-3 pr-4 text-gray-400 text-xs">{t.client}</td>
                  <td className="py-3 pr-4 text-gray-400 text-xs">{t.duree}</td>
                  <td className="py-3 pr-4 text-gold-400 font-bold text-xs">{t.montant.toLocaleString('fr-FR')} FCFA</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${PAYMT[t.statut]}`}>{t.statut}</span>
                  </td>
                  <td className="py-3 text-gray-600 text-xs">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Escrow info */}
      <div className="card-luxe p-5 mt-5 border-gold-500/20 mt-6">
        <p className="text-white text-xs font-semibold mb-2">Règle de séquestre Luxe Drive</p>
        <p className="text-gray-500 text-xs leading-relaxed">
          <strong className="text-gray-400">Location &lt; 1 semaine :</strong> 20% versés à la réservation, 80% débloqués J+1 après la fin.<br />
          <strong className="text-gray-400">Location &gt; 1 semaine :</strong> 50% versés au terme de la 1ère semaine, solde échelonné.
        </p>
      </div>
    </div>
  )
}
