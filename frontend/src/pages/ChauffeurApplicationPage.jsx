import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User, Phone, Mail, MapPin, Car, FileText, Shield,
  CheckCircle2, AlertCircle, Upload, ChevronRight, ChevronLeft,
  Award, Star, Clock, Camera
} from 'lucide-react'

const STEPS = [
  { n: 1, label: 'Identité',        icon: User    },
  { n: 2, label: 'Expérience',      icon: Car     },
  { n: 3, label: 'Documents',       icon: FileText},
  { n: 4, label: 'Conditions',      icon: Shield  },
]

const PREREQUIS = [
  { icon: '📋', title: 'Permis de conduire valide',          detail: 'Catégorie B minimum, catégorie C fortement recommandée. Moins de 3 points retirés.' },
  { icon: '🪪', title: 'Carte nationale d\'identité',        detail: 'En cours de validité. Copie certifiée conforme exigée.' },
  { icon: '🩺', title: 'Certificat médical',                 detail: 'Visite médicale de moins de 6 mois attestant l\'aptitude à la conduite professionnelle.' },
  { icon: '📜', title: 'Extrait de casier judiciaire',       detail: 'Bulletin n°3 vierge de moins de 3 mois.' },
  { icon: '👔', title: 'Respect du dress code',              detail: 'Costume sombre, chemise blanche, cravate, chaussures de ville cirées. Tenue fournie par Luxe Drive.' },
  { icon: '🌍', title: 'Maîtrise du français/anglais',       detail: 'Niveau B2 minimum dans l\'une des deux langues. Des tests peuvent être effectués.' },
  { icon: '📱', title: 'Smartphone compatible',              detail: 'Android 10+ ou iOS 15+. Application Luxe Drive obligatoire.' },
  { icon: '🚗', title: '2 ans d\'expérience en conduite',    detail: 'Transport de personnes, VTC, ou expérience équivalente.' },
]

const AVANTAGES = [
  { icon: '💰', v: 'Revenus attractifs',      d: 'Commission nette 75–85% selon les missions' },
  { icon: '📅', v: 'Liberté de planning',     d: 'Choisissez vos jours et créneaux' },
  { icon: '🏆', v: 'Clientèle premium',        d: 'Diplomates, executives, célébrités' },
  { icon: '📚', v: 'Formation Luxe Drive',     d: 'Formation gratuite protocole VIP' },
  { icon: '🛡️', v: 'Assurance incluse',        d: 'Couverture pro sur toutes les missions' },
  { icon: '⭐', v: 'Programme fidélité',       d: 'Bonus performance et ancienneté' },
]

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-gray-400 text-xs font-medium mb-1.5">
        {label}{required && <span className="text-gold-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function Input({ ...props }) {
  return (
    <input {...props}
      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 transition-colors" />
  )
}

function Select({ children, ...props }) {
  return (
    <select {...props}
      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors appearance-none">
      {children}
    </select>
  )
}

function UploadBox({ label, name, value, onChange }) {
  return (
    <label className="block border-2 border-dashed border-gray-800 rounded-xl p-4 text-center cursor-pointer hover:border-gold-500/40 transition-colors">
      <Upload size={20} className="mx-auto mb-2 text-gray-600" />
      <p className="text-gray-500 text-xs">{value ? <span className="text-green-400">✓ {value}</span> : label}</p>
      <input type="file" name={name} className="hidden"
        onChange={e => onChange(name, e.target.files[0]?.name || '')} />
    </label>
  )
}

export default function ChauffeurApplicationPage() {
  const navigate  = useNavigate()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [checked, setChecked] = useState({})
  const [files, setFiles] = useState({})
  const [form, setForm] = useState({
    prenom:'', nom:'', telephone:'', email:'', ville:'',
    dateNaissance:'', sexe:'',
    experience:'', typePermis:'B', anneePermis:'',
    vehiculesConduits:'', langues:'', specialites:'',
    bio:'',
    acceptConditions: false, acceptDressCode: false, acceptFormation: false,
  })

  const set = (k, v) => setForm(f => ({...f, [k]: v}))

  const handleFile = (name, val) => setFiles(f => ({...f, [name]: val}))

  const steps = {
    1: (
      <div className="space-y-5">
        <h2 className="text-white font-display font-bold text-xl mb-5">Informations personnelles</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Prénom" required>
            <Input value={form.prenom} onChange={e => set('prenom', e.target.value)} placeholder="Votre prénom" />
          </Field>
          <Field label="Nom" required>
            <Input value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Votre nom de famille" />
          </Field>
          <Field label="Téléphone" required>
            <Input value={form.telephone} onChange={e => set('telephone', e.target.value)} placeholder="+237 6XX XXX XXX" />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="chauffeur@email.com" />
          </Field>
          <Field label="Ville de résidence" required>
            <Select value={form.ville} onChange={e => set('ville', e.target.value)}>
              <option value="">Sélectionner…</option>
              {['Yaoundé','Douala','Bafoussam','Garoua','Maroua','Bamenda','Bertoua'].map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </Select>
          </Field>
          <Field label="Date de naissance" required>
            <Input type="date" value={form.dateNaissance} onChange={e => set('dateNaissance', e.target.value)} />
          </Field>
          <Field label="Sexe" required>
            <Select value={form.sexe} onChange={e => set('sexe', e.target.value)}>
              <option value="">Sélectionner…</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </Select>
          </Field>
        </div>
        {/* Photo */}
        <Field label="Photo de profil professionnelle">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center">
              <Camera size={24} className="text-gray-600" />
            </div>
            <div>
              <UploadBox label="Cliquez pour uploader (JPG/PNG)" name="photo" value={files.photo} onChange={handleFile} />
              <p className="text-gray-600 text-xs mt-1">Photo en tenue professionnelle recommandée</p>
            </div>
          </div>
        </Field>
      </div>
    ),
    2: (
      <div className="space-y-5">
        <h2 className="text-white font-display font-bold text-xl mb-5">Expérience & compétences</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Années d'expérience en conduite professionnelle" required>
            <Select value={form.experience} onChange={e => set('experience', e.target.value)}>
              <option value="">Sélectionner…</option>
              <option value="2-3">2 à 3 ans</option>
              <option value="3-5">3 à 5 ans</option>
              <option value="5-10">5 à 10 ans</option>
              <option value="10+">Plus de 10 ans</option>
            </Select>
          </Field>
          <Field label="Catégorie de permis" required>
            <Select value={form.typePermis} onChange={e => set('typePermis', e.target.value)}>
              <option value="B">Catégorie B (Voiture)</option>
              <option value="C">Catégorie C (Poids lourd)</option>
              <option value="D">Catégorie D (Bus)</option>
              <option value="BC">B + C</option>
            </Select>
          </Field>
          <Field label="Année d'obtention du permis" required>
            <Input type="number" value={form.anneePermis} onChange={e => set('anneePermis', e.target.value)} placeholder="ex: 2015" min="1990" max="2024" />
          </Field>
          <Field label="Types de véhicules conduits" required>
            <Select value={form.vehiculesConduits} onChange={e => set('vehiculesConduits', e.target.value)}>
              <option value="">Sélectionner…</option>
              <option value="berlines">Berlines de luxe</option>
              <option value="suv">SUV / 4x4</option>
              <option value="berlines_suv">Berlines + SUV</option>
              <option value="minibus">Minibus</option>
              <option value="tous">Tous types</option>
            </Select>
          </Field>
        </div>
        <Field label="Langues maîtrisées" required>
          <div className="grid grid-cols-3 gap-2">
            {['Français','Anglais','Fulfulde','Ewondo','Duala','Espagnol','Arabe'].map(l => (
              <label key={l} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                form.langues.includes(l)
                  ? 'bg-gold-500/10 border-gold-500/30 text-gold-400'
                  : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700'
              }`}>
                <input type="checkbox" className="hidden"
                  checked={form.langues.includes(l)}
                  onChange={e => set('langues', e.target.checked
                    ? form.langues + (form.langues ? ',' : '') + l
                    : form.langues.split(',').filter(x => x !== l).join(',')
                  )} />
                <span className="text-xs font-medium">{l}</span>
              </label>
            ))}
          </div>
        </Field>
        <Field label="Spécialités souhaitées">
          <div className="grid grid-cols-2 gap-2">
            {['Transfert aéroport','Protocole officiel','Événementiel','Mariage','Corporate','Mise à disposition','Longue distance'].map(s => (
              <label key={s} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                form.specialites.includes(s)
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-700'
              }`}>
                <input type="checkbox" className="hidden"
                  checked={form.specialites.includes(s)}
                  onChange={e => set('specialites', e.target.checked
                    ? form.specialites + (form.specialites ? ',' : '') + s
                    : form.specialites.split(',').filter(x => x !== s).join(',')
                  )} />
                <span className="text-xs font-medium">{s}</span>
              </label>
            ))}
          </div>
        </Field>
        <Field label="Présentation personnelle">
          <textarea rows={3} value={form.bio} onChange={e => set('bio', e.target.value)}
            placeholder="Décrivez votre expérience, vos atouts et votre motivation…"
            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 resize-none" />
        </Field>
      </div>
    ),
    3: (
      <div className="space-y-5">
        <h2 className="text-white font-display font-bold text-xl mb-2">Documents requis</h2>
        <p className="text-gray-500 text-sm mb-5">Tous les documents doivent être lisibles, en cours de validité, et en PDF ou JPG.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name: 'permis',    label: '📄 Permis de conduire (recto-verso)' },
            { name: 'cni',       label: '🪪 Carte nationale d\'identité (recto-verso)' },
            { name: 'medical',   label: '🩺 Certificat médical (< 6 mois)' },
            { name: 'casier',    label: '📜 Extrait casier judiciaire B3 (< 3 mois)' },
            { name: 'photo_pro', label: '📸 Photo professionnelle (costume)' },
            { name: 'attestation',label: '📋 Attestation expérience antérieure (optionnel)' },
          ].map(doc => (
            <div key={doc.name} className={`rounded-xl border p-3 transition-all ${files[doc.name] ? 'border-green-500/30 bg-green-500/5' : 'border-gray-800 bg-gray-900/50'}`}>
              <UploadBox label={doc.label} name={doc.name} value={files[doc.name]} onChange={handleFile} />
              {files[doc.name] && (
                <div className="flex items-center gap-1.5 mt-2 text-green-400 text-xs">
                  <CheckCircle2 size={11} /> Fichier chargé
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="card-luxe p-4 border-blue-500/20 bg-blue-500/5">
          <div className="flex items-start gap-2">
            <AlertCircle size={15} className="text-blue-400 mt-0.5 shrink-0" />
            <p className="text-blue-300/80 text-xs leading-relaxed">
              Vos documents sont traités de manière confidentielle et sécurisée. Ils servent uniquement à la vérification KYC conformément à notre politique de confidentialité.
            </p>
          </div>
        </div>
      </div>
    ),
    4: (
      <div className="space-y-5">
        <h2 className="text-white font-display font-bold text-xl mb-5">Engagements & conditions</h2>
        {[
          { key: 'acceptConditions', label: 'J\'accepte les Conditions Générales d\'Utilisation de Luxe Drive et la Charte des Chauffeurs', required: true },
          { key: 'acceptDressCode', label: 'Je m\'engage à respecter le dress code Luxe Drive à chaque mission (costume sombre, chemise blanche, cravate)', required: true },
          { key: 'acceptFormation', label: 'Je m\'engage à suivre la formation d\'intégration Luxe Drive (2 jours, gratuite) avant ma première mission', required: true },
          { key: 'acceptPonctualite', label: 'Je comprends que tout retard non justifié de plus de 10 minutes peut entraîner une pénalité sur ma notation' },
          { key: 'acceptDiscretion', label: 'Je m\'engage à la discrétion absolue sur l\'identité et les activités de mes clients' },
          { key: 'acceptPartage', label: 'J\'accepte que mon profil soit visible sur la plateforme Luxe Drive pour les clients cherchant un chauffeur' },
        ].map(({ key, label, required }) => (
          <label key={key} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
            form[key] ? 'bg-gold-500/5 border-gold-500/20' : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
          }`}>
            <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
              form[key] ? 'bg-gold-500/20 border-gold-500/50' : 'border-gray-700'
            }`}>
              {form[key] && <CheckCircle2 size={12} className="text-gold-400" />}
            </div>
            <input type="checkbox" className="hidden" checked={!!form[key]}
              onChange={e => set(key, e.target.checked)} />
            <span className="text-sm text-gray-300 leading-relaxed">
              {label}{required && <span className="text-gold-400 ml-1">*</span>}
            </span>
          </label>
        ))}

        {/* Summary card */}
        <div className="card-luxe p-5 border-gold-500/20 bg-gradient-to-b from-gold-900/10 to-transparent">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <Award size={15} className="text-gold-400" /> Récapitulatif de votre candidature
          </h3>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            {[
              { k: 'Nom', v: `${form.prenom} ${form.nom}` },
              { k: 'Téléphone', v: form.telephone },
              { k: 'Ville', v: form.ville },
              { k: 'Expérience', v: form.experience },
              { k: 'Permis', v: form.typePermis },
              { k: 'Documents', v: `${Object.keys(files).length}/5 chargés` },
            ].map(({ k, v }) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-600">{k}</span>
                <span className={`font-medium ${v ? 'text-white' : 'text-red-400'}`}>{v || 'Non renseigné'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  }

  const canNext = {
    1: form.prenom && form.nom && form.telephone && form.ville && form.dateNaissance && form.sexe,
    2: form.experience && form.typePermis && form.anneePermis && form.langues,
    3: files.permis && files.cni && files.medical && files.casier,
    4: form.acceptConditions && form.acceptDressCode && form.acceptFormation,
  }

  if (submitted) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center card-luxe p-10 border-green-500/20">
        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={36} className="text-green-400" />
        </div>
        <h2 className="text-white font-display font-bold text-2xl mb-3">Candidature envoyée !</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-2">
          Votre dossier est en cours d'examen par notre équipe. Vous recevrez une réponse dans les <strong className="text-white">48–72h ouvrables</strong>.
        </p>
        <p className="text-gray-600 text-sm mb-6">Référence : <span className="text-gold-400 font-mono">CAND-{Date.now().toString().slice(-6)}</span></p>
        <div className="space-y-3">
          <Link to="/connexion" className="block w-full py-3 rounded-xl btn-gold text-sm font-semibold text-center">
            Se connecter / Créer mon compte
          </Link>
          <Link to="/" className="block text-gray-500 hover:text-white text-sm transition-colors">Retour à l'accueil</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="font-display text-xl font-bold text-gold-400">Luxe Drive</Link>
        <Link to="/catalogue?tab=chauffeur" className="text-gray-400 hover:text-white text-sm transition-colors">← Retour catalogue</Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left sidebar */}
          <div className="space-y-6">
            {/* Steps */}
            <div className="card-luxe p-5">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4">Étapes</p>
              {STEPS.map(s => {
                const Icon = s.icon
                const done = step > s.n
                const active = step === s.n
                return (
                  <div key={s.n} className={`flex items-center gap-3 py-2.5 px-3 rounded-xl mb-1 transition-all ${active ? 'bg-gold-500/10' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                      done ? 'bg-green-500/20 border border-green-500/40 text-green-400' :
                      active ? 'bg-gold-500/20 border border-gold-500/40 text-gold-400' :
                      'bg-gray-900 border border-gray-800 text-gray-600'
                    }`}>
                      {done ? <CheckCircle2 size={14} /> : s.n}
                    </div>
                    <span className={`text-sm font-medium ${active ? 'text-white' : done ? 'text-green-400' : 'text-gray-600'}`}>{s.label}</span>
                  </div>
                )
              })}
            </div>

            {/* Prérequis */}
            <div className="card-luxe p-5">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4">Prérequis</p>
              <div className="space-y-3">
                {PREREQUIS.slice(0,5).map(p => (
                  <div key={p.title} className="flex items-start gap-2">
                    <span className="text-sm">{p.icon}</span>
                    <p className="text-gray-400 text-xs leading-relaxed">{p.title}</p>
                  </div>
                ))}
              </div>
              <Link to="/partenaires" className="text-gold-400 text-xs hover:text-gold-300 mt-3 block">Voir tous les prérequis →</Link>
            </div>

            {/* Avantages */}
            <div className="card-luxe p-5 border-gold-500/15 bg-gold-500/5">
              <p className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-4">Avantages</p>
              <div className="space-y-2">
                {AVANTAGES.map(a => (
                  <div key={a.v} className="flex items-start gap-2">
                    <span className="text-sm">{a.icon}</span>
                    <div>
                      <p className="text-white text-xs font-medium">{a.v}</p>
                      <p className="text-gray-600 text-xs">{a.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main form */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="font-display text-3xl font-bold text-white">Devenir Chauffeur <span className="text-gold-400">Luxe Drive</span></h1>
              <p className="text-gray-400 mt-2">Rejoignez notre réseau d'élite. Étape {step}/4.</p>
              {/* Progress bar */}
              <div className="h-1.5 bg-gray-900 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-gold-500 rounded-full transition-all duration-500" style={{width: `${(step/4)*100}%`}} />
              </div>
            </div>

            <div className="card-luxe p-8">
              {steps[step]}

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
                {step > 1 ? (
                  <button onClick={() => setStep(s => s - 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white text-sm transition-colors">
                    <ChevronLeft size={15} /> Précédent
                  </button>
                ) : <div />}
                {step < 4 ? (
                  <button onClick={() => setStep(s => s + 1)} disabled={!canNext[step]}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-gold text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
                    Suivant <ChevronRight size={15} />
                  </button>
                ) : (
                  <button onClick={() => setSubmitted(true)} disabled={!canNext[4]}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-gold text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
                    <CheckCircle2 size={15} /> Soumettre ma candidature
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
