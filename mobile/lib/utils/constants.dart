import 'package:flutter/material.dart';

class AppConstants {
  AppConstants._();

  static const String kAppName    = 'Luxe Drive';
  static const String kAppVersion = '1.0.0';

  static const String kBaseUrl           = 'https://luxe-drive-dir4.onrender.com';
  static const String kGoogleMapsApiKey  = 'VOTRE_CLE_GOOGLE_MAPS';

  static const int    kOtpLength         = 6;
  static const int    kOtpExpiryMinutes  = 10;
  static const int    kApiTimeoutSeconds = 30;

  // SharedPreferences keys
  static const String kTokenKey        = 'access_token';
  static const String kRefreshTokenKey = 'refresh_token';
  static const String kUserKey         = 'user_data';
}

class AppColors {
  AppColors._();

  static const Color goldPrimary  = Color(0xFFD4A017);
  static const Color goldLight    = Color(0xFFE8B62A);
  static const Color goldDark     = Color(0xFFB87D10);
  static const Color darkBg       = Color(0xFF0A0A0A);
  static const Color darkSurface  = Color(0xFF111111);
  static const Color darkCard     = Color(0xFF1A1A1A);
  static const Color darkBorder   = Color(0xFF2A2A2A);
  static const Color textPrimary  = Color(0xFFF5F5F5);
  static const Color textSecondary= Color(0xFF9CA3AF);
  static const Color textMuted    = Color(0xFF6B7280);
  static const Color success      = Color(0xFF22C55E);
  static const Color error        = Color(0xFFEF4444);
  static const Color warning      = Color(0xFFF59E0B);
}

class AppEndpoints {
  AppEndpoints._();

  // Auth
  static const String login           = '/api/auth/login';
  static const String register        = '/api/auth/register';
  static const String requestOtp      = '/api/auth/request-otp';
  static const String verifyOtp       = '/api/auth/verify-otp';
  static const String refresh         = '/api/auth/refresh';
  static const String logout          = '/api/auth/logout';
  static const String me              = '/api/auth/me';

  // Resources
  static const String categories      = '/api/categories';
  static const String vehicules       = '/api/vehicules';
  static const String reservations    = '/api/reservations';
  static const String chauffeurs      = '/api/chauffeurs';
  static const String zones           = '/api/zones';
  static const String parametres      = '/api/parametres';
  static const String notifications   = '/api/notifications';
  static const String suggestions     = '/api/suggestions';
  static const String fideliteRecomp  = '/api/fidelite/recompenses';
}

class AppRoutes {
  AppRoutes._();

  static const String splash       = '/';
  static const String onboarding   = '/onboarding';
  static const String login        = '/connexion';
  static const String register     = '/inscription';
  static const String home         = '/accueil';
  static const String driver       = '/chauffeur';
  static const String owner        = '/proprietaire';
  static const String catalogue    = '/catalogue';
  static const String profil       = '/profil';
  static const String reservations = '/reservations';

  static String forRole(String? role) {
    switch (role) {
      case 'chauffeur':
        return driver;
      case 'proprietaire':
      case 'partenaire':
      case 'admin':
      case 'super_admin':
        return owner;
      default:
        return home;
    }
  }
}

class AppTheme {
  AppTheme._();

  static ThemeData get dark => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorSchemeSeed: AppColors.goldPrimary,
    scaffoldBackgroundColor: AppColors.darkBg,
    cardColor: AppColors.darkCard,
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.darkSurface,
      foregroundColor: AppColors.textPrimary,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: TextStyle(
        fontFamily: 'Playfair Display',
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.goldPrimary,
        foregroundColor: Colors.black,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.darkCard,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: AppColors.darkBorder),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: AppColors.darkBorder),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: AppColors.goldPrimary, width: 1.5),
      ),
      hintStyle: const TextStyle(color: AppColors.textMuted),
    ),
  );
}
