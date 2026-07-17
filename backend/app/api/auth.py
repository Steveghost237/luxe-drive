import random
import string
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional

from app.core.database import get_db
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.core.config import settings
from app.models.models import Utilisateur

router = APIRouter()


# ─── Schemas inline ──────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    telephone: str
    mot_de_passe: str
    prenom: Optional[str] = None
    nom: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = "client"


class LoginRequest(BaseModel):
    identifiant: str   # email ou téléphone
    mot_de_passe: str


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _user_to_dict(user: Utilisateur) -> dict:
    return {
        "id": str(user.id),
        "telephone": user.telephone,
        "email": user.email,
        "nom": user.nom,
        "prenom": user.prenom,
        "role": user.role,
        "photo_url": user.photo_url,
        "est_verifie": user.est_verifie,
    }


# ─── Endpoint : inscription ───────────────────────────────────────────────────

@router.post("/register")
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    # Vérifier unicité téléphone
    if db.query(Utilisateur).filter(Utilisateur.telephone == body.telephone).first():
        raise HTTPException(status_code=400, detail="Ce numéro de téléphone est déjà utilisé")
    # Vérifier unicité email si fourni
    if body.email and db.query(Utilisateur).filter(Utilisateur.email == body.email).first():
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé")

    allowed_roles = {"client", "chauffeur", "admin", "super_admin"}
    role = body.role if body.role in allowed_roles else "client"

    user = Utilisateur(
        telephone=body.telephone,
        email=body.email,
        prenom=body.prenom,
        nom=body.nom,
        role=role,
        mot_de_passe_hash=hash_password(body.mot_de_passe),
        est_verifie=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token  = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    user.refresh_token = refresh_token
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "utilisateur": _user_to_dict(user),
    }


# ─── Endpoint : connexion email ou téléphone + mot de passe ──────────────────

@router.post("/login")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    # Chercher par email ou par téléphone
    user = (
        db.query(Utilisateur).filter(Utilisateur.email == body.identifiant).first()
        or db.query(Utilisateur).filter(Utilisateur.telephone == body.identifiant).first()
    )
    if not user:
        raise HTTPException(status_code=401, detail="Identifiant ou mot de passe incorrect")
    if not user.mot_de_passe_hash:
        raise HTTPException(status_code=401, detail="Ce compte utilise la connexion OTP — demandez un code SMS")
    if not verify_password(body.mot_de_passe, user.mot_de_passe_hash):
        raise HTTPException(status_code=401, detail="Identifiant ou mot de passe incorrect")
    if not user.est_actif:
        raise HTTPException(status_code=403, detail="Compte désactivé — contactez le support")

    access_token  = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    user.refresh_token = refresh_token
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "utilisateur": _user_to_dict(user),
    }


def _generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


@router.post("/request-otp")
def request_otp(telephone: str, db: Session = Depends(get_db)):
    user = db.query(Utilisateur).filter(Utilisateur.telephone == telephone).first()
    if not user:
        user = Utilisateur(telephone=telephone)
        db.add(user)

    otp = _generate_otp()
    user.otp_code = otp
    user.otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
    user.otp_tentatives = 0
    db.commit()

    # TODO: envoyer via Africa's Talking SMS
    return {
        "message": "OTP envoyé par SMS",
        "debug_otp": otp if settings.DEBUG else None,
    }


@router.post("/verify-otp")
def verify_otp(telephone: str, otp: str, db: Session = Depends(get_db)):
    user = db.query(Utilisateur).filter(Utilisateur.telephone == telephone).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    if user.otp_tentatives >= 5:
        raise HTTPException(status_code=429, detail="Trop de tentatives — réessayez plus tard")

    if not user.otp_code or not user.otp_expires_at or user.otp_expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP expiré — demandez-en un nouveau")

    if user.otp_code != otp:
        user.otp_tentatives += 1
        db.commit()
        raise HTTPException(status_code=400, detail="OTP incorrect")

    user.est_verifie = True
    user.otp_code = None
    user.otp_tentatives = 0

    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    user.refresh_token = refresh_token
    db.commit()
    db.refresh(user)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "utilisateur": {
            "id": str(user.id),
            "telephone": user.telephone,
            "nom": user.nom,
            "prenom": user.prenom,
            "role": user.role,
            "photo_url": user.photo_url,
            "est_verifie": user.est_verifie,
        },
    }


@router.post("/refresh")
def refresh(token: str, db: Session = Depends(get_db)):
    payload = decode_token(token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Token de rafraîchissement invalide")

    user = db.query(Utilisateur).filter(
        Utilisateur.id == payload["sub"],
        Utilisateur.refresh_token == token,
    ).first()
    if not user:
        raise HTTPException(status_code=401, detail="Token non reconnu")

    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
def logout(token: str, db: Session = Depends(get_db)):
    payload = decode_token(token)
    if payload:
        user = db.query(Utilisateur).filter(Utilisateur.id == payload.get("sub")).first()
        if user:
            user.refresh_token = None
            db.commit()
    return {"message": "Déconnexion réussie"}


@router.get("/me")
def me(token: str, db: Session = Depends(get_db)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token invalide")
    user = db.query(Utilisateur).filter(Utilisateur.id == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return {
        "id": str(user.id),
        "telephone": user.telephone,
        "email": user.email,
        "nom": user.nom,
        "prenom": user.prenom,
        "role": user.role,
        "photo_url": user.photo_url,
        "est_verifie": user.est_verifie,
        "created_at": user.created_at,
    }


# ── Heartbeat ─────────────────────────────────────────────────────────────────

class HeartbeatBody(BaseModel):
    user_id: str

@router.post("/heartbeat")
def heartbeat(body: HeartbeatBody, db: Session = Depends(get_db)):
    user = db.query(Utilisateur).filter(Utilisateur.id == body.user_id).first()
    if user:
        user.last_seen = datetime.utcnow()
        db.commit()
    return {"status": "ok"}
