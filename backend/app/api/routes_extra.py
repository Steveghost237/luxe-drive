from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import (
    Parametre,
    SuggestionVehicule,
    VoteSuggestion,
    HistoriquePrix,
    FideliteRecompense,
    Notification,
)

router = APIRouter()


# ─── Paramètres système ───────────────────────────────────────────────────────

@router.get("/parametres")
def get_parametres(db: Session = Depends(get_db)):
    return db.query(Parametre).all()


@router.get("/parametres/{cle}")
def get_parametre(cle: str, db: Session = Depends(get_db)):
    param = db.query(Parametre).filter(Parametre.cle == cle).first()
    if not param:
        raise HTTPException(status_code=404, detail="Paramètre non trouvé")
    return param


# ─── Suggestions ──────────────────────────────────────────────────────────────

@router.get("/suggestions")
def get_suggestions(traitee: Optional[bool] = None, db: Session = Depends(get_db)):
    q = db.query(SuggestionVehicule)
    if traitee is not None:
        q = q.filter(SuggestionVehicule.est_traitee == traitee)
    return q.order_by(SuggestionVehicule.nombre_votes.desc()).all()


@router.get("/suggestions/{suggestion_id}")
def get_suggestion(suggestion_id: str, db: Session = Depends(get_db)):
    s = db.query(SuggestionVehicule).filter(SuggestionVehicule.id == suggestion_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Suggestion non trouvée")
    return s


# ─── Récompenses fidélité ─────────────────────────────────────────────────────

@router.get("/fidelite/recompenses")
def get_recompenses(db: Session = Depends(get_db)):
    return db.query(FideliteRecompense).filter(FideliteRecompense.est_active == True).all()


# ─── Historique des prix ──────────────────────────────────────────────────────

@router.get("/vehicules/{vehicule_id}/historique-prix")
def get_historique_prix(vehicule_id: str, db: Session = Depends(get_db)):
    return (
        db.query(HistoriquePrix)
        .filter(HistoriquePrix.vehicule_id == vehicule_id)
        .order_by(HistoriquePrix.created_at.desc())
        .all()
    )


# ─── Notifications ────────────────────────────────────────────────────────────

@router.get("/notifications/{utilisateur_id}")
def get_notifications(
    utilisateur_id: str,
    lue: Optional[bool] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Notification).filter(Notification.utilisateur_id == utilisateur_id)
    if lue is not None:
        q = q.filter(Notification.est_lue == lue)
    return q.order_by(Notification.created_at.desc()).all()


@router.patch("/notifications/{notification_id}/lue")
def mark_notification_read(notification_id: str, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification non trouvée")
    notif.est_lue = True
    db.commit()
    return {"ok": True}


@router.patch("/notifications/{utilisateur_id}/tout-lire")
def mark_all_read(utilisateur_id: str, db: Session = Depends(get_db)):
    db.query(Notification).filter(
        Notification.utilisateur_id == utilisateur_id,
        Notification.est_lue == False,
    ).update({"est_lue": True})
    db.commit()
    return {"ok": True}


@router.patch("/notifications/{notification_id}/lire")
def marquer_lue(notification_id: str, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification non trouvée")
    notif.est_lue = True
    db.commit()
    return {"message": "Notification marquée comme lue"}
