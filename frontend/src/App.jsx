import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore'

import HomePage          from './pages/HomePage'
import LoginPage         from './pages/LoginPage'
import RegisterPage      from './pages/RegisterPage'
import CatalogPage       from './pages/CatalogPage'
import VehicleDetailPage from './pages/VehicleDetailPage'
import BookingPage       from './pages/BookingPage'
import ProfilePage       from './pages/ProfilePage'
import ReservationsPage  from './pages/ReservationsPage'
import AdminDashboard    from './pages/admin/DashboardPage'
import AdminLoginPage    from './pages/admin/AdminLoginPage'
import FleetDashboard    from './pages/owner/FleetDashboard'
import DriverDashboard   from './pages/driver/DriverDashboard'
import ContactPage       from './pages/ContactPage'
import FidelitePage      from './pages/FidelitePage'
import PartenairesPage   from './pages/PartenairesPage'
import { CGVPage, ConfidentialitePage, GPSPage, ChartePage } from './pages/LegalPages'
import ChauffeurApplicationPage from './pages/ChauffeurApplicationPage'
import VehicleRegistrationPage   from './pages/VehicleRegistrationPage'
import ProAccountPage            from './pages/ProAccountPage'
import GaragePartnerPage         from './pages/GaragePartnerPage'
import FleetMonitorPage         from './pages/FleetMonitorPage'

function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/connexion" replace />
}

function RoleRoute({ children, roles, loginRedirect }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to={loginRedirect || '/connexion'} replace />
  if (!roles.includes(user?.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"           element={<HomePage />} />
      <Route path="/connexion"  element={<LoginPage />} />
      <Route path="/inscription" element={<RegisterPage />} />
      <Route path="/catalogue"  element={<CatalogPage />} />
      <Route path="/vehicule/:id" element={<VehicleDetailPage />} />

      {/* Auth required */}
      <Route path="/reserver/:id"    element={<PrivateRoute><BookingPage /></PrivateRoute>} />
      <Route path="/profil"          element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/mes-reservations"element={<PrivateRoute><ReservationsPage /></PrivateRoute>} />

      {/* Propriétaire */}
      <Route path="/proprietaire/*"
        element={
          <RoleRoute roles={['proprietaire', 'partenaire', 'admin', 'super_admin']}>
            <FleetDashboard />
          </RoleRoute>
        }
      />

      {/* Chauffeur */}
      <Route path="/chauffeur/*"
        element={
          <RoleRoute roles={['chauffeur', 'admin', 'super_admin']}>
            <DriverDashboard />
          </RoleRoute>
        }
      />

      {/* Admin login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin */}
      <Route path="/admin/*"
        element={
          <RoleRoute roles={['admin', 'super_admin']} loginRedirect="/admin/login">
            <AdminDashboard />
          </RoleRoute>
        }
      />

      {/* Super-Admin — same dashboard, role-filtered sidebar */}
      <Route path="/super-admin/*"
        element={
          <RoleRoute roles={['super_admin']} loginRedirect="/admin/login">
            <AdminDashboard />
          </RoleRoute>
        }
      />

      {/* Contenu */}
      <Route path="/devenir-chauffeur"   element={<ChauffeurApplicationPage />} />
      <Route path="/inscription-vehicule" element={<VehicleRegistrationPage />} />
      <Route path="/compte-pro"           element={<ProAccountPage />} />
      <Route path="/garages-partenaires"  element={<GaragePartnerPage />} />
      <Route path="/fleet-monitor"
        element={
          <RoleRoute roles={['admin', 'super_admin', 'proprietaire']}>
            <FleetMonitorPage />
          </RoleRoute>
        }
      />

      <Route path="/contact"         element={<ContactPage />} />
      <Route path="/fidelite"        element={<FidelitePage />} />
      <Route path="/partenaires"     element={<PartenairesPage />} />
      <Route path="/cgv"             element={<CGVPage />} />
      <Route path="/confidentialite" element={<ConfidentialitePage />} />
      <Route path="/gps"             element={<GPSPage />} />
      <Route path="/charte"          element={<ChartePage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
