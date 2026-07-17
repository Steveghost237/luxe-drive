import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Car, TrendingUp, Satellite, Wrench, AlertTriangle, CheckCircle2,
  MapPin, Zap, Clock, DollarSign, Plus, ChevronRight, Activity, Users
} from 'lucide-react'
import useAuthStore from '../../store/authStore'

const FLEET = [
  { id:'f1', nom:'Classe S 580', marque:'Mercedes-Benz', plaque:'LT-1234-YA', statut:'en_course', kilometrage:24800, chauffeur:'Jean-Marc Eyenga', client:'Ministère des Finances', localisation:'Yaoundé Centre-Ville', vitesse:42, prochaine_maintenance:'2 400 km restants', image:'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=400&q=80' },
  { id:'f2', nom:'Range Rover Autobiography', marque:'Land Rover', plaque:'LT-5678-DL', statut:'disponible', kilometrage:18200, chauffeur:null, client:null, localisation:'Dépôt Douala Akwa', vitesse:0, prochaine_maintenance:'7 800 km restants', image:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80' },
  { id:'f3', nom:'BMW Serie 7', marque:'BMW', plaque:'LT-9012-YA', statut:'maintenance', kilometrage:52400, chauffeur:null, client:null, localisation:'Garage Agréé — Bastos', vitesse:0, prochaine_maintenance:'En maintenance', image:'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80' },
  { id:'f4', nom:'Audi A8 L', marque:'Audi', plaque:'LT-3456-YA', statut:'en_course', kilometrage:31600, chauffeur:'Paul Biya Nkodo', client:'Ambassade de France', localisation:'Bastos, Yaoundé', vitesse:28, prochaine_maintenance:'5 400 km restants', image:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80' },
]

const TRANSACTIONS = [
  { ref:'LXD-2024-0891', vehicule:'Mercedes S 580', client:'Min. Finances', montant:540000, statut:'versé', date:'08 Juin 2025' },
  { ref:'LXD-2024-0887', vehicule:'Range Rover', client:'Pierre Atangana', montant:200000, statut:'sequestre', date:'06 Juin 2025' },
  { ref:'LXD-2024-0879', vehicule:'Audi A8', client:'Ambassade France', montant:875000, statut:'sequestre', date:'03 Juin 2025' },
  { ref:'LXD-2024-0870', vehicule:'BMW Serie 7', client:'ONG Croix-Rouge', montant:320000, statut:'versé', date:'01 Juin 2025' },
]

const STATUS = {
  en_course:   { label:'En course',   dot:'bg-green-400',  text:'text-green-400',  bg:'bg-green-500/10 border-green-500/30' },
  disponible:  { label:'Disponible',  dot:'bg-blue-400',   text:'text-blue-400',   bg:'bg-blue-500/10 border-blue-500/30' },
  maintenance: { label:'Maintenance', dot:'bg-orange-400', text:'text-orange-400', bg:'bg-orange-500/10 border-orange-500/30' },
  indisponible:{ label:'Indisponible',dot:'bg-red-400',    text:'text-red-400',    bg:'bg-red-500/10 border-red-500/30' },
}
const PAYMT = { versé:'bg-green-500/10 text-green-400 border-green-500/30', sequestre:'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' }

export default function FleetHome() {
  const { user } = useAuthStore()
  const [selectedVehicle, setSelected] = useState(null)
  const enCourse = FLEET.filter(v => v.statut==='en_course').length
  const disponible = FLEET.filter(v => v.statut==='disponible').length
  const maintenanceCount = FLEET.filter(v => v.statut==='maintenance').length

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Bonjour, {user?.prenom || 'Propriétaire'} 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5">État en temps réel de votre flotte</p>
        </div>
        <Link to="/inscription-vehicule" className="btn-gold flex items-center gap-2 text-sm px-4 py-2.5">
          <Plus size={15} /> Ajouter un véhicule
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {[
          { icon:Car,      label:'Véhicules total', value:FLEET.length,     color:'bg-gold-500/10 text-gold-400',    border:'border-gold-500/20' },
          { icon:Activity, label:'En course',        value:enCourse,         color:'bg-green-500/10 text-green-400',  border:'border-green-500/20' },
          { icon:Clock,    label:'Disponibles',       value:disponible,       color:'bg-blue-500/10 text-blue-400',    border:'border-blue-500/20' },
          { icon:Wrench,   label:'En maintenance',    value:maintenanceCount, color:'bg-orange-500/10 text-orange-400',border:'border-orange-500/20' },
        ].map(({ icon:Icon, label, value, color, border }) => (
          <div key={label} className={`card-luxe ${border} p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}><Icon size={20} /></div>
            <div><p className="text-gray-500 text-xs">{label}</p><p className="text-white text-2xl font-bold mt-0.5">{value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        {[
          { label:'En séquestre',       value:'1 075 000 FCFA', icon:Clock,      color:'text-yellow-400', bg:'bg-yellow-500/10 border-yellow-500/20' },
          { label:'Disponible au retrait', value:'860 000 FCFA',icon:DollarSign, color:'text-green-400',  bg:'bg-green-500/10 border-green-500/20' },
          { label:'Ce mois (total)',    value:'1 935 000 FCFA', icon:TrendingUp, color:'text-gold-400',   bg:'bg-gold-500/10 border-gold-500/20' },
        ].map(({ label, value, icon:Icon, color, bg }) => (
          <div key={label} className={`card-luxe ${bg} p-5 flex items-center gap-4`}>
            <Icon className={color} size={20} />
            <div><p className="text-gray-500 text-xs">{label}</p><p className={`${color} font-bold text-lg mt-0.5`}>{value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Flotte en temps réel</h2>
            <span className="text-gray-600 text-xs">{FLEET.length} véhicules</span>
          </div>
          <div className="space-y-3">
            {FLEET.map((v) => {
              const s = STATUS[v.statut]
              return (
                <div key={v.id} onClick={() => setSelected(v.id === selectedVehicle ? null : v.id)}
                  className={`card-luxe p-4 cursor-pointer transition-all duration-200 hover:border-gray-600 ${selectedVehicle===v.id?'border-gold-500/40':''}`}>
                  <div className="flex items-center gap-4">
                    <img src={v.image} alt={v.nom} className="w-16 h-12 object-cover rounded-lg bg-gray-800" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-white font-medium text-sm truncate">{v.marque} {v.nom}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${s.bg} ${s.text} shrink-0`}>{s.label}</span>
                      </div>
                      <p className="text-gray-600 text-xs">{v.plaque}</p>
                      {v.localisation && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin size={10} className="text-gray-600" />
                          <span className="text-gray-500 text-xs">{v.localisation}</span>
                          {v.vitesse > 0 && <span className="ml-2 text-green-400 text-xs font-medium">{v.vitesse} km/h</span>}
                        </div>
                      )}
                    </div>
                    <ChevronRight size={16} className={`text-gray-600 transition-transform ${selectedVehicle===v.id?'rotate-90':''}`} />
                  </div>
                  {selectedVehicle===v.id && (
                    <div className="mt-4 pt-4 border-t border-gray-800 grid sm:grid-cols-2 gap-3">
                      {v.chauffeur && <div className="flex items-center gap-2.5"><Users size={13} className="text-gray-500" /><div><p className="text-gray-600 text-xs">Chauffeur</p><p className="text-white text-xs font-medium">{v.chauffeur}</p></div></div>}
                      {v.client && <div className="flex items-center gap-2.5"><CheckCircle2 size={13} className="text-gray-500" /><div><p className="text-gray-600 text-xs">Client</p><p className="text-white text-xs font-medium">{v.client}</p></div></div>}
                      <div className="flex items-center gap-2.5"><Zap size={13} className="text-gray-500" /><div><p className="text-gray-600 text-xs">Kilométrage</p><p className="text-white text-xs font-medium">{v.kilometrage.toLocaleString('fr-FR')} km</p></div></div>
                      <div className="flex items-center gap-2.5"><Wrench size={13} className={v.statut==='maintenance'?'text-orange-400':'text-gray-500'} /><div><p className="text-gray-600 text-xs">Maintenance</p><p className={`text-xs font-medium ${v.statut==='maintenance'?'text-orange-400':'text-white'}`}>{v.prochaine_maintenance}</p></div></div>
                      {v.statut==='en_course' && (
                        <div className="sm:col-span-2 mt-2">
                          <button className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-medium py-2 rounded-lg transition-all">
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

        <div className="xl:col-span-2">
          <h2 className="text-white font-semibold mb-4">Derniers versements</h2>
          <div className="space-y-3">
            {TRANSACTIONS.map((t) => (
              <div key={t.ref} className="card-luxe p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div><p className="text-white text-xs font-medium">{t.vehicule}</p><p className="text-gray-600 text-xs">{t.client}</p></div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${PAYMT[t.statut]}`}>{t.statut}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gold-400 font-bold text-sm">{t.montant.toLocaleString('fr-FR')} FCFA</span>
                  <span className="text-gray-600 text-xs">{t.date}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="card-luxe p-5 mt-5 border-gold-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle size={15} className="text-gold-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-white text-xs font-semibold mb-1">Règle de séquestre</p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  <strong className="text-gray-400">Location &lt; 1 semaine :</strong> 20% à la réservation, 80% débloqués J+1.<br /><br />
                  <strong className="text-gray-400">Location &gt; 1 semaine :</strong> 50% au terme de la 1ère semaine, solde échelonné.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
