import { Wrench, AlertTriangle, CheckCircle2, Clock, Calendar, Plus } from 'lucide-react'

const MAINTENANCE = [
  { id:'m1', vehicule:'BMW Serie 7 760Li', plaque:'LT-9012-YA', type:'Révision complète + courroie', statut:'en_cours', garage:'Garage Elite Auto — Bastos', debut:'05 Juin 2025', fin_prevue:'10 Juin 2025', cout:185000, notes:'Révision 50 000 km + remplacement courroie distribution.', urgent:false },
  { id:'m2', vehicule:'Mercedes S 580', plaque:'LT-1234-YA', type:'Vidange + filtres', statut:'planifie', garage:'Garage Agréé Luxe Drive #2', debut:'15 Juin 2025', fin_prevue:'15 Juin 2025', cout:45000, notes:'Vidange préventive à 25 000 km.', urgent:false },
  { id:'m3', vehicule:'Audi A8 L', plaque:'LT-3456-YA', type:'Alerte pneus avant', statut:'urgent', garage:null, debut:null, fin_prevue:null, cout:null, notes:'Pression insuffisante détectée. Intervention requise sous 48h.', urgent:true },
  { id:'m4', vehicule:'Range Rover', plaque:'LT-5678-DL', type:'Révision 20 000 km', statut:'termine', garage:'Garage Pro Auto — Douala', debut:'20 Mai 2025', fin_prevue:'22 Mai 2025', cout:95000, notes:'Révision standard complète. Véhicule validé pour 10 000 km.', urgent:false },
]

const HIST = [
  { date:'22 Mai 2025', vehicule:'Range Rover', type:'Révision 20 000 km', cout:95000, garage:'Garage Pro Auto', duree:'2 jours' },
  { date:'10 Avr 2025', vehicule:'Audi A8 L', type:'Vidange + freins', cout:72000, garage:'Garage Elite Auto', duree:'1 jour' },
  { date:'02 Mars 2025', vehicule:'Mercedes S 580', type:'Carrosserie — rayure', cout:38000, garage:'Carrosserie Star', duree:'3 jours' },
]

const STATUTS = {
  en_cours: { label:'En cours',  bg:'bg-orange-500/10 border-orange-500/30 text-orange-400' },
  planifie: { label:'Planifié',  bg:'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  urgent:   { label:'Urgent !',  bg:'bg-red-500/10 border-red-500/30 text-red-400' },
  termine:  { label:'Terminé',   bg:'bg-green-500/10 border-green-500/30 text-green-400' },
}

export default function FleetMaintenance() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Maintenance</h1>
          <p className="text-gray-500 text-sm mt-0.5">Planification et suivi des interventions</p>
        </div>
        <button className="btn-gold flex items-center gap-2 text-sm px-4 py-2.5">
          <Plus size={15} /> Planifier une révision
        </button>
      </div>

      {/* Alertes urgentes */}
      {MAINTENANCE.filter(m => m.urgent).map(m => (
        <div key={m.id} className="mb-5 p-4 bg-red-500/8 border border-red-500/30 rounded-xl flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-red-400 font-semibold text-sm">{m.vehicule} ({m.plaque}) — {m.type}</p>
            <p className="text-gray-400 text-xs mt-1">{m.notes}</p>
          </div>
          <button className="text-xs px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 rounded-lg transition-all shrink-0">
            Contacter un garage
          </button>
        </div>
      ))}

      {/* Active & Planned */}
      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        {MAINTENANCE.filter(m => m.statut !== 'termine').map(m => {
          const s = STATUTS[m.statut]
          return (
            <div key={m.id} className={`card-luxe p-5 ${m.urgent ? 'border-red-500/20' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">{m.plaque}</p>
                  <h3 className="text-white font-semibold text-sm">{m.vehicule}</h3>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${s.bg}`}>{s.label}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Wrench size={13} className="text-gray-500" />
                <p className="text-gray-300 text-sm">{m.type}</p>
              </div>
              {m.garage && (
                <p className="text-gray-600 text-xs mb-2">🔧 {m.garage}</p>
              )}
              {m.debut && (
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                  <span className="flex items-center gap-1"><Calendar size={10} /> Début : {m.debut}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> Fin prévue : {m.fin_prevue}</span>
                </div>
              )}
              {m.cout && (
                <p className="text-gold-400 font-bold text-sm">{m.cout.toLocaleString('fr-FR')} FCFA</p>
              )}
              <p className="text-gray-600 text-xs mt-2 leading-relaxed">{m.notes}</p>
            </div>
          )
        })}
      </div>

      {/* Historique */}
      <div className="card-luxe p-6">
        <div className="flex items-center gap-2 mb-5">
          <CheckCircle2 size={16} className="text-green-400" />
          <h2 className="text-white font-semibold">Historique des interventions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                {['Date','Véhicule','Intervention','Durée','Coût','Garage'].map(h => (
                  <th key={h} className="text-left text-gray-600 text-xs uppercase tracking-wider py-2 pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {HIST.map((h, i) => (
                <tr key={i} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 pr-4 text-gray-500 text-xs">{h.date}</td>
                  <td className="py-3 pr-4 text-white text-xs font-medium">{h.vehicule}</td>
                  <td className="py-3 pr-4 text-gray-400 text-xs">{h.type}</td>
                  <td className="py-3 pr-4 text-gray-400 text-xs">{h.duree}</td>
                  <td className="py-3 pr-4 text-gold-400 font-bold text-xs">{h.cout.toLocaleString('fr-FR')} FCFA</td>
                  <td className="py-3 text-gray-600 text-xs">{h.garage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
