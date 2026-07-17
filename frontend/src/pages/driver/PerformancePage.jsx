import { useState } from 'react'
import { TrendingUp, TrendingDown, Star, Car, MapPin, DollarSign, Award } from 'lucide-react'

const MONTHS = ['Jan','Fév','Mar','Avr','Mai','Jun']
const REVENUE_DATA  = [95, 112, 88, 135, 160, 185]
const MISSIONS_DATA = [10, 13, 9,  15,  17,  18 ]
const NOTE_DATA     = [4.7, 4.8, 4.6, 4.9, 4.8, 4.9]

const KPIS = [
  { label: 'Missions totales',  value: '62',    delta: '+18%', up: true,  icon: Car,       color: 'text-blue-400',  bg: 'bg-blue-500/10' },
  { label: 'Note moyenne',      value: '4.9',   delta: '+0.2', up: true,  icon: Star,      color: 'text-yellow-400',bg: 'bg-yellow-500/10'},
  { label: 'Km parcourus',      value: '4 280', delta: '+12%', up: true,  icon: MapPin,    color: 'text-green-400', bg: 'bg-green-500/10' },
  { label: 'Revenus (FCFA)',    value: '775K',  delta: '+22%', up: true,  icon: DollarSign,color: 'text-gold-400',  bg: 'bg-gold-500/10'  },
]

const PERF_METRICS = [
  { label: 'Ponctualité',        pct: 96, prev: 93 },
  { label: 'Satisfaction client',pct: 98, prev: 97 },
  { label: 'Respect dress code', pct: 90, prev: 85 },
  { label: 'Taux d\'acceptation',pct: 88, prev: 82 },
  { label: 'Zéro incident',      pct: 100,prev: 100},
]

const BADGES = [
  { icon: '🏆', label: 'Top Chauffeur', sub: 'Juin 2025',     earned: true  },
  { icon: '⭐', label: '50 courses',    sub: 'Débloqué',       earned: true  },
  { icon: '🎖️', label: 'Note parfaite', sub: '10× note 5/5',  earned: true  },
  { icon: '🚀', label: '100 courses',   sub: '38 restantes',   earned: false },
  { icon: '💎', label: 'Platinum',      sub: 'Note 5.0 / 3 mois', earned: false},
]

function BarChart({ data, labels, color = '#D4A017', unit = '', max }) {
  const peak = max || Math.max(...data)
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs text-gray-600">{v}{unit}</span>
          <div className="w-full rounded-t-md transition-all duration-500"
            style={{ height: `${(v / peak) * 90}%`, background: `${color}30`, borderTop: `2px solid ${color}` }} />
          <span className="text-xs text-gray-600">{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

function MiniLine({ data, color = '#D4A017' }) {
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const w = 100 / (data.length - 1)
  const points = data.map((v, i) => `${i * w},${100 - ((v - min) / range) * 80}`).join(' ')
  return (
    <svg viewBox={`0 0 100 100`} className="w-full h-16" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={i * w} cy={100 - ((v - min) / range) * 80} r="3" fill={color} />
      ))}
    </svg>
  )
}

export default function PerformancePage() {
  const [period, setPeriod] = useState('6m')

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <TrendingUp size={22} className="text-gold-400" /> Performance
          </h1>
          <p className="text-gray-500 text-sm mt-1">Vos statistiques et indicateurs de qualité</p>
        </div>
        <div className="flex gap-1 bg-gray-900 p-1 rounded-xl border border-gray-800">
          {['1m','3m','6m','1a'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === p ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' : 'text-gray-500 hover:text-white'
              }`}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {KPIS.map(({label, value, delta, up, icon: Icon, color, bg}) => (
          <div key={label} className="card-luxe p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={16} className={color} />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-green-400' : 'text-red-400'}`}>
                {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {delta}
              </span>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-3 gap-6 mb-8">

        {/* Revenue chart */}
        <div className="card-luxe p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold text-sm">Revenus mensuels (K FCFA)</h2>
            <span className="text-green-400 text-xs flex items-center gap-1">
              <TrendingUp size={12} /> +22% vs période préc.
            </span>
          </div>
          <BarChart data={REVENUE_DATA} labels={MONTHS} color="#D4A017" />
        </div>

        {/* Note évolution */}
        <div className="card-luxe p-6">
          <h2 className="text-white font-semibold text-sm mb-1">Évolution note</h2>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-yellow-400">4.9</span>
            <span className="text-green-400 text-xs mb-1 flex items-center gap-0.5">
              <TrendingUp size={11} /> +0.2
            </span>
          </div>
          <MiniLine data={NOTE_DATA} color="#FBBF24" />
          <div className="flex justify-between mt-1">
            {MONTHS.map(m => <span key={m} className="text-xs text-gray-700">{m}</span>)}
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">

        {/* Indicateurs qualité */}
        <div className="card-luxe p-6">
          <h2 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
            <Award size={15} className="text-gold-400" /> Indicateurs qualité
          </h2>
          <div className="space-y-4">
            {PERF_METRICS.map(({label, pct, prev}) => {
              const diff = pct - prev
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-gray-300 text-sm">{label}</span>
                    <div className="flex items-center gap-2">
                      {diff !== 0 && (
                        <span className={`text-xs flex items-center gap-0.5 ${diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {diff > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {diff > 0 ? '+' : ''}{diff}%
                        </span>
                      )}
                      <span className={`text-sm font-bold ${pct >= 95 ? 'text-green-400' : pct >= 85 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {pct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${
                      pct >= 95 ? 'bg-gradient-to-r from-green-600 to-green-400'
                      : pct >= 85 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400'
                      : 'bg-gradient-to-r from-red-600 to-red-400'
                    }`} style={{width:`${pct}%`}} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Missions bar */}
        <div className="card-luxe p-6">
          <h2 className="text-white font-semibold text-sm mb-5">Missions par mois</h2>
          <BarChart data={MISSIONS_DATA} labels={MONTHS} color="#60A5FA" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              {label:'Ce mois', value:'18', color:'text-blue-400'},
              {label:'Mois préc.', value:'17', color:'text-gray-400'},
              {label:'Moyenne', value:'13.7', color:'text-gray-500'},
            ].map(({label,value,color})=>(
              <div key={label} className="bg-gray-900 rounded-lg p-3 text-center">
                <p className={`text-lg font-bold ${color}`}>{value}</p>
                <p className="text-gray-600 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="card-luxe p-6 xl:col-span-2">
          <h2 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
            🏅 Mes badges & récompenses
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {BADGES.map(({icon, label, sub, earned}) => (
              <div key={label} className={`rounded-xl p-4 text-center border transition-all ${
                earned
                  ? 'bg-gold-500/5 border-gold-500/20 hover:border-gold-500/40'
                  : 'bg-gray-900/50 border-gray-800 opacity-50 grayscale'
              }`}>
                <div className="text-3xl mb-2">{icon}</div>
                <p className={`text-xs font-semibold ${earned ? 'text-white' : 'text-gray-600'}`}>{label}</p>
                <p className="text-gray-600 text-xs mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
