import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Car, Users, Building2, MapPin, Shield, Clock, Star,
  Satellite, CreditCard, CheckCircle2, ChevronRight, Wrench, BadgeCheck,
  ChevronLeft, Pause, Play, Download, Smartphone, Bell, Zap
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FEATURED_VEHICLES, SEGMENTS } from '../data/vehicles'
import { formatPrice } from '../utils/format'

// ── HERO SLIDES ──────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=1600&q=80',
    badge: 'Cameroun · Yaoundé · Douala',
    title: "L'Excellence",
    titleAccent: 'Automobile',
    subtitle: 'La plateforme de mise en relation la plus fiable pour la location de véhicules de prestige au Cameroun.',
    features: ['KYC vérifié', 'GPS temps réel', 'Paiement sécurisé'],
    cta:  { label: 'Explorer le catalogue', href: '/catalogue' },
    cta2: { label: 'Créer un compte',       href: '/inscription' },
    overlay: 'from-black/95 via-black/60 to-black/20',
    accent: '#D4A017',
  },
  {
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80',
    badge: 'Service Premium · VIP · Diplomatique',
    title: 'Votre Chauffeur',
    titleAccent: 'Privé',
    subtitle: 'Chauffeurs en costume noir, vérifiés KYC, ponctualité garantie. Pour vos missions les plus exigeantes.',
    features: ['Dress code strict', 'Chauffeur KYC vérifié', 'Suivi GPS'],
    cta:  { label: 'Réserver un chauffeur',  href: '/catalogue?service=chauffeur' },
    cta2: { label: 'En savoir plus',         href: '/#services' },
    overlay: 'from-black/90 via-black/55 to-transparent',
    accent: '#D4A017',
  },
  {
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80',
    badge: 'Liberté · Prestige · Aventure',
    title: 'Prenez Le',
    titleAccent: 'Volant',
    subtitle: 'Livraison à votre adresse, assurance tous risques incluse. Explorez le Cameroun en première classe.',
    features: ['Livraison à domicile', 'Assurance incluse', 'Caution sécurisée'],
    cta:  { label: 'Location libre-service', href: '/catalogue?service=location' },
    cta2: { label: 'Voir les tarifs',        href: '/catalogue' },
    overlay: 'from-black/92 via-black/50 to-transparent',
    accent: '#D4A017',
  },
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80',
    badge: 'Propriétaires · Chauffeurs · Partenaires',
    title: 'Rejoignez',
    titleAccent: "L'Écosystème",
    subtitle: 'Monétisez votre flotte, rejoignez notre pool de chauffeurs ou devenez partenaire technique agréé.',
    features: ['Tableau de bord dédié', 'Revenus sécurisés', 'Support 24/7'],
    cta:  { label: 'Devenir partenaire',   href: '/inscription?role=proprietaire' },
    cta2: { label: 'Découvrir les rôles',  href: '/#ecosystem' },
    overlay: 'from-black/94 via-black/58 to-black/25',
    accent: '#D4A017',
  },
]

// ── HERO CAROUSEL ─────────────────────────────────────────────────────────────

const SLIDE_DURATION = 6000

function HeroCarousel() {
  const [current,   setCurrent]   = useState(0)
  const [prev,      setPrev]      = useState(null)
  const [animKey,   setAnimKey]   = useState(0)
  const [paused,    setPaused]    = useState(false)
  const [progress,  setProgress]  = useState(0)
  const intervalRef  = useRef(null)
  const progressRef  = useRef(null)
  const startTimeRef = useRef(Date.now())

  const goTo = useCallback((idx) => {
    setPrev(current)
    setCurrent(idx)
    setAnimKey((k) => k + 1)
    setProgress(0)
    startTimeRef.current = Date.now()
  }, [current])

  const next = useCallback(() => goTo((current + 1) % HERO_SLIDES.length), [current, goTo])
  const prev_ = useCallback(() => goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), [current, goTo])

  useEffect(() => {
    if (paused) { clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(next, SLIDE_DURATION)
    return () => clearInterval(intervalRef.current)
  }, [paused, next])

  useEffect(() => {
    if (paused) { cancelAnimationFrame(progressRef.current); return }
    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current
      setProgress(Math.min((elapsed / SLIDE_DURATION) * 100, 100))
      progressRef.current = requestAnimationFrame(tick)
    }
    progressRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(progressRef.current)
  }, [paused, animKey])

  const slide = HERO_SLIDES[current]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">

      {/* ── Background images with crossfade ── */}
      {HERO_SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt=""
            className="w-full h-full object-cover"
            style={{
              transform: i === current ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 7s cubic-bezier(.22,1,.36,1)',
            }}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${s.overlay}`} />
        </div>
      ))}

      {/* ── Ambient particles ── */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-gold-500/30"
            style={{
              left: `${15 + i * 14}%`,
              bottom: `${20 + (i % 3) * 10}%`,
              animation: `particleDrift ${3 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold-600/4 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-28 pb-20 grid lg:grid-cols-2 gap-12 items-center w-full">
        <div key={animKey}>
          {/* Badge */}
          <div className="animate-fade-in-left flex items-center gap-2 mb-6">
            <div className="w-8 h-px bg-gold-500" />
            <span className="text-gold-400 text-xs font-semibold uppercase tracking-[0.2em]">
              {slide.badge}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-white leading-[1.05] mb-6">
            <span className="animate-fade-in-up block delay-100">{slide.title}</span>
            <span className="animate-fade-in-up block delay-200 shimmer-gold">
              {slide.titleAccent}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up delay-300 text-lg text-gray-400 leading-relaxed mb-8 max-w-lg">
            {slide.subtitle}
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up delay-400 flex flex-wrap gap-4 mb-10">
            <Link to={slide.cta.href}
              className="btn-gold flex items-center gap-2 text-base px-7 py-3.5 animate-pulse-gold">
              {slide.cta.label} <ArrowRight size={18} />
            </Link>
            <Link to={slide.cta2.href}
              className="btn-outline-gold flex items-center gap-2 text-base px-7 py-3.5">
              {slide.cta2.label}
            </Link>
          </div>

          {/* Features */}
          <div className="animate-fade-in-up delay-500 flex flex-wrap gap-x-6 gap-y-2">
            {slide.features.map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-gray-500 text-sm">
                <CheckCircle2 size={13} className="text-gold-600" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats card */}
        <div className="hidden lg:grid grid-cols-2 gap-4 max-w-sm ml-auto">
          {STATS.map(({ value, label }, i) => (
            <div
              key={label}
              className="glass-card gold-border-animated p-6 text-center animate-scale-in"
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
            >
              <p className="text-3xl font-display font-bold text-gold-400 mb-1">{value}</p>
              <p className="text-gray-500 text-xs leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="absolute z-30 bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6">
        {/* Dots + progress */}
        <div className="flex items-center gap-3">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
              style={{ width: i === current ? 40 : 16, background: 'rgba(255,255,255,0.2)' }}
              aria-label={`Slide ${i + 1}`}
            >
              {i === current && (
                <span
                  className="absolute inset-y-0 left-0 bg-gold-400 rounded-full"
                  style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
                />
              )}
            </button>
          ))}
        </div>
        {/* Pause/play */}
        <button
          onClick={() => setPaused((v) => !v)}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all"
          aria-label={paused ? 'Reprendre' : 'Pause'}
        >
          {paused ? <Play size={12} className="text-white ml-0.5" /> : <Pause size={12} className="text-white" />}
        </button>
      </div>

      {/* ── Arrows ── */}
      <button
        onClick={prev_}
        className="absolute z-30 left-4 lg:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-gold-500/20 border border-white/10 hover:border-gold-500/50 flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
        aria-label="Précédent"
      >
        <ChevronLeft size={20} className="text-white" />
      </button>
      <button
        onClick={next}
        className="absolute z-30 right-4 lg:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-gold-500/20 border border-white/10 hover:border-gold-500/50 flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
        aria-label="Suivant"
      >
        <ChevronRight size={20} className="text-white" />
      </button>

      {/* ── Slide counter ── */}
      <div className="absolute z-30 bottom-10 right-6 lg:right-10 text-gray-600 text-xs font-mono tracking-widest">
        <span className="text-gold-500">{String(current + 1).padStart(2, '0')}</span>
        {' / '}
        {String(HERO_SLIDES.length).padStart(2, '0')}
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute z-30 bottom-8 left-10 hidden lg:flex flex-col items-center gap-2 text-gray-600">
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-gold-600" />
        <span className="text-xs uppercase tracking-widest" style={{ writingMode: 'vertical-lr' }}>Découvrir</span>
      </div>
    </section>
  )
}

// ── DATA ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '50+',  label: 'Véhicules certifiés' },
  { value: '200+', label: 'Clients satisfaits'  },
  { value: '15+',  label: 'Propriétaires partenaires' },
  { value: '24/7', label: 'Support & disponibilité'  },
]

const SERVICES = [
  {
    icon: Users,
    title: 'Location avec Chauffeur',
    tag: 'Service Premium',
    desc: 'Un chauffeur en costume noir — chemise blanche, cravate noire — ponctuel et discret. Idéal pour vos déplacements VIP, cérémonies et missions diplomatiques.',
    href: '/catalogue?service=chauffeur',
    from: 'À partir de 80 000 FCFA / jour',
    features: ['Dress Code strict garanti', 'Chauffeur KYC vérifié', 'Suivi GPS temps réel'],
    accent: 'border-gold-500/30 hover:border-gold-500',
    iconBg: 'bg-gold-500/15',
    iconColor: 'text-gold-400',
  },
  {
    icon: Car,
    title: 'Location Libre-Service',
    tag: 'Liberté & Prestige',
    desc: 'Prenez le volant de votre véhicule de prestige. Livraison à l\'adresse de votre choix, assurance tous risques incluse. Flexibilité totale pour explorer le Cameroun.',
    href: '/catalogue?service=location',
    from: 'À partir de 50 000 FCFA / jour',
    features: ['Livraison à domicile', 'Assurance tous risques', 'Caution par chèque certifié'],
    accent: 'border-gray-700 hover:border-gray-500',
    iconBg: 'bg-gray-700/40',
    iconColor: 'text-gray-300',
  },
  {
    icon: Building2,
    title: 'Flotte Entreprise & Institutions',
    tag: 'Solutions B2B',
    desc: 'Pour ambassades, ministères, ONG, mairies et grandes entreprises. Contrats de flotte sur-mesure avec tableau de bord de gestion dédié et facturation mensuelle.',
    href: '/inscription?role=client_moral',
    from: 'Sur devis personnalisé',
    features: ['Contrat flotte mensuel', 'Gestionnaire de compte dédié', 'Rapport financier automatique'],
    accent: 'border-blue-500/20 hover:border-blue-400/40',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Créez votre compte',
    desc: 'Inscription en ligne avec vérification d\'identité (KYC) et sécurisation par code PIN à 6 chiffres.',
    icon: BadgeCheck,
  },
  {
    step: '02',
    title: 'Choisissez votre véhicule',
    desc: 'Parcourez notre catalogue certifié. Filtrez par segment (Entrée, Moyen, Haut Luxe), date et ville.',
    icon: Car,
  },
  {
    step: '03',
    title: 'Paiement sécurisé en ligne',
    desc: 'Orange Money, MTN MoMo ou virement bancaire. Zéro espèce. Vos fonds sont sécurisés en séquestre.',
    icon: CreditCard,
  },
  {
    step: '04',
    title: 'Prise en charge & suivi',
    desc: 'Le véhicule vous est livré. Suivez votre trajet en temps réel depuis l\'application.',
    icon: Satellite,
  },
]

const ROLES = [
  {
    icon: Car,
    title: 'Propriétaire / Partenaire',
    desc: 'Monétisez votre flotte. À partir de 10 véhicules validés, devenez Partenaire Officiel avec un tableau de bord de suivi complet.',
    href: '/inscription?role=proprietaire',
    cta: 'Inscrire mes véhicules',
    color: 'from-gold-900/30',
    border: 'border-gold-500/20 hover:border-gold-500/50',
  },
  {
    icon: Users,
    title: 'Chauffeur Confirmé',
    desc: 'Rejoignez notre pool de chauffeurs professionnels. Références vérifiées, dress code exigé, garant humain et évaluation mensuelle.',
    href: '/inscription?role=chauffeur',
    cta: 'Devenir chauffeur',
    color: 'from-gray-800/50',
    border: 'border-gray-600/20 hover:border-gray-500/50',
  },
  {
    icon: Building2,
    title: 'Client Entreprise / Institution',
    desc: 'Ambassades, ministères, ONG — accédez à un espace dédié avec facturation centralisée et gestion de flotte multi-usagers.',
    href: '/inscription?role=client_moral',
    cta: 'Ouvrir un compte pro',
    color: 'from-blue-900/20',
    border: 'border-blue-500/20 hover:border-blue-400/40',
  },
  {
    icon: Wrench,
    title: 'Partenaire Technique',
    desc: 'Garagistes et laveurs agréés : recevez les plannings de maintenance automatiques et les alertes de la plateforme.',
    href: '/inscription?role=partenaire_tech',
    cta: 'Devenir partenaire',
    color: 'from-green-900/20',
    border: 'border-green-500/20 hover:border-green-400/40',
  },
]

const VALUES = [
  { icon: Shield,      label: 'Confiance & KYC',     desc: 'Chaque compte, véhicule et chauffeur est rigoureusement vérifié avant toute activation.' },
  { icon: Satellite,   label: 'GPS & Télémétrie',    desc: 'Boîtier GPS analytique installé sur chaque véhicule. Suivi comportemental et coupure à distance.' },
  { icon: CreditCard,  label: '100% Paiement en ligne',desc: 'Zéro espèces. Fonds sécurisés en séquestre et versements échelonnés aux propriétaires.' },
  { icon: Star,        label: 'Standard Luxe Certifié',desc: 'Chaque véhicule passe par une inspection esthétique et mécanique par des experts agréés.' },
  { icon: Clock,       label: 'Disponibilité 24h/7j', desc: 'Chauffeurs, support client et monitoring disponibles à toute heure, tous les jours.' },
]

// ── COMPONENT ─────────────────────────────────────────────────────────────────

function VehicleCard({ v }) {
  const seg = SEGMENTS[v.segment]
  return (
    <Link to={`/vehicule/${v.id}`} className="card-luxe group overflow-hidden block">
      <div className="relative h-52 overflow-hidden bg-gray-900">
        <img
          src={v.image}
          alt={`${v.marque} ${v.nom}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${seg.bg} ${seg.color}`}>
            {seg.label}
          </span>
        </div>
        {!v.disponible && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-medium text-sm bg-gray-900 px-4 py-1.5 rounded-full">
              Non disponible
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="text-gray-600 text-xs uppercase tracking-widest mb-1">{v.marque}</p>
        <h3 className="font-display font-semibold text-white text-lg leading-tight mb-3">{v.nom}</h3>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-gray-600 text-xs mb-0.5">À partir de</p>
            <p className="text-gold-400 font-bold text-lg leading-none">
              {formatPrice(v.prix_location_jour, 'XOF')}
              <span className="text-gray-600 text-xs font-normal"> /jour</span>
            </p>
          </div>
          <div className="flex gap-1.5">
            {v.services.includes('chauffeur') && (
              <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-md">
                Chauffeur
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <HeroCarousel />

      {/* ── SERVICES ────────────────────────────────────────────────────── */}
      <section id="services" className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold-500 text-xs font-semibold uppercase tracking-[0.25em] mb-4">Nos Services</p>
          <h2 className="section-title text-4xl md:text-5xl">
            Une offre complète<br />
            <span className="text-gold-400">taillée pour vous</span>
          </h2>
          <div className="divider-gold mx-auto mt-5" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {SERVICES.map(({ icon: Icon, title, tag, desc, href, from, features, accent, iconBg, iconColor }) => (
            <Link
              key={title}
              to={href}
              className={`card-luxe ${accent} p-8 group flex flex-col transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={iconColor} size={26} />
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-600 uppercase tracking-widest">{tag}</span>
                <h3 className="font-display font-semibold text-white text-xl mt-1.5 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{desc}</p>
                <ul className="space-y-2 mb-6">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-gray-400 text-sm">
                      <CheckCircle2 size={13} className="text-gold-600 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-gray-800 pt-5 flex items-center justify-between">
                <span className="text-gold-400 text-sm font-medium">{from}</span>
                <span className="w-8 h-8 rounded-full bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500 transition-colors">
                  <ArrowRight size={14} className="text-gold-400 group-hover:text-black transition-colors" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED VEHICLES ───────────────────────────────────────────── */}
      <section className="py-24 bg-gray-900/30 border-y border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-gold-500 text-xs font-semibold uppercase tracking-[0.25em] mb-3">Notre Flotte</p>
              <h2 className="section-title">Véhicules en vedette</h2>
            </div>
            <Link to="/catalogue" className="btn-outline-gold text-sm px-5 py-2.5 flex items-center gap-2 self-start sm:self-auto whitespace-nowrap">
              Voir tout le catalogue <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {FEATURED_VEHICLES.slice(0, 8).map((v) => <VehicleCard key={v.id} v={v} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold-500 text-xs font-semibold uppercase tracking-[0.25em] mb-4">Processus</p>
          <h2 className="section-title">Comment ça fonctionne</h2>
          <div className="divider-gold mx-auto mt-5" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }, i) => (
            <div key={step} className="relative">
              {i < HOW_IT_WORKS.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-gold-600/40 to-transparent z-0 translate-x-4" />
              )}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-gold-400" />
                </div>
                <div className="text-4xl font-display font-bold text-gray-800 mb-3">{step}</div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VALUES ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-black border-y border-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(212,160,23,0.06),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-gold-500 text-xs font-semibold uppercase tracking-[0.25em] mb-4">Nos Engagements</p>
            <h2 className="section-title">Pourquoi choisir Luxe Drive</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {VALUES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-gold-500/8 border border-gold-500/15 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/15 group-hover:border-gold-500/30 transition-all duration-300">
                  <Icon className="text-gold-400" size={22} />
                </div>
                <h4 className="font-semibold text-white text-sm mb-2">{label}</h4>
                <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES ECOSYSTEM ─────────────────────────────────────────────── */}
      <section id="ecosystem" className="py-28 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold-500 text-xs font-semibold uppercase tracking-[0.25em] mb-4">Écosystème</p>
          <h2 className="section-title">Rejoignez la plateforme</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Luxe Drive est une marketplace à 5 rôles. Que vous soyez client, propriétaire, chauffeur ou partenaire —
            il y a une place pour vous.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {ROLES.map(({ icon: Icon, title, desc, href, cta, color, border }) => (
            <div key={title}
              className={`card-luxe ${border} bg-gradient-to-b ${color} to-transparent p-7 flex flex-col transition-all duration-300 hover:-translate-y-1`}>
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                <Icon className="text-white/70" size={20} />
              </div>
              <h3 className="font-display font-semibold text-white text-lg mb-3 leading-snug">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-6">{desc}</p>
              <Link to={href}
                className="flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors group">
                {cta}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── GPS HIGHLIGHT ───────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-gold-500 text-xs font-semibold uppercase tracking-[0.25em] mb-5">Technologie</p>
            <h2 className="section-title mb-5 text-3xl md:text-4xl">
              GPS Analytics &<br />Contrôle à Distance
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8 text-sm">
              Chaque véhicule est équipé d'un boîtier GPS analytique de type Business Intelligence.
              Les propriétaires et administrateurs suivent la position en temps réel,
              analysent le comportement de conduite et peuvent <strong className="text-white">couper le moteur à distance</strong> en cas d'alerte sécurité.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Tracking GPS temps réel pour propriétaires & admins',
                'Analyse comportementale : vitesse, freinages, trajets',
                'Coupure moteur à distance en cas d\'incident',
                'Alertes maintenance automatiques après kilométrage',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-400">
                  <CheckCircle2 size={15} className="text-gold-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/inscription?role=proprietaire" className="btn-gold text-sm px-6 py-3 inline-flex items-center gap-2">
              Surveiller ma flotte <ArrowRight size={16} />
            </Link>
          </div>

          {/* Map mock */}
          <div className="relative">
            <div className="rounded-2xl bg-gray-900 border border-gray-700 overflow-hidden aspect-video relative">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
                alt="GPS Tracking"
                className="w-full h-full object-cover opacity-40"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-transparent to-gray-900/60" />

              {/* Fake GPS UI overlay */}
              <div className="absolute inset-4 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-black/70 backdrop-blur border border-gray-700 rounded-xl px-4 py-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white text-xs font-medium">3 véhicules actifs</span>
                  </div>
                </div>

                {/* Mock vehicle pins */}
                <div className="flex gap-3">
                  {['S 580 · Yaoundé Centre', 'Range Rover · Douala Akwa', 'X7 · Bastos'].map((label) => (
                    <div key={label} className="bg-black/70 backdrop-blur border border-gold-500/30 rounded-lg px-3 py-2 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MapPin size={10} className="text-gold-400" />
                        <span className="text-white text-xs font-semibold truncate">{label.split('·')[0]}</span>
                      </div>
                      <span className="text-gray-500 text-xs">{label.split('·')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Glow */}
            <div className="absolute -inset-4 bg-gold-500/5 rounded-3xl blur-2xl -z-10" />
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD APP SECTION ────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-950 to-black border-t border-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl border border-gold-500/20 bg-gradient-to-br from-gold-950/30 via-gray-900 to-gray-950 p-10 md:p-14 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(212,160,23,0.08),transparent)]" />
            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/25 text-gold-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
                  <Smartphone size={13} /> Application Mobile
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                  Luxe Drive<br />
                  <span className="text-gold-400">dans votre poche</span>
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  Réservez, suivez vos courses et gérez votre compte directement depuis l'application Android.
                  Notifications en temps réel, programme de fidélité et accès complet à la plateforme.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="/luxe-drive.apk"
                    download
                    className="flex items-center justify-center gap-2.5 bg-gold-500 hover:bg-gold-400 text-black font-bold px-7 py-3.5 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-gold-500/20 text-sm"
                  >
                    <Download size={18} /> Télécharger l'APK
                  </a>
                  <div className="flex items-center gap-2 text-gray-500 text-xs self-center">
                    <span className="w-6 h-px bg-gray-700" />
                    Android 8.0+ · 54 MB
                    <span className="w-6 h-px bg-gray-700" />
                  </div>
                </div>
                <p className="text-gray-600 text-xs mt-4">
                  ⚙️ Activez <strong className="text-gray-500">«&nbsp;Sources inconnues&nbsp;»</strong> dans les paramètres Android avant l'installation.
                </p>
              </div>

              {/* Right — feature chips */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Bell,       label: 'Notifications',     desc: 'Alertes en temps réel' },
                  { icon: Star,       label: 'Programme fidélité', desc: 'Points & récompenses' },
                  { icon: Satellite,  label: 'Suivi GPS',          desc: 'Tracking de vos courses' },
                  { icon: Zap,        label: 'Réservation rapide', desc: 'En moins de 2 minutes' },
                  { icon: Shield,     label: 'Sécurisé',           desc: 'Données chiffrées' },
                  { icon: CreditCard, label: 'Paiement en ligne',  desc: 'Mobile Money & carte' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 hover:border-gold-500/30 transition-colors">
                    <Icon size={18} className="text-gold-400 mb-2" />
                    <p className="text-white text-xs font-semibold">{label}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────────── */}
      <section
        className="relative py-24 text-center overflow-hidden"
        style={{
          backgroundImage:
            `linear-gradient(rgba(0,0,0,0.88), rgba(0,0,0,0.88)),
             url('https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(212,160,23,0.08),transparent)]" />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <div className="badge-gold mb-6 inline-block">Rejoignez Luxe Drive dès aujourd'hui</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Vivez l'excellence<br />automobile au Cameroun
          </h2>
          <p className="text-gray-400 mb-10 text-base leading-relaxed">
            Créez votre compte en moins de 5 minutes. Véhicules disponibles à Yaoundé et Douala,
            avec extension internationale programmée.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/inscription" className="btn-gold text-base px-8 py-3.5 flex items-center justify-center gap-2">
              Créer mon compte <ArrowRight size={18} />
            </Link>
            <Link to="/catalogue" className="btn-ghost text-base px-8 py-3.5 border border-gray-700 rounded-lg">
              Voir le catalogue
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
