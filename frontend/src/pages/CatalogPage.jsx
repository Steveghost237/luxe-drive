import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Car, Star, Users, Tag, CheckCircle2, Clock,
  MapPin, Fuel, Zap, Shield, ChevronRight, Phone, X, Send, Calendar, MessageSquare
} from 'lucide-react'
import { LOCATION_VEHICLES, CHAUFFEURS, VENTE_VEHICLES } from '../data/catalogData'
import useAdminStore from '../store/adminStore'

const MAIN_TABS = [
  { key: 'location', label: '🚗 Location',   desc: 'Avec ou sans chauffeur' },
  { key: 'chauffeur',label: '👤 Chauffeurs',  desc: 'Certifiés & notés' },
  { key: 'vente',    label: '🏷️ Achat',       desc: 'Véhicules à vendre' },
]

const SEGMENTS = ['Tous', 'Ultra-Luxe', 'Haut-Gamme', 'Premium']

const FMT = (n) => new Intl.NumberFormat('fr-FR').format(n)

// ── Vehicle location card ─────────────────────────────────────────────────────

function LocationCard({ v }) {
  const segColors = {
    'Ultra-Luxe': 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    'Haut-Gamme': 'bg-gold-500/10 border-gold-500/30 text-gold-300',
    'Premium':    'bg-blue-500/10 border-blue-500/30 text-blue-300',
  }
  return (
    <Link to={`/vehicule/${v.id}`}
      className="card-luxe overflow-hidden group block hover:border-gold-500/30 transition-all duration-300">
      <div className="relative h-48 overflow-hidden bg-gray-900">
        <img src={v.images[0]} alt={v.nom}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${segColors[v.segment]}`}>
            {v.segment}
          </span>
        </div>
        {!v.disponible && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm font-semibold px-4 py-2 rounded-full">
              Indisponible
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-gray-400 text-xs">{v.marque}</p>
            <p className="text-white font-display font-bold text-sm">{v.nom}</p>
          </div>
          <span className="text-gray-400 text-xs bg-black/50 px-2 py-1 rounded">{v.annee}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Users size={11} /> {v.places} places</span>
          <span className="flex items-center gap-1"><Zap size={11} /> {v.puissance}</span>
          <span className="flex items-center gap-1"><Fuel size={11} /> {v.carburant}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {v.features.slice(0,3).map(f => (
            <span key={f} className="text-xs bg-gray-900 border border-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{f}</span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gold-400 font-bold text-lg">{FMT(v.prix_jour)} <span className="text-gray-500 text-xs font-normal">FCFA/jour</span></p>
            <p className="text-gray-600 text-xs">Caution : {FMT(v.caution)} FCFA</p>
          </div>
          <span className="text-gold-400 text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
            Voir détail <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </Link>
  )
}

// ── Chauffeur card ────────────────────────────────────────────────────────────

function ChauffeurCard({ c, onBook, onCall }) {
  return (
    <div className="card-luxe p-5 hover:border-gold-500/30 transition-all duration-300">
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <img src={c.photo} alt={c.prenom}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-800" />
          {c.disponible
            ? <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-gray-900" />
            : <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gray-600 border-2 border-gray-900" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold">{c.prenom} {c.nom}</h3>
            {c.certifications.includes('Top Chauffeur 2024') && (
              <span className="text-xs bg-gold-500/10 border border-gold-500/30 text-gold-400 px-2 py-0.5 rounded-full">⭐ Top</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-0.5">
              {Array.from({length:5}).map((_,i) => (
                <Star key={i} size={12} className={i < Math.floor(c.note) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'} />
              ))}
            </div>
            <span className="text-yellow-400 font-bold text-sm">{c.note}</span>
            <span className="text-gray-600 text-xs">({c.missions} missions)</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <MapPin size={10} /> {c.ville} · {c.experience} d'exp.
          </div>
        </div>
      </div>
      <p className="text-gray-400 text-xs leading-relaxed mb-3 italic">"{c.bio}"</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {c.specialites.map(s => (
          <span key={s} className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{s}</span>
        ))}
      </div>
      <div className="flex flex-wrap gap-1 mb-4">
        {c.certifications.map(cert => (
          <span key={cert} className="text-xs flex items-center gap-1 text-green-400">
            <CheckCircle2 size={10} /> {cert}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
        <span>🌐 {c.langues.join(' · ')}</span>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onBook && onBook(c)} className="flex-1 py-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 text-sm font-semibold transition-all">
          Réserver
        </button>
        <button onClick={() => onCall && onCall(c)} className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-500/30 transition-colors">
          <Phone size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Vente card ────────────────────────────────────────────────────────────────

function VenteCard({ v, onContact }) {
  return (
    <div className={`card-luxe overflow-hidden group ${v.vendu ? 'opacity-60' : 'hover:border-gold-500/30'} transition-all duration-300`}>
      <div className="relative h-52 overflow-hidden bg-gray-900">
        <img src={v.images[0]} alt={v.nom}
          className={`w-full h-full object-cover ${!v.vendu && 'group-hover:scale-105'} transition-transform duration-700`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {v.vendu ? (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500/30 border border-red-500 text-red-400 font-bold px-6 py-2 rounded-full">VENDU</span>
          </div>
        ) : (
          <div className="absolute top-3 right-3">
            <span className="bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold px-2.5 py-1 rounded-full">
              Disponible
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <p className="text-gray-400 text-xs">{v.marque}</p>
          <p className="text-white font-display font-bold">{v.nom}</p>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Clock size={11} /> {v.annee}</span>
          <span className="flex items-center gap-1"><Car size={11} /> {FMT(v.kilometrage)} km</span>
          <span className="flex items-center gap-1"><Shield size={11} /> Garantie {v.garantie}</span>
          <span className="flex items-center gap-1"><Tag size={11} /> {v.etat}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {v.options.slice(0,3).map(o => (
            <span key={o} className="text-xs bg-gray-900 border border-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{o}</span>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-4 flex items-center justify-between">
          <div>
            <p className="text-gold-400 font-bold text-xl">{FMT(v.prix_vente)}</p>
            <p className="text-gray-600 text-xs">FCFA TTC</p>
          </div>
          {!v.vendu && (
            <button onClick={() => onContact && onContact(v)} className="px-4 py-2 rounded-xl btn-gold text-sm font-semibold flex items-center gap-1.5">
              <MessageSquare size={13}/> Contacter
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Booking modal ─────────────────────────────────────────────────────────────

const LUXE_TEL = '+237 699 000 001'
const TYPES_SERVICE = ['Protocole / VIP','Transfert aéroport','Corporate / Mise à dispo','Événement privé','Mariage & Cérémonie','Tourisme']

function ChauffeurBookingModal({ chauffeur, onClose }) {
  const { soumettreReservationChauffeur } = useAdminStore()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ clientNom:'', clientTel:'', clientEmail:'', date:'', heure:'09:00', duree:4, typeService:TYPES_SERVICE[0], depart:'', destination:'', message:'' })
  const [done, setDone] = useState(false)
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const canNext = step === 1 ? form.clientNom && form.clientTel : form.date && form.depart && form.destination
  const submit = () => {
    soumettreReservationChauffeur({ chauffeurId:chauffeur.id, chauffeurNom:`${chauffeur.prenom} ${chauffeur.nom}`, ...form })
    setDone(true)
  }
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <img src={chauffeur.photo} alt={chauffeur.prenom} className="w-10 h-10 rounded-xl object-cover border border-gray-700" />
            <div>
              <p className="text-white font-semibold text-sm">{chauffeur.prenom} {chauffeur.nom}</p>
              <p className="text-gray-500 text-xs">{chauffeur.ville} · {chauffeur.note}★ · {chauffeur.missions} missions</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18}/></button>
        </div>
        {!done ? (
          <div className="p-5">
            <div className="flex gap-2 mb-5">{[1,2].map(s => <div key={s} className={`h-1.5 flex-1 rounded-full ${s<=step?'bg-gold-400':'bg-gray-800'}`}/>)}</div>
            {step === 1 && (
              <div className="space-y-3">
                <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-2">Vos coordonnées</p>
                <input placeholder="Nom complet *" value={form.clientNom} onChange={e=>upd('clientNom',e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
                <input placeholder="Téléphone *" value={form.clientTel} onChange={e=>upd('clientTel',e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
                <input placeholder="Email" value={form.clientEmail} onChange={e=>upd('clientEmail',e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
                <select value={form.typeService} onChange={e=>upd('typeService',e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-gold-500/50 outline-none">
                  {TYPES_SERVICE.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-3">
                <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-2">Détails mission</p>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" value={form.date} onChange={e=>upd('date',e.target.value)} className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-gold-500/50 outline-none" />
                  <input type="time" value={form.heure} onChange={e=>upd('heure',e.target.value)} className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-gold-500/50 outline-none" />
                </div>
                <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5">
                  <span className="text-gray-500 text-xs">Durée (h)</span>
                  <input type="number" min="1" max="72" value={form.duree} onChange={e=>upd('duree',+e.target.value)} className="flex-1 bg-transparent text-sm text-white focus:outline-none" />
                </div>
                <input placeholder="Lieu de départ *" value={form.depart} onChange={e=>upd('depart',e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
                <input placeholder="Destination *" value={form.destination} onChange={e=>upd('destination',e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
                <textarea rows={2} placeholder="Message (optionnel)" value={form.message} onChange={e=>upd('message',e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none resize-none" />
              </div>
            )}
            <div className="flex gap-3 mt-5">
              <button onClick={step===1?onClose:()=>setStep(1)} className="btn-ghost flex-1 py-2.5 text-sm">{step===1?'Annuler':'← Retour'}</button>
              {step===1
                ? <button onClick={()=>setStep(2)} disabled={!canNext} className="btn-gold flex-1 py-2.5 text-sm disabled:opacity-40">Suivant →</button>
                : <button onClick={submit} disabled={!canNext} className="btn-gold flex-1 py-2.5 text-sm disabled:opacity-40 flex items-center justify-center gap-2"><Send size={14}/> Envoyer</button>
              }
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={32} className="text-green-400"/></div>
            <h3 className="text-white font-display font-bold text-lg mb-2">Demande envoyée !</h3>
            <p className="text-gray-400 text-sm mb-1">Réservation pour <span className="text-white font-medium">{chauffeur.prenom} {chauffeur.nom}</span> en attente de validation admin.</p>
            <p className="text-gray-500 text-xs mb-6">Un conseiller vous contactera sous 24h au {form.clientTel}.</p>
            <button onClick={onClose} className="btn-gold px-8 py-2.5 text-sm">Fermer</button>
          </div>
        )}
      </div>
    </div>
  )
}

function CallPopup({ chauffeur, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-full bg-gold-500/15 flex items-center justify-center mx-auto mb-4">
          <Phone size={24} className="text-gold-400"/>
        </div>
        <h3 className="text-white font-semibold mb-1">Réserver par téléphone</h3>
        <p className="text-gray-400 text-sm mb-4">Appelez Luxe Drive pour <span className="text-white font-medium">{chauffeur.prenom} {chauffeur.nom}</span></p>
        <a href={`tel:${LUXE_TEL.replace(/\s/g,'')}`} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 font-semibold text-sm transition-all mb-3">
          <Phone size={16}/> {LUXE_TEL}
        </a>
        <p className="text-gray-600 text-xs mb-4">Disponible 7j/7 · 7h — 22h</p>
        <button onClick={onClose} className="btn-ghost w-full py-2.5 text-sm">Fermer</button>
      </div>
    </div>
  )
}

function VenteContactModal({ vehicule, onClose }) {
  const { soumettreDemandeAchat } = useAdminStore()
  const [form, setForm] = useState({ clientNom:'', clientTel:'', clientEmail:'', offre:'', message:'' })
  const [done, setDone] = useState(false)
  const upd = (k,v) => setForm(p=>({...p,[k]:v}))
  const submit = () => {
    soumettreDemandeAchat({ vehiculeNom:`${vehicule.marque} ${vehicule.nom}`, vehiculePrix:`${FMT(vehicule.prix_vente)} FCFA`, ...form })
    setDone(true)
  }
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div>
            <p className="text-white font-semibold text-sm">{vehicule.marque} {vehicule.nom}</p>
            <p className="text-gold-400 text-xs font-bold">{FMT(vehicule.prix_vente)} FCFA</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18}/></button>
        </div>
        {!done ? (
          <div className="p-5 space-y-3">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-2">Votre demande d'information</p>
            <input placeholder="Nom complet *" value={form.clientNom} onChange={e=>upd('clientNom',e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
            <input placeholder="Téléphone *" value={form.clientTel} onChange={e=>upd('clientTel',e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
            <input placeholder="Email" value={form.clientEmail} onChange={e=>upd('clientEmail',e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
            <input placeholder="Votre offre (optionnel)" value={form.offre} onChange={e=>upd('offre',e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
            <textarea rows={3} placeholder="Message" value={form.message} onChange={e=>upd('message',e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none resize-none" />
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="btn-ghost flex-1 py-2.5 text-sm">Annuler</button>
              <button onClick={submit} disabled={!form.clientNom||!form.clientTel} className="btn-gold flex-1 py-2.5 text-sm disabled:opacity-40 flex items-center justify-center gap-2"><Send size={14}/> Envoyer</button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={28} className="text-green-400"/></div>
            <h3 className="text-white font-semibold mb-1">Demande envoyée !</h3>
            <p className="text-gray-400 text-sm mb-5">Un conseiller Luxe Drive vous contactera sous 24h pour ce véhicule.</p>
            <button onClick={onClose} className="btn-gold px-8 py-2.5 text-sm">Fermer</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CatalogPage() {
  const [tab, setTab]         = useState('location')
  const [search, setSearch]   = useState('')
  const [segment, setSegment] = useState('Tous')
  const [noteMin, setNoteMin] = useState(0)
  const [disponible, setDispo]= useState(false)
  const [bookModal, setBookModal]     = useState(null)
  const [callModal, setCallModal]     = useState(null)
  const [contactModal, setContactModal] = useState(null)

  const filteredLocation = LOCATION_VEHICLES.filter(v => {
    const q = search.toLowerCase()
    const matchSearch = !q || v.nom.toLowerCase().includes(q) || v.marque.toLowerCase().includes(q)
    const matchSeg    = segment === 'Tous' || v.segment === segment
    const matchDispo  = !disponible || v.disponible
    return matchSearch && matchSeg && matchDispo
  })

  const filteredChauffeurs = CHAUFFEURS.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || `${c.prenom} ${c.nom}`.toLowerCase().includes(q) || c.ville.toLowerCase().includes(q)
    const matchNote   = c.note >= noteMin
    const matchDispo  = !disponible || c.disponible
    return matchSearch && matchNote && matchDispo
  })

  const filteredVente = VENTE_VEHICLES.filter(v => {
    const q = search.toLowerCase()
    return !q || v.nom.toLowerCase().includes(q) || v.marque.toLowerCase().includes(q)
  })

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="font-display text-xl font-bold text-gold-400">Luxe Drive</Link>
        <div className="flex items-center gap-3">
          <Link to="/inscription-vehicule" className="text-gray-400 hover:text-white text-sm transition-colors">Inscrire un véhicule</Link>
          <Link to="/devenir-chauffeur" className="text-gray-400 hover:text-white text-sm transition-colors">Devenir chauffeur</Link>
          <Link to="/connexion" className="btn-gold text-sm px-4 py-2">Connexion</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            Catalogue <span className="text-gold-400">Luxe Drive</span>
          </h1>
          <p className="text-gray-400 mb-6">Véhicules de prestige, chauffeurs certifiés et opportunités d'achat au Cameroun</p>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher marque, modèle, chauffeur…"
              className="w-full input-luxe pl-11 py-3" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-gray-900/50 rounded-2xl border border-gray-800 w-fit">
          {MAIN_TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                  : 'text-gray-500 hover:text-white'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── LOCATION ── */}
        {tab === 'location' && (
          <>
            {/* Sub-filters */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="flex gap-1 p-1 bg-gray-900 rounded-xl border border-gray-800">
                {SEGMENTS.map(s => (
                  <button key={s} onClick={() => setSegment(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      segment === s ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' : 'text-gray-500 hover:text-white'
                    }`}>{s}</button>
                ))}
              </div>
              <button onClick={() => setDispo(d => !d)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  disponible ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-gray-900 border-gray-800 text-gray-500'
                }`}>
                <div className={`w-2 h-2 rounded-full ${disponible ? 'bg-green-400' : 'bg-gray-600'}`} />
                Disponibles uniquement
              </button>
              <span className="ml-auto text-gray-600 text-sm">{filteredLocation.length} véhicule{filteredLocation.length > 1 ? 's' : ''}</span>
            </div>

            {/* Grouped by segment */}
            {['Ultra-Luxe', 'Haut-Gamme', 'Premium'].map(seg => {
              const items = filteredLocation.filter(v => v.segment === seg)
              if (items.length === 0) return null
              if (segment !== 'Tous' && segment !== seg) return null
              const segStyle = {
                'Ultra-Luxe': { badge: 'bg-purple-500/10 border-purple-500/30 text-purple-300', label: '👑 Ultra-Luxe' },
                'Haut-Gamme': { badge: 'bg-gold-500/10 border-gold-500/30 text-gold-300', label: '⭐ Haut-Gamme' },
                'Premium':    { badge: 'bg-blue-500/10 border-blue-500/30 text-blue-300', label: '💎 Premium' },
              }[seg]
              return (
                <div key={seg} className="mb-10">
                  <div className="flex items-center gap-3 mb-5">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${segStyle.badge}`}>
                      {segStyle.label}
                    </span>
                    <div className="flex-1 h-px bg-gray-800" />
                    <span className="text-gray-600 text-xs">{items.length} véhicule{items.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {items.map(v => <LocationCard key={v.id} v={v} />)}
                  </div>
                </div>
              )
            })}

            {filteredLocation.length === 0 && (
              <div className="text-center py-16 text-gray-600">
                <Car size={40} className="mx-auto mb-3 opacity-30" />
                <p>Aucun véhicule trouvé</p>
              </div>
            )}
          </>
        )}

        {/* ── CHAUFFEURS ── */}
        {tab === 'chauffeur' && (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="flex gap-1 p-1 bg-gray-900 rounded-xl border border-gray-800">
                {[0, 4.5, 4.7, 4.9].map(n => (
                  <button key={n} onClick={() => setNoteMin(n)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      noteMin === n ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'text-gray-500 hover:text-white'
                    }`}>
                    {n === 0 ? 'Tous' : <><Star size={10} className="fill-current" /> {n}+</>}
                  </button>
                ))}
              </div>
              <button onClick={() => setDispo(d => !d)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                  disponible ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-gray-900 border-gray-800 text-gray-500'
                }`}>
                <div className={`w-2 h-2 rounded-full ${disponible ? 'bg-green-400' : 'bg-gray-600'}`} />
                Disponibles
              </button>
              <span className="ml-auto text-gray-600 text-sm">{filteredChauffeurs.length} chauffeur{filteredChauffeurs.length > 1 ? 's' : ''}</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredChauffeurs.map(c => <ChauffeurCard key={c.id} c={c} onBook={setBookModal} onCall={setCallModal} />)}
            </div>

            {filteredChauffeurs.length === 0 && (
              <div className="text-center py-16 text-gray-600">
                <Users size={40} className="mx-auto mb-3 opacity-30" />
                <p>Aucun chauffeur trouvé</p>
              </div>
            )}

            <div className="mt-8 card-luxe p-6 border-gold-500/20 bg-gold-500/5 text-center">
              <h3 className="text-white font-display font-bold text-lg mb-2">Vous souhaitez devenir chauffeur Luxe Drive ?</h3>
              <p className="text-gray-400 text-sm mb-4">Rejoignez notre réseau de chauffeurs certifiés et bénéficiez d'une clientèle premium</p>
              <Link to="/devenir-chauffeur" className="btn-gold px-6 py-2.5 inline-block">Déposer ma candidature</Link>
            </div>
          </>
        )}

        {/* ── VENTE ── */}
        {tab === 'vente' && (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-400 text-sm">
                {filteredVente.filter(v => !v.vendu).length} véhicule{filteredVente.filter(v=>!v.vendu).length>1?'s':''} disponible{filteredVente.filter(v=>!v.vendu).length>1?'s':''}
              </p>
              <Link to="/inscription-vehicule" className="flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors">
                + Mettre en vente mon véhicule
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVente.map(v => <VenteCard key={v.id} v={v} onContact={setContactModal} />)}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {bookModal    && <ChauffeurBookingModal chauffeur={bookModal}   onClose={()=>setBookModal(null)} />}
      {callModal    && <CallPopup            chauffeur={callModal}   onClose={()=>setCallModal(null)} />}
      {contactModal && <VenteContactModal    vehicule={contactModal} onClose={()=>setContactModal(null)} />}
    </div>
  )
}
