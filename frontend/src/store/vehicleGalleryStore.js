import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LOCATION_VEHICLES } from '../data/catalogData'

const buildInitialGalleries = () => {
  const g = {}
  LOCATION_VEHICLES.forEach(v => {
    g[v.id] = {
      images:      [...(v.images || [])],
      description: v.description || '',
      features:    [...(v.features || [])],
      couleur:     v.couleur || '',
      puissance:   v.puissance || '',
      transmission:v.transmission || '',
      carburant:   v.carburant || '',
      places:      v.places || '',
    }
  })
  return g
}

const useVehicleGalleryStore = create(
  persist(
    (set, get) => ({
      galleries: buildInitialGalleries(),

      getGallery: (vehicleId) => {
        const g = get().galleries[vehicleId]
        if (g) return g
        const v = LOCATION_VEHICLES.find(x => x.id === vehicleId)
        return v ? {
          images: [...(v.images || [])], description: v.description || '',
          features: [...(v.features || [])], couleur: v.couleur || '',
          puissance: v.puissance || '', transmission: v.transmission || '',
          carburant: v.carburant || '', places: v.places || '',
        } : { images: [], description: '', features: [] }
      },

      addImage: (vehicleId, url) => set(s => {
        const cur = s.galleries[vehicleId] || { images: [], description: '', features: [] }
        return { galleries: { ...s.galleries, [vehicleId]: { ...cur, images: [...cur.images, url] } } }
      }),

      removeImage: (vehicleId, idx) => set(s => {
        const cur = s.galleries[vehicleId] || { images: [] }
        const imgs = [...cur.images]
        imgs.splice(idx, 1)
        return { galleries: { ...s.galleries, [vehicleId]: { ...cur, images: imgs } } }
      }),

      setMainImage: (vehicleId, idx) => set(s => {
        const cur = s.galleries[vehicleId] || { images: [] }
        const imgs = [...cur.images]
        const [main] = imgs.splice(idx, 1)
        imgs.unshift(main)
        return { galleries: { ...s.galleries, [vehicleId]: { ...cur, images: imgs } } }
      }),

      updateMeta: (vehicleId, patch) => set(s => ({
        galleries: {
          ...s.galleries,
          [vehicleId]: { ...(s.galleries[vehicleId] || {}), ...patch }
        }
      })),

      initVehicle: (vehicleId, data) => set(s => ({
        galleries: {
          ...s.galleries,
          [vehicleId]: {
            images: [], description: '', features: [], ...data,
            ...(s.galleries[vehicleId] || {})
          }
        }
      })),
    }),
    { name: 'luxe-drive-gallery' }
  )
)

export default useVehicleGalleryStore
