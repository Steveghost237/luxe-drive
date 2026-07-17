import { useState } from 'react'
import {
  Car, Clock, MapPin, Phone, CheckCircle2, XCircle,
  Navigation, AlertTriangle, Search, ChevronDown,
  Zap, UserCheck,
} from 'lucide-react'
import useFleetStore from '../../store/fleetStore'
import useAuthStore  from '../../store/authStore'

const ALL_MISSIONS = [
  {
    id: 1, ref: 'MIS-2025-0447', statut: 'en_attente',
    vehicule: 'Mercedes-Benz Classe S 580', plaque: 'LT-1234-YA',
    client: 'M. Fouda Serge', telephone: '+237 699 887 766',
    type: 'Transfert Aéroport', depart: 'Hôtel Pullman, Yaoundé',
    arrivee: 'Aéroport Nsimalen', date: '13 Juin 2025', heure: '10:00',
    montant: '25 000 FCFA', km: 28, duree: '35 min',
  },
  {
    id: 2, ref: 'MIS-2025-0446', statut: 'en_attente',
    vehicule: 'Audi A8 L', plaque: 'LT-5678-YA',
    client: 'Mme Owona Sandrine', telephone: '+237 677 112 233',
    type: 'Mise à disposition', depart: 'Bastos, Yaoundé',
    arrivee: 'Melen, Yaoundé', date: '13 Juin 2025', heure: '14:00',
    montant: '60 000 FCFA', km: 12, duree: '4 h',
  },
  {
    id: 3, ref: 'MIS-2025-0445', statut: 'confirmee',
    vehicule: 'Mercedes-Benz Classe S 580', plaque: 'LT-1234-YA',
    client: 'M. Christophe Ondoua', telephone: '+237 677 123 456',
    type: 'Transfert Aéroport', depart: 'Hôtel Hilton, Yaoundé',
    arrivee: 'Aéroport Nsimalen', date: "Aujourd'hui", heure: '14:30',
    montant: '25 000 FCFA', km: 28, duree: '35 min',
  },
  {
    id: 4, ref: 'MIS-2025-0440', statut: 'en_cours',
    vehicule: 'Range Rover Autobiography', plaque: 'LT-9012-YA',
    client: 'Ambassade de France', telephone: '+237 222 230 100',
    type: 'Protocole officiel', depart: 'Ambassade de France',
    arrivee: 'Palais de l\'Unité', date: "Aujourd'hui", heure: '09:00',
    montant: '80 000 FCFA', km: 8, duree: '2 h',
  },
  {
    id: 5, ref: 'MIS-2025-0435', statut: 'terminee',
    vehicule: 'Mercedes-Benz Classe S 580', plaque: 'LT-1234-YA',
    client: 'M. Ndi Albert', telephone: '+237 655 443 322',
    type: 'Transfert hôtel', depart: 'Aéroport Nsimalen',
    arrivee: 'Hôtel Mont Fébé', date: '10 Juin 2025', heure: '18:15',
    montant: '30 000 FCFA', km: 35, duree: '45 min',
  },
  {
    id: 6, ref: 'MIS-2025-0430', statut: 'terminee',
    vehicule: 'Audi A8 L', plaque: 'LT-5678-YA',
    client: 'Mme Bika Grace', telephone: '+237 677 556 677',
    type: 'Mise à disposition', depart: 'Centre-ville, Yaoundé',
    arrivee: 'Diverses destinations', date: '08 Juin 2025', heure: '08:00',
    montant: '90 000 FCFA', km: 65, duree: '6 h',
  },
  {
    id: 7, ref: 'MIS-2025-0420', statut: 'annulee',
    vehicule: 'Bentley Bentayga', plaque: 'LT-3456-YA',
    client: 'M. Kameni Daniel', telephone: '+237 699 001 122',
    type: 'Événement privé', depart: 'Odza, Yaoundé',
    arrivee: 'Salle des fêtes Mvog-Mbi', date: '05 Juin 2025', heure: '19:00',
    montant: '0 FCFA', km: 0, duree: '—',
  },
]

const TABS = [
  { key: 'tous',        label: 'Toutes',     count: ALL_MISSIONS.length },
  { key: 'en_attente',  label: 'En attente', count: ALL_MISSIONS.filter(m=>m.statut==='en_attente').length },
  { key: 'confirmee',   label: 'Confirmées', count: ALL_MISSIONS.filter(m=>m.statut==='confirmee').length },
  { key: 'en_cours',    label: 'En cours',   count: ALL_MISSIONS.filter(m=>m.statut==='en_cours').length },
  { key: 'terminee',    label: 'Terminées',  count: ALL_MISSIONS.filter(m=>m.statut==='terminee').length },
  { key: 'annulee',     label: 'Annulées',   count: ALL_MISSIONS.filter(m=>m.statut==='annulee').length },
]

const STATUT_STYLE = {
  en_attente: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  confirmee:  'bg-blue-500/10 text-blue-400 border-blue-500/30',
  en_cours:   'bg-green-500/10 text-green-400 border-green-500/30',
  terminee:   'bg-gray-500/10 text-gray-400 border-gray-500/30',
  annulee:    'bg-red-500/10 text-red-400 border-red-500/30',
}
const STATUT_LABEL = {
  en_attente: 'En attente', confirmee: 'Confirmée',
  en_cours: 'En cours', terminee: 'Terminée', annulee: 'Annulée',
}

function MissionCard({ m, onAccept, onRefuse, onStart, onEnd }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="card-luxe overflow-hidden transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-500 text-xs font-mono">{m.ref}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUT_STYLE[m.statut]}`}>
                {STATUT_LABEL[m.statut]}
              </span>
            </div>
            <p className="text-white font-semibold text-sm">{m.type}</p>
            <p className="text-gray-400 text-xs">{m.vehicule} · {m.plaque}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-gold-400 font-bold text-sm">{m.montant}</p>
            <p className="text-gray-600 text-xs">{m.km} km · {m.duree}</p>
          </div>
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 mb-3 bg-gray-900/60 rounded-lg px-3 py-2.5">
          <div className="flex-1 min-w-0">
            <p className="text-gray-500 text-xs">Départ</p>
            <p className="text-white text-xs font-medium truncate">{m.depart}</p>
          </div>
          <div className="h-px w-8 bg-gradient-to-r from-green-500/50 to-red-500/50 shrink-0" />
          <div className="flex-1 min-w-0 text-right">
            <p className="text-gray-500 text-xs">Arrivée</p>
            <p className="text-white text-xs font-medium truncate">{m.arrivee}</p>
          </div>
        </div>

        {/* Date + client */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock size={12} />{m.date} à {m.heure}
          </div>
          <button onClick={() => setExpanded(v => !v)}
            className="text-gray-600 hover:text-gray-400 text-xs flex items-center gap-1 transition-colors">
            {expanded ? 'Réduire' : 'Détails'}
            <ChevronDown size={13} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-800 space-y-2">
            <div className="flex items-center gap-2">
              <Phone size={12} className="text-blue-400 shrink-0" />
              <div>
                <span className="text-white text-xs font-medium">{m.client}</span>
                <span className="text-gray-500 text-xs ml-2">{m.telephone}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {m.statut === 'en_attente' && (
        <div className="px-5 pb-4 flex gap-2">
          <button onClick={() => onAccept(m.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 text-xs font-semibold transition-all">
            <CheckCircle2 size={13} /> Accepter
          </button>
          <button onClick={() => onRefuse(m.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all">
            <XCircle size={13} /> Refuser
          </button>
        </div>
      )}
      {m.statut === 'confirmee' && (
        <div className="px-5 pb-4">
          <button onClick={() => onStart(m.id)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg btn-gold text-xs font-semibold transition-all">
            <Navigation size={13} /> Démarrer la mission
          </button>
        </div>
      )}
      {m.statut === 'en_cours' && (
        <div className="px-5 pb-4">
          <button onClick={() => onEnd(m.id)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all">
            <CheckCircle2 size={13} /> Terminer la mission
          </button>
        </div>
      )}
    </div>
  )
}

// ── Courses disponibles card ──────────────────────────────────────────────────
function CourseCard({ course, isMine, onPrendre, onDemarrer, onTerminer }) {
  const [exp, setExp] = useState(false)
  return (
    <div className={`card-luxe overflow-hidden transition-all ${
      course.statut === 'en_cours' ? 'border-green-500/40' :
      isMine                       ? 'border-blue-500/25'  : ''
    }`}>
      {/* Vehicle image strip */}
      <div className="relative h-28 overflow-hidden">
        <img src={course.vehiculeImage} alt={course.vehiculeNom}
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
          <div>
            <p className="text-white text-xs font-semibold">{course.vehiculeNom}</p>
            <p className="text-gray-400 text-[10px]">{course.plaque}</p>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
            course.statut === 'en_cours'   ? 'bg-green-500/20 border-green-500/40 text-green-400' :
            course.statut === 'acceptee'   ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'    :
            'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
          }`}>
            {course.statut === 'en_cours' ? '🟢 En cours' : course.statut === 'acceptee' ? '🔵 Acceptée' : '⚡ Disponible'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-white text-xs font-semibold">{course.type}</p>
            <p className="text-gray-500 text-[10px] font-mono">{course.ref}</p>
          </div>
          <p className="text-gold-400 font-bold text-sm shrink-0">{course.montant} FCFA</p>
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 mb-2 bg-gray-900/60 rounded-lg px-3 py-2">
          <div className="flex-1 min-w-0">
            <p className="text-gray-600 text-[10px]">Départ</p>
            <p className="text-white text-xs font-medium truncate">{course.depart}</p>
          </div>
          <div className="h-px w-6 bg-gradient-to-r from-green-500/50 to-red-500/50 shrink-0" />
          <div className="flex-1 min-w-0 text-right">
            <p className="text-gray-600 text-[10px]">Arrivée</p>
            <p className="text-white text-xs font-medium truncate">{course.arrivee}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-500 text-[10px] flex items-center gap-1">
            <Clock size={10} />{course.date} à {course.heure}
          </span>
          <span className="text-gray-500 text-[10px]">{course.km} km · {course.duree}</span>
          <button onClick={() => setExp(v => !v)}
            className="text-gray-600 hover:text-gray-400 text-[10px] flex items-center gap-0.5">
            {exp ? 'Moins' : 'Plus'} <ChevronDown size={11} className={`transition-transform ${exp?'rotate-180':''}`} />
          </button>
        </div>

        {exp && (
          <div className="mb-3 pt-2 border-t border-gray-800 flex items-center gap-2">
            <Phone size={11} className="text-blue-400 shrink-0" />
            <p className="text-white text-xs font-medium">{course.client}</p>
            <p className="text-gray-500 text-xs">{course.telephone}</p>
          </div>
        )}

        {/* CTA */}
        {course.statut === 'disponible' && (
          <button onClick={() => onPrendre(course.id)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 text-xs font-semibold transition-all">
            <Zap size={13} /> Prendre la course
          </button>
        )}
        {course.statut === 'acceptee' && (
          <button onClick={() => onDemarrer(course.id)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg btn-gold text-xs font-semibold transition-all">
            <Navigation size={13} /> Démarrer la mission
          </button>
        )}
        {course.statut === 'en_cours' && (
          <button onClick={() => onTerminer(course.id)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all">
            <CheckCircle2 size={13} /> Fin de course — Terminer
          </button>
        )}
      </div>
    </div>
  )
}

export default function MissionsPage() {
  const { user } = useAuthStore()
  const { getCoursesForChauffeur, accepterCourse, demarrerCourse, terminerCourse } = useFleetStore()

  const [tab, setTab]           = useState('tous')
  const [search, setSearch]     = useState('')
  const [missions, setMissions] = useState(ALL_MISSIONS)

  // Mock: current driver id = 'c1' (David Kameni) — in prod would be user.driverId
  const DRIVER_ID = 'c1'
  const coursesStore = getCoursesForChauffeur(DRIVER_ID)
  const activeCourse = coursesStore.find(c => ['acceptee','en_cours'].includes(c.statut))

  const filtered = missions.filter(m => {
    const matchTab = tab === 'tous' || m.statut === tab
    const q = search.toLowerCase()
    const matchSearch = !q || m.ref.toLowerCase().includes(q) ||
      m.client.toLowerCase().includes(q) || m.vehicule.toLowerCase().includes(q)
    return matchTab && matchSearch
  })

  const updateStatut = (id, statut) =>
    setMissions(prev => prev.map(m => m.id === id ? {...m, statut} : m))

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <Car size={22} className="text-gold-400" /> Mes Missions
        </h1>
        <p className="text-gray-500 text-sm mt-1">{missions.length} missions · {coursesStore.length} course{coursesStore.length > 1 ? 's' : ''} disponible{coursesStore.length > 1 ? 's' : ''}</p>
      </div>

      {/* ── COURSES DISPONIBLES (depuis le store) ── */}
      {coursesStore.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {activeCourse ? (
              <>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <h2 className="text-white font-semibold text-sm">Course en cours — Planning bloqué</h2>
                <span className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
                  Indisponible pour autres courses
                </span>
              </>
            ) : (
              <>
                <Zap size={15} className="text-gold-400" />
                <h2 className="text-white font-semibold text-sm">Courses disponibles pour vos véhicules assignés</h2>
                <span className="text-xs bg-gold-500/10 border border-gold-500/20 text-gold-400 px-2 py-0.5 rounded-full">
                  {coursesStore.filter(c => c.statut === 'disponible').length} disponible{coursesStore.filter(c => c.statut === 'disponible').length > 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {coursesStore.map(c => (
              <CourseCard key={c.id} course={c}
                isMine={c.chauffeurId === DRIVER_ID}
                onPrendre={id => {
                  if (activeCourse) return // already in a course
                  accepterCourse(id, DRIVER_ID)
                }}
                onDemarrer={id => demarrerCourse(id)}
                onTerminer={id => terminerCourse(id, DRIVER_ID)}
              />
            ))}
          </div>

          {/* Planning blocked notice */}
          {activeCourse && (
            <div className="mt-4 p-3 bg-red-500/6 border border-red-500/20 rounded-xl flex items-center gap-3 text-xs">
              <UserCheck size={14} className="text-red-400 shrink-0" />
              <p className="text-gray-400">
                Votre planning est <strong className="text-red-400">bloqué</strong> le temps de la course en cours.
                Terminez la course pour redevenir disponible.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="border-t border-gray-800/60 pt-6">
        <h2 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
          <Car size={15} className="text-gray-500" /> Historique des missions
        </h2>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par réf., client ou véhicule…"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 transition-colors" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-900/50 p-1 rounded-xl flex-wrap">
          {TABS.map(({key, label, count}) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tab === key ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' : 'text-gray-500 hover:text-white'
              }`}>
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? 'bg-gold-500/20' : 'bg-gray-800'}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Car size={36} className="mx-auto mb-3 opacity-30" />
            <p>Aucune mission trouvée</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-4">
            {filtered.map(m => (
              <MissionCard key={m.id} m={m}
                onAccept={id => updateStatut(id, 'confirmee')}
                onRefuse={id => updateStatut(id, 'annulee')}
                onStart={id  => updateStatut(id, 'en_cours')}
                onEnd={id    => updateStatut(id, 'terminee')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
