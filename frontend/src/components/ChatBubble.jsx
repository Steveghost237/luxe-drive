import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, MessageSquare, Minus } from 'lucide-react'
import useAuthStore from '../store/authStore'
import useChat from '../hooks/useChat'

const ROLE_STYLE = {
  super_admin: { bg: 'bg-red-500/15 text-red-300 border-red-500/25',    dot: 'bg-red-400',    label: 'Super Admin' },
  admin:       { bg: 'bg-gold-500/15 text-gold-300 border-gold-500/25', dot: 'bg-gold-400',   label: 'Admin'       },
  chauffeur:   { bg: 'bg-blue-500/15 text-blue-300 border-blue-500/25', dot: 'bg-blue-400',   label: 'Chauffeur'   },
  client:      { bg: 'bg-gray-700 text-gray-300 border-gray-600',       dot: 'bg-gray-400',   label: 'Client'      },
}

function useDrag(initialPos) {
  const [pos, setPos] = useState(initialPos)
  const dragging = useRef(false)
  const origin   = useRef({ x: 0, y: 0 })
  const moved    = useRef(false)

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return
      moved.current = true
      const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0
      const cy = e.clientY ?? e.touches?.[0]?.clientY ?? 0
      setPos({ x: cx - origin.current.x, y: cy - origin.current.y })
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  const onDown = useCallback((e) => {
    dragging.current = true
    moved.current = false
    const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    const cy = e.clientY ?? e.touches?.[0]?.clientY ?? 0
    origin.current = { x: cx - pos.x, y: cy - pos.y }
    e.preventDefault()
  }, [pos])

  return { pos, onDown, wasMoved: () => moved.current }
}

export default function ChatBubble({ canal, label, allowedRoles }) {
  const user = useAuthStore(s => s.user)
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [unread, setUnread] = useState(0)
  const prevCount = useRef(0)

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800

  const bubble = useDrag({ x: 24, y: vh - 88 })
  const panel  = useDrag({ x: 24, y: vh - 500 })

  const { messages, refresh } = useChat(canal)
  const endRef = useRef(null)

  useEffect(() => {
    if (open && !minimized) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
      setUnread(0)
      prevCount.current = messages.length
    } else if (messages.length > prevCount.current) {
      setUnread(messages.length - prevCount.current)
    }
  }, [messages, open, minimized])

  const handleSend = async () => {
    if (!input.trim() || !user) return
    setSending(true)
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canal,
          sender_id: user.id || 'unknown',
          sender_name: `${user.prenom || ''} ${user.nom || ''}`.trim() || user.telephone || 'Utilisateur',
          sender_role: user.role || 'client',
          contenu: input.trim(),
        }),
      })
      setInput('')
      await refresh()
    } finally {
      setSending(false) }
  }

  const handleBubbleClick = () => {
    if (bubble.wasMoved()) return
    if (open) setOpen(false)
    else { setOpen(true); setMinimized(false); setUnread(0) }
  }

  const fmtTime = (iso) => {
    try { return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) }
    catch { return '' }
  }

  return (
    <>
      {/* ── Floating bubble ───────────────────────────────────────── */}
      <div
        style={{ position: 'fixed', left: bubble.pos.x, top: bubble.pos.y, zIndex: 9999 }}
        onMouseDown={bubble.onDown}
        onClick={handleBubbleClick}
        className="cursor-grab active:cursor-grabbing select-none"
      >
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-xl shadow-yellow-500/30 border-2 border-yellow-300/40 hover:scale-105 transition-transform">
          <div className="flex flex-col items-center gap-0.5">
            <MessageSquare size={18} className="text-black fill-black/20" />
            <span className="text-black text-[8px] font-black tracking-wider leading-none">LD</span>
          </div>
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full border-2 border-yellow-400/50 animate-ping opacity-40 pointer-events-none" />
        </div>
        {unread > 0 && !open && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 shadow-lg z-10">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </div>

      {/* ── Chat panel ────────────────────────────────────────────── */}
      {open && (
        <div
          style={{ position: 'fixed', left: panel.pos.x, top: panel.pos.y, zIndex: 9998, width: 360 }}
          className="flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-700/80 bg-gray-950"
        >
          {/* Header — drag handle */}
          <div
            className="flex items-center justify-between px-3.5 py-3 bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800 border-b border-gray-700/60 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={panel.onDown}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shrink-0">
                <span className="text-black text-[9px] font-black">LD</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">Luxe Drive</p>
                <p className="text-yellow-400 text-[10px] leading-tight">{label}</p>
              </div>
            </div>
            <div className="flex items-center gap-1" onMouseDown={e => e.stopPropagation()}>
              <button onClick={() => setMinimized(m => !m)}
                className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-500 hover:text-gray-300 transition-all" title={minimized ? 'Agrandir' : 'Réduire'}>
                <Minus size={13} />
              </button>
              <button onClick={() => setOpen(false)}
                className="p-1.5 hover:bg-red-500/15 rounded-lg text-gray-500 hover:text-red-400 transition-all" title="Fermer">
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Body */}
          {!minimized && (
            <>
              {/* Messages */}
              <div className="h-72 overflow-y-auto p-3 space-y-3 bg-gray-950/80 scrollbar-thin">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-600">
                    <MessageSquare size={28} className="opacity-30" />
                    <p className="text-xs text-center">Aucun message.<br />Démarrez la conversation.</p>
                  </div>
                )}
                {messages.map(m => {
                  const isMine = m.sender_id === user?.id
                  const rs = ROLE_STYLE[m.sender_role] || ROLE_STYLE.client
                  return (
                    <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[82%] flex flex-col gap-0.5 ${isMine ? 'items-end' : 'items-start'}`}>
                        {!isMine && (
                          <div className="flex items-center gap-1.5 px-0.5">
                            <span className="text-white text-[11px] font-semibold">{m.sender_name}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold ${rs.bg}`}>{rs.label}</span>
                          </div>
                        )}
                        <div className={`px-3 py-1.5 rounded-2xl text-[13px] leading-snug ${isMine ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-black rounded-tr-sm font-medium' : 'bg-gray-800 text-gray-100 rounded-tl-sm'}`}>
                          {m.contenu}
                        </div>
                        <span className="text-gray-600 text-[10px] px-0.5">{fmtTime(m.created_at)}</span>
                      </div>
                    </div>
                  )
                })}
                <div ref={endRef} />
              </div>

              {/* Input */}
              <div className="p-2.5 border-t border-gray-800 bg-gray-900/80" onMouseDown={e => e.stopPropagation()}>
                <div className="flex gap-2 items-center">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                    placeholder="Écrire un message…"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-yellow-500/50 outline-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || sending}
                    className="p-2 bg-gradient-to-br from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 rounded-xl text-black transition-all disabled:opacity-40 shrink-0"
                  >
                    <Send size={14} />
                  </button>
                </div>
                <p className="text-gray-700 text-[10px] mt-1.5 text-center">
                  {canal === 'admin_internal' ? '🔒 Canal exclusif Admin / Super Admin' : '💬 Canal Chauffeurs & Management'}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
