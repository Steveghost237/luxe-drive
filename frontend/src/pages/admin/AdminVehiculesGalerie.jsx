import { useState, useRef } from 'react'
import {
  Images, Plus, Trash2, Star, ChevronLeft, ChevronRight,
  Search, CheckCircle2, X, Upload, Eye, Pencil, Save, Link2, ImagePlus,
} from 'lucide-react'
import { LOCATION_VEHICLES } from '../../data/catalogData'
import useVehicleGalleryStore from '../../store/vehicleGalleryStore'

const SEG_BADGE = {
  'Ultra-Luxe': 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  'Haut-Gamme': 'bg-gold-500/10 text-gold-300 border-gold-500/30',
  'Premium':    'bg-blue-500/10 text-blue-300 border-blue-500/30',
}
const SEGMENTS = ['Tous', 'Ultra-Luxe', 'Haut-Gamme', 'Premium']
const FMT = n => new Intl.NumberFormat('fr-FR').format(n)

// ── Preview lightbox ──────────────────────────────────────────────────────────
function PreviewLightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex)
  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/40 rounded-full p-2 z-10"><X size={20}/></button>
      <button onClick={e=>{e.stopPropagation();setIdx(i=>(i-1+images.length)%images.length)}} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-3 z-10"><ChevronLeft size={24}/></button>
      <button onClick={e=>{e.stopPropagation();setIdx(i=>(i+1)%images.length)}} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-3 z-10"><ChevronRight size={24}/></button>
      <img src={images[idx]} alt="" className="max-h-[88vh] max-w-[88vw] object-contain rounded-xl" onClick={e=>e.stopPropagation()} />
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs">{idx+1} / {images.length}</p>
    </div>
  )
}

// ── Gallery editor panel ──────────────────────────────────────────────────────
function GalleryEditor({ vehicle, onBack }) {
  const { getGallery, addImage, removeImage, setMainImage, updateMeta } = useVehicleGalleryStore()
  const gallery = getGallery(vehicle.id)
  const images  = gallery.images || []

  const [newUrl, setNewUrl]       = useState('')
  const [urlError, setUrlError]   = useState('')
  const [addMode, setAddMode]     = useState('upload')
  const [uploading, setUploading] = useState(false)
  const fileInputRef              = useRef(null)
  const [preview, setPreview]     = useState(null)
  const [editMeta, setEditMeta]   = useState(false)
  const [meta, setMeta]           = useState({
    description:  gallery.description  || vehicle.description || '',
    couleur:      gallery.couleur      || vehicle.couleur || '',
    puissance:    gallery.puissance    || vehicle.puissance || '',
    transmission: gallery.transmission || vehicle.transmission || '',
    carburant:    gallery.carburant    || vehicle.carburant || '',
    places:       gallery.places       || vehicle.places || '',
  })
  const [metaSaved, setMetaSaved] = useState(false)

  const addUrl = () => {
    const url = newUrl.trim()
    if (!url) return
    if (!url.startsWith('http')) { setUrlError('URL invalide'); return }
    addImage(vehicle.id, url)
    setNewUrl('')
    setUrlError('')
  }

  const handleFiles = (files) => {
    if (!files?.length) return
    setUploading(true)
    let loaded = 0
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) { loaded++; if (loaded===files.length) setUploading(false); return }
      const reader = new FileReader()
      reader.onload = e => {
        addImage(vehicle.id, e.target.result)
        loaded++
        if (loaded === files.length) setUploading(false)
      }
      reader.readAsDataURL(file)
    })
  }

  const onDrop = e => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }

  const saveMeta = () => {
    updateMeta(vehicle.id, meta)
    setMetaSaved(true)
    setTimeout(() => setMetaSaved(false), 2000)
    setEditMeta(false)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800">
          <ChevronLeft size={20}/>
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold text-white">{vehicle.marque} {vehicle.nom}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${SEG_BADGE[vehicle.segment]}`}>{vehicle.segment}</span>
            <span className="text-gray-500 text-xs">{images.length} photo{images.length!==1?'s':''}</span>
            <span className="text-gray-600 text-xs">· {FMT(vehicle.prix_jour)} FCFA/jour</span>
          </div>
        </div>
        <button onClick={() => setEditMeta(v => !v)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium transition-all ${editMeta?'bg-gold-500/10 text-gold-400 border-gold-500/30':'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'}`}>
          <Pencil size={13}/> Modifier les infos
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Left: gallery grid ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Add photo panel */}
          <div className="card-luxe p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Ajouter des photos</p>
              <div className="flex gap-1 bg-gray-900 rounded-lg p-0.5">
                <button onClick={()=>setAddMode('upload')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${addMode==='upload'?'bg-gold-500/15 text-gold-400':'text-gray-500 hover:text-gray-300'}`}>
                  <ImagePlus size={12}/> Téléverser
                </button>
                <button onClick={()=>setAddMode('url')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${addMode==='url'?'bg-gold-500/15 text-gold-400':'text-gray-500 hover:text-gray-300'}`}>
                  <Link2 size={12}/> Par URL
                </button>
              </div>
            </div>

            {addMode === 'upload' ? (
              <>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef} type="file" accept="image/*" multiple
                  className="hidden"
                  onChange={e => handleFiles(e.target.files)}
                />
                {/* Drop zone */}
                <div
                  onDragOver={e=>e.preventDefault()} onDrop={onDrop}
                  onClick={()=>fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-700 hover:border-gold-500/40 rounded-xl p-8 text-center cursor-pointer transition-all group">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin"/>
                      <p className="text-gray-400 text-sm">Chargement en cours…</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={28} className="text-gray-600 group-hover:text-gold-500/60 mx-auto mb-2 transition-colors"/>
                      <p className="text-gray-400 text-sm font-medium">Cliquez ou glissez vos photos ici</p>
                      <p className="text-gray-600 text-xs mt-1">JPG, PNG, WEBP · Plusieurs fichiers acceptés · Depuis votre téléphone ou ordinateur</p>
                    </>
                  )}
                </div>
                <button onClick={()=>fileInputRef.current?.click()}
                  className="btn-gold w-full mt-3 py-2.5 text-sm flex items-center justify-center gap-2">
                  <ImagePlus size={14}/> Choisir des photos
                </button>
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"/>
                    <input
                      value={newUrl} onChange={e=>{setNewUrl(e.target.value);setUrlError('')}}
                      onKeyDown={e=>e.key==='Enter'&&addUrl()}
                      placeholder="URL de l'image (https://…)"
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
                  </div>
                  <button onClick={addUrl} className="btn-gold px-4 py-2.5 text-sm flex items-center gap-1.5 shrink-0">
                    <Plus size={14}/> Ajouter
                  </button>
                </div>
                {urlError && <p className="text-red-400 text-xs mt-1.5">{urlError}</p>}
                <p className="text-gray-600 text-xs mt-2">Collez une URL publique (Unsplash, CDN, Google Photos…)</p>
              </>
            )}
          </div>

          {/* Gallery grid */}
          {images.length === 0 ? (
            <div className="card-luxe p-12 text-center">
              <Images size={36} className="text-gray-700 mx-auto mb-3"/>
              <p className="text-gray-500">Aucune photo pour ce véhicule.</p>
              <p className="text-gray-600 text-xs mt-1">Téléversez depuis votre appareil ou collez une URL.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden aspect-[4/3] bg-gray-900">
                  <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all"/>

                  {/* Badges */}
                  {i === 0 && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-gold-500/80 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                      <Star size={10} className="fill-black"/> Principale
                    </div>
                  )}

                  {/* Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => setPreview(i)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all" title="Prévisualiser">
                      <Eye size={14}/>
                    </button>
                    {i > 0 && (
                      <button onClick={() => setMainImage(vehicle.id, i)}
                        className="p-2 bg-gold-500/30 hover:bg-gold-500/50 rounded-full text-gold-300 transition-all" title="Définir comme principale">
                        <Star size={14}/>
                      </button>
                    )}
                    <button onClick={() => removeImage(vehicle.id, i)}
                      className="p-2 bg-red-500/30 hover:bg-red-500/50 rounded-full text-red-300 transition-all" title="Supprimer">
                      <Trash2 size={14}/>
                    </button>
                  </div>

                  <p className="absolute bottom-2 right-2 bg-black/60 text-white/60 text-xs px-1.5 py-0.5 rounded">#{i+1}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: metadata ── */}
        <div className="space-y-4">
          {/* Meta card */}
          <div className="card-luxe p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider font-medium">Caractéristiques</p>
              {metaSaved && <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle2 size={11}/> Sauvegardé</span>}
            </div>

            {editMeta ? (
              <div className="space-y-2.5">
                {[
                  { key:'couleur',      label:'Couleur' },
                  { key:'puissance',    label:'Puissance' },
                  { key:'transmission', label:'Transmission' },
                  { key:'carburant',    label:'Carburant' },
                  { key:'places',       label:'Nbre places' },
                ].map(f => (
                  <div key={f.key}>
                    <p className="text-gray-600 text-xs mb-0.5">{f.label}</p>
                    <input value={meta[f.key] || ''} onChange={e=>setMeta(p=>({...p,[f.key]:e.target.value}))}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500/50 outline-none" />
                  </div>
                ))}
                <div>
                  <p className="text-gray-600 text-xs mb-0.5">Description</p>
                  <textarea rows={4} value={meta.description} onChange={e=>setMeta(p=>({...p,description:e.target.value}))}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-gold-500/50 outline-none resize-none" />
                </div>
                <button onClick={saveMeta} className="btn-gold w-full py-2.5 text-xs flex items-center justify-center gap-1.5">
                  <Save size={12}/> Sauvegarder
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs">
                {[
                  { label:'Couleur',       value: meta.couleur || vehicle.couleur },
                  { label:'Puissance',     value: meta.puissance || vehicle.puissance },
                  { label:'Transmission',  value: meta.transmission || vehicle.transmission },
                  { label:'Carburant',     value: meta.carburant || vehicle.carburant },
                  { label:'Places',        value: meta.places ? `${meta.places} places` : vehicle.places ? `${vehicle.places} places` : null },
                  { label:'Prix/jour',     value: `${FMT(vehicle.prix_jour)} FCFA` },
                  { label:'Caution',       value: `${FMT(vehicle.caution)} FCFA` },
                  { label:'Disponibilité', value: vehicle.disponible ? 'Disponible' : 'Indisponible' },
                ].filter(f=>f.value).map(f => (
                  <div key={f.label} className="flex items-start justify-between gap-2 border-b border-gray-800/50 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-500 shrink-0">{f.label}</span>
                    <span className="text-white text-right">{f.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description preview */}
          {!editMeta && (
            <div className="card-luxe p-5">
              <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-2">Description</p>
              <p className="text-gray-400 text-xs leading-relaxed">
                {meta.description || vehicle.description || 'Aucune description.'}
              </p>
            </div>
          )}

          {/* Features */}
          {vehicle.features?.length > 0 && (
            <div className="card-luxe p-5">
              <p className="text-gray-400 text-xs uppercase tracking-wider font-medium mb-3">Équipements</p>
              <div className="flex flex-wrap gap-1.5">
                {vehicle.features.map(f => (
                  <span key={f} className="flex items-center gap-1 text-xs bg-gray-900 border border-gray-800 text-gray-300 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={10} className="text-green-400"/> {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview lightbox */}
      {preview !== null && <PreviewLightbox images={images} startIndex={preview} onClose={() => setPreview(null)} />}
    </div>
  )
}

// ── Vehicle list ──────────────────────────────────────────────────────────────
export default function AdminVehiculesGalerie() {
  const { getGallery } = useVehicleGalleryStore()
  const [selected, setSelected] = useState(null)
  const [search, setSearch]     = useState('')
  const [segment, setSegment]   = useState('Tous')

  if (selected) return <GalleryEditor vehicle={selected} onBack={() => setSelected(null)} />

  const filtered = LOCATION_VEHICLES.filter(v => {
    const q = `${v.marque} ${v.nom}`.toLowerCase()
    const matchSearch = !search || q.includes(search.toLowerCase())
    const matchSeg    = segment === 'Tous' || v.segment === segment
    return matchSearch && matchSeg
  })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white">Galeries Véhicules</h1>
        <p className="text-gray-500 text-sm mt-0.5">Gérez les photos et caractéristiques de chaque véhicule du catalogue</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {SEGMENTS.filter(s=>s!=='Tous').map(seg => {
          const count = LOCATION_VEHICLES.filter(v=>v.segment===seg).length
          const withPhotos = LOCATION_VEHICLES.filter(v=>v.segment===seg&&(getGallery(v.id)?.images?.length||0)>0).length
          return (
            <div key={seg} className="card-luxe p-4 text-center">
              <p className={`text-xl font-bold ${seg==='Ultra-Luxe'?'text-purple-400':seg==='Haut-Gamme'?'text-gold-400':'text-blue-400'}`}>{count}</p>
              <p className="text-gray-600 text-xs mt-0.5">{seg}</p>
              <p className="text-gray-700 text-xs mt-1">{withPhotos}/{count} avec galerie</p>
            </div>
          )
        })}
        <div className="card-luxe p-4 text-center">
          <p className="text-xl font-bold text-white">{LOCATION_VEHICLES.reduce((a,v)=>a+(getGallery(v.id)?.images?.length||0),0)}</p>
          <p className="text-gray-600 text-xs mt-0.5">Photos totales</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Marque, modèle…"
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-gold-500/50 outline-none" />
        </div>
        <div className="flex gap-2">
          {SEGMENTS.map(s => (
            <button key={s} onClick={()=>setSegment(s)}
              className={`text-xs px-3 py-2 rounded-lg border font-medium transition-all ${segment===s?'bg-gold-500/10 text-gold-400 border-gold-500/30':'bg-gray-900 text-gray-500 border-gray-700 hover:border-gray-500'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle grid by segment */}
      {(['Ultra-Luxe','Haut-Gamme','Premium']).map(seg => {
        const items = filtered.filter(v => v.segment === seg)
        if (items.length === 0 || (segment !== 'Tous' && segment !== seg)) return null
        return (
          <div key={seg} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${SEG_BADGE[seg]}`}>{seg}</span>
              <div className="flex-1 h-px bg-gray-800"/>
              <span className="text-gray-600 text-xs">{items.length} véhicule{items.length>1?'s':''}</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map(v => {
                const g = getGallery(v.id)
                const photoCount = g?.images?.length || 0
                const coverImg   = g?.images?.[0] || v.images?.[0]
                return (
                  <div key={v.id} onClick={() => setSelected(v)}
                    className="card-luxe overflow-hidden group cursor-pointer hover:border-gold-500/30 transition-all">
                    <div className="relative h-40 bg-gray-900 overflow-hidden">
                      {coverImg ? (
                        <img src={coverImg} alt={v.nom}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Images size={28} className="text-gray-700"/>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/>
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Images size={10}/> {photoCount}
                      </div>
                      {photoCount === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-xs bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 px-2.5 py-1 rounded-full">Sans galerie</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-gray-500 text-xs">{v.marque}</p>
                      <p className="text-white text-sm font-semibold truncate">{v.nom}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gold-400 text-xs font-bold">{FMT(v.prix_jour)} F/j</span>
                        <span className={`text-xs font-medium ${v.disponible?'text-green-400':'text-red-400'}`}>
                          {v.disponible?'Disponible':'Indisponible'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
