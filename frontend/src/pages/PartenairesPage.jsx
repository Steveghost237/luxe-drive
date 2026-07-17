import { Car, Wrench, Users, Building2, ArrowRight, CheckCircle2, TrendingUp, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PARTNER_TYPES = [
  {
    icon: Car,
    title: 'Propriétaire de Flotte',
    desc: 'Vous possédez un ou plusieurs véhicules de prestige. Mettez-les en location sur Luxe Drive et générez des revenus passifs.',
    href: '/inscription?role=proprietaire',
    cta: 'Inscrire ma flotte',
    color: 'from-gold-900/20',
    border: 'border-gold-500/20',
    benefits: ['Tableau de bord dédié', 'Versements sécurisés en séquestre', 'Suivi GPS de votre flotte', 'Assurance et KYC inclus'],
  },
  {
    icon: Users,
    title: 'Chauffeur Professionnel',
    desc: 'Rejoignez notre pool de chauffeurs certifiés. Dress code exigé, évaluation mensuelle, missions régulières garanties.',
    href: '/inscription?role=chauffeur',
    cta: 'Devenir chauffeur',
    color: 'from-gray-800/30',
    border: 'border-gray-600/20',
    benefits: ['Missions planifiées', 'Rémunération transparente', 'Évaluation mensuelle', 'Formation continue'],
  },
  {
    icon: Wrench,
    title: 'Partenaire Technique',
    desc: 'Garagistes, carrossiers, nettoyeurs agréés : recevez les plannings de maintenance et intervenez sur notre flotte.',
    href: '/inscription?role=partenaire_tech',
    cta: 'Devenir partenaire tech',
    color: 'from-green-900/15',
    border: 'border-green-500/20',
    benefits: ['Alertes maintenance automatiques', 'Facturation centralisée', 'Label Luxe Drive agréé', 'Réseau partenaires'],
  },
  {
    icon: Building2,
    title: 'Client Entreprise / Institution',
    desc: 'Ambassades, ministères, ONG — accédez à un espace dédié avec facturation centralisée et gestion multi-usagers.',
    href: '/inscription?role=client_moral',
    cta: 'Ouvrir un compte pro',
    color: 'from-blue-900/15',
    border: 'border-blue-500/20',
    benefits: ['Contrat de flotte mensuel', 'Gestionnaire de compte dédié', 'Rapports financiers automatiques', 'Facturation sur devis'],
  },
]

const STATS = [
  { value: '15+', label: 'Propriétaires partenaires' },
  { value: '40+', label: 'Chauffeurs certifiés' },
  { value: '8',   label: 'Garages agréés' },
  { value: '25+', label: 'Entreprises clientes' },
]

export default function PartenairesPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(212,160,23,0.08),transparent)]" />
        <div className="relative max-w-2xl mx-auto">
          <div className="badge-gold inline-block mb-5 animate-fade-in">Espace Partenaires</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 animate-fade-in-up">
            Rejoignez<br /><span className="shimmer-gold">l'écosystème Luxe Drive</span>
          </h1>
          <p className="text-gray-400 animate-fade-in-up delay-200">
            Que vous soyez propriétaire, chauffeur ou prestataire technique,
            il y a une place pour vous dans notre réseau de confiance.
          </p>
        </div>
      </section>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {STATS.map(({ value, label }) => (
            <div key={label} className="card-luxe gold-border-animated p-5 text-center">
              <p className="text-3xl font-display font-bold text-gold-400">{value}</p>
              <p className="text-gray-500 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Partner cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {PARTNER_TYPES.map(({ icon: Icon, title, desc, href, cta, color, border, benefits }) => (
            <div key={title} className={`card-luxe ${border} bg-gradient-to-b ${color} to-transparent p-7`}>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <Icon className="text-white/70" size={22} />
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-3">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{desc}</p>
              <ul className="space-y-2 mb-6">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-gray-400 text-sm">
                    <CheckCircle2 size={12} className="text-gold-600 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link to={href}
                className="flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors group">
                {cta} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* Trust section */}
        <div className="mt-16 card-luxe gold-border-animated p-8 text-center">
          <Shield size={32} className="text-gold-400 mx-auto mb-4" />
          <h3 className="font-display font-bold text-white text-xl mb-3">Pourquoi nous faire confiance ?</h3>
          <p className="text-gray-500 text-sm max-w-lg mx-auto mb-6">
            Tous les partenaires Luxe Drive passent par un processus de vérification KYC rigoureux.
            Votre réputation est notre priorité.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Vérification KYC', 'Contrat officiel', 'Assurance incluse', 'Support dédié', 'Paiements sécurisés'].map((t) => (
              <span key={t} className="badge-gold text-xs">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
