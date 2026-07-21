import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Phone, Mail, Lock, ArrowLeft, Loader2, Eye, EyeOff, Shield, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import useAuthStore from '../store/authStore'

const MODE = { PASSWORD: 'password', OTP: 'otp' }
const OTP_STEP = { PHONE: 'phone', CODE: 'code' }

function _redirect(navigate, role) {
  const dest =
    role === 'super_admin' || role === 'admin' ? '/admin' :
    role === 'chauffeur'                        ? '/chauffeur' :
    role === 'proprietaire'                     ? '/proprietaire' :
    '/'
  navigate(dest)
}

export default function LoginPage() {
  const [mode, setMode]         = useState(MODE.PASSWORD)
  const [identifiant, setId]    = useState('')          // email ou téléphone
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [otpStep, setOtpStep]   = useState(OTP_STEP.PHONE)
  const [telephone, setPhone]   = useState('')
  const [otp, setOtp]           = useState('')
  const [debugOtp, setDebugOtp] = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate                = useNavigate()
  const login                   = useAuthStore((s) => s.login)

  // ── Mode Mot de passe ─────────────────────────────────────────────────────
  const handlePasswordLogin = async (e) => {
    e.preventDefault()
    if (!identifiant.trim() || !password) return
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', {
        identifiant: identifiant.trim(),
        mot_de_passe: password,
      })
      login(data.utilisateur, data.access_token, data.refresh_token)
      toast.success(`Bienvenue ${data.utilisateur.prenom || ''} !`)
      _redirect(navigate, data.utilisateur.role)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Identifiant ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  // ── Mode OTP ──────────────────────────────────────────────────────────────
  const handleRequestOtp = async (e) => {
    e.preventDefault()
    if (!telephone.trim()) return
    setLoading(true)
    try {
      const { data } = await api.post(`/auth/request-otp?telephone=${encodeURIComponent(telephone)}`)
      if (data.debug_otp) {
        setDebugOtp(data.debug_otp)
        toast.success(`Code OTP : ${data.debug_otp}`, { duration: 60000, icon: '🔑' })
      } else {
        toast.success('Code OTP envoyé par SMS')
      }
      setOtpStep(OTP_STEP.CODE)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erreur lors de l\'envoi')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) return
    setLoading(true)
    try {
      const { data } = await api.post(
        `/auth/verify-otp?telephone=${encodeURIComponent(telephone)}&otp=${otp}`
      )
      login(data.utilisateur, data.access_token, data.refresh_token)
      toast.success(`Bienvenue ${data.utilisateur.prenom || ''} !`)
      _redirect(navigate, data.utilisateur.role)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Code incorrect')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (m) => {
    setMode(m)
    setId('')
    setPassword('')
    setPhone('')
    setOtp('')
    setOtpStep(OTP_STEP.PHONE)
    setDebugOtp('')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-10 transition-colors">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gold-500 flex items-center justify-center mx-auto mb-4">
            <span className="font-display font-bold text-black text-xl">LD</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Connexion</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Accédez à votre espace Luxe Drive</p>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6">
          <button
            onClick={() => switchMode(MODE.PASSWORD)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === MODE.PASSWORD
                ? 'bg-gold-500 text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Lock size={14} /> Email / Téléphone
          </button>
          <button
            onClick={() => switchMode(MODE.OTP)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === MODE.OTP
                ? 'bg-gold-500 text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare size={14} /> Code OTP
          </button>
        </div>

        <div className="card-luxe p-7">

          {/* ── PASSWORD MODE ── */}
          {mode === MODE.PASSWORD && (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email ou numéro de téléphone</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    placeholder="votre@email.com ou +237 6XX XXX XXX"
                    value={identifiant}
                    onChange={(e) => setId(e.target.value)}
                    className="input-luxe pl-10"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-luxe pl-10 pr-10"
                    autoComplete="current-password"
                    required
                  />
                  <button type="button" onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-2 py-3">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
                Se connecter
              </button>

              {/* Admin hint */}
              <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-500">
                  <span className="text-gold-500 font-semibold">Administrateurs :</span> utilisez votre email + mot de passe.<br />
                  <span className="text-gold-500 font-semibold">Clients / Chauffeurs :</span> utilisez votre numéro ou email + mot de passe créé lors de l'inscription.
                </p>
              </div>
            </form>
          )}

          {/* ── OTP MODE ── */}
          {mode === MODE.OTP && otpStep === OTP_STEP.PHONE && (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <p className="text-gray-500 text-sm">Recevez un code à usage unique par SMS pour vous connecter sans mot de passe.</p>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Numéro de téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="tel"
                    placeholder="+237 6XX XXX XXX"
                    value={telephone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-luxe pl-10"
                    required
                  />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-2 py-3">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <MessageSquare size={16} />}
                Recevoir le code OTP
              </button>
            </form>
          )}

          {mode === MODE.OTP && otpStep === OTP_STEP.CODE && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {debugOtp && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3">
                  <p className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-1">Code OTP (mode test)</p>
                  <p className="text-white font-mono font-bold text-3xl tracking-[0.5em]">{debugOtp}</p>
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Code envoyé au {telephone}</label>
                <input
                  type="text" inputMode="numeric" maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="input-luxe text-center text-3xl tracking-[1.2rem] font-mono font-bold"
                  required
                />
              </div>
              <button type="submit" disabled={loading || otp.length !== 6}
                className="btn-gold w-full flex items-center justify-center gap-2 py-3">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={16} />}
                Confirmer le code
              </button>
              <button type="button" onClick={() => { setOtpStep(OTP_STEP.PHONE); setOtp('') }}
                className="btn-ghost w-full text-sm">
                Changer de numéro
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="text-gold-400 hover:text-gold-300 font-medium">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}

