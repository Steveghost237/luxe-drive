import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'providers/auth_provider.dart';
import 'providers/vehicle_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/home_screen.dart';
import 'screens/catalog_screen.dart';
import 'screens/vehicle_detail_screen.dart';
import 'screens/booking_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/reservations_screen.dart';
import 'screens/driver_dashboard_screen.dart';
import 'screens/owner_dashboard_screen.dart';
import 'screens/chauffeur_form_screen.dart';
import 'screens/vehicle_registration_screen.dart';
import 'screens/pro_account_screen.dart';
import 'screens/garage_partner_screen.dart';
import 'screens/fidelite_screen.dart';
import 'screens/notifications_screen.dart';
import 'screens/contact_screen.dart';
import 'screens/partenaires_screen.dart';
import 'services/api_service.dart';
import 'providers/notification_provider.dart';
import 'widgets/notification_popup.dart';
import 'utils/constants.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  ApiService().init();
  runApp(const LuxeDriveApp());
}

final _router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/',             builder: (_, __) => const SplashScreen()),
    GoRoute(path: '/onboarding',   builder: (_, __) => const OnboardingScreen()),
    GoRoute(path: '/connexion',    builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/inscription',  builder: (_, __) => const RegisterScreen()),
    GoRoute(path: '/accueil',      builder: (_, __) => const HomeScreen()),
    GoRoute(path: '/catalogue',    builder: (_, __) => const CatalogScreen()),
    GoRoute(
      path: '/vehicule/:id',
      builder: (_, state) => VehicleDetailScreen(id: state.pathParameters['id']!),
    ),
    GoRoute(
      path: '/reservation/:id',
      builder: (_, state) => BookingScreen(vehicleId: state.pathParameters['id']!),
    ),
    GoRoute(path: '/profil',        builder: (_, __) => const ProfileScreen()),
    GoRoute(path: '/reservations', builder: (_, __) => const ReservationsScreen()),
    GoRoute(path: '/chauffeur',            builder: (_, __) => const DriverDashboardScreen()),
    GoRoute(path: '/proprietaire',          builder: (_, __) => const OwnerDashboardScreen()),
    GoRoute(path: '/devenir-chauffeur',     builder: (_, __) => const ChauffeurFormScreen()),
    GoRoute(path: '/inscription-vehicule',  builder: (_, __) => const VehicleRegistrationScreen()),
    GoRoute(path: '/compte-pro',            builder: (_, __) => const ProAccountScreen()),
    GoRoute(path: '/garages-partenaires',   builder: (_, __) => const GaragePartnerScreen()),
    GoRoute(path: '/fidelite',        builder: (_, __) => const FideliteScreen()),
    GoRoute(path: '/notifications',    builder: (_, __) => const NotificationsScreen()),
    GoRoute(path: '/contact',          builder: (_, __) => const ContactScreen()),
    GoRoute(path: '/partenaires',            builder: (_, __) => const PartenairesScreen()),
  ],
);

class LuxeDriveApp extends StatelessWidget {
  const LuxeDriveApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => VehicleProvider()),
        ChangeNotifierProvider(create: (_) => NotificationProvider()),
      ],
      child: MaterialApp.router(
        title: AppConstants.kAppName,
        debugShowCheckedModeBanner: false,
        theme: AppTheme.dark,
        routerConfig: _router,
        builder: (context, child) {
          final auth = Provider.of<AuthProvider>(context);
          final notifProv = Provider.of<NotificationProvider>(context, listen: false);
          if (auth.isAuthenticated && auth.user != null) {
            notifProv.start(auth.user!.id);
          } else {
            notifProv.stop();
          }
          return NotificationOverlay(child: child ?? const SizedBox());
        },
      ),
    );
  }
}
