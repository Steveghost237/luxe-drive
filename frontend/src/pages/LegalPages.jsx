import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function LegalLayout({ title, badge, children }) {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <section className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_50%_0%,rgba(212,160,23,0.06),transparent)]" />
        <div className="relative">
          <div className="badge-gold inline-block mb-4">{badge}</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white animate-fade-in-up">{title}</h1>
          <p className="text-gray-600 text-sm mt-3">Dernière mise à jour : Juin 2025</p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-6 pb-24 space-y-8">
        {children}
      </div>
      <Footer />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="card-luxe p-6">
      <h2 className="font-display font-bold text-white text-lg mb-3 border-b border-gray-800 pb-3">{title}</h2>
      <div className="text-gray-500 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  )
}

export function CGVPage() {
  return (
    <LegalLayout title="Conditions Générales de Vente" badge="Légal">
      <Section title="Article 1 — Objet">
        <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre la société Luxe Drive SAS (ci-après « Luxe Drive ») et tout utilisateur de la plateforme en ligne disponible à l'adresse luxedrive.cm.</p>
      </Section>
      <Section title="Article 2 — Services proposés">
        <p>Luxe Drive propose les services suivants :</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Location de véhicules de prestige avec ou sans chauffeur</li>
          <li>Mise en relation entre propriétaires de véhicules et clients</li>
          <li>Gestion de flotte pour entreprises et institutions</li>
          <li>Services de chauffeur privé pour événements</li>
        </ul>
      </Section>
      <Section title="Article 3 — Réservation et paiement">
        <p>Toute réservation implique l'acceptation des présentes CGV. Le paiement s'effectue exclusivement en ligne via Orange Money, MTN MoMo ou virement bancaire. Aucun paiement en espèces n'est accepté.</p>
        <p>Les fonds sont sécurisés en séquestre et versés au propriétaire selon le calendrier défini à l'article 5.</p>
      </Section>
      <Section title="Article 4 — Annulation et remboursement">
        <p><strong className="text-white">Annulation {">"} 48h avant :</strong> Remboursement intégral (hors frais de traitement).</p>
        <p><strong className="text-white">Annulation entre 24h et 48h :</strong> Remboursement à 50%.</p>
        <p><strong className="text-white">Annulation {"<"} 24h :</strong> Aucun remboursement.</p>
      </Section>
      <Section title="Article 5 — Règle de séquestre">
        <p>Pour toute location inférieure à 1 semaine : 20% versés à la réservation, 80% débloqués J+1 après la fin de la mission.</p>
        <p>Pour toute location supérieure à 1 semaine : 50% versés au terme de la 1ère semaine, solde échelonné selon accord.</p>
      </Section>
      <Section title="Article 6 — Responsabilités">
        <p>Luxe Drive agit en qualité de plateforme de mise en relation. La responsabilité en cas d'accident est couverte par l'assurance tous risques souscrite obligatoirement par le propriétaire du véhicule.</p>
      </Section>
      <Section title="Article 7 — Droit applicable">
        <p>Les présentes CGV sont soumises au droit camerounais. Tout litige sera soumis aux tribunaux compétents de Yaoundé, Cameroun.</p>
      </Section>
    </LegalLayout>
  )
}

export function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de Confidentialité" badge="Protection des données">
      <Section title="1. Collecte des données">
        <p>Luxe Drive collecte les données suivantes lors de l'inscription et de l'utilisation de la plateforme :</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Identité (nom, prénom, date de naissance)</li>
          <li>Documents d'identité pour la vérification KYC</li>
          <li>Coordonnées (email, téléphone, adresse)</li>
          <li>Données de paiement (traitées par des prestataires sécurisés)</li>
          <li>Données de géolocalisation (avec votre consentement)</li>
        </ul>
      </Section>
      <Section title="2. Utilisation des données">
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>La gestion de votre compte et de vos réservations</li>
          <li>La vérification KYC obligatoire</li>
          <li>La communication sur vos missions et alertes</li>
          <li>L'amélioration de nos services</li>
        </ul>
      </Section>
      <Section title="3. Conservation des données">
        <p>Vos données sont conservées pendant la durée de votre relation avec Luxe Drive, puis archivées pendant 5 ans conformément à la réglementation camerounaise.</p>
      </Section>
      <Section title="4. Vos droits">
        <p>Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez : privacy@luxedrive.cm</p>
      </Section>
      <Section title="5. Partage des données">
        <p>Luxe Drive ne vend jamais vos données personnelles à des tiers. Elles peuvent être partagées avec nos prestataires de services (paiement, géolocalisation) dans le strict cadre de l'exécution de vos contrats.</p>
      </Section>
    </LegalLayout>
  )
}

export function GPSPage() {
  return (
    <LegalLayout title="Politique GPS & Télémétrie" badge="Technologie">
      <Section title="Équipement GPS obligatoire">
        <p>Tout véhicule référencé sur la plateforme Luxe Drive doit être équipé d'un boîtier GPS analytique homologué par Luxe Drive. Cet équipement est fourni ou agréé par Luxe Drive et reste sa propriété pendant toute la durée du partenariat.</p>
      </Section>
      <Section title="Données collectées">
        <ul className="list-disc list-inside space-y-1">
          <li>Position GPS en temps réel (latitude, longitude)</li>
          <li>Vitesse instantanée et historique</li>
          <li>Comportement de conduite (freinages brusques, accélérations)</li>
          <li>Kilométrage et alertes maintenance</li>
          <li>Statut du moteur (démarré/arrêté)</li>
        </ul>
      </Section>
      <Section title="Accès aux données GPS">
        <p><strong className="text-white">Propriétaire :</strong> Accès en temps réel à la position et aux statistiques de ses véhicules.</p>
        <p><strong className="text-white">Administrateur Luxe Drive :</strong> Accès complet pour supervision et sécurité.</p>
        <p><strong className="text-white">Client :</strong> Accès limité à la position du chauffeur pendant sa mission.</p>
        <p><strong className="text-white">Chauffeur :</strong> Aucun accès aux données analytiques.</p>
      </Section>
      <Section title="Coupure moteur à distance">
        <p>La fonctionnalité de coupure moteur est réservée aux situations d'urgence (vol, incident de sécurité). Elle ne peut être activée que par un administrateur Luxe Drive ou le propriétaire du véhicule, en accord avec la réglementation en vigueur.</p>
      </Section>
    </LegalLayout>
  )
}

export function ChartePage() {
  return (
    <LegalLayout title="Charte Qualité Luxe Drive" badge="Excellence">
      <Section title="Notre engagement de qualité">
        <p>Luxe Drive s'engage à maintenir les standards les plus élevés de l'industrie automobile de luxe en Afrique centrale. Cette charte définit les critères minimaux acceptés sur notre plateforme.</p>
      </Section>
      <Section title="Critères véhicules">
        <ul className="list-disc list-inside space-y-1">
          <li>Véhicule de moins de 7 ans ou kilométrage {"<"} 150 000 km</li>
          <li>Inspection esthétique complète (carrosserie, intérieur)</li>
          <li>Contrôle technique valide</li>
          <li>Climatisation, vitres teintées, cuir obligatoires (Haut Luxe)</li>
          <li>GPS Luxe Drive installé et fonctionnel</li>
        </ul>
      </Section>
      <Section title="Critères chauffeurs">
        <ul className="list-disc list-inside space-y-1">
          <li>Permis de conduire valide catégorie B minimum ({"≥"} 5 ans)</li>
          <li>Casier judiciaire vierge</li>
          <li>Dress code strict : costume noir, chemise blanche, cravate noire</li>
          <li>Formation à l'accueil VIP et protocole diplomatique</li>
          <li>Note minimum 4.0/5.0 maintenue</li>
          <li>Entretien mensuel obligatoire</li>
        </ul>
      </Section>
      <Section title="Critères propriétaires">
        <ul className="list-disc list-inside space-y-1">
          <li>Vérification KYC complète (identité, domicile, propriété du véhicule)</li>
          <li>Assurance tous risques en cours de validité</li>
          <li>Entretien régulier documenté</li>
          <li>Réactivité aux demandes de maintenance sous 48h</li>
        </ul>
      </Section>
      <Section title="Sanctions">
        <p>Tout manquement à la présente charte peut entraîner une suspension temporaire ou définitive du compte et du ou des véhicules concernés, sans préjudice des voies de recours légales.</p>
      </Section>
    </LegalLayout>
  )
}
