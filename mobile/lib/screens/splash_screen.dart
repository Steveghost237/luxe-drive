import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../providers/auth_provider.dart';
import '../utils/constants.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _logoCtrl;
  late Animation<double>   _logoFade;
  late Animation<double>   _logoScale;
  late AnimationController _glowCtrl;
  late Animation<double>   _glowAnim;

  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.light);

    _logoCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    );
    _logoFade  = CurvedAnimation(parent: _logoCtrl, curve: Curves.easeOut);
    _logoScale = Tween<double>(begin: 0.75, end: 1.0).animate(
      CurvedAnimation(parent: _logoCtrl, curve: Curves.easeOutBack),
    );

    _glowCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..repeat(reverse: true);
    _glowAnim = Tween<double>(begin: 0.3, end: 0.7).animate(
      CurvedAnimation(parent: _glowCtrl, curve: Curves.easeInOut),
    );

    _logoCtrl.forward();
    _init();
  }

  Future<void> _init() async {
    await Future.delayed(const Duration(milliseconds: 2200));
    if (!mounted) return;

    final prefs = await SharedPreferences.getInstance();
    final onboardingDone = prefs.getBool('onboarding_done') ?? false;

    if (!mounted) return;

    if (!onboardingDone) {
      context.go('/onboarding');
      return;
    }

    final auth = context.read<AuthProvider>();
    await auth.loadFromStorage();
    if (!mounted) return;
    context.go(auth.isAuthenticated ? '/accueil' : '/connexion');
  }

  @override
  void dispose() {
    _logoCtrl.dispose();
    _glowCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkBg,
      body: Stack(
        children: [
          // Ambient glow background
          AnimatedBuilder(
            animation: _glowAnim,
            builder: (_, __) => Center(
              child: Container(
                width: 320,
                height: 320,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.goldPrimary.withOpacity(_glowAnim.value * 0.12),
                      blurRadius: 180,
                      spreadRadius: 60,
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Main logo
          Center(
            child: ScaleTransition(
              scale: _logoScale,
              child: FadeTransition(
                opacity: _logoFade,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Logo icon
                    Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        color: AppColors.goldPrimary,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.goldPrimary.withOpacity(0.4),
                            blurRadius: 28,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Text(
                          'LD',
                          style: TextStyle(
                            fontFamily: 'Playfair Display',
                            fontSize: 26,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // App name
                    RichText(
                      text: const TextSpan(
                        children: [
                          TextSpan(
                            text: 'Luxe',
                            style: TextStyle(
                              fontFamily: 'Playfair Display',
                              fontSize: 38,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                              letterSpacing: 1.5,
                            ),
                          ),
                          TextSpan(
                            text: ' Drive',
                            style: TextStyle(
                              fontFamily: 'Playfair Display',
                              fontSize: 38,
                              fontWeight: FontWeight.bold,
                              color: AppColors.goldPrimary,
                              letterSpacing: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'L\'Excellence Automobile',
                      style: TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 13,
                        letterSpacing: 2,
                        fontWeight: FontWeight.w300,
                      ),
                    ),
                    const SizedBox(height: 60),

                    // Loading indicator
                    SizedBox(
                      width: 28,
                      height: 28,
                      child: CircularProgressIndicator(
                        color: AppColors.goldPrimary.withOpacity(0.7),
                        strokeWidth: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Version tag
          Positioned(
            bottom: 32,
            left: 0,
            right: 0,
            child: FadeTransition(
              opacity: _logoFade,
              child: const Center(
                child: Text(
                  'v${AppConstants.kAppVersion} · Cameroun',
                  style: TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 11,
                    letterSpacing: 1.5,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
