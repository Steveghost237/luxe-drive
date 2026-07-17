import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Boolean, Integer, Numeric, Text,
    DateTime, ForeignKey, Enum as SAEnum, JSON,
)
from sqlalchemy.orm import relationship
from app.core.database import Base


# ─── Enums ────────────────────────────────────────────────────────────────────

RoleEnum = SAEnum("client", "admin", "chauffeur", "super_admin", name="role_enum")
TypeReservationEnum = SAEnum("location", "chauffeur", "achat", name="type_reservation_enum")
StatutReservationEnum = SAEnum(
    "en_attente", "confirmee", "en_cours", "terminee", "annulee",
    name="statut_reservation_enum",
)
StatutPaiementEnum = SAEnum(
    "en_attente", "succes", "echec", "rembourse", name="statut_paiement_enum"
)
ModePaiementEnum = SAEnum("mobile_money", "especes", "carte", name="mode_paiement_enum")
TypeNotificationEnum = SAEnum("info", "succes", "alerte", "promotion", name="type_notif_enum")
TypeFideliteEnum = SAEnum("gain", "depense", name="type_fidelite_enum")
TransmissionEnum = SAEnum("automatique", "manuelle", name="transmission_enum")
CarburantEnum = SAEnum("essence", "diesel", "electrique", "hybride", name="carburant_enum")


# ─── 1. Utilisateurs ──────────────────────────────────────────────────────────

class Utilisateur(Base):
    __tablename__ = "utilisateurs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    telephone = Column(String(20), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=True)
    nom = Column(String(100), nullable=True)
    prenom = Column(String(100), nullable=True)
    role = Column(RoleEnum, default="client", nullable=False)
    mot_de_passe_hash = Column(String(255), nullable=True)
    otp_code = Column(String(6), nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
    otp_tentatives = Column(Integer, default=0)
    est_verifie = Column(Boolean, default=False)
    est_actif = Column(Boolean, default=True)
    token_fcm = Column(Text, nullable=True)
    photo_url = Column(Text, nullable=True)
    refresh_token = Column(Text, nullable=True)
    deleted_at = Column(DateTime, nullable=True)
    last_seen = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    adresses = relationship("Adresse", back_populates="utilisateur")
    reservations = relationship("Reservation", back_populates="client")
    fidelite = relationship("FideliteCompte", back_populates="utilisateur", uselist=False)
    evaluations = relationship("Evaluation", back_populates="client")
    notifications = relationship("Notification", back_populates="utilisateur")
    chauffeur = relationship("Chauffeur", back_populates="utilisateur", uselist=False)


# ─── 2. Adresses ──────────────────────────────────────────────────────────────

class Adresse(Base):
    __tablename__ = "adresses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    utilisateur_id = Column(String(36), ForeignKey("utilisateurs.id"), nullable=False)
    libelle = Column(String(100), nullable=False)
    rue = Column(Text, nullable=True)
    ville = Column(String(100), nullable=False)
    pays = Column(String(100), default="Côte d'Ivoire")
    latitude = Column(Numeric(10, 8), nullable=True)
    longitude = Column(Numeric(11, 8), nullable=True)
    est_par_defaut = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    utilisateur = relationship("Utilisateur", back_populates="adresses")


# ─── 3. Zones de service ──────────────────────────────────────────────────────

class ZoneService(Base):
    __tablename__ = "zones_service"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nom = Column(String(100), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    frais_base = Column(Numeric(10, 2), default=0)
    km_max = Column(Numeric(8, 2), nullable=True)
    delai_minutes = Column(Integer, nullable=True)
    est_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# ─── 4. Catégories de véhicules ───────────────────────────────────────────────

class CategorieVehicule(Base):
    __tablename__ = "categories_vehicules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nom = Column(String(100), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    icone = Column(String(50), nullable=True)
    couleur = Column(String(7), nullable=True)
    description = Column(Text, nullable=True)
    est_active = Column(Boolean, default=True)
    ordre = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    vehicules = relationship("Vehicule", back_populates="categorie")


# ─── 5. Véhicules ─────────────────────────────────────────────────────────────

class Vehicule(Base):
    __tablename__ = "vehicules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    categorie_id = Column(
        String(36), ForeignKey("categories_vehicules.id"), nullable=False
    )
    nom = Column(String(200), nullable=False)
    marque = Column(String(100), nullable=False)
    modele = Column(String(100), nullable=False)
    annee = Column(Integer, nullable=True)
    slug = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    prix_location_jour = Column(Numeric(10, 2), nullable=True)
    prix_vente = Column(Numeric(12, 2), nullable=True)
    prix_chauffeur_heure = Column(Numeric(10, 2), nullable=True)
    images = Column(JSON, default=list)
    transmission = Column(TransmissionEnum, nullable=True)
    carburant = Column(CarburantEnum, nullable=True)
    nombre_places = Column(Integer, nullable=True)
    nombre_portes = Column(Integer, nullable=True)
    kilometrage = Column(Integer, nullable=True)
    couleur = Column(String(50), nullable=True)
    plaque = Column(String(20), unique=True, nullable=True)
    disponible_location = Column(Boolean, default=True)
    disponible_vente = Column(Boolean, default=False)
    disponible_chauffeur = Column(Boolean, default=False)
    est_actif = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    categorie = relationship("CategorieVehicule", back_populates="vehicules")
    options = relationship("OptionVehicule", back_populates="vehicule")
    reservations_lignes = relationship("ReservationLigne", back_populates="vehicule")
    historique_prix = relationship("HistoriquePrix", back_populates="vehicule")


# ─── 6. Options véhicules ─────────────────────────────────────────────────────

class OptionVehicule(Base):
    __tablename__ = "options_vehicules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vehicule_id = Column(String(36), ForeignKey("vehicules.id"), nullable=False)
    nom = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    prix_supplementaire = Column(Numeric(10, 2), default=0)
    est_inclus = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    vehicule = relationship("Vehicule", back_populates="options")


# ─── 7. Listes favorites ──────────────────────────────────────────────────────

class ListeFavorite(Base):
    __tablename__ = "listes_favorites"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    utilisateur_id = Column(String(36), ForeignKey("utilisateurs.id"), nullable=False)
    nom = Column(String(100), default="Mes favoris")
    created_at = Column(DateTime, default=datetime.utcnow)

    lignes = relationship("ListeFavoriteLigne", back_populates="liste")


# ─── 8. Lignes de listes favorites ───────────────────────────────────────────

class ListeFavoriteLigne(Base):
    __tablename__ = "listes_favorites_lignes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    liste_id = Column(String(36), ForeignKey("listes_favorites.id"), nullable=False)
    vehicule_id = Column(String(36), ForeignKey("vehicules.id"), nullable=False)
    type_interet = Column(String(20), default="location")
    notes = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    liste = relationship("ListeFavorite", back_populates="lignes")


# ─── 9. Config niveaux chauffeurs ─────────────────────────────────────────────

class ChauffeurNiveauConfig(Base):
    __tablename__ = "chauffeur_niveaux_config"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nom = Column(String(50), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    courses_min = Column(Integer, default=0)
    note_min = Column(Numeric(3, 2), default=0)
    bonus_pourcent = Column(Numeric(5, 2), default=0)
    icone = Column(String(50), nullable=True)
    couleur = Column(String(7), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# ─── 10. Chauffeurs ───────────────────────────────────────────────────────────

class Chauffeur(Base):
    __tablename__ = "chauffeurs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    utilisateur_id = Column(
        String(36), ForeignKey("utilisateurs.id"), nullable=False, unique=True
    )
    numero_permis = Column(String(50), nullable=True)
    permis_expire_le = Column(DateTime, nullable=True)
    photo_permis_url = Column(Text, nullable=True)
    vehicule_id = Column(String(36), ForeignKey("vehicules.id"), nullable=True)
    latitude_actuelle = Column(Numeric(10, 8), nullable=True)
    longitude_actuelle = Column(Numeric(11, 8), nullable=True)
    est_disponible = Column(Boolean, default=False)
    note_moyenne = Column(Numeric(3, 2), default=0)
    nombre_courses = Column(Integer, default=0)
    niveau_id = Column(
        String(36), ForeignKey("chauffeur_niveaux_config.id"), nullable=True
    )
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    utilisateur = relationship("Utilisateur", back_populates="chauffeur")
    niveau = relationship("ChauffeurNiveauConfig")


# ─── 11. Réservations ─────────────────────────────────────────────────────────

class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    reference = Column(String(20), unique=True, nullable=False)
    client_id = Column(String(36), ForeignKey("utilisateurs.id"), nullable=False)
    type_reservation = Column(TypeReservationEnum, nullable=False)
    statut = Column(StatutReservationEnum, default="en_attente")
    date_debut = Column(DateTime, nullable=True)
    date_fin = Column(DateTime, nullable=True)
    adresse_prise_en_charge = Column(Text, nullable=True)
    adresse_destination = Column(Text, nullable=True)
    latitude_prise = Column(Numeric(10, 8), nullable=True)
    longitude_prise = Column(Numeric(11, 8), nullable=True)
    sous_total = Column(Numeric(12, 2), default=0)
    frais_service = Column(Numeric(10, 2), default=0)
    remise = Column(Numeric(10, 2), default=0)
    total = Column(Numeric(12, 2), default=0)
    points_gagnes = Column(Integer, default=0)
    notes_client = Column(Text, nullable=True)
    notes_admin = Column(Text, nullable=True)
    photo_livraison_url = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    client = relationship("Utilisateur", back_populates="reservations")
    lignes = relationship("ReservationLigne", back_populates="reservation")
    paiements = relationship("Paiement", back_populates="reservation")


# ─── 12. Lignes de réservation ────────────────────────────────────────────────

class ReservationLigne(Base):
    __tablename__ = "reservations_lignes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    reservation_id = Column(String(36), ForeignKey("reservations.id"), nullable=False)
    vehicule_id = Column(String(36), ForeignKey("vehicules.id"), nullable=False)
    quantite = Column(Integer, default=1)
    prix_unitaire = Column(Numeric(12, 2), nullable=False)
    nombre_jours = Column(Integer, nullable=True)
    sous_total = Column(Numeric(12, 2), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    reservation = relationship("Reservation", back_populates="lignes")
    vehicule = relationship("Vehicule", back_populates="reservations_lignes")
    options = relationship("ReservationOption", back_populates="ligne")


# ─── 13. Options de réservation ───────────────────────────────────────────────

class ReservationOption(Base):
    __tablename__ = "reservations_options"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ligne_id = Column(String(36), ForeignKey("reservations_lignes.id"), nullable=False)
    option_id = Column(String(36), ForeignKey("options_vehicules.id"), nullable=False)
    prix_applique = Column(Numeric(10, 2), default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    ligne = relationship("ReservationLigne", back_populates="options")


# ─── 14. Paiements ────────────────────────────────────────────────────────────

class Paiement(Base):
    __tablename__ = "paiements"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    reservation_id = Column(String(36), ForeignKey("reservations.id"), nullable=False)
    montant = Column(Numeric(12, 2), nullable=False)
    mode = Column(ModePaiementEnum, nullable=False)
    statut = Column(StatutPaiementEnum, default="en_attente")
    reference_externe = Column(String(100), nullable=True)
    telephone_paiement = Column(String(20), nullable=True)
    reponse_api = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    reservation = relationship("Reservation", back_populates="paiements")


# ─── 15. Comptes fidélité ─────────────────────────────────────────────────────

class FideliteCompte(Base):
    __tablename__ = "fidelite_comptes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    utilisateur_id = Column(
        String(36), ForeignKey("utilisateurs.id"), nullable=False, unique=True
    )
    solde_points = Column(Integer, default=0)
    total_points_gagnes = Column(Integer, default=0)
    total_points_depenses = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    utilisateur = relationship("Utilisateur", back_populates="fidelite")
    transactions = relationship("FideliteTransaction", back_populates="compte")


# ─── 16. Transactions fidélité ────────────────────────────────────────────────

class FideliteTransaction(Base):
    __tablename__ = "fidelite_transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    compte_id = Column(String(36), ForeignKey("fidelite_comptes.id"), nullable=False)
    reservation_id = Column(String(36), ForeignKey("reservations.id"), nullable=True)
    type = Column(TypeFideliteEnum, nullable=False)
    points = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    compte = relationship("FideliteCompte", back_populates="transactions")


# ─── 17. Récompenses fidélité ─────────────────────────────────────────────────

class FideliteRecompense(Base):
    __tablename__ = "fidelite_recompenses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    nom = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    points_requis = Column(Integer, nullable=False)
    valeur_reduction = Column(Numeric(10, 2), nullable=True)
    image_url = Column(Text, nullable=True)
    est_active = Column(Boolean, default=True)
    stock = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# ─── 18. Évaluations ──────────────────────────────────────────────────────────

class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    reservation_id = Column(String(36), ForeignKey("reservations.id"), nullable=False)
    client_id = Column(String(36), ForeignKey("utilisateurs.id"), nullable=False)
    chauffeur_id = Column(String(36), ForeignKey("chauffeurs.id"), nullable=True)
    vehicule_id = Column(String(36), ForeignKey("vehicules.id"), nullable=True)
    note_globale = Column(Numeric(3, 2), nullable=False)
    note_vehicule = Column(Numeric(3, 2), nullable=True)
    note_chauffeur = Column(Numeric(3, 2), nullable=True)
    commentaire = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Utilisateur", back_populates="evaluations")


# ─── 19. Notifications ────────────────────────────────────────────────────────

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    utilisateur_id = Column(String(36), ForeignKey("utilisateurs.id"), nullable=False)
    titre = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(TypeNotificationEnum, default="info")
    est_lue = Column(Boolean, default=False)
    est_envoyee = Column(Boolean, default=False)
    reservation_id = Column(String(36), ForeignKey("reservations.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    utilisateur = relationship("Utilisateur", back_populates="notifications")


# ─── 20. Paramètres système ───────────────────────────────────────────────────

class Parametre(Base):
    __tablename__ = "parametres"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    cle = Column(String(100), unique=True, nullable=False)
    valeur = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    modifiable_admin = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# ─── 21. Suggestions de véhicules ────────────────────────────────────────────

class SuggestionVehicule(Base):
    __tablename__ = "suggestions_vehicules"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    utilisateur_id = Column(String(36), ForeignKey("utilisateurs.id"), nullable=False)
    titre = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    marque_souhaitee = Column(String(100), nullable=True)
    type_service = Column(String(50), nullable=True)
    nombre_votes = Column(Integer, default=0)
    est_traitee = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    votes = relationship("VoteSuggestion", back_populates="suggestion")


# ─── 22. Votes sur suggestions ───────────────────────────────────────────────

class VoteSuggestion(Base):
    __tablename__ = "votes_suggestions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    suggestion_id = Column(
        String(36), ForeignKey("suggestions_vehicules.id"), nullable=False
    )
    utilisateur_id = Column(String(36), ForeignKey("utilisateurs.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    suggestion = relationship("SuggestionVehicule", back_populates="votes")


# ─── 23. Historique des prix ──────────────────────────────────────────────────

class HistoriquePrix(Base):
    __tablename__ = "historique_prix"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    vehicule_id = Column(String(36), ForeignKey("vehicules.id"), nullable=False)
    type_prix = Column(String(50), nullable=False)
    ancien_prix = Column(Numeric(12, 2), nullable=True)
    nouveau_prix = Column(Numeric(12, 2), nullable=False)
    modifie_par = Column(String(36), ForeignKey("utilisateurs.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    vehicule = relationship("Vehicule", back_populates="historique_prix")


# ─── 24. Messages internes (chat) ─────────────────────────────────────────────

class Message(Base):
    __tablename__ = "messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    canal = Column(String(50), nullable=False, index=True)
    sender_id = Column(String(36), nullable=False)
    sender_name = Column(String(200), nullable=False)
    sender_role = Column(String(50), nullable=False)
    contenu = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
