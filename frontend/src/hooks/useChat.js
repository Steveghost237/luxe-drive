import { useState, useEffect, useCallback } from 'react'

const POLL = 3000

export default function useChat(canal) {
  const [messages, setMessages] = useState([])

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(`/api/messages?canal=${encodeURIComponent(canal)}&limit=150`)
      if (r.ok) setMessages(await r.json())
    } catch (_) {}
  }, [canal])

  useEffect(() => {
    refresh()
    const t = setInterval(refresh, POLL)
    return () => clearInterval(t)
  }, [refresh])

  return { messages, refresh }
}
