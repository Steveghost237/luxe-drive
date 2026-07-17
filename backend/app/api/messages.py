from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.models.models import Message

router = APIRouter()


class MessageCreate(BaseModel):
    canal: str
    sender_id: str
    sender_name: str
    sender_role: str
    contenu: str


def _msg_dict(m: Message) -> dict:
    return {
        "id": m.id,
        "canal": m.canal,
        "sender_id": m.sender_id,
        "sender_name": m.sender_name,
        "sender_role": m.sender_role,
        "contenu": m.contenu,
        "created_at": m.created_at.isoformat() if m.created_at else None,
    }


@router.get("/messages")
def get_messages(
    canal: str,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    msgs = (
        db.query(Message)
        .filter(Message.canal == canal)
        .order_by(Message.created_at.asc())
        .all()
    )
    return [_msg_dict(m) for m in msgs[-limit:]]


@router.post("/messages")
def send_message(body: MessageCreate, db: Session = Depends(get_db)):
    if not body.contenu.strip():
        raise HTTPException(status_code=400, detail="Le message ne peut pas être vide")
    msg = Message(
        canal=body.canal,
        sender_id=body.sender_id,
        sender_name=body.sender_name,
        sender_role=body.sender_role,
        contenu=body.contenu.strip(),
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return _msg_dict(msg)
