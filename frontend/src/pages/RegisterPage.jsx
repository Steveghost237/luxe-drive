import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import {
  Car, Users, Building2, Wrench, ArrowRight, ArrowLeft,
  Phone, User, Mail, FileText, CheckCircle2, Loader2, Shield
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import useAuthStore from '../store/authStore'
import Navbar from '../components/Navbar'

// ── ROLES ─────────────────────────────────────────────────────────────────────

const ROLES = [
  {
    key: 'client_physique',
    icon: User,
    title: 'Client Particulier',
    desc: 'Particulier souhaitant louer un véhicule de luxe avec ou sans chauffeur.',
    docs: ['Pièce d\'identité nationale (CNI / passeport)', 'Code PIN à 6 chiffres'],
    color: 'border-gold-500/30 hover:border-gold-500',
    iconBg: 'bg-gold-500/10',
    iconColor: 'text-gold-400',
  },
  {
    key: 'client_moral',
    icon: Building2,
    title: 'Entreprise / Institution',
    desc: 'Ambassades, ministères, ONG, mairies et entreprises. Facturation mensuelle.',
    docs: ['Registre de commerce / décret de création', 'Pièce identité du responsable'],
    color: 'border-blue-500/20 hover:border-blue-400',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
  },
  {
    key: 'proprietaire',
    icon: Car,
    title: 'Propriétaire de Véhicules',
    desc: 'Monétisez votre flotte. Carte grise obligatoirement à votre nom ou mandataire.',
    docs: ['CNI / Passeport', 'Carte grise de chaque véhicule', 'Attestation d\'assurance'],
    color: 'border-green-500/20 hover:border-green-400',
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-400',
  },
  {
    key: 'chauffeur',
    icon: Users,
    title: 'Chauffeur Confirmé',
    desc: 'Permis valide, références vérifiables, garant humain et dress code exigé.',
    docs: ['Permis de conduire valide', 'CNI / Passeport', 'Coordonnées du garant', 'Références d\'anciens employeurs'],
    color: 'border-purple-500/20 hover:border-purple-400',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
  },
]

const DRESS_CODE_ITEMS = [
  'Costume noir obligatoire',
  'Chemise blanche immaculée',
  'Cravate noire',
  'Chaussures noires cirées',
  'Chaussettes noires',
]

const STEPS = { ROLE: 'role', PHONE: 'phone', OTP: 'otp', DETAILS: 'details', DONE: 'done' }

export default function RegisterPage() {
  const [params]      = useSearchParams()
  const navigate      = useNavigate()
  const login         = useAuthStore((s) => s.login)

  const [step, setStep]     = useState(params.get('role') ? STEPS.PHONE : STEPS.ROLE)
  const [role, setRole]     = useState(params.get('role') || '')
  const [telephone, setTel] = useState('')
  const [otp, setOtp]       = useState('')
  const [loading, setL]     = useState(false)

  const [details, setDetails] = useState({
    nom: '', prenom: '', email: '', nom_entreprise: '',
    numero_permis: '', nom_garant: '', telephone_garant: '',
    pin: '', pin_confirm: '',
  })

  const selectedRole = ROLES.find((r) => r.key === role)

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleRoleSelect = (key) => {
    setRole(key)
    setStep(STEPS.PHONE)
  }

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    setL(true)
    try {
      await api.post(`/auth/request-otp?telephone=${encodeURIComponent(telephone)}`)
      toast.success('Code OTP envoyé par SMS')
      setStep(STEPS.OTP)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erreur lors de l\'envoi')
    } finally {
      setL(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setL(true)
    try {
      await api.post(`/auth/verify-otp?telephone=${encodeURIComponent(telephone)}&otp=${otp}`)
      setStep(STEPS.DETAILS)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Code incorrect')
    } finally {
      setL(false)
    }
  }

  const handleFinish = async (e) => {
    e.preventDefault()
    if (details.pin !== details.pin_confirm) {
      toast.error('Les codes PIN ne correspondent pas')
      return
    }
    setL(true)
    try {
      toast.success('Compte créé avec succès ! En attente de validation KYC.')
      setStep(STEPS.DONE)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erreur lors de la création du compte')
    } finally {
      setL(false)
    }
  }

  const setDet = (key, val) => setDetails((d) => ({ ...d, [key]: val }))

  // ── Render helpers ─────────────────────────────────────────────────────────

  const StepDot = ({ s, label }) => {
    const steps = [STEPS.ROLE, STEPS.PHONE, STEPS.OTP, STEPS.DETAILS]
    const idx   = steps.indexOf(s)
    const cur   = steps.indexOf(step)
    const done  = cur > idx
    const active= cur === idx
    return (
      <div className="flex flex-col items-center gap-1.5">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
          done   ? 'bg-gold-500 text-black' :
          active ? 'bg-gold-500/20 border-2 border-gold-500 text-gold-400' :
                   'bg-gray-800 border border-gray-700 text-gray-600'
        }`}>
          {done ? <CheckCircle2 size={14} /> : idx + 1}
        </div>
        <span className={`text-xs hidden sm:block ${active ? 'text-gold-400' : done ? 'text-gray-400' : 'text-gray-700'}`}>
          {label}
        </span>
      </div>
    )
  }

  // ── JSX ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">

        {/* Header */}
        {step !== STEPS.DONE && (
          <div className="text-center mb-10">
            <span className="font-display text-3xl font-bold text-white">
              Rejoindre <span className="text-gold-400">Luxe Drive</span>
            </span>
            <p className="text-gray-500 mt-2 text-sm">
              {step === STEPS.ROLE    && 'Choisissez votre profil pour commencer'}
              {step === STEPS.PHONE   && `Inscription — ${selectedRole?.title}`}
              {step === STEPS.OTP     && 'Vérification du numéro'}
              {step === STEPS.DETAILS && 'Complétez votre profil'}
            </p>

            {/* Progress bar */}
            {step !== STEPS.ROLE && (
              <div className="flex items-center justify-center gap-3 mt-8">
                {[
                  { s: STEPS.PHONE,   label: 'Téléphone' },
                  { s: STEPS.OTP,     label: 'OTP'       },
                  { s: STEPS.DETAILS, label: 'Profil'    },
                ].map(({ s, label }, i, arr) => (
                  <div key={s} className="flex items-center gap-3">
                    <StepDot s={s} label={label} />
                    {i < arr.length - 1 && (
                      <div className={`w-10 sm:w-16 h-px ${
                        [STEPS.PHONE, STEPS.OTP, STEPS.DETAILS].indexOf(step) > i
                          ? 'bg-gold-500' : 'bg-gray-800'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STEP: ROLE SELECTION ── */}
        {step === STEPS.ROLE && (
          <div className="grid sm:grid-cols-2 gap-5">
            {ROLES.map(({ key, icon: Icon, title, desc, docs, color, iconBg, iconColor }) => (
              <button
                key={key}
                onClick={() => handleRoleSelect(key)}
                className={`card-luxe ${color} p-7 text-left group transition-all duration-300 hover:-translate-y-1 flex flex-col`}
              >
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-5`}>
                  <Icon className={iconColor} size={22} />
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">{desc}</p>
                <div className="border-t border-gray-800 pt-4">
                  <p className="text-gray-600 text-xs uppercase tracking-widest mb-2">Documents requis</p>
                  <ul className="space-y-1.5">
                    {docs.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-gray-500 text-xs">
                        <FileText size={10} className="mt-0.5 shrink-0 text-gray-600" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-2 text-gold-400 text-sm font-medium mt-5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Choisir ce profil <ArrowRight size={14} />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ── STEP: PHONE ── */}
        {step === STEPS.PHONE && (
          <div className="max-w-md mx-auto card-luxe p-8">
            <button onClick={() => setStep(STEPS.ROLE)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors">
              <ArrowLeft size={14} /> Changer de profil
            </button>
            <div className={`w-12 h-12 rounded-xl ${selectedRole?.iconBg} flex items-center justify-center mb-5`}>
              {selectedRole && <selectedRole.icon className={selectedRole.iconColor} size={20} />}
            </div>
            <h2 className="font-display font-semibold text-white text-xl mb-1">{selectedRole?.title}</h2>
            <p className="text-gray-500 text-sm mb-7">Entrez votre numéro de téléphone pour recevoir un code OTP.</p>

            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Numéro de téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type="tel" value={telephone} onChange={(e) => setTel(e.target.value)}
                    placeholder="+237 6XX XXX XXX" className="input-luxe pl-10" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 py-3">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                Recevoir le code OTP
              </button>
            </form>
          </div>
        )}

        {/* ── STEP: OTP ── */}
        {step === STEPS.OTP && (
          <div className="max-w-md mx-auto card-luxe p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-5">
              <Shield className="text-gold-400" size={24} />
            </div>
            <h2 className="font-display font-semibold text-white text-xl mb-2">Vérification</h2>
            <p className="text-gray-500 text-sm mb-8">
              Code OTP envoyé au <span className="text-white font-medium">{telephone}</span>
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <input
                type="text" inputMode="numeric" maxLength={6}
                value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="input-luxe text-center text-3xl tracking-[1.2rem] font-mono font-bold"
                required
              />
              <button type="submit" disabled={loading || otp.length !== 6}
                className="btn-gold w-full flex items-center justify-center gap-2 py-3">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                Confirmer le code
              </button>
              <button type="button" onClick={() => setStep(STEPS.PHONE)}
                className="btn-ghost w-full text-sm py-2">
                Changer de numéro
              </button>
            </form>
          </div>
        )}

        {/* ── STEP: DETAILS ── */}
        {step === STEPS.DETAILS && (
          <form onSubmit={handleFinish} className="space-y-6">

            {/* Base info */}
            <div className="card-luxe p-7">
              <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
                <User size={16} className="text-gold-400" /> Informations personnelles
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Prénom</label>
                  <input type="text" value={details.prenom} onChange={(e) => setDet('prenom', e.target.value)}
                    placeholder="Jean" className="input-luxe" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Nom</label>
                  <input type="text" value={details.nom} onChange={(e) => setDet('nom', e.target.value)}
                    placeholder="Dupont" className="input-luxe" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <Mail size={13} /> Email (optionnel)
                  </label>
                  <input type="email" value={details.email} onChange={(e) => setDet('email', e.target.value)}
                    placeholder="votre@email.com" className="input-luxe" />
                </div>
                {role === 'client_moral' && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Nom de l'organisation</label>
                    <input type="text" value={details.nom_entreprise} onChange={(e) => setDet('nom_entreprise', e.target.value)}
                      placeholder="Ambassade de France / Ministère des Finances..." className="input-luxe" required />
                  </div>
                )}
              </div>
            </div>

            {/* Chauffeur extra */}
            {role === 'chauffeur' && (
              <>
                <div className="card-luxe p-7">
                  <h3 className="font-semibold text-white mb-5">Informations professionnelles</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">N° Permis de conduire</label>
                      <input type="text" value={details.numero_permis} onChange={(e) => setDet('numero_permis', e.target.value)}
                        placeholder="CM-XXX-XXXXX" className="input-luxe" required />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nom du garant</label>
                      <input type="text" value={details.nom_garant} onChange={(e) => setDet('nom_garant', e.target.value)}
                        placeholder="Nom complet du garant" className="input-luxe" required />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm text-gray-400 mb-2">Téléphone du garant</label>
                      <input type="tel" value={details.telephone_garant} onChange={(e) => setDet('telephone_garant', e.target.value)}
                        placeholder="+237 6XX XXX XXX" className="input-luxe" required />
                    </div>
                  </div>
                </div>

                {/* Dress code */}
                <div className="card-luxe p-7 border-gold-500/20">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-gold-400 text-lg">👔</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">Dress Code Obligatoire</h3>
                      <p className="text-gray-500 text-xs mb-4">
                        En rejoignant Luxe Drive, vous vous engagez à respecter le dress code suivant lors de chaque prestation.
                      </p>
                      <ul className="space-y-2">
                        {DRESS_CODE_ITEMS.map((item) => (
                          <li key={item} className="flex items-center gap-2.5 text-gray-300 text-sm">
                            <CheckCircle2 size={13} className="text-gold-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <label className="flex items-start gap-3 mt-6 cursor-pointer group">
                    <input type="checkbox" required className="w-4 h-4 mt-0.5 accent-yellow-500 shrink-0" />
                    <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                      Je m'engage à respecter le dress code Luxe Drive lors de toutes mes prestations.
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* PIN security */}
            <div className="card-luxe p-7">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Shield size={16} className="text-gold-400" /> Sécurisation du compte
              </h3>
              <p className="text-gray-500 text-xs mb-5">
                Créez un code PIN à 6 chiffres pour sécuriser votre compte et valider chaque transaction.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Code PIN (6 chiffres)</label>
                  <input type="password" inputMode="numeric" maxLength={6}
                    value={details.pin} onChange={(e) => setDet('pin', e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••" className="input-luxe text-center tracking-widest" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Confirmer le PIN</label>
                  <input type="password" inputMode="numeric" maxLength={6}
                    value={details.pin_confirm} onChange={(e) => setDet('pin_confirm', e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••" className="input-luxe text-center tracking-widest" required />
                </div>
              </div>
            </div>

            {/* Legal */}
            <div className="card-luxe p-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required className="w-4 h-4 mt-0.5 accent-yellow-500 shrink-0" />
                <span className="text-gray-400 text-sm">
                  J'accepte les{' '}
                  <Link to="/cgv" className="text-gold-400 hover:underline">conditions générales</Link>
                  {' '}et la{' '}
                  <Link to="/confidentialite" className="text-gold-400 hover:underline">politique de confidentialité</Link>
                  {' '}de Luxe Drive. Je consens à la vérification KYC de mon identité.
                </span>
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 py-4 text-base">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              Créer mon compte Luxe Drive
            </button>
          </form>
        )}

        {/* ── STEP: DONE ── */}
        {step === STEPS.DONE && (
          <div className="max-w-md mx-auto text-center card-luxe p-12">
            <div className="w-20 h-20 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-gold-400" size={40} />
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              Demande envoyée !
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Votre dossier est en cours de vérification KYC par notre équipe de conformité.
              Vous recevrez un SMS de confirmation sous <strong className="text-white">24 à 48h ouvrées</strong>.
            </p>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8 text-left space-y-2">
              {[
                '✅ Numéro de téléphone vérifié',
                '⏳ Vérification KYC en cours',
                '⏳ Activation du compte',
              ].map((s) => (
                <p key={s} className="text-sm text-gray-400">{s}</p>
              ))}
            </div>
            <Link to="/" className="btn-gold w-full text-center py-3 block">
              Retour à l'accueil
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
