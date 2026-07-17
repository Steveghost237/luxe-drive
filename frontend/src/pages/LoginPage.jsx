import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Phone, ArrowLeft, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import useAuthStore from '../store/authStore'

const STEPS = { PHONE: 'phone', OTP: 'otp' }

export default function LoginPage() {
  const [step, setStep]         = useState(STEPS.PHONE)
  const [telephone, setPhone]   = useState('')
  const [otp, setOtp]           = useState('')
  const [debugOtp, setDebugOtp] = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate                = useNavigate()
  const login                   = useAuthStore((s) => s.login)

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    if (!telephone.trim()) return
    setLoading(true)
    try {
      const { data } = await api.post(`/auth/request-otp?telephone=${encodeURIComponent(telephone)}`)
      if (data.debug_otp) {
        setDebugOtp(data.debug_otp)
        toast.success(`[DEV] OTP : ${data.debug_otp}`, { duration: 30000, icon: '🔑' })
      } else {
        toast.success('Code OTP envoyé par SMS')
      }
      setStep(STEPS.OTP)
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
      const role = data.utilisateur.role
      const dest =
        role === 'super_admin' || role === 'admin' ? '/admin' :
        role === 'chauffeur'                        ? '/chauffeur' :
        role === 'proprietaire'                     ? '/proprietaire' :
        '/'
      navigate(dest)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Code incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-10 transition-colors">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>

        <div className="card-luxe p-8">
          <div className="text-center mb-8">
            <span className="font-display text-3xl font-bold text-gold-400">Luxe Drive</span>
            <p className="text-gray-500 mt-2 text-sm">
              {step === STEPS.PHONE
                ? 'Entrez votre numéro de téléphone'
                : `Code envoyé au ${telephone}`}
            </p>
          </div>

          {step === STEPS.PHONE ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Numéro de téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
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
              <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                Recevoir le code OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {debugOtp && (
                <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-xl">🔑</span>
                  <div>
                    <p className="text-yellow-400 text-xs font-semibold uppercase tracking-widest">Mode développement</p>
                    <p className="text-white font-mono font-bold text-2xl tracking-[0.3em] mt-0.5">{debugOtp}</p>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm text-gray-400 mb-2">Code OTP (6 chiffres)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="input-luxe text-center text-2xl tracking-[1rem] font-mono"
                  required
                />
              </div>
              <button type="submit" disabled={loading || otp.length !== 6} className="btn-gold w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                Confirmer
              </button>
              <button
                type="button"
                onClick={() => { setStep(STEPS.PHONE); setOtp('') }}
                className="btn-ghost w-full text-sm"
              >
                Changer de numéro
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
