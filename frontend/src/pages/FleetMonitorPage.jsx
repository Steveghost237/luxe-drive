import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Satellite, Activity, AlertTriangle, MapPin, Navigation,
  Zap, Car, Users, Clock, Shield, ChevronRight
} from 'lucide-react'

const VEHICLES = [
  { id:'f1', nom:'Classe S 580', marque:'Mercedes-Benz', plaque:'LT-1234-YA', statut:'en_course', vitesse:42, localisation:'Yaoundé Centre-Ville, Rue Nachtigal', chauffeur:'Jean-Marc Eyenga', batterie_gps:87, dernierePing:'Il y a 12s', distance_aujourd_hui:38, client:'Min. des Finances', color:'bg-green-400' },
  { id:'f2', nom:'Range Rover Autobiography', marque:'Land Rover', plaque:'LT-5678-DL', statut:'gare', vitesse:0, localisation:'Dépôt Douala Akwa, Bd de la Liberté', chauffeur:null, batterie_gps:92, dernierePing:'Il y a 2 min', distance_aujourd_hui:0, client:null, color:'bg-blue-400' },
  { id:'f3', nom:'BMW Serie 7', marque:'BMW', plaque:'LT-9012-YA', statut:'maintenance', vitesse:0, localisation:'Garage Agréé Elite Auto — Bastos', chauffeur:null, batterie_gps:34, dernierePing:'Il y a 45 min', distance_aujourd_hui:0, client:null, color:'bg-orange-400' },
  { id:'f4', nom:'Audi A8 L', marque:'Audi', plaque:'LT-3456-YA', statut:'en_course', vitesse:28, localisation:'Bastos, Avenue des Ambassadeurs', chauffeur:'Paul Biya Nkodo', batterie_gps:71, dernierePing:'Il y a 8s', distance_aujourd_hui:25, client:'Ambassade de France', color:'bg-green-400' },
  { id:'f5', nom:'Porsche Cayenne Turbo', marque:'Porsche', plaque:'LT-7890-YA', statut:'en_course', vitesse:55, localisation:'Autoroute Yaoundé–Douala (km 45)', chauffeur:'Alice Nguema', batterie_gps:65, dernierePing:'Il y a 5s', distance_aujourd_hui:89, client:'ONG Croix-Rouge', color:'bg-green-400' },
  { id:'f6', nom:'Mercedes V-Class', marque:'Mercedes-Benz', plaque:'LT-2468-DL', statut:'alerte', vitesse:0, localisation:'Zone Industrielle Bonabéri', chauffeur:'Rodrigue Manga', batterie_gps:12, dernierePing:'Il y a 18 min', distance_aujourd_hui:12, client:null, color:'bg-red-400' },
]

const STATUS_MAP = {
  en_course:   { label:'En course',   dot:'bg-green-400 animate-pulse',  text:'text-green-400',  badge:'bg-green-500/10 border-green-500/30 text-green-400'   },
  gare:        { label:'Garé',        dot:'bg-blue-400',                 text:'text-blue-400',   badge:'bg-blue-500/10 border-blue-500/30 text-blue-400'      },
  maintenance: { label:'Maintenance', dot:'bg-orange-400',               text:'text-orange-400', badge:'bg-orange-500/10 border-orange-500/30 text-orange-400' },
  alerte:      { label:'Alerte',      dot:'bg-red-400 animate-pulse',    text:'text-red-400',    badge:'bg-red-500/10 border-red-500/30 text-red-400'         },
}

export default function FleetMonitorPage() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('tous')

  const enCourse = VEHICLES.filter(v => v.statut === 'en_course').length
  const alertes  = VEHICLES.filter(v => v.statut === 'alerte').length

  const filtered = filter === 'tous' ? VEHICLES : VEHICLES.filter(v => v.statut === filter)

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center">
                <span className="font-display font-bold text-black text-xs">LD</span>
              </div>
              <span className="font-display font-bold text-white text-lg">Luxe<span className="text-gold-400"> Drive</span></span>
            </Link>
            <span className="text-gray-700">·</span>
            <div className="flex items-center gap-2">
              <Satellite size={15} className="text-gold-400" />
              <span className="text-white font-semibold text-sm">Centre de Surveillance Flotte</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {alertes > 0 && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                <AlertTriangle size={12} /> {alertes} alerte{alertes > 1 ? 's' : ''}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Temps réel actif
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* KPIs */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {[
            { icon:Car,        label:'Véhicules total',  value:VEHICLES.length,     color:'bg-gold-500/10 text-gold-400',    border:'border-gold-500/20' },
            { icon:Activity,   label:'En course',         value:enCourse,            color:'bg-green-500/10 text-green-400',  border:'border-green-500/20' },
            { icon:Satellite,  label:'GPS actifs',        value:VEHICLES.filter(v=>v.batterie_gps>20).length, color:'bg-blue-500/10 text-blue-400', border:'border-blue-500/20' },
            { icon:AlertTriangle,label:'Alertes',         value:alertes,             color:'bg-red-500/10 text-red-400',      border:'border-red-500/20' },
          ].map(({ icon:Icon, label, value, color, border }) => (
            <div key={label} className={`card-luxe ${border} p-5 flex items-center gap-4`}>
              <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}><Icon size={20} /></div>
              <div>
                <p className="text-gray-500 text-xs">{label}</p>
                <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid xl:grid-cols-5 gap-6">

          {/* Map */}
          <div className="xl:col-span-3">
            <div className="card-luxe overflow-hidden mb-5">
              <div className="relative h-80 bg-gray-900">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=60"
                  alt="Carte GPS" className="w-full h-full object-cover opacity-25" />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-gray-900/30 to-gray-950/60" />

                {/* Vehicle pins */}
                {[
                  { top:'35%', left:'48%', v:VEHICLES[0] },
                  { top:'55%', left:'72%', v:VEHICLES[1] },
                  { top:'32%', left:'54%', v:VEHICLES[3] },
                  { top:'20%', left:'60%', v:VEHICLES[4] },
                  { top:'65%', left:'68%', v:VEHICLES[5] },
                ].map(({ top, left, v }) => (
                  <div key={v.id} className="absolute group cursor-pointer" style={{ top, left }}
                    onClick={() => setSelected(selected === v.id ? null : v.id)}>
                    <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg ${v.color} ${v.statut === 'en_course' || v.statut === 'alerte' ? 'animate-pulse' : ''}`} />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/95 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <p className="font-semibold">{v.marque} {v.nom}</p>
                      <p className="text-gray-400 truncate max-w-[160px]">{v.localisation.split(',')[0]}</p>
                      {v.vitesse > 0 && <p className="text-green-400 font-medium">{v.vitesse} km/h</p>}
                    </div>
                  </div>
                ))}

                {/* Overlay info */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-black/70 backdrop-blur border border-gray-700 rounded-xl px-4 py-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white text-xs font-medium">{enCourse} véhicules actifs</span>
                  </div>
                  {alertes > 0 && (
                    <div className="bg-red-500/20 backdrop-blur border border-red-500/40 rounded-xl px-4 py-2 flex items-center gap-2">
                      <AlertTriangle size={11} className="text-red-400" />
                      <span className="text-red-300 text-xs font-medium">{alertes} alerte en cours</span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 text-gray-600 text-xs">Carte simulée — Intégration Google Maps disponible</div>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-4">
              {['tous','en_course','gare','maintenance','alerte'].map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`text-xs px-3 py-2 rounded-lg border font-medium transition-all ${filter===s?'bg-gold-500/10 text-gold-400 border-gold-500/30':'bg-gray-900 text-gray-500 border-gray-700 hover:border-gray-500'}`}>
                  {s === 'tous' ? 'Tous' : STATUS_MAP[s]?.label}
                </button>
              ))}
            </div>

            {/* Vehicle list */}
            <div className="space-y-2.5">
              {filtered.map(v => {
                const s = STATUS_MAP[v.statut]
                const isSelected = selected === v.id
                const batColor = v.batterie_gps > 50 ? 'text-green-400' : v.batterie_gps > 20 ? 'text-yellow-400' : 'text-red-400'
                return (
                  <div key={v.id} onClick={() => setSelected(isSelected ? null : v.id)}
                    className={`card-luxe p-4 cursor-pointer transition-all hover:border-gray-600 ${isSelected ? 'border-gold-500/40' : ''} ${v.statut === 'alerte' ? 'border-red-500/30' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${s.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-white font-medium text-sm truncate">{v.marque} {v.nom}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${s.badge}`}>{s.label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={10} className="text-gray-600 shrink-0" />
                          <p className="text-gray-500 text-xs truncate">{v.localisation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {v.vitesse > 0 && <span className="text-green-400 text-xs font-semibold">{v.vitesse} km/h</span>}
                        <span className={`text-xs font-medium ${batColor}`}>{v.batterie_gps}%</span>
                        <ChevronRight size={14} className={`text-gray-600 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-gray-800 grid sm:grid-cols-3 gap-3">
                        <div className="bg-gray-900 rounded-lg p-3">
                          <p className="text-gray-600 text-xs mb-1">Plaque</p>
                          <p className="text-white text-xs font-mono font-medium">{v.plaque}</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3">
                          <p className="text-gray-600 text-xs mb-1">Distance / jour</p>
                          <p className="text-white text-xs font-medium">{v.distance_aujourd_hui} km</p>
                        </div>
                        <div className="bg-gray-900 rounded-lg p-3">
                          <p className="text-gray-600 text-xs mb-1">Dernière maj GPS</p>
                          <p className="text-white text-xs">{v.dernierePing}</p>
                        </div>
                        {v.chauffeur && (
                          <div className="bg-gray-900 rounded-lg p-3">
                            <p className="text-gray-600 text-xs mb-1">Chauffeur</p>
                            <p className="text-white text-xs font-medium">{v.chauffeur}</p>
                          </div>
                        )}
                        {v.client && (
                          <div className="bg-gray-900 rounded-lg p-3">
                            <p className="text-gray-600 text-xs mb-1">Client</p>
                            <p className="text-white text-xs font-medium">{v.client}</p>
                          </div>
                        )}
                        {v.statut === 'en_course' && (
                          <div className="sm:col-span-3 mt-1">
                            <button className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-medium py-2.5 rounded-lg transition-all">
                              <AlertTriangle size={12} /> Coupure moteur d'urgence
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right panel */}
          <div className="xl:col-span-2 space-y-5">

            {/* GPS Health */}
            <div className="card-luxe p-5">
              <div className="flex items-center gap-2 mb-4">
                <Satellite size={15} className="text-gold-400" />
                <h3 className="text-white font-semibold text-sm">Santé GPS</h3>
              </div>
              <div className="space-y-3">
                {VEHICLES.map(v => {
                  const batColor = v.batterie_gps > 50 ? 'bg-green-400' : v.batterie_gps > 20 ? 'bg-yellow-400' : 'bg-red-400'
                  return (
                    <div key={v.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400 text-xs">{v.nom}</span>
                        <span className={`text-xs font-medium ${v.batterie_gps > 50 ? 'text-green-400' : v.batterie_gps > 20 ? 'text-yellow-400' : 'text-red-400'}`}>{v.batterie_gps}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${batColor}`} style={{ width: `${v.batterie_gps}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Alerts */}
            <div className="card-luxe p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={15} className="text-red-400" />
                <h3 className="text-white font-semibold text-sm">Alertes actives</h3>
              </div>
              {VEHICLES.filter(v => v.statut === 'alerte' || v.batterie_gps < 20).length === 0 ? (
                <div className="text-center py-6">
                  <Shield size={24} className="text-green-500 mx-auto mb-2" />
                  <p className="text-gray-500 text-xs">Aucune alerte active</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {VEHICLES.filter(v => v.statut === 'alerte').map(v => (
                    <div key={v.id} className="p-3 bg-red-500/8 border border-red-500/20 rounded-xl">
                      <p className="text-red-400 text-xs font-semibold">{v.marque} {v.nom} ({v.plaque})</p>
                      <p className="text-gray-500 text-xs mt-0.5">Batterie GPS critique : {v.batterie_gps}% — Dernière position : {v.dernierePing}</p>
                    </div>
                  ))}
                  {VEHICLES.filter(v => v.batterie_gps < 20 && v.statut !== 'alerte').map(v => (
                    <div key={v.id} className="p-3 bg-orange-500/8 border border-orange-500/20 rounded-xl">
                      <p className="text-orange-400 text-xs font-semibold">{v.marque} {v.nom}</p>
                      <p className="text-gray-500 text-xs mt-0.5">Batterie GPS faible : {v.batterie_gps}%</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live stats */}
            <div className="card-luxe p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={15} className="text-blue-400" />
                <h3 className="text-white font-semibold text-sm">Activité du jour</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label:'Km total parcourus', value:`${VEHICLES.reduce((s,v)=>s+v.distance_aujourd_hui,0)} km`, color:'text-white' },
                  { label:'Vitesse max enregistrée', value:'72 km/h', color:'text-green-400' },
                  { label:'Zones à risque traversées', value:'0', color:'text-green-400' },
                  { label:'Coupures GPS signalées', value:'1', color:'text-yellow-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-gray-800/60 last:border-0">
                    <p className="text-gray-500 text-xs">{label}</p>
                    <p className={`${color} text-xs font-semibold`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
