import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Wrench, ShieldCheck, Star, CheckCircle2, AlertCircle,
  Phone, Mail, MapPin, Clock, FileText, Truck, Upload,
  ChevronRight, Award, Zap
} from 'lucide-react'

const TABS = [
  { key:'normes',     label:'Normes & Standards'   },
  { key:'garagiste',  label:'Devenir Garagiste Agréé' },
  { key:'livreur',    label:'Devenir Livreur Agréé' },
  { key:'partenaire', label:'Partenariat Entreprise' },
]

const NORMES_GARAGISTE = [
  {
    cat: '🔧 Infrastructure',
    items: [
      'Surface minimum : 200 m² couverts avec fosse de visite',
      'Équipement de diagnostic OBD-II multi-marques obligatoire',
      'Outillage homologué constructeur (Mercedes, BMW, Audi, RR…)',
      'Zone dédiée véhicules de luxe (propre, couverte, sécurisée)',
      'Système de vidéosurveillance 24h/24 dans l\'atelier',
    ],
  },
  {
    cat: '👨‍🔧 Personnel',
    items: [
      'Au minimum 1 mécanicien certifié constructeur (Mercedes, BMW, Porsche ou équivalent)',
      'Formation spécifique véhicules hybrides/électriques exigée',
      'Port de tenue de travail propre et identifiée obligatoire',
      'Formation protocole client Luxe Drive (½ journée, gratuite)',
      'Maîtrise du français et/ou anglais pour la communication client',
    ],
  },
  {
    cat: '📋 Processus & qualité',
    items: [
      'Rapport d\'intervention détaillé remis systématiquement au client',
      'Photos avant/après intervention obligatoires pour chaque mission',
      'Délais d\'intervention : 24h pour pannes simples, 72h max pour révisions',
      'Véhicule de courtoisie fourni ou prise en charge taxi (si > 4h d\'immobilisation)',
      'Garantie main d\'œuvre minimum 3 mois / pièces selon constructeur',
      'Utilisation de pièces d\'origine ou équivalent qualité OEM uniquement',
    ],
  },
  {
    cat: '🛡️ Assurances & légal',
    items: [
      'Assurance responsabilité civile professionnelle obligatoire',
      'Agrément du Ministère des Transports du Cameroun',
      'Registre de Commerce valide (RCCM)',
      'Numéro d\'Identifiant Unique (NIU) à jour',
      'Conformité aux normes environnementales (traitement des huiles usagées)',
    ],
  },
]

const NORMES_LIVREUR = [
  {
    cat: '🚚 Véhicule de livraison',
    items: [
      'Véhicule propre, en excellent état mécanique et esthétique',
      'Vitre teintée et habitacle protégé (housses siège, tapis de coffre)',
      'Présence d\'un kit de protection véhicule (couvertures, sangles)',
      'Possibilité de livraison avec plateau pour véhicules non-roulants',
      'GPS tracker obligatoire sur le véhicule de livraison',
    ],
  },
  {
    cat: '👤 Livreur',
    items: [
      'Permis de conduire catégorie B minimum, C recommandé',
      'Extrait de casier judiciaire vierge (< 3 mois)',
      'Expérience minimum 2 ans en livraison de véhicules ou conduite VIP',
      'Formation Luxe Drive (1 journée : protocole, manutention, sécurité)',
      'Tenue propre et professionnelle lors des livraisons',
      'Maîtrise de l\'application mobile Luxe Drive pour le suivi',
    ],
  },
  {
    cat: '📦 Process de livraison',
    items: [
      'Inspection visuelle complète + photos horodatées avant prise en charge',
      'Signature d\'un bon de prise en charge avec le propriétaire ou son représentant',
      'Traçabilité GPS en temps réel partagée avec le client pendant la livraison',
      'Livraison uniquement à la personne identifiée (vérification CNI)',
      'Rapport de livraison photos + signature numérique obligatoire',
      'Délais respectés : pénalité de 5 000 FCFA/heure de retard non justifié',
    ],
  },
]

function NormCard({ cat, items }) {
  return (
    <div className="card-luxe p-5">
      <h3 className="text-white font-semibold text-sm mb-3">{cat}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
            <CheckCircle2 size={13} className="text-green-400 mt-0.5 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ApplicationForm({ type }) {
  const [form, setForm] = useState({ nom:'', entreprise:'', telephone:'', email:'', ville:'', description:'' })
  const [docs, setDocs] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const set = (k, v) => setForm(f => ({...f, [k]: v}))

  if (submitted) return (
    <div className="card-luxe p-8 text-center border-green-500/20">
      <CheckCircle2 size={32} className="text-green-400 mx-auto mb-3" />
      <h3 className="text-white font-bold text-lg mb-2">Candidature envoyée !</h3>
      <p className="text-gray-400 text-sm">Notre équipe partenariats vous contactera sous 48–72h. Réf : <span className="text-gold-400 font-mono">PART-{Date.now().toString().slice(-5)}</span></p>
    </div>
  )

  const docList = type === 'garagiste'
    ? ['registreCommerce','assurancePro','agrementTransport','certifTechnicien']
    : ['permisConduire','casierJudiciaire','assuranceVehicule','photoVehicule']

  const docLabels = {
    registreCommerce: '📋 Registre de Commerce', assurancePro: '🛡️ Assurance RC Pro',
    agrementTransport: '📜 Agrément Transport', certifTechnicien: '🔧 Certif. technicien',
    permisConduire: '🪪 Permis de conduire', casierJudiciaire: '📄 Casier judiciaire B3',
    assuranceVehicule: '🛡️ Assurance véhicule', photoVehicule: '📸 Photos du véhicule',
  }

  return (
    <div className="card-luxe p-6 space-y-4">
      <h3 className="text-white font-display font-bold text-lg">Candidature {type === 'garagiste' ? 'Garagiste Agréé' : 'Livreur Agréé'}</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { k:'nom', label:'Nom complet *', ph:'Jean Mbida' },
          { k:'entreprise', label:'Nom du garage / entreprise *', ph:'Garage Excel Auto' },
          { k:'telephone', label:'Téléphone *', ph:'+237 6XX XXX XXX' },
          { k:'email', label:'Email *', ph:'contact@garage.cm' },
          { k:'ville', label:'Ville *', ph:'Yaoundé' },
        ].map(({ k, label, ph }) => (
          <div key={k}>
            <label className="block text-gray-400 text-xs mb-1.5">{label}</label>
            <input value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50" />
          </div>
        ))}
      </div>
      <div>
        <label className="block text-gray-400 text-xs mb-1.5">Présentez votre établissement / expérience *</label>
        <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="Décrivez votre garage, équipements, équipes, expérience avec véhicules de luxe…"
          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gold-500/50 resize-none" />
      </div>
      <div>
        <p className="text-gray-400 text-xs font-medium mb-2">Documents requis</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {docList.map(d => (
            <label key={d} className={`border border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${docs[d] ? 'border-green-500/40 bg-green-500/5' : 'border-gray-800 hover:border-gold-500/40'}`}>
              <Upload size={14} className="mx-auto mb-1 text-gray-600" />
              <p className="text-xs text-gray-500">{docs[d] ? <span className="text-green-400">✓ {docs[d]}</span> : docLabels[d]}</p>
              <input type="file" className="hidden" onChange={e => setDocs(dd => ({...dd, [d]: e.target.files[0]?.name || ''}))} />
            </label>
          ))}
        </div>
      </div>
      <button onClick={() => setSubmitted(true)}
        disabled={!form.nom || !form.telephone || !form.email || !form.ville}
        className="w-full py-3 rounded-xl btn-gold text-sm font-semibold disabled:opacity-40">
        Envoyer ma candidature
      </button>
    </div>
  )
}

export default function GaragePartnerPage() {
  const [tab, setTab] = useState('normes')

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <Link to="/" className="font-display text-xl font-bold text-gold-400">Luxe Drive</Link>
        <div className="flex items-center gap-3">
          <Link to="/catalogue" className="text-gray-400 hover:text-white text-sm transition-colors">Catalogue</Link>
          <Link to="/compte-pro" className="btn-gold text-sm px-4 py-2">Compte Pro</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800 px-6 py-14">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-1.5 mb-5">
            <Award size={14} className="text-gold-400" />
            <span className="text-gold-400 text-xs font-semibold">Programme Partenaires Agréés</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-3">
            Rejoindre le réseau <span className="text-gold-400">Luxe Drive</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Garagistes, livreurs et entreprises partenaires : découvrez nos normes d'excellence et rejoignez l'écosystème du transport de luxe au Cameroun.
          </p>
          <div className="flex justify-center gap-6 mt-8">
            {[
              { v:'12+', l:'Garagistes agréés' },
              { v:'28+', l:'Livreurs certifiés' },
              { v:'40+', l:'Entreprises partenaires' },
            ].map(({ v, l }) => (
              <div key={l} className="text-center">
                <p className="text-gold-400 font-bold text-2xl">{v}</p>
                <p className="text-gray-500 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-gray-900/50 rounded-2xl border border-gray-800 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.key ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' : 'text-gray-500 hover:text-white'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Normes ── */}
        {tab === 'normes' && (
          <div className="space-y-6">
            <div className="card-luxe p-5 border-gold-500/20 bg-gold-500/5 mb-2">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-gold-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gold-400 font-semibold text-sm">Charte d'excellence Luxe Drive</p>
                  <p className="text-gray-400 text-xs leading-relaxed mt-1">
                    Luxe Drive s'engage à offrir une expérience de transport haut de gamme. Tous nos partenaires (garagistes, livreurs, chauffeurs) doivent respecter ces normes strictes pour garantir la satisfaction de notre clientèle d'élite.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-white font-display font-bold text-xl">Normes Garagiste Agréé</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {NORMES_GARAGISTE.map(n => <NormCard key={n.cat} {...n} />)}
            </div>

            <h2 className="text-white font-display font-bold text-xl mt-8">Normes Livreur Agréé</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {NORMES_LIVREUR.map(n => <NormCard key={n.cat} {...n} />)}
            </div>

            <div className="card-luxe p-5 border-blue-500/20 bg-blue-500/5 mt-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={15} className="text-blue-400 mt-0.5 shrink-0" />
                <p className="text-blue-300/80 text-sm leading-relaxed">
                  <strong>Audit annuel :</strong> Chaque partenaire agréé fait l'objet d'un audit qualité annuel par un inspecteur Luxe Drive. Tout manquement grave aux normes peut entraîner la suspension de l'agrément.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Garagiste ── */}
        {tab === 'garagiste' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                { icon:'💰', t:'Commission sur révisions', d:'10% sur chaque prestation réalisée pour un véhicule Luxe Drive' },
                { icon:'📋', t:'Contrats prioritaires',    d:'Missions de maintenance garanties via notre réseau de 120+ véhicules' },
                { icon:'⭐', t:'Badge officiel',           d:'Label « Garagiste Agréé Luxe Drive » visible sur votre devanture et vos supports' },
              ].map(({ icon, t, d }) => (
                <div key={t} className="card-luxe p-4 text-center">
                  <span className="text-3xl">{icon}</span>
                  <p className="text-white font-semibold text-sm mt-2 mb-1">{t}</p>
                  <p className="text-gray-500 text-xs">{d}</p>
                </div>
              ))}
            </div>
            <ApplicationForm type="garagiste" />
          </div>
        )}

        {/* ── Livreur ── */}
        {tab === 'livreur' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                { icon:'📦', t:'15 000–50 000 FCFA/mission', d:'Rémunération attractive selon la distance et le type de véhicule livré' },
                { icon:'📱', t:'Missions via l\'app',         d:'Recevez et gérez vos missions de livraison directement sur votre smartphone' },
                { icon:'🛡️', t:'Couverture assurance',       d:'Chaque mission est couverte par l\'assurance Luxe Drive pendant le transport' },
              ].map(({ icon, t, d }) => (
                <div key={t} className="card-luxe p-4 text-center">
                  <span className="text-3xl">{icon}</span>
                  <p className="text-white font-semibold text-sm mt-2 mb-1">{t}</p>
                  <p className="text-gray-500 text-xs">{d}</p>
                </div>
              ))}
            </div>
            <ApplicationForm type="livreur" />
          </div>
        )}

        {/* ── Partenaire entreprise ── */}
        {tab === 'partenaire' && (
          <div className="space-y-6">
            <p className="text-gray-400 text-sm leading-relaxed">
              Vous êtes une entreprise, une ambassade, un hôtel ou une organisation souhaitant bénéficier de tarifs préférentiels et d'un accès prioritaire à la flotte Luxe Drive ? Créez votre compte professionnel.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon:'🏨', t:'Hôtels & Résidences', d:'Transferts VIP pour vos clients, fleet management intégré à votre CRM' },
                { icon:'🏢', t:'Entreprises', d:'Abonnement mensuel, facturation centralisée, reporting RH transport' },
                { icon:'🏛️', t:'Ambassades & Org. Int.', d:'Discrétion absolue, véhicules blindés disponibles, chauffeurs diplomates' },
                { icon:'🎪', t:'Organisateurs d\'événements', d:'Flotte complète pour galas, conférences, concerts, défilés…' },
              ].map(({ icon, t, d }) => (
                <div key={t} className="card-luxe p-5 flex items-start gap-3 hover:border-gold-500/30 transition-colors">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">{t}</p>
                    <p className="text-gray-500 text-xs">{d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-luxe p-6 text-center border-gold-500/20 bg-gold-500/5">
              <h3 className="text-white font-display font-bold text-lg mb-2">Créer votre compte Professionnel</h3>
              <p className="text-gray-400 text-sm mb-4">Accédez à toutes les fonctionnalités Pro : gestion de flotte, chauffeurs attitrés, reporting avancé, tarifs négociés.</p>
              <Link to="/compte-pro" className="btn-gold px-8 py-3 inline-block text-sm font-semibold rounded-xl">
                Ouvrir mon compte Pro <ChevronRight size={14} className="inline" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
