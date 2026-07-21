import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Car, Download } from 'lucide-react'
import useAuthStore from '../store/authStore'

const NAV_LINKS = [
  { label: 'Accueil',    href: '/' },
  { label: 'Catalogue',  href: '/catalogue' },
  { label: 'Services',   href: '/#services' },
  { label: 'À propos',   href: '/#ecosystem' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenu]     = useState(false)
  const [dropOpen, setDrop]     = useState(false)
  const { pathname }            = useLocation()
  const navigate                = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setDrop(false)
  }

  const dashboardHref =
    user?.role === 'admin' || user?.role === 'super_admin' ? '/admin' :
    user?.role === 'proprietaire' ? '/proprietaire' :
    user?.role === 'chauffeur'    ? '/chauffeur' : '/profil'

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? 'bg-black/95 backdrop-blur-xl border-b border-gray-800/80 shadow-xl shadow-black/50'
          : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gold-500 flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-black text-sm leading-none">LD</span>
          </div>
          <div className="leading-none">
            <span className="font-display font-bold text-white text-xl tracking-wide">
              Luxe<span className="text-gold-400"> Drive</span>
            </span>
            <p className="text-gray-600 text-[10px] tracking-widest uppercase hidden sm:block">Cameroun</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === href
                  ? 'text-gold-400 bg-gold-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="/luxe-drive.apk"
            download
            className="hidden xl:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-gold-500/40 text-gold-400 hover:bg-gold-500/10 transition-all"
          >
            <Download size={13} /> App Android
          </a>
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDrop((v) => !v)}
                className="flex items-center gap-2.5 bg-gray-900 border border-gray-700 hover:border-gold-500/50 rounded-xl px-4 py-2.5 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center">
                  <User size={14} className="text-gold-400" />
                </div>
                <span className="text-white text-sm font-medium max-w-[120px] truncate">
                  {user?.prenom || user?.nom || 'Mon compte'}
                </span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-white text-sm font-medium">{user?.prenom} {user?.nom}</p>
                    <p className="text-gray-500 text-xs capitalize mt-0.5">{user?.role?.replace('_', ' ')}</p>
                  </div>
                  <div className="p-1.5">
                    <Link to={dashboardHref} onClick={() => setDrop(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 text-sm transition-colors">
                      <LayoutDashboard size={15} className="text-gold-500" /> Tableau de bord
                    </Link>
                    <Link to="/catalogue" onClick={() => setDrop(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 text-sm transition-colors">
                      <Car size={15} className="text-gold-500" /> Catalogue
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-sm transition-colors mt-1 border-t border-gray-800 pt-2">
                      <LogOut size={15} /> Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/connexion"
                className="text-gray-300 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/5 transition-all">
                Connexion
              </Link>
              <Link to="/inscription"
                className="btn-gold text-sm px-5 py-2.5">
                Créer un compte
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenu((v) => !v)} className="lg:hidden p-2 text-gray-400 hover:text-white">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-black/98 border-t border-gray-800 px-6 py-6 space-y-3">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={href} href={href} onClick={() => setMenu(false)}
              className="block py-3 text-gray-300 hover:text-white border-b border-gray-900 text-sm font-medium">
              {label}
            </a>
          ))}
          <a href="/luxe-drive.apk" download
            className="flex items-center justify-center gap-2 bg-gold-500/10 border border-gold-500/40 text-gold-400 text-sm py-3 rounded-lg font-semibold">
            <Download size={15} /> Télécharger l'App Android
          </a>
          <div className="flex flex-col gap-3 pt-3">
            {isAuthenticated ? (
              <>
                <Link to={dashboardHref} onClick={() => setMenu(false)} className="btn-gold text-center text-sm py-3">
                  Mon Tableau de bord
                </Link>
                <button onClick={handleLogout} className="text-red-400 text-sm py-2">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/connexion" onClick={() => setMenu(false)} className="btn-outline-gold text-center text-sm py-3">
                  Connexion
                </Link>
                <Link to="/inscription" onClick={() => setMenu(false)} className="btn-gold text-center text-sm py-3">
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
