import { Star, Gift, Zap, Crown, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const TIERS = [
  {
    name: 'Argent',
    points: '0 – 999',
    color: 'border-gray-500/30',
    icon: Star,
    iconColor: 'text-gray-400',
    iconBg: 'bg-gray-500/10',
    perks: ['5% de réduction sur les locations', 'Accès prioritaire au catalogue', 'Support standard'],
  },
  {
    name: 'Or',
    points: '1 000 – 4 999',
    color: 'border-gold-500/40',
    icon: Crown,
    iconColor: 'text-gold-400',
    iconBg: 'bg-gold-500/15',
    perks: ['10% de réduction', 'Upgrade de véhicule offert (1×/mois)', 'Support prioritaire 24/7', 'Accès aux véhicules VIP'],
    featured: true,
  },
  {
    name: 'Platine',
    points: '5 000+',
    color: 'border-blue-400/30',
    icon: Zap,
    iconColor: 'text-blue-300',
    iconBg: 'bg-blue-500/10',
    perks: ['15% de réduction permanente', 'Chauffeur personnel prioritaire', 'Accès lounge Luxe Drive', 'Invitations événements exclusifs', 'Conciergerie dédiée 24/7'],
  },
]

const HOW = [
  { step: '01', title: 'Réservez', desc: '1 FCFA dépensé = 1 point de fidélité crédité automatiquement.' },
  { step: '02', title: 'Cumulez', desc: 'Vos points s\'accumulent à chaque location, chauffeur et renouvellement.' },
  { step: '03', title: 'Profitez', desc: 'Échangez vos points contre des réductions, upgrades et avantages exclusifs.' },
]

export default function FidelitePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(212,160,23,0.1),transparent)]" />
        <div className="relative max-w-2xl mx-auto">
          <div className="badge-gold inline-block mb-5 animate-fade-in">Programme Fidélité</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 animate-fade-in-up">
            Chaque course vous<br /><span className="shimmer-gold">récompense</span>
          </h1>
          <p className="text-gray-400 animate-fade-in-up delay-200 max-w-lg mx-auto">
            Accumulez des points à chaque réservation et débloquez des avantages exclusifs.
            Plus vous voyagez, plus vous gagnez.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {HOW.map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="text-5xl font-display font-bold text-gray-800 mb-3">{step}</div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Tiers */}
        <h2 className="section-title text-center mb-2">Niveaux de fidélité</h2>
        <div className="divider-gold mx-auto mb-12" />
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map(({ name, points, color, icon: Icon, iconColor, iconBg, perks, featured }) => (
            <div key={name}
              className={`card-luxe ${color} p-8 flex flex-col relative ${featured ? 'ring-1 ring-gold-500/30' : ''}`}>
              {featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge-gold text-xs px-3 py-1">Le plus populaire</span>
                </div>
              )}
              <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center mb-5`}>
                <Icon className={iconColor} size={22} />
              </div>
              <h3 className="font-display font-bold text-white text-2xl mb-1">{name}</h3>
              <p className="text-gray-600 text-xs mb-5">{points} points</p>
              <ul className="space-y-2.5 flex-1">
                {perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-gray-400 text-sm">
                    <CheckCircle2 size={13} className="text-gold-600 mt-0.5 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/inscription" className="btn-gold inline-flex items-center gap-2 px-8 py-3.5">
            Commencer à cumuler des points <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
