"""
Routes d'administration — lecture/écriture directe sur la base de données.
Accessibles via /api/admin/...
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from datetime import datetime, timedelta

from app.core.database import get_db
from app.models.models import Utilisateur, Reservation, Chauffeur, Vehicule

router = APIRouter()


# ── Schémas ───────────────────────────────────────────────────────────────────

class StatutUpdate(BaseModel):
    est_actif: bool

class RoleUpdate(BaseModel):
    role: str  # client | chauffeur | admin | super_admin

class ReservationStatutUpdate(BaseModel):
    statut: str  # en_attente | confirmee | en_cours | terminee | annulee


# ── Helper ────────────────────────────────────────────────────────────────────

def _user_dict(u: Utilisateur) -> dict:
    return {
        "id": str(u.id),
        "prenom": u.prenom or "",
        "nom": u.nom or "",
        "telephone": u.telephone,
        "email": u.email or "",
        "role": u.role,
        "est_actif": u.est_actif,
        "est_verifie": u.est_verifie,
        "created_at": u.created_at.isoformat() if u.created_at else None,
        "photo_url": u.photo_url,
    }

def _reservation_dict(r: Reservation) -> dict:
    client = r.client
    return {
        "id": str(r.id),
        "reference": r.reference,
        "type_reservation": r.type_reservation,
        "statut": r.statut,
        "total": float(r.total or 0),
        "sous_total": float(r.sous_total or 0),
        "date_debut": r.date_debut.isoformat() if r.date_debut else None,
        "date_fin": r.date_fin.isoformat() if r.date_fin else None,
        "notes_client": r.notes_client,
        "adresse_prise_en_charge": r.adresse_prise_en_charge,
        "adresse_destination": r.adresse_destination,
        "created_at": r.created_at.isoformat() if r.created_at else None,
        "client": {
            "id": str(client.id) if client else None,
            "prenom": client.prenom or "" if client else "",
            "nom": client.nom or "" if client else "",
            "telephone": client.telephone if client else "",
            "email": client.email or "" if client else "",
        } if client else None,
    }


# ── Stats globales ────────────────────────────────────────────────────────────

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_users       = db.query(func.count(Utilisateur.id)).scalar()
    clients           = db.query(func.count(Utilisateur.id)).filter(Utilisateur.role == "client").scalar()
    chauffeurs        = db.query(func.count(Utilisateur.id)).filter(Utilisateur.role == "chauffeur").scalar()
    admins            = db.query(func.count(Utilisateur.id)).filter(Utilisateur.role.in_(["admin", "super_admin"])).scalar()
    actifs            = db.query(func.count(Utilisateur.id)).filter(Utilisateur.est_actif == True).scalar()
    inactifs          = db.query(func.count(Utilisateur.id)).filter(Utilisateur.est_actif == False).scalar()

    total_reservations   = db.query(func.count(Reservation.id)).scalar()
    en_attente           = db.query(func.count(Reservation.id)).filter(Reservation.statut == "en_attente").scalar()
    confirmees           = db.query(func.count(Reservation.id)).filter(Reservation.statut == "confirmee").scalar()
    en_cours             = db.query(func.count(Reservation.id)).filter(Reservation.statut == "en_cours").scalar()
    terminees            = db.query(func.count(Reservation.id)).filter(Reservation.statut == "terminee").scalar()
    annulees             = db.query(func.count(Reservation.id)).filter(Reservation.statut == "annulee").scalar()
    revenu_total         = db.query(func.sum(Reservation.total)).filter(Reservation.statut == "terminee").scalar() or 0

    total_vehicules      = db.query(func.count(Vehicule.id)).scalar()

    return {
        "utilisateurs": {
            "total": total_users,
            "clients": clients,
            "chauffeurs": chauffeurs,
            "admins": admins,
            "actifs": actifs,
            "inactifs": inactifs,
        },
        "reservations": {
            "total": total_reservations,
            "en_attente": en_attente,
            "confirmees": confirmees,
            "en_cours": en_cours,
            "terminees": terminees,
            "annulees": annulees,
            "revenu_total": float(revenu_total),
        },
        "vehicules": {
            "total": total_vehicules,
        },
        "timestamp": datetime.utcnow().isoformat(),
    }


# ── Utilisateurs ──────────────────────────────────────────────────────────────

@router.get("/utilisateurs")
def list_users(
    role: Optional[str] = None,
    est_actif: Optional[bool] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    q = db.query(Utilisateur).filter(Utilisateur.deleted_at == None)
    if role:
        q = q.filter(Utilisateur.role == role)
    if est_actif is not None:
        q = q.filter(Utilisateur.est_actif == est_actif)
    if search:
        term = f"%{search}%"
        q = q.filter(
            (Utilisateur.nom.ilike(term)) |
            (Utilisateur.prenom.ilike(term)) |
            (Utilisateur.telephone.ilike(term)) |
            (Utilisateur.email.ilike(term))
        )
    users = q.order_by(Utilisateur.created_at.desc()).offset(skip).limit(limit).all()
    return [_user_dict(u) for u in users]


@router.get("/utilisateurs/{user_id}")
def get_user(user_id: str, db: Session = Depends(get_db)):
    u = db.query(Utilisateur).filter(Utilisateur.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return _user_dict(u)


@router.patch("/utilisateurs/{user_id}/statut")
def update_statut(user_id: str, body: StatutUpdate, db: Session = Depends(get_db)):
    u = db.query(Utilisateur).filter(Utilisateur.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    u.est_actif = body.est_actif
    db.commit()
    db.refresh(u)
    return _user_dict(u)


@router.patch("/utilisateurs/{user_id}/role")
def update_role(user_id: str, body: RoleUpdate, db: Session = Depends(get_db)):
    allowed = {"client", "chauffeur", "admin", "super_admin"}
    if body.role not in allowed:
        raise HTTPException(status_code=400, detail=f"Rôle invalide. Valeurs : {allowed}")
    u = db.query(Utilisateur).filter(Utilisateur.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    u.role = body.role
    db.commit()
    db.refresh(u)
    return _user_dict(u)


@router.delete("/utilisateurs/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db)):
    u = db.query(Utilisateur).filter(Utilisateur.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    u.deleted_at = datetime.utcnow()
    u.est_actif = False
    db.commit()
    return {"message": "Compte supprimé (soft delete)"}


# ── Réservations ──────────────────────────────────────────────────────────────

@router.get("/reservations")
def list_reservations(
    statut: Optional[str] = None,
    type_reservation: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    q = db.query(Reservation)
    if statut:
        q = q.filter(Reservation.statut == statut)
    if type_reservation:
        q = q.filter(Reservation.type_reservation == type_reservation)
    reservations = q.order_by(Reservation.created_at.desc()).offset(skip).limit(limit).all()
    return [_reservation_dict(r) for r in reservations]


@router.patch("/reservations/{reservation_id}/statut")
def update_reservation_statut(reservation_id: str, body: ReservationStatutUpdate, db: Session = Depends(get_db)):
    allowed = {"en_attente", "confirmee", "en_cours", "terminee", "annulee"}
    if body.statut not in allowed:
        raise HTTPException(status_code=400, detail=f"Statut invalide. Valeurs : {allowed}")
    r = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Réservation non trouvée")
    r.statut = body.statut
    db.commit()
    db.refresh(r)
    return _reservation_dict(r)


# ── Chauffeurs ────────────────────────────────────────────────────────────────

@router.get("/chauffeurs")
def list_chauffeurs_admin(db: Session = Depends(get_db)):
    chauffeurs = db.query(Chauffeur).all()
    result = []
    for c in chauffeurs:
        u = c.utilisateur
        result.append({
            "id": str(c.id),
            "utilisateur_id": str(c.utilisateur_id),
            "prenom": u.prenom or "" if u else "",
            "nom": u.nom or "" if u else "",
            "telephone": u.telephone if u else "",
            "email": u.email or "" if u else "",
            "est_actif": u.est_actif if u else False,
            "est_verifie": u.est_verifie if u else False,
            "est_disponible": c.est_disponible,
            "note_moyenne": float(c.note_moyenne or 0),
            "nombre_courses": c.nombre_courses or 0,
            "numero_permis": c.numero_permis,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        })
    return result


# ── Véhicules ─────────────────────────────────────────────────────────────────

@router.get("/vehicules")
def list_vehicules_admin(db: Session = Depends(get_db)):
    vehicules = db.query(Vehicule).all()
    return [{
        "id": str(v.id),
        "nom": v.nom,
        "marque": v.marque,
        "modele": v.modele,
        "plaque": v.plaque,
        "est_actif": v.est_actif,
        "disponible_location": v.disponible_location,
        "disponible_vente": v.disponible_vente,
        "disponible_chauffeur": v.disponible_chauffeur,
        "prix_location_jour": float(v.prix_location_jour or 0),
        "images": v.images or [],
        "created_at": v.created_at.isoformat() if v.created_at else None,
    } for v in vehicules]


# ── Utilisateurs connectés ────────────────────────────────────────────────────

@router.get("/connected")
def connected_users(db: Session = Depends(get_db)):
    threshold = datetime.utcnow() - timedelta(minutes=10)
    users = (
        db.query(Utilisateur)
        .filter(
            Utilisateur.last_seen >= threshold,
            Utilisateur.est_actif == True,
            Utilisateur.deleted_at == None,
        )
        .order_by(Utilisateur.last_seen.desc())
        .all()
    )
    return [_user_dict(u) for u in users]


# ── Localisation chauffeurs ───────────────────────────────────────────────────

@router.get("/chauffeurs/locations")
def chauffeur_locations(db: Session = Depends(get_db)):
    chauffeurs = db.query(Chauffeur).all()
    result = []
    for c in chauffeurs:
        u = c.utilisateur
        result.append({
            "id": str(c.id),
            "utilisateur_id": str(c.utilisateur_id),
            "prenom": u.prenom or "" if u else "",
            "nom": u.nom or "" if u else "",
            "telephone": u.telephone if u else "",
            "latitude": float(c.latitude_actuelle) if c.latitude_actuelle else None,
            "longitude": float(c.longitude_actuelle) if c.longitude_actuelle else None,
            "est_disponible": c.est_disponible,
            "last_seen": u.last_seen.isoformat() if u and u.last_seen else None,
            "note_moyenne": float(c.note_moyenne or 0),
            "nombre_courses": c.nombre_courses or 0,
        })
    return result
