/**
 * useAdminData — Fetches live data from the backend database every 10 s.
 * Replaces the stale Zustand mock store for admin views.
 */
import { useState, useEffect, useCallback, useRef } from 'react'

const BASE = '/api/admin'
const POLL = 10_000  // 10 seconds

async function apiFetch(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

// ── Clear stale Zustand mock data once ───────────────────────────────────────
function clearStaleMock() {
  try {
    const KEY = 'luxe-drive-admin'
    if (localStorage.getItem(KEY)) {
      localStorage.removeItem(KEY)
      console.info('[admin] Cleared stale mock data from localStorage')
    }
  } catch (_) {}
}

// ── Main hook ─────────────────────────────────────────────────────────────────
export function useAdminData() {
  const [stats,        setStats]        = useState(null)
  const [utilisateurs, setUtilisateurs] = useState([])
  const [reservations, setReservations] = useState([])
  const [chauffeurs,   setChauffeurs]   = useState([])
  const [vehicules,    setVehicules]    = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [lastRefresh,  setLastRefresh]  = useState(null)
  const timerRef = useRef(null)

  const fetchAll = useCallback(async () => {
    try {
      const [s, u, r, c, v] = await Promise.all([
        apiFetch('/stats'),
        apiFetch('/utilisateurs?limit=200'),
        apiFetch('/reservations?limit=200'),
        apiFetch('/chauffeurs'),
        apiFetch('/vehicules'),
      ])
      setStats(s)
      setUtilisateurs(u)
      setReservations(r)
      setChauffeurs(c)
      setVehicules(v)
      setError(null)
      setLastRefresh(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    clearStaleMock()
    fetchAll()
    timerRef.current = setInterval(fetchAll, POLL)
    return () => clearInterval(timerRef.current)
  }, [fetchAll])

  // ── Actions ────────────────────────────────────────────────────────────────

  const updateUserStatut = useCallback(async (userId, est_actif) => {
    await apiFetch(`/utilisateurs/${userId}/statut`, {
      method: 'PATCH',
      body: JSON.stringify({ est_actif }),
    })
    await fetchAll()
  }, [fetchAll])

  const updateUserRole = useCallback(async (userId, role) => {
    await apiFetch(`/utilisateurs/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    })
    await fetchAll()
  }, [fetchAll])

  const deleteUser = useCallback(async (userId) => {
    await apiFetch(`/utilisateurs/${userId}`, { method: 'DELETE' })
    await fetchAll()
  }, [fetchAll])

  const updateReservationStatut = useCallback(async (resaId, statut) => {
    await apiFetch(`/reservations/${resaId}/statut`, {
      method: 'PATCH',
      body: JSON.stringify({ statut }),
    })
    await fetchAll()
  }, [fetchAll])

  return {
    stats, utilisateurs, reservations, chauffeurs, vehicules,
    loading, error, lastRefresh,
    refresh: fetchAll,
    updateUserStatut,
    updateUserRole,
    deleteUser,
    updateReservationStatut,
  }
}

// ── Specialized hooks ─────────────────────────────────────────────────────────

export function useAdminStats() {
  const [stats,       setStats]       = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [lastRefresh, setLastRefresh] = useState(null)

  const fetch = useCallback(async () => {
    try {
      const s = await apiFetch('/stats')
      setStats(s)
      setLastRefresh(new Date())
    } catch (_) {}
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch()
    const t = setInterval(fetch, POLL)
    return () => clearInterval(t)
  }, [fetch])

  return { stats, loading, lastRefresh, refresh: fetch }
}

export function useConnectedUsers() {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try { setData(await apiFetch('/connected')) } catch (_) {}
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch()
    const t = setInterval(fetch, 5_000)
    return () => clearInterval(t)
  }, [fetch])

  return { data, loading, refresh: fetch }
}

export function useChauffeurLocations() {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try { setData(await apiFetch('/chauffeurs/locations')) } catch (_) {}
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch()
    const t = setInterval(fetch, 5_000)
    return () => clearInterval(t)
  }, [fetch])

  return { data, loading, refresh: fetch }
}

export function useAdminMissionsLive() {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try { setData(await apiFetch('/reservations?limit=50')) } catch (_) {}
    setLoading(false)
  }, [])

  useEffect(() => {
    fetch()
    const t = setInterval(fetch, 5_000)
    return () => clearInterval(t)
  }, [fetch])

  return { data, loading, refresh: fetch }
}

export function useAdminUtilisateurs(roleFilter, search) {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      let url = '/utilisateurs?limit=200'
      if (roleFilter && roleFilter !== 'tous') url += `&role=${roleFilter}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      const u = await apiFetch(url)
      setData(u)
    } catch (_) {}
    setLoading(false)
  }, [roleFilter, search])

  useEffect(() => {
    fetch()
    const t = setInterval(fetch, POLL)
    return () => clearInterval(t)
  }, [fetch])

  return { data, loading, refresh: fetch }
}

export function useAdminReservations(statutFilter) {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      let url = '/reservations?limit=200'
      if (statutFilter && statutFilter !== 'tous') url += `&statut=${statutFilter}`
      const r = await apiFetch(url)
      setData(r)
    } catch (_) {}
    setLoading(false)
  }, [statutFilter])

  useEffect(() => {
    fetch()
    const t = setInterval(fetch, POLL)
    return () => clearInterval(t)
  }, [fetch])

  return { data, loading, refresh: fetch }
}
