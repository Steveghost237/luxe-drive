import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Phone, Mail, LogOut, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'

export default function ProfilePage() {
  const { user, logout } = useAuthStore()
  const navigate          = useNavigate()
  const [form, setForm]   = useState({ nom: user?.nom || '', prenom: user?.prenom || '', email: user?.email || '' })

  const handleLogout = () => {
    logout()
    toast.success('Déconnexion réussie')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
            <ArrowLeft size={20} />
          </button>
          <Link to="/" className="font-display text-xl font-bold text-gold-400">Luxe Drive</Link>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition-colors">
          <LogOut size={16} /> Déconnexion
        </button>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
            {user?.photo_url
              ? <img src={user.photo_url} className="w-full h-full rounded-full object-cover" alt="" />
              : <User className="text-gold-400" size={28} />}
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white">
              {user?.prenom || user?.nom || 'Votre Profil'}
            </h1>
            <span className="badge-gold capitalize">{user?.role}</span>
          </div>
        </div>

        <div className="card-luxe p-6 space-y-5 mb-6">
          <h2 className="text-lg font-semibold text-white border-b border-gray-800 pb-3">
            Informations personnelles
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Prénom</label>
              <input type="text" value={form.prenom} onChange={(e) => setForm(f => ({...f, prenom: e.target.value}))}
                className="input-luxe" placeholder="Prénom" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nom</label>
              <input type="text" value={form.nom} onChange={(e) => setForm(f => ({...f, nom: e.target.value}))}
                className="input-luxe" placeholder="Nom" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2"><Mail size={14} /> Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))}
              className="input-luxe" placeholder="votre@email.com" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2"><Phone size={14} /> Téléphone</label>
            <input type="text" value={user?.telephone || ''} disabled className="input-luxe opacity-50 cursor-not-allowed" />
          </div>
          <button className="btn-gold w-full" onClick={() => toast.success('Profil mis à jour')}>
            Enregistrer les modifications
          </button>
        </div>

        <div className="card-luxe p-6">
          <h2 className="text-lg font-semibold text-white border-b border-gray-800 pb-3 mb-4">
            Accès rapide
          </h2>
          <div className="space-y-2">
            <Link to="/mes-reservations" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
              Mes réservations <span className="text-gold-500">→</span>
            </Link>
            <Link to="/catalogue" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
              Explorer le catalogue <span className="text-gold-500">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
