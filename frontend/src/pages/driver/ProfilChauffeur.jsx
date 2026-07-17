import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import {
  Settings, User, Lock, FileText, Shield, Camera,
  CheckCircle2, AlertTriangle, Eye, EyeOff, Save, Bell,
  ToggleLeft, ToggleRight,
} from 'lucide-react'

const TABS = [
  { key:'profil',     icon: User,     label: 'Mon profil'       },
  { key:'securite',   icon: Lock,     label: 'Sécurité'         },
  { key:'documents',  icon: FileText, label: 'Documents'        },
  { key:'dressCode',  icon: Shield,   label: 'Dress Code'       },
  { key:'notifs',     icon: Bell,     label: 'Notifications'    },
]

const DRESS_ITEMS = [
  { item: 'Costume noir 3 pièces', ok: true  },
  { item: 'Chemise blanche',       ok: true  },
  { item: 'Cravate noire',         ok: true  },
  { item: 'Chaussures noires',     ok: true  },
  { item: 'Chaussettes noires',    ok: false },
  { item: 'Gants blancs (opt.)',   ok: false },
]

const DOCS = [
  { name:'Permis de conduire',  exp:'12 Jul 2025', status:'expiring', file:'permis_cm_2019.pdf' },
  { name:'Assurance véhicule',  exp:'30 Déc 2025', status:'valid',    file:'assurance_2025.pdf' },
  { name:'Carte grise',         exp: null,          status:'valid',    file:'carte_grise.pdf'    },
  { name:'Certificat médical',  exp:'03 Mar 2026',  status:'valid',    file:'cert_medical.pdf'   },
  { name:'Casier judiciaire',   exp: null,          status:'missing',  file: null                },
]

function TabBtn({ active, icon:Icon, label, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
        active ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' : 'text-gray-500 hover:text-white hover:bg-gray-800'
      }`}>
      <Icon size={15} className="shrink-0" />{label}
    </button>
  )
}

function FieldGroup({ label, children }) {
  return (
    <div>
      <label className="text-gray-400 text-xs font-medium block mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, type='text', placeholder='', disabled=false }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" />
  )
}

export default function ProfilChauffeur() {
  const { user, updateUser } = useAuthStore()
  const [tab, setTab] = useState('profil')
  const [saved, setSaved] = useState(false)
  const [dressCode, setDressCode] = useState(DRESS_ITEMS)

  const [form, setForm] = useState({
    prenom:    user?.prenom || '',
    nom:       user?.nom    || '',
    telephone: user?.telephone || '+237 677 000 000',
    email:     user?.email  || '',
    bio:       'Chauffeur professionnel certifié, 7 ans d\'expérience en transport VIP.',
    ville:     'Yaoundé',
    langue:    'Français, Anglais',
    disponible: true,
  })

  const [passForm, setPassForm] = useState({ current:'', next:'', confirm:'' })
  const [showPass, setShowPass] = useState({ current:false, next:false, confirm:false })
  const [notifPrefs, setNotifPrefs] = useState({
    missions: true, paiements: true, evaluations: true, alertes: true, email: false,
  })

  const handleSave = () => {
    updateUser({ prenom: form.prenom, nom: form.nom, email: form.email })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const toggleDress = (i) => {
    setDressCode(prev => prev.map((d,idx) => idx===i ? {...d, ok:!d.ok} : d))
  }

  const DOC_STATUS = {
    valid:    { label:'Valide',     color:'text-green-400',  bg:'bg-green-500/10',  border:'border-green-500/30'  },
    expiring: { label:'Expire bientôt', color:'text-orange-400', bg:'bg-orange-500/10', border:'border-orange-500/30' },
    missing:  { label:'Manquant',   color:'text-red-400',    bg:'bg-red-500/10',    border:'border-red-500/30'    },
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <Settings size={22} className="text-gold-400" /> Mon profil
        </h1>
        <p className="text-gray-500 text-sm mt-1">Gérez vos informations et préférences</p>
      </div>

      {/* Avatar banner */}
      <div className="card-luxe p-6 mb-6 flex items-center gap-5 border-gold-500/15 bg-gradient-to-r from-gold-900/10 to-transparent">
        <div className="relative group">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center text-3xl font-bold text-black shadow-lg">
            {(form.prenom[0] || 'C').toUpperCase()}
          </div>
          <button className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Camera size={20} className="text-white" />
          </button>
        </div>
        <div>
          <h2 className="text-white text-xl font-display font-bold">{form.prenom} {form.nom}</h2>
          <p className="text-gray-500 text-sm">{form.telephone}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs px-2.5 py-1 rounded-full">Chauffeur VIP</span>
            <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Disponible
            </span>
          </div>
        </div>
        <div className="ml-auto grid grid-cols-3 gap-4 text-center">
          {[{v:'18',l:'Missions'},{v:'4.9',l:'Note'},{v:'62',l:'Total'}].map(({v,l}) => (
            <div key={l}>
              <p className="text-white font-bold text-lg">{v}</p>
              <p className="text-gray-600 text-xs">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-44 shrink-0 space-y-0.5">
          {TABS.map(t => (
            <TabBtn key={t.key} active={tab===t.key} icon={t.icon} label={t.label} onClick={() => setTab(t.key)} />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* ── PROFIL ── */}
          {tab === 'profil' && (
            <div className="card-luxe p-6 space-y-5">
              <h2 className="text-white font-semibold text-sm border-b border-gray-800 pb-3">Informations personnelles</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <FieldGroup label="Prénom">
                  <Input value={form.prenom} onChange={e => setForm(f=>({...f, prenom:e.target.value}))} />
                </FieldGroup>
                <FieldGroup label="Nom">
                  <Input value={form.nom} onChange={e => setForm(f=>({...f, nom:e.target.value}))} />
                </FieldGroup>
                <FieldGroup label="Téléphone">
                  <Input value={form.telephone} onChange={e => setForm(f=>({...f, telephone:e.target.value}))} />
                </FieldGroup>
                <FieldGroup label="Email">
                  <Input type="email" value={form.email} onChange={e => setForm(f=>({...f, email:e.target.value}))} placeholder="votre@email.com" />
                </FieldGroup>
                <FieldGroup label="Ville">
                  <Input value={form.ville} onChange={e => setForm(f=>({...f, ville:e.target.value}))} />
                </FieldGroup>
                <FieldGroup label="Langues parlées">
                  <Input value={form.langue} onChange={e => setForm(f=>({...f, langue:e.target.value}))} />
                </FieldGroup>
              </div>
              <FieldGroup label="Biographie / Présentation">
                <textarea rows={3} value={form.bio} onChange={e => setForm(f=>({...f, bio:e.target.value}))}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 resize-none" />
              </FieldGroup>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <button onClick={() => setForm(f=>({...f, disponible:!f.disponible}))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      form.disponible
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-gray-900 border-gray-800 text-gray-500'
                    }`}>
                    {form.disponible ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    {form.disponible ? 'Disponible' : 'Non disponible'}
                  </button>
                </div>
                <button onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-gold text-sm font-semibold">
                  {saved ? <><CheckCircle2 size={14} /> Sauvegardé !</> : <><Save size={14} /> Enregistrer</>}
                </button>
              </div>
              {saved && <p className="text-green-400 text-xs flex items-center gap-1.5"><CheckCircle2 size={12} /> Modifications enregistrées avec succès.</p>}
            </div>
          )}

          {/* ── SÉCURITÉ ── */}
          {tab === 'securite' && (
            <div className="card-luxe p-6 space-y-5">
              <h2 className="text-white font-semibold text-sm border-b border-gray-800 pb-3">Changer le mot de passe</h2>
              {(['current','next','confirm']).map(k => {
                const labels = {current:'Mot de passe actuel', next:'Nouveau mot de passe', confirm:'Confirmer le nouveau'}
                return (
                  <FieldGroup key={k} label={labels[k]}>
                    <div className="relative">
                      <input type={showPass[k] ? 'text' : 'password'}
                        value={passForm[k]} onChange={e => setPassForm(f=>({...f,[k]:e.target.value}))}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-gold-500/50 transition-colors" />
                      <button type="button" onClick={() => setShowPass(p=>({...p,[k]:!p[k]}))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                        {showPass[k] ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </FieldGroup>
                )
              })}
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 space-y-2 text-xs text-gray-500">
                <p className="text-gray-400 font-medium mb-2">Règles de sécurité :</p>
                {['Minimum 8 caractères','Au moins une majuscule','Au moins un chiffre','Au moins un caractère spécial'].map(r => (
                  <p key={r} className="flex items-center gap-2"><CheckCircle2 size={11} className="text-gray-700" />{r}</p>
                ))}
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-gold text-sm font-semibold">
                <Save size={14} /> Modifier le mot de passe
              </button>
            </div>
          )}

          {/* ── DOCUMENTS ── */}
          {tab === 'documents' && (
            <div className="card-luxe p-6">
              <h2 className="text-white font-semibold text-sm border-b border-gray-800 pb-3 mb-5">Mes documents</h2>
              <div className="space-y-3">
                {DOCS.map(({name, exp, status, file}) => {
                  const cfg = DOC_STATUS[status]
                  return (
                    <div key={name} className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg ${cfg.bg} border ${cfg.border} flex items-center justify-center`}>
                          <FileText size={15} className={cfg.color} />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{name}</p>
                          {exp && <p className="text-gray-600 text-xs">Expire le {exp}</p>}
                          {!exp && status !== 'missing' && <p className="text-gray-600 text-xs">Sans expiration</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                        {file ? (
                          <button className="text-gold-400 hover:text-gold-300 text-xs transition-colors">Voir</button>
                        ) : (
                          <button className="text-blue-400 hover:text-blue-300 text-xs transition-colors">Téléverser</button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-5 bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={15} className="text-orange-400 mt-0.5 shrink-0" />
                <p className="text-orange-300/80 text-xs leading-relaxed">
                  Votre permis de conduire expire dans <strong className="text-orange-400">30 jours</strong>. 
                  Pensez à le renouveler pour éviter toute suspension de vos missions.
                </p>
              </div>
            </div>
          )}

          {/* ── DRESS CODE ── */}
          {tab === 'dressCode' && (
            <div className="card-luxe p-6">
              <h2 className="text-white font-semibold text-sm border-b border-gray-800 pb-3 mb-5">Checklist Dress Code</h2>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                Le dress code Luxe Drive est obligatoire à chaque mission. Cochez les éléments que vous avez préparés ce jour.
              </p>
              <div className="space-y-3">
                {dressCode.map(({item, ok}, i) => (
                  <button key={item} onClick={() => toggleDress(i)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left hover:border-gray-700"
                    style={{borderColor: ok ? 'rgba(34,197,94,0.3)' : 'rgba(75,85,99,0.5)'}}>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                      ok ? 'bg-green-500/20 border-green-500/50' : 'bg-gray-800 border-gray-700'
                    }`}>
                      {ok && <CheckCircle2 size={12} className="text-green-400" />}
                    </div>
                    <span className={`text-sm ${ok ? 'text-white' : 'text-gray-500'}`}>{item}</span>
                    <span className={`ml-auto text-xs ${ok ? 'text-green-400' : 'text-gray-700'}`}>
                      {ok ? '✓ OK' : 'À vérifier'}
                    </span>
                  </button>
                ))}
              </div>
              {dressCode.every(d=>d.ok) ? (
                <div className="mt-5 bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-400" />
                  <p className="text-green-400 text-sm font-medium">Dress code complet — vous êtes prêt pour la mission !</p>
                </div>
              ) : (
                <div className="mt-5 bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 flex items-start gap-2">
                  <AlertTriangle size={15} className="text-orange-400 mt-0.5 shrink-0" />
                  <p className="text-orange-300/80 text-xs">
                    {dressCode.filter(d=>!d.ok).length} élément(s) manquants. Cela peut impacter votre évaluation client.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {tab === 'notifs' && (
            <div className="card-luxe p-6">
              <h2 className="text-white font-semibold text-sm border-b border-gray-800 pb-3 mb-5">Préférences de notifications</h2>
              <div className="space-y-4">
                {Object.entries(notifPrefs).map(([key, val]) => {
                  const labels = {
                    missions:'Nouvelles missions & updates', paiements:'Paiements & virements',
                    evaluations:'Évaluations clients', alertes:'Alertes & rappels importants',
                    email:'Résumé email hebdomadaire',
                  }
                  return (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-900 rounded-xl border border-gray-800">
                      <div>
                        <p className="text-white text-sm font-medium capitalize">{labels[key]}</p>
                        <p className="text-gray-600 text-xs mt-0.5">
                          {key === 'email' ? 'Envoyé chaque lundi matin' : 'Notification push sur l\'app'}
                        </p>
                      </div>
                      <button onClick={() => setNotifPrefs(p=>({...p,[key]:!p[key]}))}
                        className={`relative w-11 h-6 rounded-full transition-all ${val ? 'bg-gold-500' : 'bg-gray-700'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${val ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  )
                })}
              </div>
              <button className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl btn-gold text-sm font-semibold">
                <Save size={14} /> Sauvegarder les préférences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
