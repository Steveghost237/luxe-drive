import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Car } from 'lucide-react'
import api from '../utils/api'
import useAuthStore from '../store/authStore'
import { formatDate, formatPrice } from '../utils/format'

const STATUS_STYLES = {
  en_attente: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  confirmee:  'bg-blue-500/10  text-blue-400  border-blue-500/30',
  en_cours:   'bg-green-500/10 text-green-400 border-green-500/30',
  terminee:   'bg-gray-500/10  text-gray-400  border-gray-500/30',
  annulee:    'bg-red-500/10   text-red-400   border-red-500/30',
}

const STATUS_LABELS = {
  en_attente: 'En attente',
  confirmee:  'Confirmée',
  en_cours:   'En cours',
  terminee:   'Terminée',
  annulee:    'Annulée',
}

export default function ReservationsPage() {
  const user                      = useAuthStore((s) => s.user)
  const navigate                  = useNavigate()
  const [reservations, setR]      = useState([])
  const [loading, setL]           = useState(true)

  useEffect(() => {
    if (!user?.id) return
    api.get('/reservations', { params: { client_id: user.id } })
      .then((r) => setR(r.data))
      .catch(() => {})
      .finally(() => setL(false))
  }, [user])

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 h-16 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <Link to="/" className="font-display text-xl font-bold text-gold-400">Luxe Drive</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="section-title mb-2">Mes Réservations</h1>
        <div className="divider-gold mb-8" />

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-luxe h-28 animate-pulse bg-gray-800" />
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-24 text-gray-600">
            <Calendar size={48} className="mx-auto mb-4 opacity-30" />
            <p className="mb-4">Aucune réservation pour le moment</p>
            <Link to="/catalogue" className="btn-gold text-sm px-5 py-2">
              Explorer le catalogue
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((r) => (
              <div key={r.id} className="card-luxe p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                    <Car className="text-gold-400" size={18} />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{r.reference}</p>
                    <p className="text-gray-500 text-xs capitalize">{r.type_reservation}</p>
                    {r.date_debut && (
                      <p className="text-gray-600 text-xs mt-0.5">{formatDate(r.date_debut)}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[r.statut] || STATUS_STYLES.en_attente}`}>
                    {STATUS_LABELS[r.statut] || r.statut}
                  </span>
                  {r.total > 0 && (
                    <p className="text-gold-400 text-sm font-semibold mt-2">{formatPrice(r.total)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
