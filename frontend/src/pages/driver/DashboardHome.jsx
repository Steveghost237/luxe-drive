import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Star, MapPin, Clock, CheckCircle2, AlertTriangle, Calendar,
  Navigation, Phone, Shield, TrendingUp, Car, ChevronRight, FileText,
  Zap, UserCheck, XCircle,
} from 'lucide-react'
import useAuthStore  from '../../store/authStore'
import useFleetStore from '../../store/fleetStore'

const NEXT_MISSION = {
  ref: 'MIS-2025-0445', vehicule: 'Mercedes-Benz Classe S 580',
  plaque: 'LT-1234-YA', client: 'M. Christophe Ondoua',
  telephone: '+237 677 123 456', type: 'Transfert Aéroport',
  depart: 'Hôtel Hilton, Yaoundé', arrivee: 'Aéroport Nsimalen',
  heure: '14:30', date: "Aujourd'hui", statut: 'confirmé',
  image: 'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=600&q=80',
}
const STATS = [
  { label: 'Missions ce mois', value: '18',    sub: '+3 vs mois dernier',  color: 'text-gold-400'  },
  { label: 'Note moyenne',     value: '4.9',   sub: '48 évaluations',      color: 'text-yellow-400'},
  { label: 'Km parcourus',     value: '1 240', sub: 'Ce mois',             color: 'text-blue-400'  },
  { label: 'Revenus',          value: '185K',  sub: 'FCFA ce mois',        color: 'text-green-400' },
]
const EVALS = [
  { client: 'M. Etoga Jean',  note: 5, comment: 'Ponctuel, courtois, dress code impeccable.', date: '05 Juin' },
  { client: 'Mme Bika Grace', note: 5, comment: 'Excellent chauffeur, conduite douce.',       date: '03 Juin' },
  { client: 'Amb. de France', note: 4, comment: 'Très professionnel. Légère imprécision GPS.',date: '01 Juin' },
]
const DRESS = [
  { item: 'Costume noir',       ok: true  },
  { item: 'Chemise blanche',    ok: true  },
  { item: 'Cravate noire',      ok: true  },
  { item: 'Chaussures noires',  ok: true  },
  { item: 'Chaussettes noires', ok: false },
]

function Stars({ n }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({length:5}).map((_,i)=>(
        <Star key={i} size={11} className={i<n?'text-yellow-400 fill-yellow-400':'text-gray-700'} />
      ))}
    </div>
  )
}

export default function DashboardHome() {
  const { user } = useAuthStore()
  const { getCoursesForChauffeur, getActiveCourse, accepterCourse, demarrerCourse, terminerCourse, chauffeurs } = useFleetStore()
  const navigate = useNavigate()
  const dressOk = DRESS.every(d => d.ok)

  // Mock: current driver id = 'c1' — in prod derived from user.driverId
  const DRIVER_ID = 'c1'
  const coursesDispos = getCoursesForChauffeur(DRIVER_ID)
  const activeCourse  = getActiveCourse(DRIVER_ID)
  const myChauffeur   = chauffeurs.find(c => c.id === DRIVER_ID)
  const isEnCourse    = !!activeCourse

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">
            Bonjour, {user?.prenom || 'Chauffeur'} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Vendredi 13 juin 2025 · Bonne journée !</p>
        </div>
        <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium ${
          isEnCourse
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-gray-900 border-gray-700 text-gray-400'
        }`}>
          <div className={`w-2 h-2 rounded-full ${isEnCourse ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
          {isEnCourse ? 'En mission' : 'Disponible'}
        </div>
      </div>

      {/* CTA — compléter le profil chauffeur */}
      {!user?.profilComplet && (
        <div className="mb-6 card-luxe p-5 border-gold-500/25 bg-gradient-to-r from-gold-900/20 to-transparent flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-gold-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">Complétez votre profil chauffeur</p>
            <p className="text-gray-400 text-xs mt-0.5">Uploadez vos documents et renseignez vos informations pour commencer à recevoir des missions.</p>
          </div>
          <button onClick={() => navigate('/devenir-chauffeur')}
            className="btn-gold px-4 py-2 text-xs font-semibold shrink-0 rounded-xl">
            Compléter →
          </button>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {STATS.map(({label, value, sub, color}) => (
          <div key={label} className="card-luxe p-5">
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-gray-600 text-xs mt-1">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-5 gap-6">

        {/* Left col */}
        <div className="xl:col-span-3 space-y-6">

          {/* ── Course active ou courses dispo ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                {isEnCourse
                  ? <><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Course en cours</>  
                  : <><Zap size={16} className="text-gold-400" /> Courses disponibles</>}
              </h2>
              <button onClick={() => navigate('/chauffeur/missions')}
                className="text-gold-400 hover:text-gold-300 text-xs flex items-center gap-1 transition-colors">
                Toutes <ChevronRight size={13} />
              </button>
            </div>

            {/* Active course */}
            {activeCourse && (
              <div className="card-luxe border-green-500/30 overflow-hidden mb-4">
                <div className="relative h-32">
                  <img src={activeCourse.vehiculeImage} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/30" />
                  <div className="absolute inset-4 flex flex-col justify-between">
                    <span className="bg-green-500/20 border border-green-500/40 text-green-400 text-xs px-2.5 py-1 rounded-full w-fit flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      {activeCourse.statut === 'en_cours' ? 'En course' : 'Acceptée — En attente démarrage'}
                    </span>
                    <div>
                      <p className="text-white font-display font-semibold">{activeCourse.vehiculeNom}</p>
                      <p className="text-gray-400 text-xs">{activeCourse.plaque}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0">
                        <Clock size={13} className="text-gold-400" />
                      </div>
                      <div><p className="text-gray-500 text-xs">Heure</p>
                        <p className="text-white text-sm font-semibold">{activeCourse.heure} · {activeCourse.date}</p></div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Phone size={13} className="text-blue-400" />
                      </div>
                      <div><p className="text-gray-500 text-xs">Client</p>
                        <p className="text-white text-sm font-semibold">{activeCourse.client}</p>
                        <p className="text-gray-500 text-xs">{activeCourse.telephone}</p></div>
                    </div>
                    <div className="flex items-start gap-2.5 sm:col-span-2">
                      <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                        <MapPin size={13} className="text-green-400" />
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div><p className="text-gray-500 text-xs">Départ</p>
                          <p className="text-white text-xs font-medium truncate">{activeCourse.depart}</p></div>
                        <div className="flex-1 h-px bg-gradient-to-r from-green-500/40 to-red-500/40 mx-1" />
                        <div><p className="text-gray-500 text-xs">Arrivée</p>
                          <p className="text-white text-xs font-medium truncate">{activeCourse.arrivee}</p></div>
                      </div>
                    </div>
                  </div>
                  {activeCourse.statut === 'acceptee' && (
                    <button onClick={() => demarrerCourse(activeCourse.id)}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold btn-gold flex items-center justify-center gap-2">
                      <Navigation size={15} /> Démarrer la mission
                    </button>
                  )}
                  {activeCourse.statut === 'en_cours' && (
                    <button onClick={() => terminerCourse(activeCourse.id, DRIVER_ID)}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 flex items-center justify-center gap-2 transition-all">
                      <CheckCircle2 size={15} /> Fin de course — Terminer
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Available courses preview (max 2) */}
            {!isEnCourse && coursesDispos.length > 0 && (
              <div className="space-y-3">
                {coursesDispos.slice(0, 2).map(c => (
                  <div key={c.id} className="card-luxe p-4 flex items-center gap-4">
                    <img src={c.vehiculeImage} alt="" className="w-14 h-10 object-cover rounded-lg bg-gray-800 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{c.vehiculeNom}</p>
                      <p className="text-gray-500 text-[10px]">{c.type} · {c.date} {c.heure}</p>
                      <p className="text-gold-400 text-xs font-bold">{c.montant} FCFA</p>
                    </div>
                    <button onClick={() => accepterCourse(c.id, DRIVER_ID)}
                      className="flex items-center gap-1.5 bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 text-xs font-semibold px-3 py-2 rounded-lg transition-all shrink-0">
                      <Zap size={11} /> Prendre
                    </button>
                  </div>
                ))}
                {coursesDispos.length > 2 && (
                  <button onClick={() => navigate('/chauffeur/missions')}
                    className="w-full text-xs text-gray-500 hover:text-gold-400 transition-colors py-2">
                    +{coursesDispos.length - 2} autres courses disponibles →
                  </button>
                )}
              </div>
            )}

            {!isEnCourse && coursesDispos.length === 0 && (
              <div className="card-luxe p-8 text-center">
                <Car size={32} className="text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Aucune course disponible pour vos véhicules assignés</p>
                <p className="text-gray-700 text-xs mt-1">Le propriétaire doit vous assigner un véhicule pour voir les courses</p>
              </div>
            )}
          </div>

          {/* Recent evals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Star size={16} className="text-gold-400" /> Dernières évaluations
              </h2>
              <button onClick={() => navigate('/chauffeur/evaluations')}
                className="text-gold-400 hover:text-gold-300 text-xs flex items-center gap-1 transition-colors">
                Voir tout <ChevronRight size={13} />
              </button>
            </div>
            <div className="space-y-3">
              {EVALS.map((e,i) => (
                <div key={i} className="card-luxe p-4 flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 text-xs font-bold text-gray-400">
                    {e.client.split(' ').map(w=>w[0]).slice(0,2).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white text-sm font-medium">{e.client}</p>
                      <Stars n={e.note} />
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed">{e.comment}</p>
                    <p className="text-gray-700 text-xs mt-1">{e.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="xl:col-span-2 space-y-4">

          {/* Dress code */}
          <div className={`card-luxe p-5 ${dressOk ? 'border-green-500/20' : 'border-orange-500/30'}`}>
            <div className="flex items-center gap-2 mb-3">
              {dressOk ? <CheckCircle2 size={15} className="text-green-400" /> : <AlertTriangle size={15} className="text-orange-400" />}
              <h3 className="text-white font-semibold text-sm">Dress Code du jour</h3>
            </div>
            <div className="space-y-2">
              {DRESS.map(({item,ok}) => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${ok?'bg-green-500/10 border border-green-500/30':'bg-orange-500/10 border border-orange-500/30'}`}>
                    {ok ? <CheckCircle2 size={10} className="text-green-400" /> : <AlertTriangle size={10} className="text-orange-400" />}
                  </div>
                  <span className={`text-xs ${ok?'text-gray-400':'text-orange-300 font-medium'}`}>{item}</span>
                </div>
              ))}
            </div>
            {!dressOk && <p className="text-orange-400 text-xs mt-3 flex items-start gap-1.5"><AlertTriangle size={11} className="mt-0.5 shrink-0" />Dress code incomplet — peut impacter votre note.</p>}
          </div>

          {/* Performance rapide */}
          <div className="card-luxe p-5 border-gold-500/15 bg-gradient-to-b from-gold-900/10 to-transparent">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} className="text-gold-400" />
              <h3 className="text-white font-semibold text-sm">Performance</h3>
            </div>
            {[
              { label: 'Ponctualité',    pct: 96 },
              { label: 'Satisfaction',   pct: 98 },
              { label: 'Dress code',     pct: 90 },
            ].map(({label, pct}) => (
              <div key={label} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{label}</span>
                  <span className="text-gold-400 font-bold">{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all" style={{width:`${pct}%`}} />
                </div>
              </div>
            ))}
            <button onClick={() => navigate('/chauffeur/performance')}
              className="text-gold-400 hover:text-gold-300 text-xs mt-1 flex items-center gap-1 transition-colors">
              Voir détails <ChevronRight size={12} />
            </button>
          </div>

          {/* Pool véhicules */}
          <div className="card-luxe p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={15} className="text-blue-400" />
              <h3 className="text-white font-semibold text-sm">Mon Pool</h3>
            </div>
            <div className="space-y-2">
              {[
                {nom:'Mercedes Classe S 580', proprio:'M. Ngono Fabrice'},
                {nom:'Audi A8 L',             proprio:'Mme Ateba Christine'},
              ].map(({nom,proprio}) => (
                <div key={nom} className="bg-gray-900 rounded-lg px-3 py-2.5">
                  <p className="text-white text-xs font-medium">{nom}</p>
                  <p className="text-gray-600 text-xs">{proprio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
