import { MapPin, Zap, AlertTriangle, Navigation, Clock, Activity } from 'lucide-react'

const VEHICLES = [
  { id:'f1', nom:'Classe S 580', marque:'Mercedes-Benz', plaque:'LT-1234-YA', statut:'en_course', vitesse:42, lat:'3.8667', lng:'11.5167', localisation:'Yaoundé Centre-Ville, Rue Nachtigal', chauffeur:'Jean-Marc Eyenga', batterie_gps:87, dernierePing:'Il y a 12s', distance_aujourd_hui:38 },
  { id:'f2', nom:'Range Rover', marque:'Land Rover', plaque:'LT-5678-DL', statut:'disponible', vitesse:0, lat:'4.0511', lng:'9.7679', localisation:'Dépôt Douala Akwa, Bd de la Liberté', chauffeur:null, batterie_gps:92, dernierePing:'Il y a 2 min', distance_aujourd_hui:0 },
  { id:'f3', nom:'BMW Serie 7', marque:'BMW', plaque:'LT-9012-YA', statut:'maintenance', vitesse:0, lat:'3.8667', lng:'11.5317', localisation:'Garage Agréé Elite Auto — Bastos', chauffeur:null, batterie_gps:34, dernierePing:'Il y a 45 min', distance_aujourd_hui:0 },
  { id:'f4', nom:'Audi A8 L', marque:'Audi', plaque:'LT-3456-YA', statut:'en_course', vitesse:28, lat:'3.8782', lng:'11.5321', localisation:'Bastos, Avenue des Ambassadeurs', chauffeur:'Paul Biya Nkodo', batterie_gps:71, dernierePing:'Il y a 8s', distance_aujourd_hui:25 },
]

const STATUS = {
  en_course:   { label:'En course',   dot:'bg-green-400 animate-pulse', text:'text-green-400', bg:'bg-green-500/10 border-green-500/30' },
  disponible:  { label:'Garé',        dot:'bg-blue-400',                text:'text-blue-400',  bg:'bg-blue-500/10 border-blue-500/30'   },
  maintenance: { label:'Maintenance', dot:'bg-orange-400',              text:'text-orange-400',bg:'bg-orange-500/10 border-orange-500/30'},
}

export default function FleetGPS() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Suivi GPS</h1>
          <p className="text-gray-500 text-sm mt-0.5">Localisation en temps réel de votre flotte</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-green-400">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Mise à jour continue
        </div>
      </div>

      {/* Map placeholder */}
      <div className="card-luxe overflow-hidden mb-6">
        <div className="relative h-72 bg-gray-900">
          <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=70"
            alt="Carte GPS" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/40 to-gray-900/70" />
          {/* Map pins */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-2xl mx-auto">
              {[
                { top:'30%', left:'45%', v:VEHICLES[0] },
                { top:'60%', left:'75%', v:VEHICLES[1] },
                { top:'35%', left:'50%', v:VEHICLES[3] },
              ].map(({ top, left, v }) => (
                <div key={v.id} className="absolute" style={{ top, left }}>
                  <div className="relative group cursor-pointer">
                    <div className={`w-4 h-4 rounded-full border-2 border-white ${v.statut === 'en_course' ? 'bg-green-400 animate-pulse' : 'bg-blue-400'}`} />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/90 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <p className="font-semibold">{v.marque} {v.nom}</p>
                      <p className="text-gray-400">{v.localisation.split(',')[0]}</p>
                      {v.vitesse > 0 && <p className="text-green-400">{v.vitesse} km/h</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Overlay UI */}
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur border border-gray-700 rounded-xl px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white text-xs font-medium">{VEHICLES.filter(v => v.statut === 'en_course').length} véhicules actifs</span>
          </div>
          <div className="absolute bottom-4 right-4 text-gray-500 text-xs">Carte simulée — Intégration Google Maps disponible</div>
        </div>
      </div>

      {/* Vehicle cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {VEHICLES.map(v => {
          const s = STATUS[v.statut]
          const batColor = v.batterie_gps > 50 ? 'text-green-400' : v.batterie_gps > 20 ? 'text-yellow-400' : 'text-red-400'
          return (
            <div key={v.id} className="card-luxe p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">{v.marque}</p>
                  <h3 className="text-white font-semibold">{v.nom}</h3>
                  <p className="text-gray-600 text-xs">{v.plaque}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${s.bg} ${s.text}`}>{s.label}</span>
              </div>

              <div className="flex items-start gap-2 mb-4">
                <MapPin size={12} className="text-gold-500 mt-0.5 shrink-0" />
                <span className="text-gray-400 text-xs leading-relaxed">{v.localisation}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-900 rounded-lg p-2.5 text-center">
                  <Navigation size={12} className="text-gold-400 mx-auto mb-1" />
                  <p className="text-white text-sm font-bold">{v.vitesse}</p>
                  <p className="text-gray-600 text-xs">km/h</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-2.5 text-center">
                  <Activity size={12} className="text-blue-400 mx-auto mb-1" />
                  <p className="text-white text-sm font-bold">{v.distance_aujourd_hui}</p>
                  <p className="text-gray-600 text-xs">km/jour</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-2.5 text-center">
                  <Zap size={12} className={`${batColor} mx-auto mb-1`} />
                  <p className={`${batColor} text-sm font-bold`}>{v.batterie_gps}%</p>
                  <p className="text-gray-600 text-xs">Batterie</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-xs flex items-center gap-1"><Clock size={10} /> {v.dernierePing}</span>
                {v.chauffeur && <span className="text-gray-400 text-xs">{v.chauffeur}</span>}
              </div>

              {v.statut === 'en_course' && (
                <button className="w-full mt-3 flex items-center justify-center gap-2 bg-red-500/8 hover:bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-medium py-2 rounded-lg transition-all">
                  <AlertTriangle size={11} /> Coupure moteur d'urgence
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
