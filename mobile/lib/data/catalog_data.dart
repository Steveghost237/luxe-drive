// ── Local catalog data — mirrors web catalogData.js ──────────────────────────

class LocalVehicle {
  final String id, marque, nom, segment, couleur, carburant, transmission,
      puissance, description;
  final int annee, places, prixJour, caution;
  final bool disponible;
  final List<String> images, features;

  const LocalVehicle({
    required this.id,
    required this.marque,
    required this.nom,
    required this.segment,
    required this.couleur,
    required this.carburant,
    required this.transmission,
    required this.puissance,
    required this.description,
    required this.annee,
    required this.places,
    required this.prixJour,
    required this.caution,
    required this.disponible,
    required this.images,
    required this.features,
  });

  static LocalVehicle? findById(String id) {
    try {
      return kLocationVehicles.firstWhere((v) => v.id == id);
    } catch (_) {
      return null;
    }
  }
}

const kLocationVehicles = [
  // ── Ultra-Luxe ────────────────────────────────────────────────────────────
  LocalVehicle(
    id: 'RR1', marque: 'Rolls-Royce', nom: 'Phantom VIII',
    segment: 'Ultra-Luxe', annee: 2024,
    couleur: 'Noir Diamant', carburant: 'Essence', transmission: 'Automatique',
    puissance: '563 ch', places: 4, prixJour: 850000, caution: 5000000,
    disponible: true,
    images: [
      'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Chauffeur inclus', 'Champagne offert', 'Tapis rouge', 'Partition cloison'],
    description: "L'apogée du luxe automobile. Silence total, finitions bois et cuir artisanal. Construit à la main en 500 heures.",
  ),
  LocalVehicle(
    id: 'BN1', marque: 'Bentley', nom: 'Mulsanne Speed',
    segment: 'Ultra-Luxe', annee: 2023,
    couleur: 'Argent Mercure', carburant: 'Essence', transmission: 'Automatique',
    puissance: '530 ch', places: 4, prixJour: 700000, caution: 4500000,
    disponible: true,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Mini-bar', 'Massages sièges', 'TV arrière', 'WiFi bord'],
    description: "Berline grand tourisme d'exception. V8 biturbo 530 ch. Cuir Poltrona Frau artisanal.",
  ),
  LocalVehicle(
    id: 'LB1', marque: 'Lamborghini', nom: 'Urus S',
    segment: 'Ultra-Luxe', annee: 2024,
    couleur: 'Jaune Giallo Inti', carburant: 'Essence', transmission: 'Automatique',
    puissance: '666 ch', places: 5, prixJour: 650000, caution: 4000000,
    disponible: false,
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Sport+', 'Karman audio', 'Pack Notte', 'Jantes 23"'],
    description: "Le SUV sport le plus rapide du monde. 0-100 km/h en 3,5 secondes.",
  ),
  // ── Haut-Gamme ────────────────────────────────────────────────────────────
  LocalVehicle(
    id: 'MB1', marque: 'Mercedes-Benz', nom: 'Classe S 580 4Matic',
    segment: 'Haut-Gamme', annee: 2024,
    couleur: 'Obsidian Black', carburant: 'Hybride', transmission: 'Automatique',
    puissance: '503 ch', places: 4, prixJour: 250000, caution: 1500000,
    disponible: true,
    images: [
      'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Massage sièges', 'HUD AR', 'Ambiance 64 couleurs', 'Suspension Magic Body'],
    description: "La référence des berlines de luxe. MBUX avec IA intégrée et affichage tête haute augmenté.",
  ),
  LocalVehicle(
    id: 'BW1', marque: 'BMW', nom: 'Série 7 750i xDrive',
    segment: 'Haut-Gamme', annee: 2024,
    couleur: 'Tanzanite Blue', carburant: 'Hybride', transmission: 'Automatique',
    puissance: '490 ch', places: 5, prixJour: 220000, caution: 1300000,
    disponible: true,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Théâtre arrière 31"', 'BMW Executive Lounge', 'Harmonia audio', 'Wifi 5G'],
    description: "Prestige technologique BMW. Écrans arrière cinématographiques inégalés.",
  ),
  LocalVehicle(
    id: 'AU1', marque: 'Audi', nom: 'A8 L 60 TFSI e',
    segment: 'Haut-Gamme', annee: 2024,
    couleur: 'Argent Floret', carburant: 'Hybride rechargeable', transmission: 'Automatique',
    puissance: '462 ch', places: 5, prixJour: 200000, caution: 1200000,
    disponible: true,
    images: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Quattro AWD', 'Massage Pro', 'Bang & Olufsen', 'Suspension pneumatique'],
    description: "Excellence Audi. Suspension pneumatique adaptative et massage 10 postes.",
  ),
  // ── Premium ────────────────────────────────────────────────────────────────
  LocalVehicle(
    id: 'MB2', marque: 'Mercedes-Benz', nom: 'Classe E 450 4Matic',
    segment: 'Premium', annee: 2024,
    couleur: 'MANUFAKTUR Blanc Opale', carburant: 'Hybride', transmission: 'Automatique',
    puissance: '367 ch', places: 5, prixJour: 120000, caution: 700000,
    disponible: true,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['MBUX Hyperscreen', 'Active Curve', 'Burmester audio', 'Keyless-go'],
    description: "Berline executive par excellence. MBUX Hyperscreen 141 cm.",
  ),
  LocalVehicle(
    id: 'PO1', marque: 'Porsche', nom: 'Taycan 4S',
    segment: 'Premium', annee: 2024,
    couleur: 'Gentian Blue Metallic', carburant: 'Électrique', transmission: 'Automatique',
    puissance: '571 ch', places: 4, prixJour: 180000, caution: 1000000,
    disponible: true,
    images: [
      'https://images.unsplash.com/photo-1611821639601-d25a8c11a821?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['800V ultra-rapide', 'Sport Chrono', 'BOSE 3D', '0-100 en 4s'],
    description: "Sportivité Porsche électrique. Recharge 800V en moins de 23 minutes.",
  ),
  LocalVehicle(
    id: 'LX1', marque: 'Lexus', nom: 'LS 500h AWD',
    segment: 'Premium', annee: 2023,
    couleur: 'Sonic Titanium', carburant: 'Hybride', transmission: 'Automatique',
    puissance: '360 ch', places: 5, prixJour: 130000, caution: 750000,
    disponible: true,
    images: [
      'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
    ],
    features: ['Executive package', 'Mark Levinson 23 HP', 'Shiatsu massage', 'Console réfrigérée'],
    description: "Luxe japonais irréprochable. Fiabilité légendaire Lexus.",
  ),
];
