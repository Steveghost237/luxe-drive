import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, token, refreshToken) =>
        set({ user, token, refreshToken, isAuthenticated: true }),

      adminLogin: async (email, password) => {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifiant: email, mot_de_passe: password }),
          })
          if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            return { success: false, message: err.detail || 'Identifiants incorrects' }
          }
          const data = await res.json()
          const user = data.utilisateur
          if (!['admin', 'super_admin'].includes(user?.role)) {
            return { success: false, message: 'Accès refusé — compte non administrateur' }
          }
          set({ user, token: data.access_token, refreshToken: data.refresh_token, isAuthenticated: true })
          return { success: true, role: user.role }
        } catch (e) {
          return { success: false, message: 'Erreur réseau — vérifiez votre connexion' }
        }
      },

      logout: () =>
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false }),

      updateUser: (userData) =>
        set((state) => ({ user: { ...state.user, ...userData } })),

      setToken: (token) => set({ token }),
    }),
    { name: 'luxe-drive-auth' }
  )
)

export default useAuthStore
