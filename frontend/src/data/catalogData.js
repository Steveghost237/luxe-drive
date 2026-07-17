// ── VÉHICULES LOCATION ────────────────────────────────────────────────────────

export const LOCATION_VEHICLES = [
  // ─ Segment Ultra-Luxe ─────────────────────────────────────────────────────
  {
    id: 'RR-PHANTOM-01', marque: 'Rolls-Royce', nom: 'Phantom VIII', annee: 2024,
    segment: 'Ultra-Luxe', prix_jour: 850000, caution: 5000000,
    places: 4, transmission: 'Automatique', carburant: 'Essence', puissance: '563 ch',
    couleur: 'Noir Diamant', disponible: true,
    images: [
      'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Chauffeur inclus', 'Champagne offert', 'Tapis rouge', 'Partition cloison'],
    description: "L'apogée du luxe automobile. Silence total, finitions bois et cuir artisanal. Chaque Phantom est construit à la main en 500 heures de travail, avec des matériaux nobles choisis par le client."
  },
  {
    id: 'BENT-MULSANNE-01', marque: 'Bentley', nom: 'Mulsanne Speed', annee: 2023,
    segment: 'Ultra-Luxe', prix_jour: 700000, caution: 4500000,
    places: 4, transmission: 'Automatique', carburant: 'Essence', puissance: '530 ch',
    couleur: 'Argent Mercure', disponible: true,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Mini-bar', 'Massages sièges', 'TV arrière', 'WiFi bord'],
    description: "Berline grand tourisme d'exception. Motorisation V8 biturbo de 530 chevaux. L'intérieur est entièrement réalisé en cuir Poltrona Frau et boiseries naturelles."
  },
  {
    id: 'LAMBO-URUS-01', marque: 'Lamborghini', nom: 'Urus S', annee: 2024,
    segment: 'Ultra-Luxe', prix_jour: 650000, caution: 4000000,
    places: 5, transmission: 'Automatique', carburant: 'Essence', puissance: '666 ch',
    couleur: 'Jaune Giallo Inti', disponible: false,
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Sport+', 'Karman audio', 'Pack Notte', 'Jantes 23"'],
    description: "Le SUV sport le plus rapide du monde. Expérience sportive hors norme avec un 0-100 km/h en 3,5 secondes."
  },
  {
    id: 'FERRARI-PORTOFINO', marque: 'Ferrari', nom: 'Portofino M', annee: 2023,
    segment: 'Ultra-Luxe', prix_jour: 720000, caution: 4500000,
    places: 2, transmission: 'Automatique', carburant: 'Essence', puissance: '620 ch',
    couleur: 'Rosso Corsa', disponible: true,
    images: [
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Capote électrique', 'Pista mode', 'Cuir Poltrona Frau', 'Échappement sport'],
    description: "Cabriolet GT Ferrari. L'alliance parfaite entre sportivité et confort. Capote électrique en 14 secondes jusqu'à 40 km/h."
  },

  // ─ Segment Haut-Gamme ────────────────────────────────────────────────────
  {
    id: 'MB-S580-01', marque: 'Mercedes-Benz', nom: 'Classe S 580 4Matic', annee: 2024,
    segment: 'Haut-Gamme', prix_jour: 250000, caution: 1500000,
    places: 4, transmission: 'Automatique', carburant: 'Hybride', puissance: '503 ch',
    couleur: 'Obsidian Black', disponible: true,
    images: [
      'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Massage sièges', 'HUD AR', 'Ambiance 64 couleurs', 'Suspension Magic Body'],
    description: "La référence des berlines de luxe. Technologie et raffinement inégalés. MBUX avec IA intégrée et affichage tête haute augmenté."
  },
  {
    id: 'BMW-750I-01', marque: 'BMW', nom: 'Série 7 750i xDrive', annee: 2024,
    segment: 'Haut-Gamme', prix_jour: 220000, caution: 1300000,
    places: 5, transmission: 'Automatique', carburant: 'Hybride', puissance: '490 ch',
    couleur: 'Tanzanite Blue', disponible: true,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Théâtre arrière', 'BMW Executive Lounge', 'Harmonia audio', 'Wifi 5G'],
    description: "Prestige technologique BMW. Écrans arrière 31 pouces pour un confort cinématographique inégalé."
  },
  {
    id: 'AUDI-A8L-01', marque: 'Audi', nom: 'A8 L 60 TFSI e', annee: 2024,
    segment: 'Haut-Gamme', prix_jour: 200000, caution: 1200000,
    places: 5, transmission: 'Automatique', carburant: 'Hybride rechargeable', puissance: '462 ch',
    couleur: 'Argent Floret', disponible: true,
    images: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Quattro AWD', 'Massage Pro', 'Sono Bang&Olufsen', 'Suspension pneumatique'],
    description: "Synthèse entre technologie de pointe et luxe Quattro. Suspension pneumatique adaptative et système de massage 10 postes."
  },
  {
    id: 'RR-CULLINAN-01', marque: 'Rolls-Royce', nom: 'Cullinan Black Badge', annee: 2023,
    segment: 'Haut-Gamme', prix_jour: 600000, caution: 3500000,
    places: 5, transmission: 'Automatique', carburant: 'Essence', puissance: '600 ch',
    couleur: 'Noir Graphite', disponible: true,
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Picnic tables', 'Starlight headliner', 'Drinks cabinet', 'Off-road mode'],
    description: "Le seul SUV Rolls-Royce. Domination totale en toutes circonstances. Ciel étoilé Starlight avec 1340 fibres optiques."
  },

  // ─ Segment Premium ─────────────────────────────────────────────────────────
  {
    id: 'MB-E450-01', marque: 'Mercedes-Benz', nom: 'Classe E 450 4Matic', annee: 2024,
    segment: 'Premium', prix_jour: 120000, caution: 700000,
    places: 5, transmission: 'Automatique', carburant: 'Hybride', puissance: '367 ch',
    couleur: 'MANUFAKTUR Blanc Opale', disponible: true,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['MBUX Hyperscreen', 'Active Curve', 'Burmester audio', 'Keyless-go'],
    description: "Berline executive par excellence. Conduite dynamique et confort premium avec l'MBUX Hyperscreen de 141 cm."
  },
  {
    id: 'PORSCHE-TAYCAN', marque: 'Porsche', nom: 'Taycan 4S', annee: 2024,
    segment: 'Premium', prix_jour: 180000, caution: 1000000,
    places: 4, transmission: 'Automatique', carburant: 'Électrique', puissance: '571 ch',
    couleur: 'Gentian Blue Metallic', disponible: true,
    images: [
      'https://images.unsplash.com/photo-1611821639601-d25a8c11a821?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['800V rapide', 'Sport Chrono', 'BOSE', '0-100 en 4s'],
    description: "Sportivité Porsche électrique. Performance et luxe sans compromis. Recharge ultra-rapide 800V en moins de 23 minutes."
  },
  {
    id: 'RANGE-VELART', marque: 'Land Rover', nom: 'Range Rover Velar R-Dynamic', annee: 2023,
    segment: 'Premium', prix_jour: 150000, caution: 900000,
    places: 5, transmission: 'Automatique', carburant: 'Essence', puissance: '400 ch',
    couleur: 'Fuji White', disponible: false,
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Terrain Response', 'Meridian audio', 'Pano roof', 'Air suspension'],
    description: "SUV design épuré. Alliance entre sophistication britannique et robustesse tout-terrain. Toit panoramique 2 panneaux."
  },
  {
    id: 'LEXUS-LS500', marque: 'Lexus', nom: 'LS 500h AWD', annee: 2023,
    segment: 'Premium', prix_jour: 130000, caution: 750000,
    places: 5, transmission: 'Automatique', carburant: 'Hybride', puissance: '360 ch',
    couleur: 'Sonic Titanium', disponible: true,
    images: [
      'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Executive package', 'Mark Levinson', 'Shiatsu massage', 'Refrigerated console'],
    description: "Luxe japonais discret et irréprochable. Fiabilité légendaire Lexus avec massage shiatsu 10 postes et sono Mark Levinson 23 HP."
  },
]

// ── CHAUFFEURS ────────────────────────────────────────────────────────────────

export const CHAUFFEURS = [
  {
    id: 'C001', prenom: 'David', nom: 'Kameni', ville: 'Yaoundé',
    note: 4.9, missions: 312, experience: '7 ans',
    langues: ['Français', 'Anglais'],
    vehicules: ['Mercedes S 580', 'Audi A8 L'],
    specialites: ['Protocole officiel', 'VIP', 'Aéroport'],
    certifications: ['KYC vérifié', 'Formation VIP', 'Permis C'],
    disponible: true,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: "Chauffeur de prestige certifié, ancien protocole gouvernemental."
  },
  {
    id: 'C002', prenom: 'Alice', nom: 'Nguema', ville: 'Douala',
    note: 4.8, missions: 248, experience: '5 ans',
    langues: ['Français', 'Anglais', 'Espagnol'],
    vehicules: ['Range Rover', 'BMW Série 7'],
    specialites: ['Transfert aéroport', 'Mise à disposition', 'Corporate'],
    certifications: ['KYC vérifié', 'Premiers secours', 'Permis B+'],
    disponible: true,
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
    bio: "Professionnelle certifiée, spécialiste du transport corporate et diplomatique."
  },
  {
    id: 'C003', prenom: 'Eric', nom: 'Fouda', ville: 'Yaoundé',
    note: 4.7, missions: 195, experience: '4 ans',
    langues: ['Français'],
    vehicules: ['Bentley Bentayga', 'Mercedes S 580'],
    specialites: ['Événements privés', 'Mariages', 'Galas'],
    certifications: ['KYC vérifié', 'Formation Luxe'],
    disponible: false,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    bio: "Expert des événements haut de gamme. Discrétion et élégance garanties."
  },
  {
    id: 'C004', prenom: 'Sandrine', nom: 'Mbarga', ville: 'Douala',
    note: 4.9, missions: 401, experience: '9 ans',
    langues: ['Français', 'Anglais', 'Duala'],
    vehicules: ['Rolls-Royce Phantom', 'Bentley Mulsanne'],
    specialites: ['Ultra-VIP', 'Protocole d\'État', 'Ambassades'],
    certifications: ['KYC vérifié', 'Top Chauffeur 2024', 'Formation diplomatique', 'Permis C'],
    disponible: true,
    photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80',
    bio: "Top chauffeure de l'année 2024. Référence absolue pour les missions protocolaires."
  },
  {
    id: 'C005', prenom: 'Jean-Marc', nom: 'Eyenga', ville: 'Yaoundé',
    note: 4.6, missions: 167, experience: '3 ans',
    langues: ['Français', 'Anglais'],
    vehicules: ['Mercedes E 450', 'Lexus LS 500'],
    specialites: ['Transfert hôtel', 'Journée mise à dispo', 'Aéroport'],
    certifications: ['KYC vérifié', 'Formation standard'],
    disponible: true,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    bio: "Ponctuel, discret et professionnel. Idéal pour les déplacements quotidiens."
  },
  {
    id: 'C006', prenom: 'Christelle', nom: 'Ondo', ville: 'Douala',
    note: 4.8, missions: 289, experience: '6 ans',
    langues: ['Français', 'Anglais', 'Bassa'],
    vehicules: ['Porsche Taycan', 'Audi A8 L'],
    specialites: ['VIP tech', 'Événementiel', 'Corporate'],
    certifications: ['KYC vérifié', 'Permis B+', 'Formation VIP'],
    disponible: true,
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&q=80',
    bio: "Spécialiste corporate et tech VIP. Expérience au sein de grandes entreprises."
  },
]

// ── VÉHICULES EN VENTE ────────────────────────────────────────────────────────

export const VENTE_VEHICLES = [
  {
    id: 'V-RR-GHOST', marque: 'Rolls-Royce', nom: 'Ghost Extended', annee: 2022,
    prix_vente: 450000000, kilometrage: 18500, etat: 'Excellent',
    couleur: 'Silver Sand', transmission: 'Automatique', carburant: 'Essence',
    puissance: '571 ch', garantie: '12 mois',
    images: ['https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=800&q=80'],
    options: ['Starlight headliner', 'Spirit of Ecstasy illuminée', 'Alcantara plafond', 'Boiseries Canadel Panelling'],
    description: "Rolls-Royce Ghost Extended 2022, parfait état. Carnet d'entretien complet Rolls-Royce.",
    vendu: false,
  },
  {
    id: 'V-BENT-FLYING', marque: 'Bentley', nom: 'Flying Spur V8', annee: 2023,
    prix_vente: 220000000, kilometrage: 12000, etat: 'Comme neuf',
    couleur: 'Verdant', transmission: 'Automatique', carburant: 'Essence',
    puissance: '550 ch', garantie: '24 mois',
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80'],
    options: ['Naim Audio', 'Bentley Rotating Display', 'Massage 10 postes', 'Peinture bi-color'],
    description: "Flying Spur millésime 2023, quasiment neuf. First owner, full options.",
    vendu: false,
  },
  {
    id: 'V-MB-S580', marque: 'Mercedes-Benz', nom: 'Classe S 680 Maybach', annee: 2023,
    prix_vente: 185000000, kilometrage: 22000, etat: 'Très bon',
    couleur: 'Obsidian Black / Magno', transmission: 'Automatique', carburant: 'Essence',
    puissance: '612 ch', garantie: '12 mois',
    images: ['https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=800&q=80'],
    options: ['Maybach Executive Rear', 'Table First Class', 'Panoramic roof', 'Burmester 4D'],
    description: "Maybach S680 en parfait état, toutes révisions effectuées chez Mercedes-Benz.",
    vendu: false,
  },
  {
    id: 'V-LAMBO-URUS', marque: 'Lamborghini', nom: 'Urus Performante', annee: 2023,
    prix_vente: 280000000, kilometrage: 8500, etat: 'Excellent',
    couleur: 'Arancio Atlas', transmission: 'Automatique', carburant: 'Essence',
    puissance: '666 ch', garantie: '18 mois',
    images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80'],
    options: ['Pack Trofeo', 'Carbon extérieur', 'Akrapovič exhaust', 'Alcantara sport'],
    description: "Urus Performante quasiment neuf, pack complet Lamborghini. Collector.",
    vendu: true,
  },
  {
    id: 'V-BMW-750', marque: 'BMW', nom: 'Série 7 750i xDrive Individual', annee: 2022,
    prix_vente: 85000000, kilometrage: 35000, etat: 'Très bon',
    couleur: 'BMW Individual Azurite Black', transmission: 'Automatique', carburant: 'Hybride',
    puissance: '530 ch', garantie: '6 mois',
    images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80'],
    options: ['Individual leather', 'Harman Kardon', 'Executive Lounge', 'Head-up 3D'],
    description: "Série 7 BMW Individual 2022 avec finitions exclusives sur mesure.",
    vendu: false,
  },
  {
    id: 'V-AUDI-A8', marque: 'Audi', nom: 'A8 L 60 TFSIe Quattro', annee: 2023,
    prix_vente: 95000000, kilometrage: 18000, etat: 'Excellent',
    couleur: 'Argent Floret Metallic', transmission: 'Automatique', carburant: 'Hybride rechargeable',
    puissance: '462 ch', garantie: '12 mois',
    images: ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80'],
    options: ['B&O Advanced Sound', 'Massage Pro Rear', 'Ambient light 64', 'Matrix LED'],
    description: "A8 L hybride rechargeable en parfait état. Entretien Audi exclusif.",
    vendu: false,
  },
]
