import { create } from 'zustand'

const useBookingStore = create((set, get) => ({
  selectedVehicle: null,
  bookingType: null,
  dateDebut: null,
  dateFin: null,
  selectedOptions: [],

  setVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  setBookingType: (type) => set({ bookingType: type }),
  setDates: (debut, fin) => set({ dateDebut: debut, dateFin: fin }),

  toggleOption: (option) =>
    set((state) => {
      const exists = state.selectedOptions.find((o) => o.id === option.id)
      return {
        selectedOptions: exists
          ? state.selectedOptions.filter((o) => o.id !== option.id)
          : [...state.selectedOptions, option],
      }
    }),

  getTotalOptions: () =>
    get().selectedOptions.reduce((sum, o) => sum + (o.prix_supplementaire || 0), 0),

  reset: () =>
    set({
      selectedVehicle: null,
      bookingType: null,
      dateDebut: null,
      dateFin: null,
      selectedOptions: [],
    }),
}))

export default useBookingStore
