import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2, Phone, Mail, FileText, Shield, CheckCircle2,
  ChevronLeft, ChevronRight, Upload, Globe, Users, Briefcase,
  Award, Zap, MapPin, CreditCard
} from 'lucide-react'

const STEPS = [
  { n:1, label:'Entreprise',   icon: Building2 },
  { n:2, label:'Représentant', icon: Users      },
  { n:3, label:'Activités',    icon: Briefcase  },
  { n:4, label:'Documents',    icon: FileText   },
  { n:5, label:'Validation',   icon: Shield     },
]

const SECTEURS = ['Transport privé','Transport diplomatique','Événementiel','Immobilier de luxe','Hôtellerie','Tourisme','Corporate/Entreprise','Ambassade/Consulat','ONG/Organisation','Autre']
const TAILLES  = ['TPE (1–5 emp.)','PME (6–50 emp.)','ETI (51–250 emp.)','Grande entreprise (250+)']

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
const Input = (props) => <input {...props} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 transition-colors" />
const Select = ({ children, ...props }) => <select {...props} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors appearance-none">{children}</select>
const Textarea = (props) => <textarea {...props} className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 resize-none transition-colors" />

const AVANTAGES_PRO = [
  { icon:'🚗', title:'Flotte multi-véhicules',  desc:'Gérez jusqu\'à 50 véhicules sur un seul tableau de bord.' },
  { icon:'👥', title:'Gestion de chauffeurs',   desc:'Assignation automatique, planning, évaluations.' },
  { icon:'📊', title:'Reporting avancé',        desc:'Statistiques, revenus, taux d\'occupation en temps réel.' },
  { icon:'🤝', title:'Contrats dédiés',         desc:'Contrats long terme avec entreprises et ambassades.' },
  { icon:'💳', title:'Facturation pro',         desc:'Factures PDF, TVA, comptabilité simplifiée.' },
  { icon:'📞', title:'Account manager dédié',  desc:'Un interlocuteur Luxe Drive rien que pour vous.' },
]

export default function ProAccountPage() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [docs, setDocs] = useState({})
  const [form, setForm] = useState({
    // entreprise
    raisonSociale:'', formeJuridique:'', numeroRccm:'', numeroCni:'',
    adresseSiege:'', ville:'', pays:'Cameroun', siteWeb:'', telephone:'', email:'',
    secteur:'', taille:'', anneeCreation:'',
    description:'',
    // représentant
    repPrenom:'', repNom:'', repFonction:'', repTel:'', repEmail:'',
    repCni:'',
    // activités
    services:[], vehiculesEstimes:'', chauffeursEstimes:'', zonesActivite:'',
    besoins:'',
    // conditions
    acceptCgu:false, acceptCharte:false, acceptCommission:false,
  })

  const set = (k, v) => setForm(f => ({...f, [k]: v}))
  const toggleArr = (key, val) => setForm(f => ({
    ...f, [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val]
  }))

  const canNext = {
    1: form.raisonSociale && form.formeJuridique && form.adresseSiege && form.ville && form.telephone && form.email && form.secteur,
    2: form.repPrenom && form.repNom && form.repFonction && form.repTel && form.repEmail,
    3: form.services.length > 0 && form.vehiculesEstimes,
    4: docs.registreCommerce,
    5: form.acceptCgu && form.acceptCharte,
  }

  if (submitted) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center card-luxe p-10 border-green-500/20">
        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={36} className="text-green-400" />
        </div>
        <h2 className="text-white font-display font-bold text-2xl mb-3">Compte Pro créé !</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-2">
          Votre dossier professionnel est en cours de vérification. Notre équipe vous contactera dans les <strong className="text-white">24–48h</strong> pour finaliser l'activation.
        </p>
        <p className="text-gray-600 text-sm mb-2">Référence : <span className="text-gold-400 font-mono">PRO-{Date.now().toString().slice(-6)}</span></p>
        <p className="text-gray-600 text-sm mb-6">Un email de confirmation a été envoyé à <span className="text-white">{form.email}</span></p>
        <div className="space-y-3">
          <Link to="/connexion" className="block w-full py-3 rounded-xl btn-gold text-sm font-semibold text-center">Se connecter à mon espace Pro</Link>
          <Link to="/inscription-vehicule" className="block text-gray-400 hover:text-white text-sm transition-colors">Inscrire mes véhicules →</Link>
        </div>
      </div>
    </div>
  )

  const steps = {
    1: (
      <div className="space-y-5">
        <h2 className="text-white font-display font-bold text-xl mb-5">Informations de l'entreprise</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Raison sociale" required>
            <Input value={form.raisonSociale} onChange={e => set('raisonSociale', e.target.value)} placeholder="ACME Transport Sarl" />
          </Field>
          <Field label="Forme juridique" required>
            <Select value={form.formeJuridique} onChange={e => set('formeJuridique', e.target.value)}>
              <option value="">Sélectionner…</option>
              {['SARL','SA','SAS','SNC','Association','ONG','Administration publique','Ambassade','Autre'].map(f => <option key={f} value={f}>{f}</option>)}
            </Select>
          </Field>
          <Field label="N° RCCM / Registre Commerce" hint="Ex: RC/YAO/2019/B/1234">
            <Input value={form.numeroRccm} onChange={e => set('numeroRccm', e.target.value)} placeholder="RC/YAO/2019/B/1234" />
          </Field>
          <Field label="N° Contribuable (NIU)">
            <Input value={form.numeroCni} onChange={e => set('numeroCni', e.target.value)} placeholder="M012345678901N" />
          </Field>
          <Field label="Adresse du siège" required>
            <Input value={form.adresseSiege} onChange={e => set('adresseSiege', e.target.value)} placeholder="Quartier Bastos, Rue…" />
          </Field>
          <Field label="Ville" required>
            <Select value={form.ville} onChange={e => set('ville', e.target.value)}>
              <option value="">Sélectionner…</option>
              {['Yaoundé','Douala','Bafoussam','Garoua','Bamenda','Bertoua','Limbe'].map(v => <option key={v} value={v}>{v}</option>)}
            </Select>
          </Field>
          <Field label="Téléphone principal" required>
            <Input value={form.telephone} onChange={e => set('telephone', e.target.value)} placeholder="+237 222 XXX XXX" />
          </Field>
          <Field label="Email professionnel" required>
            <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="contact@entreprise.cm" />
          </Field>
          <Field label="Site web">
            <Input value={form.siteWeb} onChange={e => set('siteWeb', e.target.value)} placeholder="https://www.entreprise.cm" />
          </Field>
          <Field label="Secteur d'activité" required>
            <Select value={form.secteur} onChange={e => set('secteur', e.target.value)}>
              <option value="">Sélectionner…</option>
              {SECTEURS.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
          <Field label="Taille de l'entreprise">
            <Select value={form.taille} onChange={e => set('taille', e.target.value)}>
              <option value="">Sélectionner…</option>
              {TAILLES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Année de création">
            <Input type="number" value={form.anneeCreation} onChange={e => set('anneeCreation', e.target.value)} placeholder="2015" min="1960" max="2025" />
          </Field>
        </div>
        <Field label="Présentation de l'entreprise">
          <Textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Décrivez votre activité, votre positionnement et vos objectifs sur Luxe Drive…" />
        </Field>
      </div>
    ),
    2: (
      <div className="space-y-5">
        <h2 className="text-white font-display font-bold text-xl mb-5">Représentant légal / Référent Luxe Drive</h2>
        <p className="text-gray-500 text-sm">Cette personne sera l'interlocuteur principal pour la gestion du compte Pro.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Prénom" required>
            <Input value={form.repPrenom} onChange={e => set('repPrenom', e.target.value)} placeholder="Jean-Pierre" />
          </Field>
          <Field label="Nom" required>
            <Input value={form.repNom} onChange={e => set('repNom', e.target.value)} placeholder="Nkomo" />
          </Field>
          <Field label="Fonction dans l'entreprise" required>
            <Select value={form.repFonction} onChange={e => set('repFonction', e.target.value)}>
              <option value="">Sélectionner…</option>
              {['Directeur Général','DG Adjoint','Responsable Transport','Responsable Logistique','Gérant','Administrateur','Secrétaire Général','Autre'].map(f => <option key={f} value={f}>{f}</option>)}
            </Select>
          </Field>
          <Field label="Téléphone direct" required>
            <Input value={form.repTel} onChange={e => set('repTel', e.target.value)} placeholder="+237 6XX XXX XXX" />
          </Field>
          <Field label="Email direct" required>
            <Input type="email" value={form.repEmail} onChange={e => set('repEmail', e.target.value)} placeholder="jean@entreprise.cm" />
          </Field>
          <Field label="N° CNI du représentant" hint="Pour vérification KYC">
            <Input value={form.repCni} onChange={e => set('repCni', e.target.value)} placeholder="123456789" />
          </Field>
        </div>
      </div>
    ),
    3: (
      <div className="space-y-5">
        <h2 className="text-white font-display font-bold text-xl mb-5">Besoins & activités</h2>
        <Field label="Services recherchés sur Luxe Drive" required>
          <div className="space-y-2">
            {[
              { key:'location_flotte',  label:'Mise en location de ma flotte', desc:'Vous avez des véhicules à rentabiliser' },
              { key:'gestion_chauf',    label:'Gestion de chauffeurs',          desc:'Vous employez des chauffeurs à gérer' },
              { key:'reservation_corp', label:'Réservations corporate',         desc:'Vous avez besoin de véhicules pour vos collaborateurs' },
              { key:'evenementiel',     label:'Transport événementiel',         desc:'Mariages, galas, conférences…' },
              { key:'mise_dispo',       label:'Mise à disposition longue durée',desc:'Contrats hebdo, mensuel, annuel' },
            ].map(s => (
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
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nombre de véhicules estimé" required>
            <Select value={form.vehiculesEstimes} onChange={e => set('vehiculesEstimes', e.target.value)}>
              <option value="">Sélectionner…</option>
              {['1–2','3–5','6–10','11–20','21–50','50+'].map(v => <option key={v} value={v}>{v} véhicules</option>)}
            </Select>
          </Field>
          <Field label="Nombre de chauffeurs estimé">
            <Select value={form.chauffeursEstimes} onChange={e => set('chauffeursEstimes', e.target.value)}>
              <option value="">Sélectionner…</option>
              {['0','1–2','3–5','6–10','10+'].map(v => <option key={v} value={v}>{v} chauffeur{v === '0' ? '' : 's'}</option>)}
            </Select>
          </Field>
          <Field label="Zones d'activité principales">
            <Input value={form.zonesActivite} onChange={e => set('zonesActivite', e.target.value)} placeholder="Yaoundé, Douala, Bafoussam…" />
          </Field>
        </div>
        <Field label="Besoins spécifiques / demandes particulières">
          <Textarea rows={3} value={form.besoins} onChange={e => set('besoins', e.target.value)} placeholder="Décrivez vos besoins spécifiques, contraintes ou demandes particulières…" />
        </Field>
      </div>
    ),
    4: (
      <div className="space-y-5">
        <h2 className="text-white font-display font-bold text-xl mb-2">Documents entreprise</h2>
        <p className="text-gray-400 text-sm mb-5">Documents nécessaires pour la validation KYB (Know Your Business).</p>
        {[
          { name:'registreCommerce',  label:'📋 Registre de Commerce (RCCM)', required:true },
          { name:'carteContribuable', label:'💳 Carte de contribuable (NIU)', required:false },
          { name:'statutsSociete',    label:'📄 Statuts de la société / Acte de création', required:false },
          { name:'cniRepresentant',   label:'🪪 CNI du représentant légal', required:false },
          { name:'procurationInterne',label:'✍️ Procuration interne (si délégué)', required:false },
          { name:'bilan',             label:'📊 Dernier bilan / état financier (optionnel)', required:false },
        ].map(doc => (
          <div key={doc.name} className={`p-4 rounded-xl border transition-all ${docs[doc.name] ? 'border-green-500/30 bg-green-500/5' : 'border-gray-800 bg-gray-900/50'}`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-white">{doc.label}{doc.required && <span className="text-gold-400 ml-1">*</span>}</p>
              {docs[doc.name] && <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle2 size={11}/> Chargé</span>}
            </div>
            <label className="block border border-dashed border-gray-700 rounded-lg p-3 text-center cursor-pointer hover:border-gold-500/40 transition-colors">
              <Upload size={16} className="mx-auto mb-1 text-gray-600" />
              <p className="text-gray-500 text-xs">{docs[doc.name] || 'PDF ou JPG, max 10 MB'}</p>
              <input type="file" className="hidden" onChange={e => setDocs(d => ({...d, [doc.name]: e.target.files[0]?.name || ''}))} />
            </label>
          </div>
        ))}
      </div>
    ),
    5: (
      <div className="space-y-5">
        <h2 className="text-white font-display font-bold text-xl mb-5">Conditions & offre Pro</h2>

        {/* Offre Pro */}
        <div className="card-luxe p-5 border-gold-500/20 bg-gradient-to-br from-gold-900/20 to-transparent mb-6">
          <p className="text-gold-400 font-bold text-sm uppercase tracking-wide mb-4">Votre offre Luxe Drive Pro</p>
          <div className="grid grid-cols-2 gap-3">
            {AVANTAGES_PRO.map(a => (
              <div key={a.title} className="flex items-start gap-2">
                <span className="text-lg">{a.icon}</span>
                <div>
                  <p className="text-white text-xs font-semibold">{a.title}</p>
                  <p className="text-gray-500 text-xs">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="card-luxe p-4 mb-4">
          <p className="text-gray-500 text-xs uppercase font-semibold mb-3">Récapitulatif</p>
          <div className="space-y-1 text-xs">
            {[
              {k:'Entreprise',    v:form.raisonSociale},
              {k:'Représentant',  v:`${form.repPrenom} ${form.repNom}`},
              {k:'Secteur',       v:form.secteur},
              {k:'Services',      v:`${form.services.length} sélectionné(s)`},
              {k:'Véhicules',     v:form.vehiculesEstimes},
            ].map(({k,v}) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-600">{k}</span>
                <span className={`font-medium ${v ? 'text-white' : 'text-red-400'}`}>{v || '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {[
          { key:'acceptCgu',        label:"J'accepte les CGU Luxe Drive Pro et la Charte des Partenaires Professionnels", required:true },
          { key:'acceptCharte',     label:"Je certifie que les informations fournies sont exactes et m'engage à les maintenir à jour", required:true },
          { key:'acceptCommission', label:"J'accepte la grille de commission Luxe Drive Pro (8–12% selon volume, négociable au-delà de 10 véhicules)" },
        ].map(({ key, label, required }) => (
          <label key={key} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${form[key] ? 'bg-gold-500/5 border-gold-500/20' : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'}`}>
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
        <Link to="/" className="font-display text-xl font-bold text-gold-400">Luxe Drive <span className="text-xs text-gray-500 font-sans font-normal ml-1">PRO</span></Link>
        <div className="flex items-center gap-3">
          <Link to="/partenaires" className="text-gray-400 hover:text-white text-sm transition-colors">Devenir partenaire</Link>
          <Link to="/connexion" className="btn-gold text-sm px-4 py-2">Connexion</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Steps */}
        <div className="flex items-center gap-1.5 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const done = step > s.n; const active = step === s.n
            return (
              <div key={s.n} className="flex items-center gap-1.5 shrink-0">
                <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  done ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                  active ? 'bg-gold-500/10 border-gold-500/30 text-gold-400' :
                  'bg-gray-900 border-gray-800 text-gray-600'}`}>
                  <Icon size={12} />{s.label}
                </div>
                {i < STEPS.length-1 && <ChevronRight size={12} className="text-gray-700 shrink-0" />}
              </div>
            )
          })}
        </div>

        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-white">Compte <span className="text-gold-400">Professionnel</span></h1>
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
              : <div />}
            {step < 5
              ? <button onClick={() => setStep(s => s+1)} disabled={!canNext[step]} className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-gold text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed">Suivant <ChevronRight size={15}/></button>
              : <button onClick={() => setSubmitted(true)} disabled={!canNext[5]} className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-gold text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"><Zap size={15}/> Créer mon compte Pro</button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
