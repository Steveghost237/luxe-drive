import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ChevronLeft, ChevronRight, X, Users, Zap, Fuel,
  Settings, Palette, Shield, Star, CheckCircle2, Phone, Send,
  Maximize2, MapPin, Calendar, Tag,
} from 'lucide-react'
import { LOCATION_VEHICLES } from '../data/catalogData'
import useVehicleGalleryStore from '../store/vehicleGalleryStore'
import useAdminStore from '../store/adminStore'

const FMT = n => new Intl.NumberFormat('fr-FR').format(n)
const SEG_COLORS = {
  'Ultra-Luxe': 'bg-purple-500/15 border-purple-500/30 text-purple-300',
  'Haut-Gamme': 'bg-gold-500/10 border-gold-500/30 text-gold-300',
  'Premium':    'bg-blue-500/10 border-blue-500/30 text-blue-300',
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex)
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length)
  const next = () => setIdx(i => (i + 1) % images.length)

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white z-10 bg-black/40 rounded-full p-2"><X size={22}/></button>
      <button onClick={e => { e.stopPropagation(); prev() }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 bg-black/40 rounded-full p-3"><ChevronLeft size={26}/></button>
      <button onClick={e => { e.stopPropagation(); next() }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white z-10 bg-black/40 rounded-full p-3"><ChevronRight size={26}/></button>
      <img
        src={images[idx]} alt=""
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl select-none"
        onClick={e => e.stopPropagation()}
      />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button key={i} onClick={e => { e.stopPropagation(); setIdx(i) }}
            className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-gold-400 scale-125' : 'bg-white/30'}`} />
        ))}
      </div>
      <p className="absolute bottom-4 right-6 text-white/40 text-xs">{idx + 1} / {images.length}</p>
    </div>
  )
}

// ── Booking CTA modal ─────────────────────────────────────────────────────────
const LUXE_TEL = '+237 699 000 001'

function BookingModal({ vehicule, onClose }) {
  const { soumettreReservationChauffeur } = useAdminStore()
  const [form, setForm] = useState({ clientNom:'', clientTel:'', clientEmail:'', dateDebut:'', dateFin:'', message:'' })
  const [done, setDone] = useState(false)
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const submit = () => {
    soumettreReservationChauffeur({
      chauffeurId: null, chauffeurNom: 'À affecter',
      vehiculeNom: `${vehicule.marque} ${vehicule.nom}`,
      typeService: 'Location',
      ...form, depart: '', destination: '',
      duree: 1, heure: '08:00',
    })
    setDone(true)
  }
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <div>
            <p className="text-white font-semibold text-sm">{vehicule.marque} {vehicule.nom}</p>
            <p className="text-gold-400 text-xs font-bold">{FMT(vehicule.prix_jour)} FCFA / jour</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18}/></button>
        </div>
        {!done ? (
          <div className="p-5 space-y-3">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-2">Votre demande de réservation</p>
            <input placeholder="Nom complet *" value={form.clientNom} onChange={e=>upd('clientNom',e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
            <input placeholder="Téléphone *" value={form.clientTel} onChange={e=>upd('clientTel',e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
            <input placeholder="Email" value={form.clientEmail} onChange={e=>upd('clientEmail',e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-gray-600 text-xs mb-1">Début</p>
                <input type="date" value={form.dateDebut} onChange={e=>upd('dateDebut',e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-gold-500/50 outline-none" /></div>
              <div><p className="text-gray-600 text-xs mb-1">Fin</p>
                <input type="date" value={form.dateFin} onChange={e=>upd('dateFin',e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-gold-500/50 outline-none" /></div>
            </div>
            <textarea rows={2} placeholder="Message (optionnel)" value={form.message} onChange={e=>upd('message',e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none resize-none" />
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="btn-ghost flex-1 py-2.5 text-sm">Annuler</button>
              <button onClick={submit} disabled={!form.clientNom||!form.clientTel}
                className="btn-gold flex-1 py-2.5 text-sm disabled:opacity-40 flex items-center justify-center gap-2">
                <Send size={14}/> Réserver
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={28} className="text-green-400"/></div>
            <h3 className="text-white font-semibold mb-1">Demande envoyée !</h3>
            <p className="text-gray-400 text-sm mb-5">L'équipe Luxe Drive vous contactera sous 24h au {form.clientTel} pour confirmer votre réservation.</p>
            <button onClick={onClose} className="btn-gold px-8 py-2.5 text-sm">Fermer</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function VehicleDetailPage() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { getGallery } = useVehicleGalleryStore()

  const staticVehicle = LOCATION_VEHICLES.find(v => v.id === id)
  const gallery       = getGallery(id)

  // Merge: gallery store images override/supplement static images
  const allImages = gallery?.images?.length ? gallery.images : (staticVehicle?.images || [])

  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox]   = useState(null)
  const [bookModal, setBookModal] = useState(false)

  if (!staticVehicle) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
      <p className="text-gray-400 text-lg">Véhicule introuvable.</p>
      <Link to="/catalogue" className="btn-gold px-6 py-2.5 text-sm">Retour au catalogue</Link>
    </div>
  )

  const v = { ...staticVehicle, description: gallery?.description || staticVehicle.description, features: gallery?.features || staticVehicle.features }

  const SPECS = [
    { icon: Users,    label: 'Places',        value: v.places ? `${v.places} places` : null },
    { icon: Zap,      label: 'Puissance',      value: gallery?.puissance || v.puissance },
    { icon: Settings, label: 'Transmission',   value: gallery?.transmission || v.transmission },
    { icon: Fuel,     label: 'Carburant',      value: gallery?.carburant || v.carburant },
    { icon: Palette,  label: 'Couleur',        value: gallery?.couleur || v.couleur },
    { icon: Calendar, label: 'Année',          value: v.annee },
    { icon: Shield,   label: 'Caution',        value: v.caution ? `${FMT(v.caution)} FCFA` : null },
    { icon: Tag,      label: 'Segment',        value: v.segment },
  ].filter(s => s.value)

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navbar */}
      <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 h-16 flex items-center gap-4 sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <Link to="/" className="font-display text-xl font-bold text-gold-400">Luxe Drive</Link>
        <div className="ml-auto flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${SEG_COLORS[v.segment]}`}>{v.segment}</span>
          {!v.disponible && <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-medium">Indisponible</span>}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── Gallery ── */}
          <div>
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-[4/3] mb-3 group cursor-zoom-in"
              onClick={() => setLightbox(activeImg)}>
              {allImages[activeImg] ? (
                <img src={allImages[activeImg]} alt={v.nom}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Zap className="text-gray-700" size={64} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <button className="absolute top-3 right-3 bg-black/50 text-white/70 hover:text-white rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-all">
                <Maximize2 size={16}/>
              </button>
              {allImages.length > 1 && (
                <>
                  <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i-1+allImages.length)%allImages.length) }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all">
                    <ChevronLeft size={18}/>
                  </button>
                  <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i+1)%allImages.length) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all">
                    <ChevronRight size={18}/>
                  </button>
                </>
              )}
              <div className="absolute bottom-3 right-3 bg-black/50 text-white/70 text-xs px-2 py-1 rounded-full">
                {activeImg + 1} / {allImages.length}
              </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-gold-500 ring-1 ring-gold-500/30' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Photo count badge */}
            <p className="text-gray-600 text-xs mt-2 text-center">
              {allImages.length} photo{allImages.length > 1 ? 's' : ''} · Cliquez pour agrandir
            </p>
          </div>

          {/* ── Info panel ── */}
          <div>
            <p className="text-gold-400 text-xs uppercase tracking-widest font-semibold mb-1">{v.marque}</p>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">{v.nom}</h1>
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} size={13} className="text-yellow-400 fill-yellow-400"/>)}</div>
              <span className="text-yellow-400 text-xs font-bold">5.0</span>
              <span className="text-gray-600 text-xs">· Flotte certifiée Luxe Drive</span>
            </div>

            {v.description && (
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{v.description}</p>
            )}

            {/* Price */}
            <div className="card-luxe p-4 border-gold-500/20 bg-gold-500/3 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">Tarif location</p>
                  <p className="text-gold-400 font-bold text-2xl">{FMT(v.prix_jour)} <span className="text-gray-500 text-sm font-normal">FCFA/jour</span></p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">Caution</p>
                  <p className="text-white font-semibold text-sm">{FMT(v.caution)} FCFA</p>
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {SPECS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
                  <Icon className="text-gold-500 shrink-0" size={14} />
                  <div className="min-w-0">
                    <p className="text-gray-600 text-xs">{label}</p>
                    <p className="text-white text-xs font-medium truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            {v.features?.length > 0 && (
              <div className="mb-6">
                <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-2">Équipements & Services</p>
                <div className="flex flex-wrap gap-2">
                  {v.features.map(f => (
                    <span key={f} className="flex items-center gap-1.5 text-xs bg-gray-900 border border-gray-800 text-gray-300 px-3 py-1.5 rounded-full">
                      <CheckCircle2 size={11} className="text-green-400"/> {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="space-y-2.5">
              {v.disponible ? (
                <button onClick={() => setBookModal(true)}
                  className="btn-gold w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2">
                  <Send size={15}/> Réserver ce véhicule
                </button>
              ) : (
                <div className="w-full py-3.5 text-center text-sm text-gray-600 border border-gray-800 rounded-xl bg-gray-900/50">
                  Véhicule actuellement indisponible
                </div>
              )}
              <a href={`tel:${LUXE_TEL.replace(/\s/g,'')}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 text-sm font-medium transition-all">
                <Phone size={14}/> Appeler — {LUXE_TEL}
              </a>
            </div>

            {/* Back */}
            <Link to="/catalogue" className="flex items-center gap-1.5 text-gray-600 hover:text-gray-400 text-xs mt-5 transition-colors">
              <ArrowLeft size={12}/> Retour au catalogue
            </Link>
          </div>
        </div>

        {/* ── Full gallery strip ── */}
        {allImages.length > 2 && (
          <div className="mt-12">
            <h2 className="text-white font-display font-bold text-xl mb-4">Galerie — {v.marque} {v.nom}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {allImages.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden aspect-[4/3] cursor-zoom-in group"
                  onClick={() => setLightbox(i)}>
                  <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"/>
                  {i === 0 && <span className="absolute top-2 left-2 bg-gold-500/80 text-black text-xs font-bold px-2 py-0.5 rounded-full">Photo principale</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {lightbox !== null && <Lightbox images={allImages} startIndex={lightbox} onClose={() => setLightbox(null)} />}
      {bookModal && <BookingModal vehicule={v} onClose={() => setBookModal(false)} />}
    </div>
  )
}
