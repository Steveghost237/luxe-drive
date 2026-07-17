import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays, MapPin, CreditCard, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { formatPrice } from '../utils/format'

export default function BookingPage() {
  const { id }                          = useParams()
  const [params]                        = useSearchParams()
  const navigate                        = useNavigate()
  const [vehicle, setV]                 = useState(null)
  const [loading, setL]                 = useState(true)
  const [submitting, setSub]            = useState(false)
  const [form, setForm]                 = useState({
    type_reservation: params.get('type') || 'location',
    date_debut: '',
    date_fin: '',
    adresse_prise_en_charge: '',
    adresse_destination: '',
    mode_paiement: 'mobile_money',
    telephone_paiement: '',
  })

  useEffect(() => {
    api.get(`/vehicules/${id}`)
      .then((r) => setV(r.data))
      .catch(() => navigate('/catalogue'))
      .finally(() => setL(false))
  }, [id])

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSub(true)
    try {
      toast.success('Réservation créée avec succès !')
      navigate('/mes-reservations')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Erreur lors de la réservation')
    } finally {
      setSub(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 h-16 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <Link to="/" className="font-display text-xl font-bold text-gold-400">Luxe Drive</Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="section-title mb-2">Votre Réservation</h1>
        <p className="text-gray-500 mb-8">{vehicle?.nom} — {vehicle?.marque}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type */}
          <div className="card-luxe p-5">
            <label className="block text-sm text-gray-400 mb-3">Type de service</label>
            <div className="grid grid-cols-3 gap-3">
              {['location', 'chauffeur', 'achat'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type_reservation: t }))}
                  className={`py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
                    form.type_reservation === t
                      ? 'bg-gold-500 border-gold-500 text-black'
                      : 'border-gray-700 text-gray-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          {form.type_reservation !== 'achat' && (
            <div className="card-luxe p-5 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <CalendarDays size={14} /> Date de début
                </label>
                <input type="datetime-local" name="date_debut" value={form.date_debut}
                  onChange={handleChange} className="input-luxe" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <CalendarDays size={14} /> Date de fin
                </label>
                <input type="datetime-local" name="date_fin" value={form.date_fin}
                  onChange={handleChange} className="input-luxe" required />
              </div>
            </div>
          )}

          {/* Adresses */}
          <div className="card-luxe p-5 space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                <MapPin size={14} /> Adresse de prise en charge
              </label>
              <input type="text" name="adresse_prise_en_charge" value={form.adresse_prise_en_charge}
                onChange={handleChange} placeholder="Ex : Cocody, Abidjan" className="input-luxe" />
            </div>
            {form.type_reservation === 'chauffeur' && (
              <div>
                <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                  <MapPin size={14} /> Destination
                </label>
                <input type="text" name="adresse_destination" value={form.adresse_destination}
                  onChange={handleChange} placeholder="Ex : Aéroport FHB" className="input-luxe" />
              </div>
            )}
          </div>

          {/* Paiement */}
          <div className="card-luxe p-5 space-y-4">
            <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
              <CreditCard size={14} /> Mode de paiement
            </label>
            <select name="mode_paiement" value={form.mode_paiement}
              onChange={handleChange} className="input-luxe">
              <option value="mobile_money">Mobile Money (MTN / Orange)</option>
              <option value="especes">Espèces à la livraison</option>
              <option value="carte">Carte bancaire</option>
            </select>
            {form.mode_paiement === 'mobile_money' && (
              <input type="tel" name="telephone_paiement" value={form.telephone_paiement}
                onChange={handleChange} placeholder="Numéro Mobile Money" className="input-luxe" />
            )}
          </div>

          <button type="submit" disabled={submitting} className="btn-gold w-full flex items-center justify-center gap-2">
            {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
            Confirmer la réservation
          </button>
        </form>
      </div>
    </div>
  )
}
