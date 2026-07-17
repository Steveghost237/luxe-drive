class VehicleModel {
  final String  id;
  final String  nom;
  final String  marque;
  final String  modele;
  final int?    annee;
  final String? description;
  final double? prixLocationJour;
  final double? prixVente;
  final double? prixChauffeurHeure;
  final List<String> images;
  final String? transmission;
  final String? carburant;
  final int?    nombrePlaces;
  final bool    disponibleLocation;
  final bool    disponibleVente;
  final bool    disponibleChauffeur;

  const VehicleModel({
    required this.id,
    required this.nom,
    required this.marque,
    required this.modele,
    this.annee,
    this.description,
    this.prixLocationJour,
    this.prixVente,
    this.prixChauffeurHeure,
    this.images = const [],
    this.transmission,
    this.carburant,
    this.nombrePlaces,
    this.disponibleLocation = true,
    this.disponibleVente    = false,
    this.disponibleChauffeur= false,
  });

  factory VehicleModel.fromJson(Map<String, dynamic> json) => VehicleModel(
    id:                  json['id'] as String,
    nom:                 json['nom'] as String,
    marque:              json['marque'] as String,
    modele:              json['modele'] as String,
    annee:               json['annee'] as int?,
    description:         json['description'] as String?,
    prixLocationJour:    (json['prix_location_jour'] as num?)?.toDouble(),
    prixVente:           (json['prix_vente'] as num?)?.toDouble(),
    prixChauffeurHeure:  (json['prix_chauffeur_heure'] as num?)?.toDouble(),
    images:              List<String>.from(json['images'] ?? []),
    transmission:        json['transmission'] as String?,
    carburant:           json['carburant'] as String?,
    nombrePlaces:        json['nombre_places'] as int?,
    disponibleLocation:  json['disponible_location'] as bool? ?? true,
    disponibleVente:     json['disponible_vente'] as bool? ?? false,
    disponibleChauffeur: json['disponible_chauffeur'] as bool? ?? false,
  );

  String? get firstImage => images.isNotEmpty ? images.first : null;
}
