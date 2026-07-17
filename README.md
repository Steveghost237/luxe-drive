# Luxe Drive

Plateforme premium de **location**, **chauffeur privé** et **vente** de véhicules de luxe.

---

## Architecture

| Couche | Technologie | Port |
|--------|-------------|------|
| Backend API | Python 3.10 + FastAPI 0.111 | 8000 |
| Frontend Web | React 18 + Vite 5 + TailwindCSS | 5173 |
| Application Mobile | Flutter (Dart ^3.5.2) | APK / Store |
| Base de données | PostgreSQL 14+ | 5432 |

---

## Structure du projet

```
Luxe Drive/
├── backend/          # API FastAPI + SQLAlchemy + Alembic
├── frontend/         # SPA React / Vite / TailwindCSS
├── mobile/           # Application Flutter iOS & Android
└── README.md
```

---

## Démarrage rapide

### 1. Base de données PostgreSQL
```sql
CREATE DATABASE luxe_drive;
```

### 2. Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
# Renseigner .env (DATABASE_URL, SECRET_KEY, etc.)
uvicorn app.main:app --reload --port 8000
```
→ Swagger : http://localhost:8000/docs

### 3. Frontend Web
```bash
cd frontend
npm install
npm run dev
```
→ http://localhost:5173

### 4. Mobile Flutter
```bash
cd mobile
flutter pub get
flutter run
```

---

## Variables d'environnement

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL PostgreSQL |
| `SECRET_KEY` | Clé de signature JWT (min 32 chars) |
| `AT_API_KEY` | Clé API Africa's Talking (SMS + Mobile Money) |
| `AT_USERNAME` | Username Africa's Talking |
| `ALLOWED_ORIGINS` | Origines CORS autorisées |

### Frontend (`frontend/.env.local`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | URL de l'API backend |

### Mobile (`mobile/lib/utils/constants.dart`)
| Constante | Description |
|-----------|-------------|
| `kBaseUrl` | URL de l'API backend de production |
| `kGoogleMapsApiKey` | Clé API Google Maps |

---

## Base de données — 23 tables

| Table | Description |
|-------|-------------|
| `utilisateurs` | Comptes clients, admins, chauffeurs |
| `adresses` | Adresses de livraison / prise en charge |
| `zones_service` | Zones géographiques et tarification |
| `categories_vehicules` | Catégories (Berline, SUV, Sportive…) |
| `vehicules` | Catalogue véhicules |
| `options_vehicules` | Options / extras par véhicule |
| `listes_favorites` | Listes de favoris |
| `listes_favorites_lignes` | Véhicules dans les listes |
| `chauffeur_niveaux_config` | Niveaux chauffeurs (Junior → Expert) |
| `chauffeurs` | Profils chauffeurs |
| `reservations` | Réservations (location / chauffeur / achat) |
| `reservations_lignes` | Véhicules dans une réservation |
| `reservations_options` | Options sélectionnées |
| `paiements` | Transactions Mobile Money / espèces |
| `fidelite_comptes` | Comptes points fidélité |
| `fidelite_transactions` | Historique points |
| `fidelite_recompenses` | Récompenses échangeables |
| `evaluations` | Notes et avis clients |
| `notifications` | Notifications in-app |
| `parametres` | Configuration système |
| `suggestions_vehicules` | Suggestions de véhicules |
| `votes_suggestions` | Votes sur suggestions |
| `historique_prix` | Traçabilité des prix |

---

## Déploiement

| Couche | Hébergeur | Méthode |
|--------|-----------|---------|
| Backend | Render.com | Web Service Python |
| Frontend | Vercel | Git deploy |
| Base de données | Render.com / Supabase | PostgreSQL managé |
| Mobile Android | Play Store | `flutter build apk --release` |
| Mobile iOS | App Store | `flutter build ipa` |
