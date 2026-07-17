import { useState } from 'react'
import { Bell, Car, Star, DollarSign, AlertTriangle, Info, CheckCheck, Trash2, Filter } from 'lucide-react'

const INITIAL = [
  { id:1,  type:'mission',   title:'Nouvelle mission disponible',          body:'Un transfert aéroport est proposé pour le 13 juin à 10h00. Véhicule : Mercedes S 580.',    time:'Il y a 5 min',   read:false },
  { id:2,  type:'mission',   title:'Mission confirmée',                    body:'Votre mission MIS-2025-0445 (M. Ondoua) est confirmée pour aujourd\'hui à 14h30.',          time:'Il y a 1 h',    read:false },
  { id:3,  type:'paiement',  title:'Virement reçu',                        body:'Vous avez reçu 25 000 FCFA pour la mission MIS-2025-0440. Solde mis à jour.',              time:'Il y a 2 h',    read:false },
  { id:4,  type:'evaluation',title:'Nouvelle évaluation 5★',               body:'M. Etoga Jean vous a attribué 5 étoiles : "Ponctuel, courtois, dress code impeccable."',    time:'Il y a 5 h',    read:true  },
  { id:5,  type:'alerte',    title:'Entretien mensuel dans 5 jours',        body:'Votre entretien d\'évaluation obligatoire est prévu le 17 juin. Préparez votre bilan.',     time:'Il y a 8 h',    read:true  },
  { id:6,  type:'info',      title:'Mise à jour de l\'application',         body:'Luxe Drive v2.1 est disponible. Nouvelles fonctionnalités GPS et tableau de bord amélioré.',time:'Hier',          read:true  },
  { id:7,  type:'paiement',  title:'Bonus de ponctualité crédité',          body:'Félicitations ! Un bonus de 5 000 FCFA a été ajouté à votre compte pour 100% de ponctualité ce mois.', time:'Hier', read:true  },
  { id:8,  type:'mission',   title:'Mission annulée par le client',         body:'La mission MIS-2025-0420 (M. Kameni) a été annulée par le client. Aucun impact sur votre note.',time:'Il y a 3 j', read:true  },
  { id:9,  type:'evaluation',title:'Nouvelle évaluation 4★',               body:'L\'Ambassade de France vous a noté 4/5 : "Très professionnel, légère imprécision GPS."',   time:'Il y a 4 j',   read:true  },
  { id:10, type:'alerte',    title:'Votre permis expire dans 30 jours',     body:'Votre permis de conduire (nº CM-2019-0234) expire le 12 juillet 2025. Pensez à le renouveler.', time:'Il y a 5 j', read:true  },
  { id:11, type:'info',      title:'Nouveau véhicule dans votre pool',      body:'Un Bentley Bentayga a été ajouté à votre pool par M. Ngono. Consultez les détails sur votre profil.', time:'Il y a 6 j', read:true },
  { id:12, type:'paiement',  title:'Bulletin de paie disponible',           body:'Votre relevé de missions du mois de mai 2025 est disponible en téléchargement.',            time:'Il y a 1 sem', read:true  },
]

const TYPE_CONFIG = {
  mission:   { icon: Car,          color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   label: 'Mission'    },
  evaluation:{ icon: Star,         color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Évaluation' },
  paiement:  { icon: DollarSign,   color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  label: 'Paiement'   },
  alerte:    { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Alerte'     },
  info:      { icon: Info,          color: 'text-gray-400',   bg: 'bg-gray-500/10',   border: 'border-gray-700',      label: 'Info'       },
}

const FILTERS = ['tous', 'mission', 'evaluation', 'paiement', 'alerte', 'info']

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(INITIAL)
  const [filter, setFilter] = useState('tous')

  const unread = notifs.filter(n => !n.read).length
  const filtered = filter === 'tous' ? notifs : notifs.filter(n => n.type === filter)

  const markRead   = (id) => setNotifs(p => p.map(n => n.id===id ? {...n, read:true} : n))
  const markAllRead = ()  => setNotifs(p => p.map(n => ({...n, read:true})))
  const remove     = (id) => setNotifs(p => p.filter(n => n.id!==id))
  const clearAll   = ()   => setNotifs(p => p.filter(n => !n.read))

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Bell size={22} className="text-gold-400" /> Notifications
            {unread > 0 && (
              <span className="bg-gold-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                {unread}
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {unread} non lue{unread>1?'s':''} · {notifs.length} au total
          </p>
        </div>
        <div className="flex gap-2">
          {unread > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white text-xs font-medium transition-colors">
              <CheckCheck size={13} /> Tout marquer lu
            </button>
          )}
          <button onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-500 hover:text-red-400 text-xs font-medium transition-colors">
            <Trash2 size={13} /> Effacer les lues
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-gray-900/50 p-1 rounded-xl flex-wrap border border-gray-800/50">
        {FILTERS.map(f => {
          const count = f === 'tous' ? notifs.length : notifs.filter(n => n.type===f).length
          const unreadCount = f === 'tous' ? unread : notifs.filter(n => n.type===f && !n.read).length
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filter === f
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                  : 'text-gray-500 hover:text-white'
              }`}>
              {f === 'tous' ? 'Toutes' : TYPE_CONFIG[f]?.label}
              {unreadCount > 0 && (
                <span className="bg-gold-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <Bell size={36} className="mx-auto mb-3 opacity-30" />
          <p>Aucune notification</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(n => {
            const cfg = TYPE_CONFIG[n.type]
            const Icon = cfg.icon
            return (
              <div key={n.id}
                onClick={() => markRead(n.id)}
                className={`group relative card-luxe p-4 flex gap-4 cursor-pointer transition-all hover:border-gray-700 ${
                  !n.read ? 'border-l-2 border-l-gold-500/60' : ''
                }`}>
                {/* Unread dot */}
                {!n.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gold-400" />
                )}

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                  <Icon size={16} className={cfg.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${n.read ? 'text-gray-300' : 'text-white'}`}>
                      {n.title}
                    </p>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed mt-0.5">{n.body}</p>
                  <p className="text-gray-700 text-xs mt-2">{n.time}</p>
                </div>

                {/* Delete on hover */}
                <button onClick={e => { e.stopPropagation(); remove(n.id) }}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md bg-gray-800 hover:bg-red-500/20 hover:text-red-400 text-gray-600 flex items-center justify-center transition-all">
                  <Trash2 size={11} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
