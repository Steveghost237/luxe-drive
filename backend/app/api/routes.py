import uuid
import shutil
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.database import get_db
from app.models.models import (
    Vehicule,
    CategorieVehicule,
    Reservation,
    Chauffeur,
    ZoneService,
    Utilisateur,
    Adresse,
    Evaluation,
    FideliteCompte,
)


class ReservationCreate(BaseModel):
    vehicule_id: Optional[str] = None
    vehicule_nom: Optional[str] = None
    type: Optional[str] = "location"          # location | chauffeur | achat
    client_nom: Optional[str] = None
    client_tel: Optional[str] = None
    client_email: Optional[str] = None
    date_debut: Optional[str] = None
    date_fin: Optional[str] = None
    note: Optional[str] = None
    montant_total: Optional[float] = 0
    chauffeur_nom: Optional[str] = None
    type_service: Optional[str] = None
    depart: Optional[str] = None
    destination: Optional[str] = None
    message: Optional[str] = None

router = APIRouter()


# ─── Catégories ───────────────────────────────────────────────────────────────

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(CategorieVehicule).filter(CategorieVehicule.est_active == True).order_by(
        CategorieVehicule.ordre
    ).all()


@router.get("/categories/{categorie_id}")
def get_categorie(categorie_id: str, db: Session = Depends(get_db)):
    cat = db.query(CategorieVehicule).filter(CategorieVehicule.id == categorie_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    return cat


# ─── Véhicules ────────────────────────────────────────────────────────────────

@router.get("/vehicules")
def get_vehicules(
    categorie_id: Optional[str] = None,
    service: Optional[str] = None,
    marque: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    q = db.query(Vehicule).filter(Vehicule.est_actif == True)
    if categorie_id:
        q = q.filter(Vehicule.categorie_id == categorie_id)
    if marque:
        q = q.filter(Vehicule.marque.ilike(f"%{marque}%"))
    if service == "location":
        q = q.filter(Vehicule.disponible_location == True)
    elif service == "vente":
        q = q.filter(Vehicule.disponible_vente == True)
    elif service == "chauffeur":
        q = q.filter(Vehicule.disponible_chauffeur == True)
    return q.offset(skip).limit(limit).all()


@router.get("/vehicules/{vehicule_id}")
def get_vehicule(vehicule_id: str, db: Session = Depends(get_db)):
    v = db.query(Vehicule).filter(Vehicule.id == vehicule_id).first()
    if not v:
        raise HTTPException(status_code=404, detail="Véhicule non trouvé")
    return v


# ─── Réservations ─────────────────────────────────────────────────────────────

@router.post("/reservations")
def create_reservation(body: ReservationCreate, db: Session = Depends(get_db)):
    """Crée une réservation depuis l'app mobile ou le site."""
    client = None
    if body.client_tel:
        client = db.query(Utilisateur).filter(Utilisateur.telephone == body.client_tel).first()
    if not client:
        prenom = body.client_nom.split()[0] if body.client_nom else None
        nom = " ".join(body.client_nom.split()[1:]) if body.client_nom and len(body.client_nom.split()) > 1 else None
        client = Utilisateur(
            telephone=body.client_tel or f"anon-{uuid.uuid4().hex[:8]}",
            prenom=prenom, nom=nom, email=body.client_email,
            role="client", est_verifie=False,
        )
        db.add(client)
        db.flush()

    type_map = {"location": "location", "chauffeur": "chauffeur", "achat": "achat"}
    type_resa = type_map.get(body.type or "location", "location")

    notes = []
    if body.note:         notes.append(body.note)
    if body.message:      notes.append(body.message)
    if body.chauffeur_nom: notes.append(f"Chauffeur : {body.chauffeur_nom}")
    if body.type_service:  notes.append(f"Service : {body.type_service}")
    if body.vehicule_nom:  notes.append(f"Véhicule : {body.vehicule_nom}")

    resa = Reservation(
        reference=f"LD-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}",
        client_id=str(client.id),
        type_reservation=type_resa,
        statut="en_attente",
        date_debut=datetime.fromisoformat(body.date_debut) if body.date_debut else None,
        date_fin=datetime.fromisoformat(body.date_fin) if body.date_fin else None,
        adresse_prise_en_charge=body.depart,
        adresse_destination=body.destination,
        total=body.montant_total or 0,
        notes_client="\n".join(notes) if notes else None,
    )
    db.add(resa)
    db.commit()
    db.refresh(resa)
    return {"id": str(resa.id), "reference": resa.reference, "statut": resa.statut}


@router.get("/reservations")
def get_reservations(
    client_id: Optional[str] = None,
    statut: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    q = db.query(Reservation)
    if client_id:
        q = q.filter(Reservation.client_id == client_id)
    if statut:
        q = q.filter(Reservation.statut == statut)
    return q.order_by(Reservation.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/reservations/{reservation_id}")
def get_reservation(reservation_id: str, db: Session = Depends(get_db)):
    r = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    return r


# ─── Chauffeurs ───────────────────────────────────────────────────────────────

@router.get("/chauffeurs")
def get_chauffeurs(disponible: Optional[bool] = None, db: Session = Depends(get_db)):
    q = db.query(Chauffeur)
    if disponible is not None:
        q = q.filter(Chauffeur.est_disponible == disponible)
    return q.all()


@router.get("/chauffeurs/{chauffeur_id}")
def get_chauffeur(chauffeur_id: str, db: Session = Depends(get_db)):
    c = db.query(Chauffeur).filter(Chauffeur.id == chauffeur_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Chauffeur non trouvé")
    return c


# ─── Zones de service ─────────────────────────────────────────────────────────

@router.get("/zones")
def get_zones(db: Session = Depends(get_db)):
    return db.query(ZoneService).filter(ZoneService.est_active == True).all()


# ─── Évaluations ──────────────────────────────────────────────────────────────

@router.get("/evaluations")
def get_evaluations(
    vehicule_id: Optional[str] = None,
    chauffeur_id: Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Evaluation)
    if vehicule_id:
        q = q.filter(Evaluation.vehicule_id == vehicule_id)
    if chauffeur_id:
        q = q.filter(Evaluation.chauffeur_id == chauffeur_id)
    return q.order_by(Evaluation.created_at.desc()).all()


# ─── Fidélité ─────────────────────────────────────────────────────────────────

@router.get("/fidelite/{utilisateur_id}")
def get_fidelite(utilisateur_id: str, db: Session = Depends(get_db)):
    compte = db.query(FideliteCompte).filter(
        FideliteCompte.utilisateur_id == utilisateur_id
    ).first()
    if not compte:
        raise HTTPException(status_code=404, detail="Compte fidélité non trouvé")
    return compte


# ─── Upload fichiers ──────────────────────────────────────────────────────────

@router.post("/uploads/image")
async def upload_image(file: UploadFile = File(...)):
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Format non supporté (JPEG, PNG, WebP)")
    ext = file.filename.rsplit(".", 1)[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    path = f"uploads/{filename}"
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"url": f"/uploads/{filename}", "filename": filename}
