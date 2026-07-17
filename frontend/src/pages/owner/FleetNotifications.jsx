import { useState } from 'react'
import { Bell, AlertTriangle, CheckCircle2, Info, DollarSign, Car, Wrench, X } from 'lucide-react'

const NOTIFS = [
  { id:'n1', type:'payment',  titre:'Versement reçu — 860 000 FCFA', message:'Le paiement de la réservation LXD-2025-0891 (Mercedes S 580 / Min. Finances) a été viré sur votre compte.', date:'Aujourd\'hui, 14:32', lu:false },
  { id:'n2', type:'alert',   titre:'Alerte pneus — Audi A8 (LT-3456-YA)', message:'Le système GPS a détecté une pression insuffisante sur les pneus avant. Intervention requise sous 48h.', date:'Aujourd\'hui, 09:15', lu:false },
  { id:'n3', type:'booking', titre:'Nouvelle réservation confirmée', message:'Une réservation de 3 jours pour le Range Rover Autobiography a été confirmée par Pierre Atangana (200 000 FCFA).', date:'Hier, 18:44', lu:false },
  { id:'n4', type:'maintenance', titre:'BMW Serie 7 — Révision terminée', message:'La révision complète (50 000 km) du BMW Serie 7 chez Garage Elite Auto est terminée. Coût total : 185 000 FCFA.', date:'Hier, 11:20', lu:true },
  { id:'n5', type:'info',    titre:'Mise à jour des tarifs de séquestre', message:'À partir du 1er juillet, le délai de déblocage des fonds passe de J+1 à J+0 pour les locations de moins de 3 jours.', date:'08 Juin 2025', lu:true },
  { id:'n6', type:'payment', titre:'Séquestre débloqué — 540 000 FCFA', message:'Le montant de la réservation LXD-2025-0879 (Classe S 580 / Ambassade France) a été libéré du séquestre.', date:'07 Juin 2025', lu:true },
  { id:'n7', type:'alert',   titre:'Kilométrage élevé — Mercedes S 580', message:'Le véhicule Mercedes S 580 (LT-1234-YA) approche du seuil de révision (25 000 km). Planifiez une maintenance.', date:'05 Juin 2025', lu:true },
  { id:'n8', type:'booking', titre:'Annulation — Range Rover', message:'La réservation de l\'Ambassade du Canada pour le Range Rover (2 jours) a été annulée. Remboursement en cours.', date:'03 Juin 2025', lu:true },
]

const TYPES = {
  payment:     { icon: DollarSign, color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
  alert:       { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  booking:     { icon: Car,         color: 'text-blue-400',  bg: 'bg-blue-500/10 border-blue-500/20' },
  maintenance: { icon: Wrench,      color: 'text-orange-400',bg: 'bg-orange-500/10 border-orange-500/20' },
  info:        { icon: Info,        color: 'text-gray-400',  bg: 'bg-gray-700/30 border-gray-700' },
}

export default function FleetNotifications() {
  const [notifs, setNotifs] = useState(NOTIFS)
  const [filter, setFilter] = useState('toutes')

  const unread = notifs.filter(n => !n.lu).length

  const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, lu: true })))
  const dismiss = (id) => setNotifs(notifs.filter(n => n.id !== id))
  const markRead = (id) => setNotifs(notifs.map(n => n.id === id ? { ...n, lu: true } : n))

  const filtered = notifs.filter(n => {
    if (filter === 'toutes') return true
    if (filter === 'non_lues') return !n.lu
    return n.type === filter
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-3">
            Notifications
            {unread > 0 && (
              <span className="bg-gold-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">{unread}</span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{unread > 0 ? `${unread} non lue${unread > 1 ? 's' : ''}` : 'Tout est à jour'}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm text-gold-400 hover:text-gold-300 flex items-center gap-1.5 transition-colors">
            <CheckCircle2 size={14} /> Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key:'toutes', label:'Toutes' },
          { key:'non_lues', label:`Non lues (${unread})` },
          { key:'payment', label:'Paiements' },
          { key:'alert', label:'Alertes' },
          { key:'booking', label:'Réservations' },
          { key:'maintenance', label:'Maintenance' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`text-xs px-3 py-2 rounded-lg border font-medium transition-all ${filter === f.key ? 'bg-gold-500/10 text-gold-400 border-gold-500/30' : 'bg-gray-900 text-gray-500 border-gray-700 hover:border-gray-500'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Bell size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucune notification</p>
          </div>
        )}
        {filtered.map(n => {
          const t = TYPES[n.type]
          const Icon = t.icon
          return (
            <div key={n.id} onClick={() => markRead(n.id)}
              className={`card-luxe p-5 flex gap-4 cursor-pointer transition-all hover:border-gray-600 ${!n.lu ? 'border-gold-500/15' : ''}`}>
              <div className={`w-10 h-10 rounded-xl ${t.bg} border flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon size={16} className={t.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${!n.lu ? 'text-white' : 'text-gray-300'}`}>{n.titre}</p>
                  <div className="flex items-center gap-2 shrink-0">
                    {!n.lu && <div className="w-2 h-2 rounded-full bg-gold-400 shrink-0" />}
                    <button onClick={(e) => { e.stopPropagation(); dismiss(n.id) }}
                      className="text-gray-700 hover:text-gray-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed mt-1">{n.message}</p>
                <p className="text-gray-700 text-xs mt-2">{n.date}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
