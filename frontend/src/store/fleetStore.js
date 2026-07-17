import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Catalogue chauffeurs ────────────────────────────────────────────────────
export const CATALOGUE_CHAUFFEURS = [
  {
    id: 'c1', prenom: 'David', nom: 'Kameni', ville: 'Yaoundé',
    tel: '+237 699 001 001', note: 4.9, missions: 312,
    disponibilite: 'disponible', // disponible | en_course | indisponible
    langues: ['Français', 'Anglais'], permis: 'B+',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    planning: [
      { jour: 'Lun', debut: null, fin: null },
      { jour: 'Mar', debut: '09:00', fin: '17:00' },
      { jour: 'Mer', debut: '09:00', fin: '17:00' },
      { jour: 'Jeu', debut: null, fin: null },
      { jour: 'Ven', debut: '08:00', fin: '20:00' },
      { jour: 'Sam', debut: '08:00', fin: '14:00' },
      { jour: 'Dim', debut: null, fin: null },
    ],
    vehiculeAssigne: null,
    bio: 'Chauffeur VIP confirmé. 5 ans d\'expérience protocole diplomatique et événementiel haut de gamme.',
  },
  {
    id: 'c2', prenom: 'Alice', nom: 'Nguema', ville: 'Douala',
    tel: '+237 677 002 002', note: 4.8, missions: 248,
    disponibilite: 'disponible',
    langues: ['Français', 'Anglais', 'Bassa'],  permis: 'B+',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    planning: [
      { jour: 'Lun', debut: '07:00', fin: '19:00' },
      { jour: 'Mar', debut: '07:00', fin: '19:00' },
      { jour: 'Mer', debut: null, fin: null },
      { jour: 'Jeu', debut: '07:00', fin: '19:00' },
      { jour: 'Ven', debut: '07:00', fin: '19:00' },
      { jour: 'Sam', debut: '09:00', fin: '15:00' },
      { jour: 'Dim', debut: null, fin: null },
    ],
    vehiculeAssigne: null,
    bio: 'Spécialisée transferts aéroport et événements corporate. Ponctualité et discrétion garanties.',
  },
  {
    id: 'c3', prenom: 'Paul', nom: 'Biya Nkodo', ville: 'Yaoundé',
    tel: '+237 655 003 003', note: 4.7, missions: 189,
    disponibilite: 'en_course',
    langues: ['Français', 'Ewondo'], permis: 'B',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    planning: [
      { jour: 'Lun', debut: '08:00', fin: '20:00' },
      { jour: 'Mar', debut: '08:00', fin: '20:00' },
      { jour: 'Mer', debut: '08:00', fin: '20:00' },
      { jour: 'Jeu', debut: null, fin: null },
      { jour: 'Ven', debut: '08:00', fin: '20:00' },
      { jour: 'Sam', debut: null, fin: null },
      { jour: 'Dim', debut: null, fin: null },
    ],
    vehiculeAssigne: 'f4', // Audi A8 already assigned
    bio: 'Expert conduite diplomatique et sécurisée. Formation conduite défensive certifiée.',
  },
  {
    id: 'c4', prenom: 'Carine', nom: 'Essama', ville: 'Yaoundé',
    tel: '+237 688 004 004', note: 4.9, missions: 421,
    disponibilite: 'disponible',
    langues: ['Français', 'Anglais', 'Fulfulde'], permis: 'B+',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    planning: [
      { jour: 'Lun', debut: '06:00', fin: '22:00' },
      { jour: 'Mar', debut: '06:00', fin: '22:00' },
      { jour: 'Mer', debut: '06:00', fin: '22:00' },
      { jour: 'Jeu', debut: '06:00', fin: '22:00' },
      { jour: 'Ven', debut: '06:00', fin: '22:00' },
      { jour: 'Sam', debut: '08:00', fin: '18:00' },
      { jour: 'Dim', debut: '10:00', fin: '16:00' },
    ],
    vehiculeAssigne: null,
    bio: 'Meilleure note de la plateforme. Disponible 7j/7. Trilingue, dress code irréprochable.',
  },
  {
    id: 'c5', prenom: 'Jean-Marc', nom: 'Eyenga', ville: 'Yaoundé',
    tel: '+237 671 005 005', note: 4.6, missions: 167,
    disponibilite: 'disponible',
    langues: ['Français'], permis: 'B',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    planning: [
      { jour: 'Lun', debut: '09:00', fin: '18:00' },
      { jour: 'Mar', debut: null, fin: null },
      { jour: 'Mer', debut: '09:00', fin: '18:00' },
      { jour: 'Jeu', debut: '09:00', fin: '18:00' },
      { jour: 'Ven', debut: '09:00', fin: '18:00' },
      { jour: 'Sam', debut: '10:00', fin: '16:00' },
      { jour: 'Dim', debut: null, fin: null },
    ],
    vehiculeAssigne: null,
    bio: 'Spécialisé transport médical et déplacements longue distance inter-villes.',
  },
  {
    id: 'c6', prenom: 'Christelle', nom: 'Ondo', ville: 'Douala',
    tel: '+237 692 006 006', note: 4.8, missions: 289,
    disponibilite: 'indisponible',
    langues: ['Français', 'Anglais'], permis: 'B+',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    planning: [
      { jour: 'Lun', debut: null, fin: null },
      { jour: 'Mar', debut: null, fin: null },
      { jour: 'Mer', debut: null, fin: null },
      { jour: 'Jeu', debut: null, fin: null },
      { jour: 'Ven', debut: null, fin: null },
      { jour: 'Sam', debut: null, fin: null },
      { jour: 'Dim', debut: null, fin: null },
    ],
    vehiculeAssigne: null,
    bio: 'En congé jusqu\'au 20 juin. Disponible pour réservations futures.',
  },
]

// ── Mock courses (rides) ─────────────────────────────────────────────────────
const INITIAL_COURSES = [
  {
    id: 'cr1', ref: 'MIS-2025-0447',
    vehiculeId: 'f1', vehiculeNom: 'Mercedes-Benz Classe S 580', plaque: 'LT-1234-YA',
    vehiculeImage: 'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=400&q=80',
    chauffeurId: null, // pas encore acceptée
    client: 'M. Fouda Serge', telephone: '+237 699 887 766',
    type: 'Transfert Aéroport',
    depart: 'Hôtel Pullman, Yaoundé', arrivee: 'Aéroport Nsimalen',
    date: '13 Juin 2025', heure: '10:00',
    montant: '25 000', km: 28, duree: '35 min',
    statut: 'disponible', // disponible | acceptee | en_cours | terminee
  },
  {
    id: 'cr2', ref: 'MIS-2025-0448',
    vehiculeId: 'f2', vehiculeNom: 'Range Rover Autobiography', plaque: 'LT-5678-DL',
    vehiculeImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=80',
    chauffeurId: null,
    client: 'Ambassade du Canada', telephone: '+237 222 293 800',
    type: 'Protocole officiel',
    depart: 'Ambassade du Canada, Bastos', arrivee: 'Ministère des Affaires Étrangères',
    date: "Aujourd'hui", heure: '11:30',
    montant: '80 000', km: 12, duree: '2h',
    statut: 'disponible',
  },
  {
    id: 'cr3', ref: 'MIS-2025-0445',
    vehiculeId: 'f1', vehiculeNom: 'Mercedes-Benz Classe S 580', plaque: 'LT-1234-YA',
    vehiculeImage: 'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=400&q=80',
    chauffeurId: 'c1',
    client: 'M. Christophe Ondoua', telephone: '+237 677 123 456',
    type: 'Transfert Aéroport',
    depart: 'Hôtel Hilton, Yaoundé', arrivee: 'Aéroport Nsimalen',
    date: "Aujourd'hui", heure: '14:30',
    montant: '25 000', km: 28, duree: '35 min',
    statut: 'acceptee',
  },
]

// ── Initial assignments ──────────────────────────────────────────────────────
const INITIAL_ASSIGNMENTS = [
  { vehiculeId: 'f4', chauffeurId: 'c3', dateAssignation: '10 Juin 2025' },
]

// ── Store ────────────────────────────────────────────────────────────────────
const useFleetStore = create(
  persist(
    (set, get) => ({
      chauffeurs:  CATALOGUE_CHAUFFEURS,
      assignments: INITIAL_ASSIGNMENTS,
      courses:     INITIAL_COURSES,
      // Véhicules enregistrés via le formulaire (liés à un ownerId)
      vehiculesInscrits: [], // [{ id, ownerId, statut:'en_attente'|'actif'|'rejete', ...formData }]

      // ── Propriétaire: inscrire un nouveau véhicule ─────────────────────────
      addVehicule: (vehiculeData) => {
        const id = `v_${Date.now()}`
        const ref = `VEH-${Date.now().toString().slice(-6)}`
        set(state => ({
          vehiculesInscrits: [
            ...state.vehiculesInscrits,
            { ...vehiculeData, id, ref, statut: 'en_attente', dateInscription: new Date().toLocaleDateString('fr-FR') },
          ],
        }))
        return ref
      },

      // Véhicules d'un propriétaire donné
      getVehiculesOwner: (ownerId) =>
        get().vehiculesInscrits.filter(v => v.ownerId === ownerId),

      // ── Owner: assign one or multiple vehicles to a chauffeur ──────────────
      assignerChauffeur: (vehiculeIds, chauffeurId) => {
        set(state => {
          const now = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
          // Remove any existing assignments for these vehicles
          const kept = state.assignments.filter(a => !vehiculeIds.includes(a.vehiculeId))
          const newOnes = vehiculeIds.map(vid => ({ vehiculeId: vid, chauffeurId, dateAssignation: now }))
          // Update chauffeur record
          const chauffeurs = state.chauffeurs.map(c => {
            if (c.id === chauffeurId) return { ...c, vehiculeAssigne: vehiculeIds[0] }
            // If this chauffeur was assigned to one of those vehicles before, clear it
            if (vehiculeIds.includes(c.vehiculeAssigne)) return { ...c, vehiculeAssigne: null }
            return c
          })
          return { assignments: [...kept, ...newOnes], chauffeurs }
        })
      },

      // ── Owner: remove assignment ────────────────────────────────────────────
      deassignerChauffeur: (vehiculeId) => {
        set(state => {
          const removed = state.assignments.find(a => a.vehiculeId === vehiculeId)
          const chauffeurs = removed
            ? state.chauffeurs.map(c =>
                c.id === removed.chauffeurId ? { ...c, vehiculeAssigne: null } : c
              )
            : state.chauffeurs
          return {
            assignments: state.assignments.filter(a => a.vehiculeId !== vehiculeId),
            chauffeurs,
          }
        })
      },

      // ── Driver: accept (take) a course ─────────────────────────────────────
      accepterCourse: (courseId, chauffeurId) => {
        set(state => ({
          courses: state.courses.map(c =>
            c.id === courseId ? { ...c, chauffeurId, statut: 'acceptee' } : c
          ),
          chauffeurs: state.chauffeurs.map(ch =>
            ch.id === chauffeurId ? { ...ch, disponibilite: 'en_course' } : ch
          ),
        }))
      },

      // ── Driver: start driving ──────────────────────────────────────────────
      demarrerCourse: (courseId) => {
        set(state => ({
          courses: state.courses.map(c =>
            c.id === courseId ? { ...c, statut: 'en_cours' } : c
          ),
        }))
      },

      // ── Driver: finish course → free planning ──────────────────────────────
      terminerCourse: (courseId, chauffeurId) => {
        set(state => ({
          courses: state.courses.map(c =>
            c.id === courseId ? { ...c, statut: 'terminee' } : c
          ),
          // Free chauffeur only if no other active course
          chauffeurs: state.chauffeurs.map(ch => {
            if (ch.id !== chauffeurId) return ch
            const stillActive = state.courses.some(
              c => c.id !== courseId && c.chauffeurId === chauffeurId &&
                   ['acceptee', 'en_cours'].includes(c.statut)
            )
            return { ...ch, disponibilite: stillActive ? 'en_course' : 'disponible' }
          }),
        }))
      },

      // ── Helpers ────────────────────────────────────────────────────────────
      getAssignment: (vehiculeId) => {
        const a = get().assignments.find(a => a.vehiculeId === vehiculeId)
        if (!a) return null
        return { ...a, chauffeur: get().chauffeurs.find(c => c.id === a.chauffeurId) }
      },

      getChauffeur: (chauffeurId) =>
        get().chauffeurs.find(c => c.id === chauffeurId),

      // Courses visible to a specific chauffeur:
      // - Courses for vehicles they are assigned to, still available
      // - Or courses they've already accepted/started
      getCoursesForChauffeur: (chauffeurId) => {
        const state = get()
        const assignedVehicles = state.assignments
          .filter(a => a.chauffeurId === chauffeurId)
          .map(a => a.vehiculeId)

        return state.courses.filter(c =>
          (assignedVehicles.includes(c.vehiculeId) && c.statut === 'disponible') ||
          (c.chauffeurId === chauffeurId && ['acceptee', 'en_cours'].includes(c.statut))
        )
      },

      getActiveCourse: (chauffeurId) =>
        get().courses.find(c =>
          c.chauffeurId === chauffeurId && ['acceptee', 'en_cours'].includes(c.statut)
        ),
    }),
    {
      name: 'luxe-drive-fleet',
      partialize: (state) => ({
        assignments:       state.assignments,
        courses:           state.courses,
        chauffeurs:        state.chauffeurs,
        vehiculesInscrits: state.vehiculesInscrits,
      }),
    }
  )
)

export default useFleetStore
