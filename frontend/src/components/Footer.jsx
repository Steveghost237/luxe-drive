import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Shield, Clock, Star } from 'lucide-react'

const LINKS = {
  Services: [
    { label: 'Location avec chauffeur', href: '/catalogue?service=chauffeur' },
    { label: 'Location libre-service',  href: '/catalogue?service=location'  },
    { label: 'Flotte entreprise',       href: '/inscription?role=client_moral' },
    { label: 'Devenir propriétaire',    href: '/inscription?role=proprietaire' },
    { label: 'Devenir chauffeur',       href: '/inscription?role=chauffeur'    },
  ],
  Plateformes: [
    { label: 'Catalogue véhicules', href: '/catalogue' },
    { label: 'Mon compte',          href: '/profil'    },
    { label: 'Mes réservations',    href: '/mes-reservations' },
    { label: 'Programme fidélité',  href: '/fidelite'  },
    { label: 'Espace partenaires',  href: '/partenaires'},
  ],
  Légal: [
    { label: 'Conditions générales',    href: '/cgv' },
    { label: 'Politique de confidentialité', href: '/confidentialite' },
    { label: 'Politique GPS',           href: '/gps'  },
    { label: 'Charte qualité',          href: '/charte' },
    { label: 'Contact',                 href: '/contact' },
  ],
}

const PAYMENT_METHODS = [
  { label: 'Orange Money',    color: 'text-orange-400' },
  { label: 'MTN MoMo',       color: 'text-yellow-400' },
  { label: 'Virement',       color: 'text-blue-400'   },
  { label: 'Chèque certifié',color: 'text-gray-300'   },
]

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-900">

      {/* Trust bar */}
      <div className="border-b border-gray-900 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-6 py-5 grid sm:grid-cols-3 gap-4">
          {[
            { icon: Shield, label: 'KYC & Conformité',      desc: 'Tous les comptes sont vérifiés' },
            { icon: Clock,  label: 'Disponible 24h/24',     desc: 'Assistance et chauffeurs non-stop' },
            { icon: Star,   label: 'Standard Luxe Certifié',desc: 'Véhicules inspectés par des experts' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={18} className="text-gold-500 shrink-0" />
              <div>
                <p className="text-white text-sm font-medium">{label}</p>
                <p className="text-gray-600 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-5 gap-12">

        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center">
              <span className="font-display font-bold text-black text-sm">LD</span>
            </div>
            <span className="font-display text-2xl font-bold text-white">
              Luxe<span className="text-gold-400"> Drive</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
            La plateforme de référence pour la location de véhicules de luxe au Cameroun.
            Confiance, professionnalisme et suivi temps réel.
          </p>

          {/* Contact */}
          <div className="space-y-2.5 mb-6">
            {[
              { icon: MapPin, text: 'Yaoundé & Douala, Cameroun' },
              { icon: Phone,  text: '+237 6XX XXX XXX' },
              { icon: Mail,   text: 'contact@luxedrive.cm' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-gray-500 text-sm">
                <Icon size={14} className="text-gold-600 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Payments */}
          <div>
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-3">Paiements acceptés</p>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map(({ label, color }) => (
                <span key={label}
                  className={`text-xs font-medium ${color} bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg`}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Links */}
        {Object.entries(LINKS).map(([title, links]) => (
          <div key={title}>
            <p className="text-white font-semibold text-sm mb-5">{title}</p>
            <ul className="space-y-3">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link to={href}
                    className="text-gray-500 hover:text-gold-400 text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-900 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-700 text-xs">
            © {new Date().getFullYear()} <span className="text-gold-600 font-medium">Luxe Drive SAS</span> — Tous droits réservés.
            Plateforme agréée au Cameroun.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-600 text-xs">Système opérationnel</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
