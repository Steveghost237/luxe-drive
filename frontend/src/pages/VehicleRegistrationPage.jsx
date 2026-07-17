import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Car, Camera, FileText, DollarSign, Shield, CheckCircle2,
  ChevronLeft, ChevronRight, Upload, AlertCircle, Zap,
  UserCheck, Lock, LogIn,
} from 'lucide-react'
import useAuthStore  from '../store/authStore'
import useFleetStore from '../store/fleetStore'

const STEPS = [
  { n:1, label:'Informations véhicule', icon: Car       },
  { n:2, label:'Photos & médias',       icon: Camera    },
  { n:3, label:'Tarification',          icon: DollarSign},
  { n:4, label:'Documents',             icon: FileText  },
  { n:5, label:'Validation',            icon: Shield    },
]

const MARQUES = ['Mercedes-Benz','BMW','Audi','Rolls-Royce','Bentley','Porsche','Lamborghini','Ferrari','Land Rover','Lexus','Maserati','Aston Martin','Maybach','Cadillac','Lincoln']
const CARBURANTS = ['Essence','Diesel','Hybride','Hybride rechargeable','Électrique','GPL']
const TRANSMISSIONS = ['Automatique','Manuelle','Semi-automatique']
const COULEURS = ['Noir','Blanc','Argent','Gris','Bleu','Rouge','Vert','Or','Bordeaux','Bicolore','Autre']
const SERVICES = [
  { key:'location',  label:'Location', desc:'Mise en location journalière ou hebdomadaire' },
  { key:'chauffeur', label:'Avec chauffeur', desc:'Location avec conducteur Luxe Drive' },
  { key:'vente',     label:'Vente',    desc:'Mise en vente directe sur la plateforme' },
]
const OPTIONS_LIST = [
  'GPS intégré','Toit panoramique','Massage sièges','Mini-bar','TV bord','Wifi','HUD',
  'Cuir pleine fleur','Sono premium','Rétroviseurs rabattables auto','Sièges chauffants',
  'Climatisation multi-zones','Caméra 360°','Démarrage sans clé','Sièges ventilés',
]

function Field({ label, children, required, hint }) {
  return (
    <div>
      <label className="block text-gray-400 text-xs font-medium mb-1.5">
        {label}{required && <span className="text-gold-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-gray-600 text-xs mt-1">{hint}</p>}
    </div>
  )
}
function Input(props) {
  return <input {...props} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 transition-colors" />
}
function Select({ children, ...props }) {
  return <select {...props} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors appearance-none">{children}</select>
}
function Textarea(props) {
  return <textarea {...props} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 resize-none transition-colors" />
}

export default function VehicleRegistrationPage() {
  const { user, isAuthenticated } = useAuthStore()
  const { addVehicule } = useFleetStore()
  const navigate = useNavigate()

  const [step, setStep]           = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [submittedRef, setRef]    = useState('')
  const [photos, setPhotos]       = useState([])
  const [docs, setDocs]           = useState({})
  const [form, setForm]           = useState({
    marque:'', modele:'', annee:'', plaque:'', carburant:'', transmission:'',
    puissance:'', places:'5', couleur:'', kilometrage:'', vin:'',
    description:'',
    services:[], options:[],
    prix_jour:'', prix_semaine:'', prix_mois:'', caution:'', prix_vente:'',
    acceptConditions:false, acceptInspection:false, acceptExclusivite:false,
  })

  const isOwner = isAuthenticated && ['proprietaire','partenaire','admin','super_admin'].includes(user?.role)

  const set = (k, v) => setForm(f => ({...f, [k]: v}))
  const toggleArr = (key, val) => setForm(f => ({
    ...f,
    [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val]
  }))

  const canNext = {
    1: form.marque && form.modele && form.annee && form.plaque && form.carburant && form.transmission && form.places && form.couleur,
    2: photos.length >= 4,
    3: form.services.length > 0 && (form.services.includes('location') ? form.prix_jour : true) && (form.services.includes('vente') ? form.prix_vente : true),
    4: docs.carteGrise && docs.assurance,
    5: form.acceptConditions && form.acceptInspection,
  }

  const handleSubmit = () => {
    const ref = addVehicule({
      ...form,
      ownerId:          user?.id || 'guest',
      proprietaire_nom: user ? `${user.prenom || ''} ${user.nom || ''}`.trim() : 'Invité',
      proprietaire_tel:   user?.telephone || '',
      proprietaire_email: user?.email    || '',
      nbPhotos:         photos.length,
      nbDocs:           Object.keys(docs).length,
    })
    setRef(ref)
    setSubmitted(true)
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center card-luxe p-10 border-green-500/20">
        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={36} className="text-green-400" />
        </div>
        <h2 className="text-white font-display font-bold text-2xl mb-3">Véhicule inscrit !</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-2">
          Votre véhicule a été soumis à notre équipe pour inspection et validation.
          Délai : <strong className="text-white">3–5 jours ouvrables</strong>.
        </p>
        <p className="text-gray-600 text-sm mb-1">
          Référence : <span className="text-gold-400 font-mono font-bold">{submittedRef}</span>
        </p>
        {isOwner && (
          <p className="text-green-400 text-xs mb-6 flex items-center justify-center gap-1.5">
            <UserCheck size={12} /> Véhicule lié à votre compte — visible dans votre tableau de bord
          </p>
        )}
        <div className="space-y-3 mt-6">
          {isOwner ? (
            <button onClick={() => navigate('/proprietaire/vehicules')}
              className="block w-full py-3 rounded-xl btn-gold text-sm font-semibold text-center">
              Voir ma flotte →
            </button>
          ) : (
            <Link to="/inscription?role=proprietaire"
              className="block w-full py-3 rounded-xl btn-gold text-sm font-semibold text-center">
              Créer mon compte propriétaire
            </Link>
          )}
          <Link to="/catalogue" className="block text-gray-500 hover:text-white text-sm transition-colors">
            Voir le catalogue
          </Link>
        </div>
      </div>
    </div>
  )

  const steps = {
    1: (
      <div className="space-y-5">
        <h2 className="text-white font-display font-bold text-xl mb-5">Informations du véhicule</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Marque" required>
            <Select value={form.marque} onChange={e => set('marque', e.target.value)}>
              <option value="">Sélectionner la marque…</option>
              {MARQUES.map(m => <option key={m} value={m}>{m}</option>)}
            </Select>
          </Field>
          <Field label="Modèle / Version" required>
            <Input value={form.modele} onChange={e => set('modele', e.target.value)} placeholder="ex: Classe S 580 4Matic AMG Line" />
          </Field>
          <Field label="Année" required>
            <Input type="number" value={form.annee} onChange={e => set('annee', e.target.value)} placeholder="2023" min="2015" max="2025" />
          </Field>
          <Field label="Plaque d'immatriculation" required hint="Format Cameroun: LT-XXXX-YA">
            <Input value={form.plaque} onChange={e => set('plaque', e.target.value.toUpperCase())} placeholder="LT-1234-YA" />
          </Field>
          <Field label="Carburant" required>
            <Select value={form.carburant} onChange={e => set('carburant', e.target.value)}>
              <option value="">Type de carburant…</option>
              {CARBURANTS.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Transmission" required>
            <Select value={form.transmission} onChange={e => set('transmission', e.target.value)}>
              <option value="">Type de boîte…</option>
              {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Puissance (ch)">
            <Input type="number" value={form.puissance} onChange={e => set('puissance', e.target.value)} placeholder="503" />
          </Field>
          <Field label="Nombre de places" required>
            <Select value={form.places} onChange={e => set('places', e.target.value)}>
              {[2,4,5,6,7,8].map(n => <option key={n} value={n}>{n} places</option>)}
            </Select>
          </Field>
          <Field label="Couleur" required>
            <Select value={form.couleur} onChange={e => set('couleur', e.target.value)}>
              <option value="">Couleur principale…</option>
              {COULEURS.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Field>
          <Field label="Kilométrage actuel" hint="Km au compteur le jour de l'inscription">
            <Input type="number" value={form.kilometrage} onChange={e => set('kilometrage', e.target.value)} placeholder="24 800" />
          </Field>
          <Field label="Numéro VIN (châssis)" hint="17 caractères alphanumériques">
            <Input value={form.vin} onChange={e => set('vin', e.target.value.toUpperCase())} placeholder="WDB2210561A123456" maxLength={17} />
          </Field>
        </div>
        <Field label="Options & équipements">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
            {OPTIONS_LIST.map(o => (
              <label key={o} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all text-xs font-medium ${
                form.options.includes(o)
                  ? 'bg-gold-500/10 border-gold-500/30 text-gold-400'
                  : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700'
              }`}>
                <input type="checkbox" className="hidden" checked={form.options.includes(o)} onChange={() => toggleArr('options', o)} />
                {form.options.includes(o) && <CheckCircle2 size={10} />}
                {o}
              </label>
            ))}
          </div>
        </Field>
        <Field label="Description commerciale" hint="Décrivez le véhicule pour les clients (histoire, entretien, points forts…)">
          <Textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Véhicule en parfait état, toutes révisions effectuées chez le concessionnaire officiel…" />
        </Field>
      </div>
    ),
    2: (
      <div className="space-y-5">
        <h2 className="text-white font-display font-bold text-xl mb-2">Photos du véhicule</h2>
        <p className="text-gray-400 text-sm mb-5">Minimum 4 photos requises. Maximum 12. Qualité HD recommandée.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {['Extérieur face avant','Extérieur face arrière','Profil droit','Intérieur avant','Intérieur arrière','Tableau de bord','Coffre','Moteur (optionnel)'].map((pos, i) => {
            const hasPhoto = photos.includes(pos)
            return (
              <label key={pos} className={`relative aspect-video rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center overflow-hidden transition-all ${
                hasPhoto ? 'border-green-500/40 bg-green-500/5' : 'border-dashed border-gray-800 hover:border-gold-500/40 bg-gray-900/50'
              }`}>
                <input type="file" accept="image/*" className="hidden"
                  onChange={() => setPhotos(p => hasPhoto ? p.filter(x => x !== pos) : [...p, pos])} />
                {hasPhoto ? (
                  <>
                    <CheckCircle2 size={20} className="text-green-400 mb-1" />
                    <p className="text-green-400 text-xs font-medium text-center px-2">{pos}</p>
                  </>
                ) : (
                  <>
                    <Camera size={20} className="text-gray-600 mb-1" />
                    <p className="text-gray-600 text-xs text-center px-2">{pos}</p>
                    {i < 4 && <span className="absolute top-1.5 right-1.5 text-xs bg-gold-500/20 text-gold-400 px-1.5 rounded">Requis</span>}
                  </>
                )}
              </label>
            )
          })}
        </div>
        <div className={`card-luxe p-4 border-l-4 ${photos.length >= 4 ? 'border-l-green-500 bg-green-500/5' : 'border-l-orange-500 bg-orange-500/5'}`}>
          <div className="flex items-center gap-2">
            {photos.length >= 4
              ? <CheckCircle2 size={15} className="text-green-400" />
              : <AlertCircle size={15} className="text-orange-400" />}
            <p className={`text-sm font-medium ${photos.length >= 4 ? 'text-green-400' : 'text-orange-400'}`}>
              {photos.length}/4 photos requises chargées
              {photos.length >= 4 && ' — Minimum atteint !'}
            </p>
          </div>
        </div>
      </div>
    ),
    3: (
      <div className="space-y-5">
        <h2 className="text-white font-display font-bold text-xl mb-5">Services & tarification</h2>
        <Field label="Services proposés" required>
          <div className="space-y-2">
            {SERVICES.map(s => (
              <label key={s.key} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                form.services.includes(s.key)
                  ? 'bg-gold-500/10 border-gold-500/30'
                  : 'bg-gray-900 border-gray-800 hover:border-gray-700'
              }`}>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${form.services.includes(s.key) ? 'bg-gold-500/20 border-gold-500/50' : 'border-gray-700'}`}>
                  {form.services.includes(s.key) && <CheckCircle2 size={11} className="text-gold-400" />}
                </div>
                <input type="checkbox" className="hidden" checked={form.services.includes(s.key)} onChange={() => toggleArr('services', s.key)} />
                <div>
                  <p className={`text-sm font-semibold ${form.services.includes(s.key) ? 'text-gold-400' : 'text-white'}`}>{s.label}</p>
                  <p className="text-gray-500 text-xs">{s.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </Field>

        {(form.services.includes('location') || form.services.includes('chauffeur')) && (
          <div className="space-y-4 border-t border-gray-800 pt-5">
            <p className="text-white font-semibold text-sm">Tarifs de location (FCFA)</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Prix / jour" required hint="Ex: 250 000 FCFA">
                <Input type="number" value={form.prix_jour} onChange={e => set('prix_jour', e.target.value)} placeholder="250 000" />
              </Field>
              <Field label="Prix / semaine" hint="Optionnel — prix préférentiel 7 jours">
                <Input type="number" value={form.prix_semaine} onChange={e => set('prix_semaine', e.target.value)} placeholder="1 500 000" />
              </Field>
              <Field label="Prix / mois" hint="Optionnel — longue durée">
                <Input type="number" value={form.prix_mois} onChange={e => set('prix_mois', e.target.value)} placeholder="5 000 000" />
              </Field>
              <Field label="Caution requise" required>
                <Input type="number" value={form.caution} onChange={e => set('caution', e.target.value)} placeholder="1 500 000" />
              </Field>
            </div>
          </div>
        )}

        {form.services.includes('vente') && (
          <div className="space-y-4 border-t border-gray-800 pt-5">
            <p className="text-white font-semibold text-sm">Prix de vente (FCFA)</p>
            <Field label="Prix de vente TTC" required>
              <Input type="number" value={form.prix_vente} onChange={e => set('prix_vente', e.target.value)} placeholder="85 000 000" />
            </Field>
          </div>
        )}
      </div>
    ),
    4: (
      <div className="space-y-5">
        <h2 className="text-white font-display font-bold text-xl mb-2">Documents légaux</h2>
        <p className="text-gray-400 text-sm mb-5">Documents nécessaires pour la validation par notre équipe.</p>
        {[
          { name:'carteGrise', label:'📋 Carte grise (certificat d\'immatriculation)', required:true },
          { name:'assurance', label:'🛡️ Attestation d\'assurance en cours de validité', required:true },
          { name:'controleTech', label:'🔧 Contrôle technique (< 6 mois)', required:false },
          { name:'facture', label:'🧾 Facture d\'achat ou certificat de cession', required:false },
          { name:'photos360', label:'📷 Photos 360° ou vidéo du véhicule (optionnel)', required:false },
        ].map(doc => (
          <div key={doc.name} className={`p-4 rounded-xl border transition-all ${docs[doc.name] ? 'border-green-500/30 bg-green-500/5' : 'border-gray-800 bg-gray-900/50'}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-white">{doc.label}{doc.required && <span className="text-gold-400 ml-1">*</span>}</p>
              {docs[doc.name] && <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle2 size={11} /> Chargé</span>}
            </div>
            <label className="block border border-dashed border-gray-700 rounded-lg p-3 text-center cursor-pointer hover:border-gold-500/40 transition-colors">
              <Upload size={16} className="mx-auto mb-1 text-gray-600" />
              <p className="text-gray-500 text-xs">{docs[doc.name] ? docs[doc.name] : 'PDF ou JPG, max 10 MB'}</p>
              <input type="file" className="hidden" onChange={e => setDocs(d => ({...d, [doc.name]: e.target.files[0]?.name || ''}))} />
            </label>
          </div>
        ))}
      </div>
    ),
    5: (
      <div className="space-y-5">
        <h2 className="text-white font-display font-bold text-xl mb-5">Validation & récapitulatif</h2>

        {/* ── Compte propriétaire lié ── */}
        {isOwner ? (
          <div className="flex items-center gap-4 p-4 bg-green-500/8 border border-green-500/25 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0">
              <UserCheck size={18} className="text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-green-400 text-xs font-semibold uppercase tracking-wide mb-0.5">Véhicule lié à votre compte</p>
              <p className="text-white font-semibold text-sm">{user?.prenom} {user?.nom}</p>
              <div className="flex items-center gap-4 mt-0.5 text-gray-500 text-xs">
                {user?.telephone && <span>{user.telephone}</span>}
                {user?.email    && <span>{user.email}</span>}
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-1 text-xs text-gray-500">
              <Lock size={11} /> Verrouillé
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4 p-4 bg-yellow-500/8 border border-yellow-500/25 rounded-xl">
            <AlertCircle size={18} className="text-yellow-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-yellow-400 text-xs font-semibold mb-1">Compte non connecté</p>
              <p className="text-gray-400 text-xs leading-relaxed">Sans compte, votre véhicule ne sera pas lié à un profil propriétaire. Vous ne pourrez pas gérer vos réservations, revenus ou assigner des chauffeurs.</p>
              <Link to="/connexion" className="inline-flex items-center gap-1.5 mt-2 text-xs text-gold-400 hover:text-gold-300 font-medium transition-colors">
                <LogIn size={11} /> Se connecter / Créer un compte →
              </Link>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="card-luxe p-5 border-gold-500/20 bg-gradient-to-b from-gold-900/10 to-transparent">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <Car size={15} className="text-gold-400" /> Récapitulatif
          </h3>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            {[
              { k:'Véhicule', v:`${form.marque} ${form.modele}` },
              { k:'Année', v:form.annee },
              { k:'Plaque', v:form.plaque },
              { k:'Services', v:form.services.join(', ') },
              { k:'Prix/jour', v:form.prix_jour ? `${parseInt(form.prix_jour||0).toLocaleString('fr-FR')} FCFA` : 'N/A' },
              { k:'Photos', v:`${photos.length} photos` },
              { k:'Documents', v:`${Object.keys(docs).length}/3 docs` },
            ].map(({ k, v }) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-600">{k}</span>
                <span className={`font-medium ${v ? 'text-white' : 'text-red-400'}`}>{v || '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {[
          { key:'acceptConditions', label:"J'accepte les CGU Luxe Drive et la charte propriétaire", required:true },
          { key:'acceptInspection', label:"J'accepte qu'un agent Luxe Drive inspecte physiquement le véhicule avant mise en ligne", required:true },
          { key:'acceptExclusivite', label:"Je souhaite l'exclusivité Luxe Drive (pas de double inscription sur d'autres plateformes) — optionnel, bonus commission" },
        ].map(({ key, label, required }) => (
          <label key={key} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
            form[key] ? 'bg-gold-500/5 border-gold-500/20' : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
          }`}>
            <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${form[key] ? 'bg-gold-500/20 border-gold-500/50' : 'border-gray-700'}`}>
              {form[key] && <CheckCircle2 size={12} className="text-gold-400" />}
            </div>
            <input type="checkbox" className="hidden" checked={!!form[key]} onChange={e => set(key, e.target.checked)} />
            <span className="text-sm text-gray-300 leading-relaxed">
              {label}{required && <span className="text-gold-400 ml-1">*</span>}
            </span>
          </label>
        ))}
      </div>
    ),
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="font-display text-xl font-bold text-gold-400">Luxe Drive</Link>
        <Link to="/catalogue" className="text-gray-400 hover:text-white text-sm transition-colors">← Catalogue</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Auth guard banner */}
        {!isAuthenticated && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-yellow-500/8 border border-yellow-500/25 rounded-xl">
            <AlertCircle size={16} className="text-yellow-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-yellow-400 text-sm font-semibold mb-0.5">Connectez-vous pour lier ce véhicule à votre compte</p>
              <p className="text-gray-500 text-xs">Sans compte propriétaire, vous ne pourrez pas gérer vos réservations, revenus ni assigner de chauffeurs.</p>
            </div>
            <Link to="/connexion" className="shrink-0 flex items-center gap-1.5 text-xs bg-gold-500/10 border border-gold-500/30 text-gold-400 px-3 py-1.5 rounded-lg hover:bg-gold-500/20 transition-all font-medium">
              <LogIn size={11} /> Connexion
            </Link>
          </div>
        )}
        {isOwner && (
          <div className="mb-6 flex items-center gap-3 p-3.5 bg-green-500/8 border border-green-500/25 rounded-xl">
            <UserCheck size={15} className="text-green-400 shrink-0" />
            <p className="text-green-400 text-xs font-medium flex-1">
              Connecté en tant que <strong className="text-white">{user?.prenom} {user?.nom}</strong> — ce véhicule sera automatiquement lié à votre compte propriétaire.
            </p>
          </div>
        )}

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const done = step > s.n
            const active = step === s.n
            return (
              <div key={s.n} className="flex items-center gap-2 shrink-0">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  done ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                  active ? 'bg-gold-500/10 border-gold-500/30 text-gold-400' :
                  'bg-gray-900 border-gray-800 text-gray-600'
                }`}>
                  <Icon size={13} />
                  {s.label}
                </div>
                {i < STEPS.length - 1 && <ChevronRight size={14} className="text-gray-700 shrink-0" />}
              </div>
            )
          })}
        </div>

        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-white">Inscrire mon <span className="text-gold-400">véhicule</span></h1>
          <p className="text-gray-400 mt-1">Étape {step}/5 — {STEPS[step-1].label}</p>
          <div className="h-1.5 bg-gray-900 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gold-500 rounded-full transition-all duration-500" style={{width:`${(step/5)*100}%`}} />
          </div>
        </div>

        <div className="card-luxe p-8">
          {steps[step]}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
            {step > 1
              ? <button onClick={() => setStep(s => s-1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white text-sm transition-colors"><ChevronLeft size={15}/> Précédent</button>
              : <div />
            }
            {step < 5
              ? <button onClick={() => setStep(s => s+1)} disabled={!canNext[step]} className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-gold text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed">Suivant <ChevronRight size={15}/></button>
              : <button onClick={handleSubmit} disabled={!canNext[5]} className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-gold text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"><Zap size={15}/> Soumettre le véhicule</button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
