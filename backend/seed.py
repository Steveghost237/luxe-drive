"""
Script de seed — Crée les comptes de test pour Luxe Drive
Usage : python seed.py  (depuis le dossier backend, avec le venv activé)
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine, Base
from app.core.security import create_access_token
from app.models.models import Utilisateur
import uuid

Base.metadata.create_all(bind=engine)

TEST_USERS = [
    {
        "telephone": "+237600000001",
        "nom": "Kamga",
        "prenom": "Super Admin",
        "role": "super_admin",
        "description": "Accès total — tableau de bord admin",
    },
    {
        "telephone": "+237600000002",
        "nom": "Ateba",
        "prenom": "Christine",
        "role": "admin",
        "description": "Gestionnaire plateforme",
    },
    {
        "telephone": "+237600000003",
        "nom": "Tankou",
        "prenom": "Jean-Pierre",
        "role": "client",
        "description": "Client particulier — réservations",
    },
    {
        "telephone": "+237600000004",
        "nom": "Eyenga",
        "prenom": "Marc",
        "role": "chauffeur",
        "description": "Chauffeur confirmé — tableau de bord chauffeur",
    },
]

db = SessionLocal()
results = []

for u in TEST_USERS:
    existing = db.query(Utilisateur).filter(
        Utilisateur.telephone == u["telephone"]
    ).first()

    if not existing:
        user = Utilisateur(
            id=str(uuid.uuid4()),
            telephone=u["telephone"],
            nom=u["nom"],
            prenom=u["prenom"],
            role=u["role"],
            est_verifie=True,
            est_actif=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        existing.nom = u["nom"]
        existing.prenom = u["prenom"]
        existing.role = u["role"]
        existing.est_verifie = True
        db.commit()
        db.refresh(existing)
        user = existing

    token = create_access_token({"sub": str(user.id), "role": user.role})
    results.append({**u, "token": token, "id": str(user.id)})

db.close()

SEP = "=" * 68
print(f"\n{SEP}")
print("   LUXE DRIVE — COMPTES DE TEST CRÉÉS")
print(SEP)

for r in results:
    print(f"""
  ┌─ {r['role'].upper()} ─────────────────────────────────────────
  │  Nom       : {r['prenom']} {r['nom']}
  │  Téléphone : {r['telephone']}
  │  Accès     : {r['description']}
  │  Token JWT : {r['token'][:64]}...
  └──────────────────────────────────────────────────────────""")

print(f"""
{SEP}
  COMMENT SE CONNECTER (mode DEBUG — OTP visible dans la réponse)

  Étape 1 — Demander l'OTP :
    POST http://localhost:8000/api/auth/request-otp
         ?telephone=+237600000001

  Étape 2 — La réponse JSON contient :
    {{ "debug_otp": "XXXXXX" }}   ← copiez ce code

  Étape 3 — Vérifier l'OTP :
    POST http://localhost:8000/api/auth/verify-otp
         ?telephone=+237600000001&otp=XXXXXX

  Étape 4 — Utiliser le token retourné dans le frontend
    → Allez sur http://localhost:5173/connexion
    → Saisissez le numéro, entrez l'OTP affiché dans la réponse
{SEP}
""")
