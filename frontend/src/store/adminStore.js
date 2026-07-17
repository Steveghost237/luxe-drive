import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Mock users ───────────────────────────────────────────────────────────────

const INIT_CHAUFFEURS = [
  { id:'ch1', prenom:'David',    nom:'Kameni',   tel:'+237 699 001 001', email:'d.kameni@email.cm',    ville:'Yaoundé', note:4.9, missions:312, statut:'actif',     kyc:'verifie',  vehiculeAssigne:'v2', dateInscription:'12 Jan 2024', permis:'B+', langues:['Français','Anglais'] },
  { id:'ch2', prenom:'Alice',    nom:'Nguema',   tel:'+237 677 002 002', email:'a.nguema@email.cm',    ville:'Douala',  note:4.8, missions:248, statut:'actif',     kyc:'verifie',  vehiculeAssigne:null, dateInscription:'03 Fév 2024', permis:'B+', langues:['Français','Anglais'] },
  { id:'ch3', prenom:'Rodrigue', nom:'Manga',    tel:'+237 655 003 003', email:'r.manga@email.cm',     ville:'Yaoundé', note:0,   missions:0,   statut:'en_attente',kyc:'en_cours', vehiculeAssigne:null, dateInscription:'05 Juin 2025', permis:'B', langues:['Français'] },
  { id:'ch4', prenom:'Éric',     nom:'Fouda',    tel:'+237 688 004 004', email:'e.fouda@email.cm',     ville:'Bafoussam',note:4.5,missions:167, statut:'actif',     kyc:'verifie',  vehiculeAssigne:'v4', dateInscription:'20 Mar 2024', permis:'B+', langues:['Français'] },
  { id:'ch5', prenom:'Christelle',nom:'Biya',    tel:'+237 699 005 005', email:'c.biya@email.cm',      ville:'Douala',  note:4.7, missions:89,  statut:'actif',     kyc:'verifie',  vehiculeAssigne:null, dateInscription:'11 Sep 2024', permis:'B', langues:['Français','Anglais'] },
  { id:'ch6', prenom:'Paul',     nom:'Essomba',  tel:'+237 677 006 006', email:'p.essomba@email.cm',   ville:'Yaoundé', note:0,   missions:0,   statut:'suspendu',  kyc:'verifie',  vehiculeAssigne:null, dateInscription:'01 Déc 2023', permis:'B+', langues:['Français'] },
]

const INIT_PROPRIETAIRES = [
  { id:'pr1', prenom:'Marie',   nom:'Mbeki',    tel:'+237 655 010 010', email:'m.mbeki@email.cm',     ville:'Yaoundé', vehicules:['v1','v2'], statut:'actif',     kyc:'verifie',  dateInscription:'03 Mars 2024', type:'particulier' },
  { id:'pr2', prenom:'Laurent', nom:'Ngoum',    tel:'+237 699 011 011', email:'l.ngoum@email.cm',     ville:'Douala',  vehicules:['v3'],      statut:'en_attente',kyc:'en_cours', dateInscription:'20 Mai 2025',  type:'particulier' },
  {
    id:'pr3', prenom:'ACME', nom:'Transport', tel:'+237 222 012 012', email:'contact@acme-cm.com',
    ville:'Douala', vehicules:['v4','v5'], statut:'actif', kyc:'verifie', dateInscription:'15 Nov 2023', type:'entreprise',
    raisonSociale:'ACME Transport Prestige SARL', secteur:'Transport & Logistique',
    nif:'M012345678901X', rc:'RC/DLA/2019/B/1234', responsable:'Jean-Pierre Ngoum',
    effectif:42, capitalSocial:'50 000 000 FCFA', dateCreation:'15 Mar 2019',
    adresse:'Rue de la Paix, Akwa, Douala', siteWeb:'www.acme-transport.cm',
  },
  {
    id:'pr5', prenom:'VIPFleet', nom:'Cameroun', tel:'+237 222 099 099', email:'contact@vipfleet.cm',
    ville:'Yaoundé', vehicules:[], statut:'en_attente', kyc:'en_cours', dateInscription:'20 Juin 2025', type:'entreprise',
    raisonSociale:'VIPFleet Cameroun SA', secteur:'Location de véhicules de luxe',
    nif:'M099876543210X', rc:'RC/YDE/2025/B/5678', responsable:'Camille Essama',
    effectif:8, capitalSocial:'25 000 000 FCFA', dateCreation:'01 Jan 2025',
    adresse:'Boulevard du 20 Mai, Yaoundé', siteWeb:'www.vipfleet.cm',
  },
  { id:'pr4', prenom:'Henri',   nom:'Ateba',    tel:'+237 677 013 013', email:'h.ateba@email.cm',     ville:'Yaoundé', vehicules:[],          statut:'actif',     kyc:'verifie',  dateInscription:'08 Avr 2024',  type:'particulier' },
]

const INIT_CLIENTS = [
  { id:'cl1', prenom:'Pierre',  nom:'Atangana',  tel:'+237 699 020 020', email:'p.atangana@email.cm',  ville:'Yaoundé', reservations:8,  depenses:'1 240 000', statut:'actif',       kyc:'verifie',  dateInscription:'14 Fév 2024',  type:'particulier' },
  { id:'cl2', prenom:'Sylvie',  nom:'Nkomo',     tel:'+237 677 021 021', email:'s.nkomo@email.cm',     ville:'Douala',  reservations:3,  depenses:'420 000',   statut:'actif',       kyc:'verifie',  dateInscription:'22 Avr 2024',  type:'particulier' },
  { id:'cl3', prenom:'Alain',   nom:'Tchoupo',   tel:'+237 655 022 022', email:'a.tchoupo@gmail.com',  ville:'Yaoundé', reservations:5,  depenses:'760 000',   statut:'actif',       kyc:'verifie',  dateInscription:'01 Sep 2023',  type:'particulier' },
  { id:'cl4', prenom:'Martin',  nom:'Foe',       tel:'+237 699 023 023', email:'m.foe@email.cm',       ville:'Douala',  reservations:1,  depenses:'180 000',   statut:'quarantaine', kyc:'verifie',  dateInscription:'10 Oct 2023',  type:'particulier' },
  { id:'cl5', prenom:'TotalEnergies CM',nom:'',  tel:'+237 222 024 024', email:'fleet@totalenergies.cm',ville:'Yaoundé',reservations:42, depenses:'8 500 000', statut:'actif',       kyc:'verifie',  dateInscription:'02 Jan 2023',  type:'entreprise'  },
  { id:'cl6', prenom:'Josiane', nom:'Nana',      tel:'+237 677 025 025', email:'j.nana@email.cm',      ville:'Bafoussam',reservations:0, depenses:'0',         statut:'en_attente',  kyc:'en_cours', dateInscription:'10 Juin 2025', type:'particulier' },
]

const INIT_PARTENAIRES = [
  { id:'pt1', nom:'Hôtel Hilton Yaoundé',    contact:'reservations@hilton-yde.cm',  type:'Hôtellerie',   statut:'actif',     contrat:'Premium', dateInscription:'01 Jan 2024' },
  { id:'pt2', nom:'TotalEnergies Cameroun',  contact:'fleet@totalenergies.cm',      type:'Corporate',    statut:'actif',     contrat:'Corporate',dateInscription:'15 Mar 2024' },
  { id:'pt3', nom:'Palais des Congrès',      contact:'evenements@pdcy.cm',          type:'Événementiel', statut:'actif',     contrat:'Officiel', dateInscription:'20 Avr 2024' },
  { id:'pt4', nom:'Clinique Générale de Yde',contact:'transport@clinique-yde.cm',   type:'Médical',      statut:'en_attente',contrat:'Médical',  dateInscription:'05 Mai 2025' },
]

const INIT_ADMINS = [
  { id:'a1', prenom:'Jean-Paul', nom:'Ondo',  email:'jp.ondo@luxedrive.cm',  role:'admin',      statut:'actif',    creeLe:'01 Jan 2024', permissions:['chauffeurs','proprietaires','clients','vehicules','finances'] },
  { id:'a2', prenom:'Carine',    nom:'Mfoula',email:'c.mfoula@luxedrive.cm', role:'admin',      statut:'actif',    creeLe:'15 Mar 2024', permissions:['chauffeurs','clients','vehicules'] },
  { id:'a3', prenom:'Super',     nom:'Admin', email:'adminluxedrive@gmail.com', role:'super_admin',statut:'actif', creeLe:'01 Jan 2023', permissions:['*'] },
]

const INIT_VEHICULES = [
  { id:'v1', marque:'Mercedes-Benz', modele:'S 580',   plaque:'LT-001-YA', statut:'disponible', validation:'valide',   proprietaireId:'pr1', chauffeurId:null,  prixJour:'250 000', dateInscription:'04 Mars 2024' },
  { id:'v2', marque:'BMW',           modele:'Series 7', plaque:'LT-002-YA', statut:'en_mission',  validation:'valide',   proprietaireId:'pr1', chauffeurId:'ch1', prixJour:'220 000', dateInscription:'04 Mars 2024' },
  { id:'v3', marque:'Audi',          modele:'A8 L',     plaque:'LT-003-DL', statut:'disponible', validation:'en_attente',proprietaireId:'pr2', chauffeurId:null,  prixJour:'200 000', dateInscription:'21 Mai 2025' },
  { id:'v4', marque:'Rolls-Royce',   modele:'Ghost',    plaque:'LT-004-DL', statut:'en_mission',  validation:'valide',   proprietaireId:'pr3', chauffeurId:'ch4', prixJour:'450 000', dateInscription:'16 Nov 2023' },
  { id:'v5', marque:'Bentley',       modele:'Bentayga', plaque:'LT-005-DL', statut:'maintenance', validation:'valide',   proprietaireId:'pr3', chauffeurId:null,  prixJour:'380 000', dateInscription:'16 Nov 2023' },
]

const INIT_LOGS = [
  { id:'l1', date:'13 Jun 2025 · 14:32', admin:'Super Admin', action:'Validation chauffeur', cible:'David Kameni',   statut:'success' },
  { id:'l2', date:'13 Jun 2025 · 13:15', admin:'Jean-Paul Ondo', action:'Suspension compte', cible:'Paul Essomba',  statut:'success' },
  { id:'l3', date:'12 Jun 2025 · 11:00', admin:'Carine Mfoula', action:'Validation véhicule', cible:'Mercedes S580',statut:'success' },
  { id:'l4', date:'12 Jun 2025 · 09:45', admin:'Super Admin', action:'Création admin',     cible:'Carine Mfoula',   statut:'success' },
  { id:'l5', date:'11 Jun 2025 · 16:20', admin:'Jean-Paul Ondo', action:'Quarantaine client',cible:'Martin Foe',    statut:'success' },
]

const INIT_RESERVATIONS_CHAUFFEUR = [
  {
    id:'rc1', chauffeurId:'C001', chauffeurNom:'David Kameni', clientNom:'Pierre Atangana',
    clientTel:'+237 699 020 020', clientEmail:'p.atangana@email.cm',
    date:'2025-07-05', heure:'09:00', duree:4, typeService:'Protocole / VIP',
    depart:'Aéroport de Nsimalen', destination:'Hôtel Hilton Yaoundé',
    message:'Accueil délégation officielle', statut:'en_attente',
    dateCreation:'29 Jun 2025 · 10:15'
  },
  {
    id:'rc2', chauffeurId:'C002', chauffeurNom:'Alice Nguema', clientNom:'TotalEnergies CM',
    clientTel:'+237 222 024 024', clientEmail:'fleet@totalenergies.cm',
    date:'2025-07-10', heure:'08:00', duree:8, typeService:'Corporate / Mise à disposition',
    depart:'Siège TotalEnergies, Douala', destination:'Multiple arrêts Douala',
    message:'Séminaire annuel DG', statut:'en_attente',
    dateCreation:'28 Jun 2025 · 16:42'
  },
]

const INIT_DEMANDES_ACHAT = [
  {
    id:'da1', vehiculeNom:'Rolls-Royce Ghost', vehiculePrix:'65 000 000 FCFA',
    clientNom:'Martin Essomba', clientTel:'+237 699 100 200', clientEmail:'m.essomba@email.cm',
    offre:'62 000 000 FCFA', message:'Intéressé par un achat immédiat, disponible pour essai.',
    statut:'en_attente', dateCreation:'28 Jun 2025 · 14:30'
  },
]

const INIT_ENGINE_REQUESTS = [
  { id:'er1', vehicleId:'v2', vehicleName:'BMW Series 7 · LT-002-YA', requester:'Marie Mbeki (propriétaire)', reason:'Impayé location 3 mois', date:'13 Jun 2025', statut:'en_attente' },
]

// ── Store ────────────────────────────────────────────────────────────────────

const useAdminStore = create(
  persist(
    (set, get) => ({
      chauffeurs:             INIT_CHAUFFEURS,
      proprietaires:          INIT_PROPRIETAIRES,
      clients:                INIT_CLIENTS,
      partenaires:            INIT_PARTENAIRES,
      admins:                 INIT_ADMINS,
      vehicules:              INIT_VEHICULES,
      logs:                   INIT_LOGS,
      engineRequests:         INIT_ENGINE_REQUESTS,
      reservationsChauffeur:  INIT_RESERVATIONS_CHAUFFEUR,
      demandesAchat:          INIT_DEMANDES_ACHAT,

      // ── Helpers ───────────────────────────────────────────────────────────
      _log: (admin, action, cible, statut = 'success') => {
        const now = new Date()
        const d   = `${now.getDate()} ${['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'][now.getMonth()]} ${now.getFullYear()} · ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
        set(s => ({ logs: [{ id:`l${Date.now()}`, date:d, admin, action, cible, statut }, ...s.logs] }))
      },

      // ── Chauffeurs ────────────────────────────────────────────────────────
      validerChauffeur:  (id, adminName) => set(s => {
        s._log(adminName, 'Validation chauffeur', s.chauffeurs.find(c=>c.id===id)?.prenom+' '+s.chauffeurs.find(c=>c.id===id)?.nom)
        return { chauffeurs: s.chauffeurs.map(c => c.id===id ? { ...c, statut:'actif', kyc:'verifie' } : c) }
      }),
      suspendreCompte: (type, id, adminName) => set(s => {
        const nom = s[type].find(u=>u.id===id)?.nom || ''
        s._log(adminName, 'Suspension compte', nom)
        return { [type]: s[type].map(u => u.id===id ? { ...u, statut:'suspendu' } : u) }
      }),
      reactiver: (type, id, adminName) => set(s => {
        s._log(adminName, 'Réactivation compte', s[type].find(u=>u.id===id)?.nom || '')
        return { [type]: s[type].map(u => u.id===id ? { ...u, statut:'actif' } : u) }
      }),
      supprimerCompte: (type, id, adminName) => set(s => {
        s._log(adminName, 'Suppression compte', s[type].find(u=>u.id===id)?.nom || '')
        return { [type]: s[type].filter(u => u.id !== id) }
      }),
      mettreEnQuarantaine: (id, adminName) => set(s => {
        const u = s.clients.find(c=>c.id===id)
        s._log(adminName, 'Quarantaine client', `${u?.prenom} ${u?.nom}`)
        return { clients: s.clients.map(c => c.id===id ? { ...c, statut:'quarantaine' } : c) }
      }),
      archiverClient: (id, adminName) => set(s => {
        const u = s.clients.find(c=>c.id===id)
        s._log(adminName, 'Archivage client', `${u?.prenom} ${u?.nom}`)
        return { clients: s.clients.map(c => c.id===id ? { ...c, statut:'archive' } : c) }
      }),

      // ── Véhicules ─────────────────────────────────────────────────────────
      validerVehicule: (id, adminName) => set(s => {
        const v = s.vehicules.find(v=>v.id===id)
        s._log(adminName, 'Validation véhicule', `${v?.marque} ${v?.modele}`)
        return { vehicules: s.vehicules.map(v => v.id===id ? { ...v, validation:'valide' } : v) }
      }),
      refuserVehicule: (id, adminName) => set(s => {
        const v = s.vehicules.find(v=>v.id===id)
        s._log(adminName, 'Refus véhicule', `${v?.marque} ${v?.modele}`)
        return { vehicules: s.vehicules.map(v => v.id===id ? { ...v, validation:'refuse' } : v) }
      }),

      // ── Assignation chauffeur (admin only) ────────────────────────────────
      assignerChauffeur: (vehiculeId, chauffeurId, adminName) => set(s => {
        const v  = s.vehicules.find(v=>v.id===vehiculeId)
        const ch = s.chauffeurs.find(c=>c.id===chauffeurId)
        s._log(adminName, 'Assignation chauffeur', `${ch?.prenom} ${ch?.nom} → ${v?.marque} ${v?.modele}`)
        return {
          vehicules:  s.vehicules.map(v  => v.id===vehiculeId  ? { ...v,  chauffeurId }          : v),
          chauffeurs: s.chauffeurs.map(c => c.id===chauffeurId  ? { ...c,  vehiculeAssigne:vehiculeId } : c),
        }
      }),
      desassignerChauffeur: (vehiculeId, adminName) => set(s => {
        const v = s.vehicules.find(v=>v.id===vehiculeId)
        s._log(adminName, 'Désassignation chauffeur', `${v?.marque} ${v?.modele}`)
        const oldChId = v?.chauffeurId
        return {
          vehicules:  s.vehicules.map(v  => v.id===vehiculeId ? { ...v,  chauffeurId:null }        : v),
          chauffeurs: s.chauffeurs.map(c => c.id===oldChId    ? { ...c,  vehiculeAssigne:null }     : c),
        }
      }),

      // ── Engine cut (super_admin only) ─────────────────────────────────────
      approuverCoupureMoteur: (requestId, adminName) => set(s => {
        const req = s.engineRequests.find(r=>r.id===requestId)
        s._log(adminName, 'Coupure moteur approuvée', req?.vehicleName || '')
        return {
          engineRequests: s.engineRequests.map(r => r.id===requestId ? { ...r, statut:'approuve' } : r),
          vehicules: s.vehicules.map(v => v.id===req?.vehicleId ? { ...v, statut:'bloque' } : v),
        }
      }),
      refuserCoupureMoteur: (requestId, adminName) => set(s => {
        const req = s.engineRequests.find(r=>r.id===requestId)
        s._log(adminName, 'Coupure moteur refusée', req?.vehicleName || '')
        return { engineRequests: s.engineRequests.map(r => r.id===requestId ? { ...r, statut:'refuse' } : r) }
      }),
      demanderCoupureMoteur: (vehiculeId, reason, adminName) => set(s => {
        const v = s.vehicules.find(v=>v.id===vehiculeId)
        const req = { id:`er${Date.now()}`, vehicleId:vehiculeId, vehicleName:`${v?.marque} ${v?.modele} · ${v?.plaque}`, requester:`${adminName} (admin)`, reason, date: new Date().toLocaleDateString('fr'), statut:'en_attente' }
        s._log(adminName, 'Demande coupure moteur', `${v?.marque} ${v?.modele}`)
        return { engineRequests: [...s.engineRequests, req] }
      }),

      // ── Admins (super_admin only) ─────────────────────────────────────────
      creerAdmin: (data, superAdminName) => set(s => {
        const newAdmin = { id:`a${Date.now()}`, ...data, role:'admin', statut:'actif', creeLe: new Date().toLocaleDateString('fr') }
        s._log(superAdminName, 'Création administrateur', `${data.prenom} ${data.nom}`)
        return { admins: [...s.admins, newAdmin] }
      }),
      suspendreAdmin: (id, superAdminName) => set(s => {
        const a = s.admins.find(a=>a.id===id)
        s._log(superAdminName, 'Suspension admin', `${a?.prenom} ${a?.nom}`)
        return { admins: s.admins.map(a => a.id===id ? { ...a, statut:'suspendu' } : a) }
      }),
      supprimerAdmin: (id, superAdminName) => set(s => {
        const a = s.admins.find(a=>a.id===id)
        s._log(superAdminName, 'Suppression admin', `${a?.prenom} ${a?.nom}`)
        return { admins: s.admins.filter(a => a.id !== id) }
      }),

      // ── Propriétaires ─────────────────────────────────────────────────────
      validerProprietaire: (id, adminName) => set(s => {
        const pr = s.proprietaires.find(p=>p.id===id)
        s._log(adminName, 'Validation propriétaire', `${pr?.prenom} ${pr?.nom}`)
        return { proprietaires: s.proprietaires.map(p => p.id===id ? { ...p, statut:'actif', kyc:'verifie' } : p) }
      }),

      // ── Réservations chauffeur ────────────────────────────────────────────
      soumettreReservationChauffeur: (data) => set(s => {
        const r = { id:`rc${Date.now()}`, ...data, statut:'en_attente', dateCreation: (() => { const n=new Date(); return `${n.getDate()} ${['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'][n.getMonth()]} ${n.getFullYear()} · ${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}` })() }
        return { reservationsChauffeur: [...s.reservationsChauffeur, r] }
      }),
      validerReservation: (id, adminName) => set(s => {
        const r = s.reservationsChauffeur.find(r=>r.id===id)
        s._log(adminName, 'Validation réservation chauffeur', `${r?.clientNom} — ${r?.chauffeurNom}`)
        return { reservationsChauffeur: s.reservationsChauffeur.map(r => r.id===id ? { ...r, statut:'valide' } : r) }
      }),
      refuserReservation: (id, adminName) => set(s => {
        const r = s.reservationsChauffeur.find(r=>r.id===id)
        s._log(adminName, 'Refus réservation chauffeur', `${r?.clientNom} — ${r?.chauffeurNom}`)
        return { reservationsChauffeur: s.reservationsChauffeur.map(r => r.id===id ? { ...r, statut:'refuse' } : r) }
      }),

      // ── Demandes achat ────────────────────────────────────────────────────
      soumettreDemandeAchat: (data) => set(s => {
        const d = { id:`da${Date.now()}`, ...data, statut:'en_attente', dateCreation: (() => { const n=new Date(); return `${n.getDate()} ${['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'][n.getMonth()]} ${n.getFullYear()} · ${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}` })() }
        return { demandesAchat: [...s.demandesAchat, d] }
      }),
      validerDemandeAchat: (id, adminName) => set(s => {
        const d = s.demandesAchat.find(d=>d.id===id)
        s._log(adminName, 'Validation demande achat', `${d?.clientNom} — ${d?.vehiculeNom}`)
        return { demandesAchat: s.demandesAchat.map(d => d.id===id ? { ...d, statut:'valide' } : d) }
      }),
      refuserDemandeAchat: (id, adminName) => set(s => {
        const d = s.demandesAchat.find(d=>d.id===id)
        s._log(adminName, 'Refus demande achat', `${d?.clientNom} — ${d?.vehiculeNom}`)
        return { demandesAchat: s.demandesAchat.map(d => d.id===id ? { ...d, statut:'refuse' } : d) }
      }),
    }),
    {
      name: 'luxe-drive-admin',
      partialize: (s) => ({
        chauffeurs: s.chauffeurs, proprietaires: s.proprietaires, clients: s.clients,
        vehicules: s.vehicules, admins: s.admins, logs: s.logs, engineRequests: s.engineRequests,
        partenaires: s.partenaires, reservationsChauffeur: s.reservationsChauffeur,
        demandesAchat: s.demandesAchat,
      }),
    }
  )
)

export default useAdminStore
