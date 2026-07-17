import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Car } from 'lucide-react'

const TODAY = new Date(2025, 5, 12) // 12 juin 2025

const MISSIONS_CAL = [
  { id:1, date:'2025-06-12', heure:'09:00', duree:2, type:'Protocole',        client:'Ambassade France',       vehicule:'Range Rover',         color:'bg-purple-500/20 border-purple-500/40 text-purple-300' },
  { id:2, date:'2025-06-12', heure:'14:30', duree:1, type:'Transfert Aéroport',client:'M. C. Ondoua',          vehicule:'Mercedes S 580',       color:'bg-gold-500/20 border-gold-500/40 text-gold-300'   },
  { id:3, date:'2025-06-13', heure:'10:00', duree:1, type:'Transfert Aéroport',client:'M. Fouda Serge',        vehicule:'Mercedes S 580',       color:'bg-gold-500/20 border-gold-500/40 text-gold-300'   },
  { id:4, date:'2025-06-13', heure:'14:00', duree:4, type:'Mise à disposition', client:'Mme Owona Sandrine',   vehicule:'Audi A8 L',            color:'bg-blue-500/20 border-blue-500/40 text-blue-300'   },
  { id:5, date:'2025-06-15', heure:'08:30', duree:3, type:'Événement privé',    client:'Groupe Bolloré',       vehicule:'Bentley Bentayga',     color:'bg-pink-500/20 border-pink-500/40 text-pink-300'   },
  { id:6, date:'2025-06-16', heure:'10:00', duree:2, type:'Visite officielle',  client:'Ministère des Finances',vehicule:'Range Rover',         color:'bg-purple-500/20 border-purple-500/40 text-purple-300'},
  { id:7, date:'2025-06-17', heure:'07:00', duree:1, type:'Transfert Aéroport', client:'M. Ndi Albert',        vehicule:'Mercedes S 580',       color:'bg-gold-500/20 border-gold-500/40 text-gold-300'   },
  { id:8, date:'2025-06-18', heure:'09:00', duree:6, type:'Mise à disposition', client:'Total Energies CMR',   vehicule:'Audi A8 L',            color:'bg-blue-500/20 border-blue-500/40 text-blue-300'   },
  { id:9, date:'2025-06-20', heure:'14:00', duree:1, type:'Transfert hôtel',    client:'Mme Bikié Rose',       vehicule:'Mercedes S 580',       color:'bg-gold-500/20 border-gold-500/40 text-gold-300'   },
]

const DAYS_FR = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year, month) {
  let d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1 // Monday = 0
}

function toKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth()+1).padStart(2,'0')
  const d = String(date.getDate()).padStart(2,'0')
  return `${y}-${m}-${d}`
}

export default function PlanningPage() {
  const [view, setView]     = useState('month') // month | week
  const [current, setCurrent] = useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))
  const [selected, setSelected] = useState(null)

  const year  = current.getFullYear()
  const month = current.getMonth()
  const daysInMonth  = getDaysInMonth(year, month)
  const firstDay     = getFirstDayOfMonth(year, month)

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1))

  const missionsByDay = {}
  MISSIONS_CAL.forEach(m => {
    if (!missionsByDay[m.date]) missionsByDay[m.date] = []
    missionsByDay[m.date].push(m)
  })

  const selectedKey = selected ? toKey(selected) : null
  const selectedMissions = selectedKey ? (missionsByDay[selectedKey] || []) : []

  // Week view
  const weekStart = new Date(TODAY)
  weekStart.setDate(TODAY.getDate() - ((TODAY.getDay() + 6) % 7))
  const weekDays = Array.from({length: 7}, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d
  })

  const HOURS = ['08h','09h','10h','11h','12h','13h','14h','15h','16h','17h','18h','19h','20h']

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Calendar size={22} className="text-gold-400" /> Planning
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {MISSIONS_CAL.length} missions planifiées ce mois
          </p>
        </div>
        <div className="flex gap-1 bg-gray-900 p-1 rounded-xl border border-gray-800">
          {[{k:'month',l:'Mois'},{k:'week',l:'Semaine'}].map(({k,l}) => (
            <button key={k} onClick={() => setView(k)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                view === k ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' : 'text-gray-500 hover:text-white'
              }`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">

        {/* Calendar */}
        <div className={view === 'month' ? 'xl:col-span-2' : 'xl:col-span-3'}>
          <div className="card-luxe p-6">
            {/* Nav */}
            <div className="flex items-center justify-between mb-5">
              <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                <ChevronLeft size={15} className="text-white" />
              </button>
              <h2 className="text-white font-semibold">{MONTHS_FR[month]} {year}</h2>
              <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                <ChevronRight size={15} className="text-white" />
              </button>
            </div>

            {view === 'month' && (
              <>
                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {DAYS_FR.map(d => (
                    <div key={d} className="text-center text-xs text-gray-600 py-1 font-medium">{d}</div>
                  ))}
                </div>
                {/* Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({length: firstDay}).map((_, i) => (
                    <div key={`e-${i}`} />
                  ))}
                  {Array.from({length: daysInMonth}).map((_, i) => {
                    const day = i + 1
                    const dateObj = new Date(year, month, day)
                    const key = toKey(dateObj)
                    const missions = missionsByDay[key] || []
                    const isToday = key === toKey(TODAY)
                    const isSelected = selected && key === toKey(selected)
                    return (
                      <button key={day} onClick={() => setSelected(dateObj)}
                        className={`min-h-[52px] p-1.5 rounded-lg border text-left transition-all flex flex-col ${
                          isSelected ? 'border-gold-500/50 bg-gold-500/5' :
                          isToday    ? 'border-gold-500/30 bg-gold-500/5' :
                          missions.length ? 'border-gray-700 bg-gray-900/50 hover:border-gray-600' :
                          'border-transparent hover:border-gray-800 hover:bg-gray-900/30'
                        }`}>
                        <span className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                          isToday ? 'bg-gold-500 text-black' : isSelected ? 'text-gold-400' : 'text-gray-400'
                        }`}>{day}</span>
                        <div className="space-y-0.5 flex-1">
                          {missions.slice(0,2).map(m => (
                            <div key={m.id} className={`text-xs px-1 py-0.5 rounded border truncate ${m.color}`}>
                              {m.heure}
                            </div>
                          ))}
                          {missions.length > 2 && (
                            <div className="text-xs text-gray-600 px-1">+{missions.length - 2}</div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {view === 'week' && (
              <div className="overflow-x-auto">
                <div className="grid grid-cols-8 min-w-[640px]">
                  <div />
                  {weekDays.map((d, i) => {
                    const isToday = toKey(d) === toKey(TODAY)
                    return (
                      <div key={i} className={`text-center pb-3 border-b border-gray-800 ${isToday ? 'text-gold-400' : 'text-gray-400'}`}>
                        <p className="text-xs">{DAYS_FR[i]}</p>
                        <p className={`text-sm font-bold w-7 h-7 mx-auto flex items-center justify-center rounded-full ${isToday ? 'bg-gold-500 text-black' : ''}`}>
                          {d.getDate()}
                        </p>
                      </div>
                    )
                  })}
                  {HOURS.map(hour => (
                    <>
                      <div key={`h-${hour}`} className="text-right pr-2 text-xs text-gray-700 py-2 border-b border-gray-900">{hour}</div>
                      {weekDays.map((d, di) => {
                        const key = toKey(d)
                        const missions = (missionsByDay[key] || []).filter(m => m.heure.startsWith(hour.replace('h',':')))
                        return (
                          <div key={`${hour}-${di}`} className="border-b border-gray-900 border-l border-gray-900 min-h-[36px] p-0.5">
                            {missions.map(m => (
                              <div key={m.id} className={`text-xs px-1.5 py-1 rounded border mb-0.5 truncate ${m.color}`}>
                                {m.type}
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detail panel (month view only) */}
        {view === 'month' && (
          <div className="space-y-4">
            {selected ? (
              <>
                <div className="card-luxe p-5">
                  <h3 className="text-white font-semibold text-sm mb-1">
                    {selected.toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long'})}
                  </h3>
                  <p className="text-gray-600 text-xs mb-4">
                    {selectedMissions.length} mission{selectedMissions.length !== 1 ? 's' : ''} ce jour
                  </p>
                  {selectedMissions.length === 0 ? (
                    <p className="text-gray-700 text-sm text-center py-4">Aucune mission ce jour</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedMissions.map(m => (
                        <div key={m.id} className={`rounded-xl p-3.5 border ${m.color}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm">{m.heure}</span>
                            <span className="text-xs opacity-70">{m.duree}h</span>
                          </div>
                          <p className="text-sm font-medium mb-1">{m.type}</p>
                          <p className="text-xs opacity-80 flex items-center gap-1"><Car size={11} />{m.vehicule}</p>
                          <p className="text-xs opacity-70 mt-1">{m.client}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="card-luxe p-5 text-center">
                <Calendar size={28} className="mx-auto mb-2 text-gray-700" />
                <p className="text-gray-600 text-sm">Sélectionnez un jour pour voir les détails</p>
              </div>
            )}

            {/* Upcoming */}
            <div className="card-luxe p-5">
              <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                <Clock size={14} className="text-gold-400" /> Prochaines missions
              </h3>
              <div className="space-y-3">
                {MISSIONS_CAL.filter(m => m.date >= toKey(TODAY)).slice(0,4).map(m => (
                  <div key={m.id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 border ${m.color}`} />
                    <div className="min-w-0">
                      <p className="text-white text-xs font-medium truncate">{m.type}</p>
                      <p className="text-gray-500 text-xs">{new Date(m.date).toLocaleDateString('fr-FR',{day:'numeric',month:'short'})} · {m.heure}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
