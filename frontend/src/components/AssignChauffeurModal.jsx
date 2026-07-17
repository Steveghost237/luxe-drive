import { useState } from 'react'
import {
  X, Search, Star, CheckCircle2, Clock, UserX, Car,
  ChevronRight, ChevronLeft, MapPin, Phone, Languages, Shield,
} from 'lucide-react'
import useFleetStore from '../store/fleetStore'

const DISPO = {
  disponible:   { label: 'Disponible',    dot: 'bg-green-400',  text: 'text-green-400',  badge: 'bg-green-500/10 border-green-500/30 text-green-400'  },
  en_course:    { label: 'En course',     dot: 'bg-yellow-400', text: 'text-yellow-400', badge: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'},
  indisponible: { label: 'Indisponible',  dot: 'bg-red-400',    text: 'text-red-400',    badge: 'bg-red-500/10 border-red-500/30 text-red-400'         },
}

function PlanningMini({ planning }) {
  return (
    <div className="flex gap-0.5 mt-2">
      {planning.map(({ jour, debut }) => (
        <div key={jour} className="flex flex-col items-center gap-0.5">
          <div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold ${debut ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-600'}`}>
            {jour[0]}
          </div>
        </div>
      ))}
    </div>
  )
}

function ChauffeurCard({ chauffeur, selected, onSelect, assignedVehicleNames }) {
  const d = DISPO[chauffeur.disponibilite]
  const isSelected = selected.includes(chauffeur.id)
  const blocked = chauffeur.disponibilite === 'indisponible'

  return (
    <div
      onClick={() => !blocked && onSelect(chauffeur.id)}
      className={`card-luxe p-4 transition-all cursor-pointer relative ${
        blocked ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-600'
      } ${isSelected ? 'border-gold-500/60 bg-gold-500/5' : ''}`}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center">
          <CheckCircle2 size={14} className="text-black" />
        </div>
      )}

      <div className="flex gap-3">
        <div className="relative shrink-0">
          <img src={chauffeur.photo} alt={chauffeur.prenom}
            className="w-14 h-14 rounded-xl object-cover bg-gray-800" />
          <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-gray-900 ${d.dot}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-white font-semibold text-sm">{chauffeur.prenom} {chauffeur.nom}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 text-xs font-bold">{chauffeur.note}</span>
                <span className="text-gray-600 text-xs">· {chauffeur.missions} missions</span>
              </div>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${d.badge}`}>
              {d.label}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1"><MapPin size={9} />{chauffeur.ville}</span>
            <span className="flex items-center gap-1"><Shield size={9} />Cat. {chauffeur.permis}</span>
          </div>

          {chauffeur.vehiculeAssigne && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-yellow-500/70">
              <Car size={9} />
              <span>Assigné à {assignedVehicleNames[chauffeur.vehiculeAssigne] || 'un véhicule'}</span>
            </div>
          )}

          <div className="flex items-center gap-1 mt-1 flex-wrap">
            {chauffeur.langues.map(l => (
              <span key={l} className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">{l}</span>
            ))}
          </div>

          <PlanningMini planning={chauffeur.planning} />
        </div>
      </div>

      {blocked && (
        <div className="mt-2 text-xs text-red-400/70 flex items-center gap-1">
          <UserX size={10} /> Non disponible actuellement
        </div>
      )}
    </div>
  )
}

// ── Confirmation step ─────────────────────────────────────────────────────────
function ConfirmStep({ chauffeur, vehicules, onConfirm, onBack, loading }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-800">
        <button onClick={onBack} className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors mb-4">
          <ChevronLeft size={16} /> Retour au catalogue
        </button>
        <h2 className="text-lg font-display font-bold text-white">Confirmer l'assignation</h2>
        <p className="text-gray-500 text-sm mt-0.5">Vérifiez les détails avant de valider</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Chauffeur card */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">Chauffeur sélectionné</p>
          <div className="card-luxe border-gold-500/30 p-5">
            <div className="flex items-center gap-4">
              <img src={chauffeur.photo} alt={chauffeur.prenom}
                className="w-16 h-16 rounded-xl object-cover border-2 border-gold-500/30" />
              <div>
                <p className="text-white font-bold text-base">{chauffeur.prenom} {chauffeur.nom}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-xs font-bold">{chauffeur.note}</span>
                  <span className="text-gray-500 text-xs">· {chauffeur.missions} missions</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                  <MapPin size={10} />{chauffeur.ville}
                  <Phone size={10} />{chauffeur.tel}
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  {chauffeur.langues.map(l => (
                    <span key={l} className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">{l}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-3 leading-relaxed italic">"{chauffeur.bio}"</p>

            {/* Planning week */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <p className="text-gray-600 text-xs mb-2 uppercase tracking-wider">Planning hebdomadaire</p>
              <div className="grid grid-cols-7 gap-1">
                {chauffeur.planning.map(({ jour, debut, fin }) => (
                  <div key={jour} className={`rounded-lg p-1.5 text-center ${debut ? 'bg-green-500/10 border border-green-500/20' : 'bg-gray-800/50'}`}>
                    <p className="text-[9px] font-bold text-gray-500">{jour}</p>
                    {debut ? (
                      <>
                        <p className="text-[9px] text-green-400 font-medium">{debut}</p>
                        <p className="text-[9px] text-green-400/70">{fin}</p>
                      </>
                    ) : (
                      <p className="text-[9px] text-gray-700 mt-0.5">—</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-3">
            Véhicule{vehicules.length > 1 ? 's' : ''} assigné{vehicules.length > 1 ? 's' : ''} ({vehicules.length})
          </p>
          <div className="space-y-3">
            {vehicules.map(v => (
              <div key={v.id} className="card-luxe p-4 flex items-center gap-4">
                <img src={v.image} alt={v.nom}
                  className="w-16 h-11 object-cover rounded-lg bg-gray-800 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm">{v.marque} {v.nom}</p>
                  <p className="text-gray-500 text-xs">{v.plaque} · {v.annee}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact notice */}
        <div className="p-4 bg-yellow-500/8 border border-yellow-500/20 rounded-xl flex items-start gap-3">
          <Clock size={14} className="text-yellow-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-yellow-400 text-xs font-semibold mb-1">Impact sur le planning</p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Le planning de <strong className="text-white">{chauffeur.prenom} {chauffeur.nom}</strong> sera
              bloqué dès qu'il acceptera une course pour ce véhicule. Il ne pourra pas prendre d'autres
              missions simultanément.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-800">
        <button onClick={onConfirm} disabled={loading}
          className="w-full btn-gold py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? (
            <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Assignation en cours…</>
          ) : (
            <><CheckCircle2 size={16} /> Confirmer l'assignation</>
          )}
        </button>
      </div>
    </div>
  )
}

// ── Success toast ─────────────────────────────────────────────────────────────
function SuccessStep({ chauffeur, vehicules, onClose }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-10 text-center">
      <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-5">
        <CheckCircle2 size={32} className="text-green-400" />
      </div>
      <h2 className="text-xl font-display font-bold text-white mb-2">Assignation confirmée !</h2>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
        <strong className="text-gold-400">{chauffeur.prenom} {chauffeur.nom}</strong> est maintenant
        assigné à {vehicules.length > 1 ? `${vehicules.length} véhicules` : `${vehicules[0]?.marque} ${vehicules[0]?.nom}`}.
        <br />Son planning sera automatiquement bloqué lors de l'acceptation d'une course.
      </p>

      {/* Photos */}
      <div className="flex items-center gap-4 mb-8">
        <img src={chauffeur.photo} alt="" className="w-16 h-16 rounded-xl object-cover border-2 border-gold-500/40" />
        <div className="text-gold-400"><ChevronRight size={20} /></div>
        {vehicules.slice(0, 2).map(v => (
          <img key={v.id} src={v.image} alt="" className="w-20 h-14 rounded-xl object-cover border-2 border-gray-700" />
        ))}
        {vehicules.length > 2 && (
          <div className="w-14 h-14 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 text-sm font-bold">
            +{vehicules.length - 2}
          </div>
        )}
      </div>

      <button onClick={onClose} className="btn-gold px-8 py-3 text-sm">
        Fermer
      </button>
    </div>
  )
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function AssignChauffeurModal({ vehicules, onClose }) {
  const { chauffeurs, assignments, assignerChauffeur } = useFleetStore()
  const [step, setStep]           = useState('catalogue') // catalogue | confirm | success
  const [search, setSearch]       = useState('')
  const [selectedIds, setSelectedIds] = useState([])  // chauffeur id(s) — we pick 1
  const [filterDispo, setFilterDispo] = useState('tous')
  const [loading, setLoading]     = useState(false)

  // Map vehiculeId → nom for display
  const vehicleNameMap = Object.fromEntries(
    chauffeurs
      .filter(c => c.vehiculeAssigne)
      .map(c => {
        const v = vehicules.find(vv => vv.id === c.vehiculeAssigne)
        return [c.vehiculeAssigne, v ? `${v.marque} ${v.nom}` : c.vehiculeAssigne]
      })
  )

  const filtered = chauffeurs.filter(c => {
    const q = `${c.prenom} ${c.nom} ${c.ville}`.toLowerCase()
    const matchQ = !search || q.includes(search.toLowerCase())
    const matchD = filterDispo === 'tous' || c.disponibilite === filterDispo
    return matchQ && matchD
  })

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [id]) // single chauffeur selection
  }

  const selectedChauffeur = chauffeurs.find(c => c.id === selectedIds[0])

  const handleConfirm = () => {
    setLoading(true)
    setTimeout(() => {
      assignerChauffeur(vehicules.map(v => v.id), selectedIds[0])
      setLoading(false)
      setStep('success')
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">

        {/* Success */}
        {step === 'success' && (
          <SuccessStep chauffeur={selectedChauffeur} vehicules={vehicules} onClose={onClose} />
        )}

        {/* Confirm */}
        {step === 'confirm' && selectedChauffeur && (
          <ConfirmStep
            chauffeur={selectedChauffeur}
            vehicules={vehicules}
            onConfirm={handleConfirm}
            onBack={() => setStep('catalogue')}
            loading={loading}
          />
        )}

        {/* Catalogue */}
        {step === 'catalogue' && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-800 shrink-0">
              <div>
                <h2 className="text-lg font-display font-bold text-white">Catalogue Chauffeurs</h2>
                <p className="text-gray-500 text-sm mt-0.5">
                  Pour {vehicules.length === 1
                    ? `${vehicules[0].marque} ${vehicules[0].nom}`
                    : `${vehicules.length} véhicules sélectionnés`}
                </p>
              </div>
              <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            {/* Filters */}
            <div className="px-6 pt-4 pb-3 border-b border-gray-800/60 shrink-0">
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher un chauffeur…"
                  className="w-full bg-gray-900 border border-gray-700 focus:border-gold-500/50 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors" />
              </div>
              <div className="flex gap-2">
                {[
                  { key:'tous', label:'Tous' },
                  { key:'disponible', label:'Disponibles' },
                  { key:'en_course', label:'En course' },
                  { key:'indisponible', label:'Indisponibles' },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => setFilterDispo(key)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${filterDispo === key ? 'bg-gold-500/10 text-gold-400 border-gold-500/30' : 'text-gray-500 border-gray-700 hover:border-gray-500'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-sm">Aucun chauffeur trouvé</p>
                </div>
              )}
              {filtered.map(c => (
                <ChauffeurCard
                  key={c.id}
                  chauffeur={c}
                  selected={selectedIds}
                  onSelect={toggleSelect}
                  assignedVehicleNames={vehicleNameMap}
                />
              ))}
            </div>

            {/* Footer CTA */}
            <div className="p-5 border-t border-gray-800 shrink-0">
              <button
                disabled={selectedIds.length === 0}
                onClick={() => setStep('confirm')}
                className="w-full btn-gold py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                Continuer
                {selectedIds.length > 0 && (
                  <span className="bg-black/20 px-1.5 rounded text-xs">
                    {selectedChauffeur?.prenom} {selectedChauffeur?.nom}
                  </span>
                )}
                <ChevronRight size={16} />
              </button>
              {selectedIds.length === 0 && (
                <p className="text-gray-600 text-xs text-center mt-2">Sélectionnez un chauffeur pour continuer</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
