import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus, Search, Car, Edit3, Trash2,
  UserPlus, UserMinus, CheckSquare, Star, Users, Clock,
} from 'lucide-react'
import useFleetStore from '../../store/fleetStore'
import useAuthStore  from '../../store/authStore'
import AssignChauffeurModal from '../../components/AssignChauffeurModal'

const FLEET = [
  { id:'f1', nom:'Classe S 580 AMG Line',   marque:'Mercedes-Benz', plaque:'LT-1234-YA', annee:2023, segment:'Haut Luxe', statut:'en_course',  kilometrage:24800, carburant:'Hybride',             couleur:'Noir Obsidian', prixJour:250000, image:'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=400&q=80' },
  { id:'f2', nom:'Range Rover Autobiography',marque:'Land Rover',    plaque:'LT-5678-DL', annee:2022, segment:'Haut Luxe', statut:'disponible', kilometrage:18200, carburant:'Hybride',             couleur:'Blanc Fuji',    prixJour:300000, image:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80' },
  { id:'f3', nom:'BMW Serie 7 760Li',        marque:'BMW',           plaque:'LT-9012-YA', annee:2023, segment:'Haut Luxe', statut:'maintenance', kilometrage:52400, carburant:'Hybride',            couleur:'Gris Mineral',  prixJour:220000, image:'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80' },
  { id:'f4', nom:'Audi A8 L 60 TFSIe',      marque:'Audi',          plaque:'LT-3456-YA', annee:2022, segment:'Haut Luxe', statut:'en_course',  kilometrage:31600, carburant:'Hybride rechargeable',couleur:'Gris Manhattan',prixJour:200000, image:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80' },
  { id:'f5', nom:'Porsche Cayenne Turbo GT', marque:'Porsche',       plaque:'LT-7890-YA', annee:2024, segment:'Haut Luxe', statut:'disponible', kilometrage:8500,  carburant:'Essence',             couleur:'Craie',         prixJour:280000, image:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80' },
]

const STATUS = {
  en_course:   { label:'En course',   bg:'bg-green-500/10',  text:'text-green-400',  border:'border-green-500/30'  },
  disponible:  { label:'Disponible',  bg:'bg-blue-500/10',   text:'text-blue-400',   border:'border-blue-500/30'   },
  maintenance: { label:'Maintenance', bg:'bg-orange-500/10', text:'text-orange-400', border:'border-orange-500/30' },
  indisponible:{ label:'Indisponible',bg:'bg-red-500/10',    text:'text-red-400',    border:'border-red-500/30'    },
}

export default function FleetVehicules() {
  const { assignments, getAssignment, deassignerChauffeur, getVehiculesOwner } = useFleetStore()
  const { user } = useAuthStore()
  const [search, setSearch]         = useState('')
  const [filter, setFilter]         = useState('tous')
  const [multiSelect, setMultiSel]  = useState(false)
  const [selected, setSelected]     = useState([])   // vehicule ids
  const [modalVehicules, setModal]  = useState(null) // vehicules[] | null

  // Merge static fleet + dynamically registered vehicles
  const pendingVehicules = getVehiculesOwner(user?.id || '').map(v => ({
    ...v,
    nom:    v.modele,
    statut: v.statut === 'actif' ? 'disponible' : 'indisponible',
    image:  'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=400&q=80',
    _pending: v.statut === 'en_attente',
  }))
  const ALL_FLEET = [...FLEET, ...pendingVehicules]

  const filtered = ALL_FLEET.filter(v => {
    const matchSearch = `${v.marque} ${v.nom} ${v.plaque}`.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'tous' || v.statut === filter
    return matchSearch && matchFilter
  })

  const toggleSelect = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const openModal = (vehiculeIds) => {
    const vList = vehiculeIds.map(id => ALL_FLEET.find(v => v.id === id)).filter(Boolean)
    setModal(vList)
  }

  const openMultiAssign = () => {
    if (selected.length === 0) return
    openModal(selected)
  }

  return (
    <div className="p-8">
      {/* Modal */}
      {modalVehicules && (
        <AssignChauffeurModal
          vehicules={modalVehicules}
          onClose={() => { setModal(null); setSelected([]); setMultiSel(false) }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Ma Flotte</h1>
          <p className="text-gray-500 text-sm mt-0.5">{ALL_FLEET.length} véhicules{pendingVehicules.length > 0 ? ` · ${pendingVehicules.length} en attente de validation` : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setMultiSel(v => !v); setSelected([]) }}
            className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border transition-all ${
              multiSelect
                ? 'bg-gold-500/10 border-gold-500/30 text-gold-400'
                : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
            }`}>
            <Users size={14} />
            {multiSelect ? 'Annuler sélection' : 'Sélection multiple'}
          </button>
          {multiSelect && selected.length > 0 && (
            <button onClick={openMultiAssign}
              className="btn-gold flex items-center gap-2 text-sm px-4 py-2.5">
              <UserPlus size={14} /> Assigner ({selected.length})
            </button>
          )}
          <Link to="/inscription-vehicule" className="btn-gold flex items-center gap-2 text-sm px-4 py-2.5">
            <Plus size={14} /> Ajouter
          </Link>
        </div>
      </div>

      {/* Multi-select hint */}
      {multiSelect && (
        <div className="mb-5 p-3 bg-gold-500/6 border border-gold-500/20 rounded-xl text-xs text-gold-400 flex items-center gap-2">
          <CheckSquare size={13} />
          Sélectionnez plusieurs véhicules pour les assigner à un même chauffeur en une seule fois.
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher véhicule, plaque…"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
        </div>
        <div className="flex gap-2">
          {['tous','disponible','en_course','maintenance'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-2 rounded-lg border font-medium transition-all ${filter===s ? 'bg-gold-500/10 text-gold-400 border-gold-500/30' : 'bg-gray-900 text-gray-500 border-gray-700 hover:border-gray-500'}`}>
              {s === 'tous' ? 'Tous' : STATUS[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(v => {
          const s = STATUS[v.statut]
          const assignment = getAssignment(v.id)
          const ch = assignment?.chauffeur
          const isSelected = selected.includes(v.id)

          return (
            <div key={v.id}
              onClick={() => multiSelect && toggleSelect(v.id)}
              className={`card-luxe overflow-hidden group transition-all ${
                multiSelect ? 'cursor-pointer' : ''
              } ${isSelected ? 'border-gold-500/60 ring-1 ring-gold-500/30' : ''}`}>

              {/* Image + status */}
              <div className="relative h-44 overflow-hidden">
                <img src={v.image} alt={v.nom}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full border font-semibold ${s.bg} ${s.text} ${s.border}`}>
                  {s.label}
                </span>

                {/* Pending validation badge */}
                {v._pending && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    <Clock size={9} /> En validation
                  </div>
                )}

                {/* Multi-select checkbox */}
                {multiSelect && !v._pending && (
                  <div className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                    isSelected ? 'bg-gold-500 border-gold-500' : 'bg-black/50 border-white/50'
                  }`}>
                    {isSelected && <CheckSquare size={12} className="text-black" />}
                  </div>
                )}
              </div>

              <div className="p-5">
                <p className="text-gray-600 text-xs uppercase tracking-widest mb-1">{v.marque} · {v.annee}</p>
                <h3 className="font-semibold text-white text-base mb-3">{v.nom}</h3>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="bg-gray-900 rounded-lg px-3 py-2">
                    <p className="text-gray-600 mb-0.5">Plaque</p>
                    <p className="text-white font-medium">{v.plaque}</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg px-3 py-2">
                    <p className="text-gray-600 mb-0.5">Kilométrage</p>
                    <p className="text-white font-medium">{v.kilometrage.toLocaleString('fr-FR')} km</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg px-3 py-2">
                    <p className="text-gray-600 mb-0.5">Carburant</p>
                    <p className="text-white font-medium">{v.carburant}</p>
                  </div>
                  <div className="bg-gray-900 rounded-lg px-3 py-2">
                    <p className="text-gray-600 mb-0.5">Prix/jour</p>
                    <p className="text-gold-400 font-bold">{v.prixJour.toLocaleString('fr-FR')} F</p>
                  </div>
                </div>

                {/* Assigned chauffeur badge */}
                {ch ? (
                  <div className="mb-3 flex items-center justify-between bg-green-500/8 border border-green-500/20 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <img src={ch.photo} alt={ch.prenom}
                        className="w-7 h-7 rounded-full object-cover border border-green-500/40" />
                      <div>
                        <p className="text-white text-xs font-semibold">{ch.prenom} {ch.nom}</p>
                        <div className="flex items-center gap-1">
                          <Star size={9} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-yellow-400 text-[10px]">{ch.note}</span>
                          <span className="text-gray-600 text-[10px] ml-1">Assigné</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); deassignerChauffeur(v.id) }}
                      className="p-1 text-red-400/60 hover:text-red-400 transition-colors"
                      title="Retirer l'assignation">
                      <UserMinus size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="mb-3 text-xs text-gray-600 italic px-1">
                    Aucun chauffeur assigné
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {!multiSelect && (
                    <button
                      onClick={() => openModal([v.id])}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-xs font-medium py-2 rounded-lg transition-all">
                      <UserPlus size={12} />
                      {ch ? 'Changer chauffeur' : 'Assigner chauffeur'}
                    </button>
                  )}
                  <button className="flex items-center justify-center gap-1.5 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/20 text-gold-400 text-xs font-medium py-2 px-3 rounded-lg transition-all">
                    <Edit3 size={12} />
                  </button>
                  <button className="flex items-center justify-center gap-1.5 bg-red-500/8 hover:bg-red-500/15 border border-red-500/20 text-red-400 text-xs py-2 px-3 rounded-lg transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Car size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500">Aucun véhicule trouvé</p>
        </div>
      )}
    </div>
  )
}
