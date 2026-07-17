class UserModel {
  final String  id;
  final String  telephone;
  final String? email;
  final String? nom;
  final String? prenom;
  final String  role;
  final String? photoUrl;
  final bool    estVerifie;

  const UserModel({
    required this.id,
    required this.telephone,
    this.email,
    this.nom,
    this.prenom,
    required this.role,
    this.photoUrl,
    required this.estVerifie,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id:          json['id'] as String,
    telephone:   json['telephone'] as String,
    email:       json['email'] as String?,
    nom:         json['nom'] as String?,
    prenom:      json['prenom'] as String?,
    role:        json['role'] as String,
    photoUrl:    json['photo_url'] as String?,
    estVerifie:  json['est_verifie'] as bool? ?? false,
  );

  Map<String, dynamic> toJson() => {
    'id':          id,
    'telephone':   telephone,
    'email':       email,
    'nom':         nom,
    'prenom':      prenom,
    'role':        role,
    'photo_url':   photoUrl,
    'est_verifie': estVerifie,
  };

  String get displayName {
    if (prenom != null && nom != null) return '$prenom $nom';
    return prenom ?? nom ?? telephone;
  }
}
