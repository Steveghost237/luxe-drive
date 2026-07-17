import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Loader2, Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../../store/authStore'

export default function AdminLoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const adminLogin               = useAuthStore((s) => s.adminLogin)
  const navigate                 = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    const result = await adminLogin(email, password)
    setLoading(false)
    if (result.success) {
      toast.success(`Bienvenue — Espace ${result.role === 'super_admin' ? 'Super-Admin' : 'Admin'}`)
      navigate(result.role === 'super_admin' ? '/super-admin' : '/admin')
    } else {
      toast.error(result.message || 'Identifiants incorrects')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-10 transition-colors">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>

        <div className="card-luxe p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-gold-400" />
            </div>
            <span className="font-display text-2xl font-bold text-gold-400">Luxe Drive</span>
            <p className="text-gray-500 mt-2 text-sm">Accès Administration · Espace Sécurisé</p>
          </div>

          {/* Hint */}
          <div className="bg-gold-500/5 border border-gold-500/15 rounded-xl px-4 py-3 mb-6 text-xs text-gray-500">
            <p className="font-semibold text-gold-400 mb-1">🔒 Authentification sécurisée</p>
            <p>Connectez-vous avec les identifiants de votre compte admin enregistré en base de données.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Adresse Gmail / Email professionnel</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="email"
                  placeholder="adminluxedrive@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-luxe pl-10"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-luxe pl-10 pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn-gold w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Shield size={16} />}
              {loading ? 'Vérification…' : 'Accéder au tableau de bord'}
            </button>
          </form>

          <p className="text-center text-gray-700 text-xs mt-6">
            Accès réservé aux administrateurs agréés Luxe Drive.
          </p>
        </div>
      </div>
    </div>
  )
}
