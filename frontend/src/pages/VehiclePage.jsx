import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Car, Fuel, Users, Calendar, Zap, CheckCircle } from 'lucide-react'
import api from '../utils/api'
import { formatPrice } from '../utils/format'

export default function VehiclePage() {
  const { id }              = useParams()
  const navigate            = useNavigate()
  const [vehicle, setV]     = useState(null)
  const [loading, setL]     = useState(true)
  const [activeImg, setImg] = useState(0)

  useEffect(() => {
    api.get(`/vehicules/${id}`)
      .then((r) => setV(r.data))
      .catch(() => navigate('/catalogue'))
      .finally(() => setL(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!vehicle) return null

  const images = vehicle.images?.length ? vehicle.images : [null]

  const specs = [
    { icon: Zap,      label: 'Transmission', value: vehicle.transmission },
    { icon: Fuel,     label: 'Carburant',    value: vehicle.carburant },
    { icon: Users,    label: 'Places',       value: vehicle.nombre_places },
    { icon: Calendar, label: 'Année',        value: vehicle.annee },
  ].filter((s) => s.value)

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 h-16 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <Link to="/" className="font-display text-xl font-bold text-gold-400">Luxe Drive</Link>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="rounded-xl overflow-hidden bg-gray-900 h-80 mb-3">
            {images[activeImg] ? (
              <img src={images[activeImg]} alt={vehicle.nom} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Car className="text-gray-700" size={64} />
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImg(i)}
                  className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImg === i ? 'border-gold-500' : 'border-transparent'
                  }`}
                >
                  {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : null}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div>
          <p className="text-gold-400 text-sm uppercase tracking-widest mb-1">{vehicle.marque}</p>
          <h1 className="text-4xl font-display font-bold text-white mb-2">{vehicle.nom}</h1>
          {vehicle.description && (
            <p className="text-gray-400 text-sm leading-relaxed mb-6">{vehicle.description}</p>
          )}

          {/* Specs */}
          {specs.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-8">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 flex items-center gap-3">
                  <Icon className="text-gold-500" size={16} />
                  <div>
                    <p className="text-gray-500 text-xs">{label}</p>
                    <p className="text-white text-sm font-medium capitalize">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pricing */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-3">
            {vehicle.prix_location_jour && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Location / jour</span>
                <span className="text-gold-400 font-semibold text-lg">{formatPrice(vehicle.prix_location_jour)}</span>
              </div>
            )}
            {vehicle.prix_chauffeur_heure && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Chauffeur / heure</span>
                <span className="text-gold-400 font-semibold text-lg">{formatPrice(vehicle.prix_chauffeur_heure)}</span>
              </div>
            )}
            {vehicle.prix_vente && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Prix de vente</span>
                <span className="text-gold-400 font-semibold text-lg">{formatPrice(vehicle.prix_vente)}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3">
            {vehicle.disponible_location && (
              <Link to={`/reserver/${vehicle.id}?type=location`} className="btn-gold text-center">
                Réserver — Location
              </Link>
            )}
            {vehicle.disponible_chauffeur && (
              <Link to={`/reserver/${vehicle.id}?type=chauffeur`} className="btn-outline-gold text-center">
                Réserver — Chauffeur privé
              </Link>
            )}
            {vehicle.disponible_vente && (
              <Link to={`/reserver/${vehicle.id}?type=achat`} className="btn-outline-gold text-center">
                Acheter ce véhicule
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
