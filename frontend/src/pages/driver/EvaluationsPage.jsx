import { useState } from 'react'
import { Star, TrendingUp, Filter, MessageSquare, ThumbsUp } from 'lucide-react'

const ALL_EVALS = [
  { id:1,  client:'M. Etoga Jean',       note:5, comment:'Ponctuel, courtois, dress code impeccable. Je recommande vivement.', date:'05 Juin 2025', type:'Transfert Aéroport', vehicule:'Mercedes S 580', replied:false },
  { id:2,  client:'Mme Bika Grace',      note:5, comment:'Excellent chauffeur, conduite très douce. Confort absolu.',          date:'03 Juin 2025', type:'Mise à disposition',  vehicule:'Audi A8 L',      replied:true  },
  { id:3,  client:'Amb. de France',      note:4, comment:'Très professionnel. Légère imprécision GPS sur le dernier tronçon.', date:'01 Juin 2025', type:'Protocole officiel',   vehicule:'Range Rover',    replied:false },
  { id:4,  client:'M. Ndi Albert',       note:5, comment:'Parfait de bout en bout. Véhicule impeccable.',                      date:'28 Mai 2025',  type:'Transfert hôtel',       vehicule:'Mercedes S 580', replied:true  },
  { id:5,  client:'Total Energies CMR',  note:5, comment:'Chauffeur au top du professionnalisme. Toute notre équipe satisfaite.',date:'25 Mai 2025', type:'Mise à disposition',  vehicule:'Audi A8 L',      replied:false },
  { id:6,  client:'Mme Koumba Adèle',   note:3, comment:'Conduite un peu brusque. Arrivée avec 5 min de retard.',             date:'20 Mai 2025',  type:'Transfert Aéroport', vehicule:'Mercedes S 580', replied:true  },
  { id:7,  client:'M. Mbida Paul',       note:5, comment:'Chauffeur très agréable et discret. Parfait pour notre CEO.',        date:'15 Mai 2025',  type:'Protocole officiel',   vehicule:'Range Rover',    replied:false },
  { id:8,  client:'Groupe Bolloré',      note:4, comment:'Très bien dans l\'ensemble. Quelques appels téléphoniques gênants.', date:'10 Mai 2025',  type:'Événement privé',      vehicule:'Bentley Bentayga',replied:false},
  { id:9,  client:'Mme Atangana Cécile', note:5, comment:'Je suis régulière avec Luxe Drive grâce à ce chauffeur.',           date:'05 Mai 2025',  type:'Mise à disposition',  vehicule:'Audi A8 L',      replied:true  },
  { id:10, client:'M. Kouam Théodore',   note:2, comment:'En retard de 20 minutes. A tenté une excuse peu convaincante.',      date:'28 Avr 2025',  type:'Transfert Aéroport', vehicule:'Mercedes S 580', replied:true  },
]

const DIST = [5,4,3,2,1].map(n => ({
  note: n,
  count: ALL_EVALS.filter(e => e.note === n).length,
  pct: Math.round(ALL_EVALS.filter(e => e.note === n).length / ALL_EVALS.length * 100),
}))
const AVG = (ALL_EVALS.reduce((s,e) => s + e.note, 0) / ALL_EVALS.length).toFixed(1)

function Stars({ n, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({length:5}).map((_,i) => (
        <Star key={i} size={size} className={i < n ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'} />
      ))}
    </div>
  )
}

function EvalCard({ e, onReply }) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')

  return (
    <div className="card-luxe p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-700 flex items-center justify-center shrink-0 text-xs font-bold text-gray-300">
          {e.client.split(' ').map(w => w[0]).slice(0,2).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="text-white font-semibold text-sm">{e.client}</p>
              <p className="text-gray-600 text-xs">{e.type} · {e.vehicule}</p>
            </div>
            <div className="text-right shrink-0">
              <Stars n={e.note} size={13} />
              <p className="text-gray-700 text-xs mt-1">{e.date}</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mt-2 italic">"{e.comment}"</p>

          {e.replied ? (
            <div className="mt-3 bg-gold-500/5 border border-gold-500/20 rounded-lg px-3 py-2.5 flex items-start gap-2">
              <ThumbsUp size={12} className="text-gold-400 mt-0.5 shrink-0" />
              <p className="text-gold-300/80 text-xs">Réponse envoyée — merci pour votre retour !</p>
            </div>
          ) : (
            <button onClick={() => setShowReply(v => !v)}
              className="mt-3 text-gold-400 hover:text-gold-300 text-xs flex items-center gap-1.5 transition-colors">
              <MessageSquare size={12} /> {showReply ? 'Annuler' : 'Répondre à cet avis'}
            </button>
          )}

          {showReply && !e.replied && (
            <div className="mt-3 space-y-2">
              <textarea rows={2} value={replyText} onChange={e => setReplyText(e.target.value)}
                placeholder="Remerciez le client ou apportez une explication…"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 resize-none" />
              <button onClick={() => { onReply(e.id); setShowReply(false) }}
                disabled={!replyText.trim()}
                className="px-4 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                Envoyer la réponse
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function EvaluationsPage() {
  const [filterNote, setFilterNote] = useState(0)
  const [evals, setEvals] = useState(ALL_EVALS)

  const filtered = filterNote === 0 ? evals : evals.filter(e => e.note === filterNote)

  const handleReply = (id) => {
    setEvals(prev => prev.map(e => e.id === id ? {...e, replied:true} : e))
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <Star size={22} className="text-gold-400" /> Évaluations
        </h1>
        <p className="text-gray-500 text-sm mt-1">{evals.length} avis clients au total</p>
      </div>

      <div className="grid xl:grid-cols-3 gap-6 mb-6">

        {/* Score global */}
        <div className="card-luxe p-6 text-center border-gold-500/20 bg-gradient-to-b from-gold-900/10 to-transparent">
          <p className="text-gray-500 text-sm mb-2">Note globale</p>
          <p className="text-6xl font-bold text-yellow-400 leading-none">{AVG}</p>
          <p className="text-gray-600 text-sm mt-1">sur 5.0</p>
          <div className="flex justify-center mt-3 gap-1">
            {Array.from({length:5}).map((_,i) => (
              <Star key={i} size={20} className={i < Math.round(Number(AVG)) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'} />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="bg-gray-900 rounded-lg p-2">
              <p className="text-white font-bold text-lg">{evals.length}</p>
              <p className="text-gray-600 text-xs">Avis</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-2">
              <p className="text-white font-bold text-lg">{evals.filter(e=>e.note>=4).length}</p>
              <p className="text-gray-600 text-xs">Positifs</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-2">
              <p className="text-green-400 font-bold text-lg flex items-center justify-center gap-0.5">
                <TrendingUp size={13} />+0.2
              </p>
              <p className="text-gray-600 text-xs">Tendance</p>
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div className="card-luxe p-6 xl:col-span-2">
          <h2 className="text-white font-semibold text-sm mb-4">Répartition des notes</h2>
          <div className="space-y-3">
            {DIST.map(({note, count, pct}) => (
              <div key={note} className="flex items-center gap-3">
                <button onClick={() => setFilterNote(filterNote === note ? 0 : note)}
                  className={`flex items-center gap-1 w-14 shrink-0 transition-all ${filterNote === note ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}>
                  <Star size={13} className={filterNote === note ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-500/50'} />
                  <span className="text-gray-300 text-sm font-medium">{note}</span>
                </button>
                <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${
                    note >= 4 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                    : note === 3 ? 'bg-gradient-to-r from-orange-600 to-orange-400'
                    : 'bg-gradient-to-r from-red-700 to-red-500'
                  }`} style={{width:`${pct}%`}} />
                </div>
                <span className="text-gray-500 text-xs w-14 text-right">{count} avis ({pct}%)</span>
              </div>
            ))}
          </div>
          {filterNote > 0 && (
            <button onClick={() => setFilterNote(0)} className="mt-4 text-xs text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1">
              <Filter size={11} /> Effacer le filtre
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-5">
        <Filter size={14} className="text-gray-600" />
        <span className="text-gray-500 text-sm">Filtrer :</span>
        <div className="flex gap-1">
          {[0,5,4,3,2,1].map(n => (
            <button key={n} onClick={() => setFilterNote(filterNote === n ? 0 : n)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterNote === n
                  ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                  : 'bg-gray-900 text-gray-500 border border-gray-800 hover:text-white'
              }`}>
              {n === 0 ? 'Tous' : <><Star size={10} className="fill-current" /> {n}</>}
            </button>
          ))}
        </div>
        <span className="ml-auto text-gray-600 text-xs">{filtered.length} résultat{filtered.length>1?'s':''}</span>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.map(e => (
          <EvalCard key={e.id} e={e} onReply={handleReply} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <Star size={32} className="mx-auto mb-2 opacity-30" />
            <p>Aucune évaluation pour ce filtre</p>
          </div>
        )}
      </div>
    </div>
  )
}
