import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/constants.dart';

class _OnboardSlide {
  final String imageUrl;
  final String badge;
  final String title;
  final String titleAccent;
  final String subtitle;
  final List<String> features;

  const _OnboardSlide({
    required this.imageUrl,
    required this.badge,
    required this.title,
    required this.titleAccent,
    required this.subtitle,
    required this.features,
  });
}

const _slides = [
  _OnboardSlide(
    imageUrl:
        'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=800&q=80',
    badge: 'Cameroun · Yaoundé · Douala',
    title: "L'Excellence",
    titleAccent: 'Automobile',
    subtitle:
        'La plateforme de référence pour la location de véhicules de prestige en Afrique centrale.',
    features: ['KYC vérifié', 'GPS temps réel', 'Paiement sécurisé'],
  ),
  _OnboardSlide(
    imageUrl:
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80',
    badge: 'Service Premium · VIP',
    title: 'Votre Chauffeur',
    titleAccent: 'Privé',
    subtitle:
        'Chauffeurs en costume noir, vérifiés KYC, ponctualité garantie pour vos déplacements les plus exigeants.',
    features: ['Dress code strict', 'Chauffeur certifié', 'Suivi GPS en direct'],
  ),
  _OnboardSlide(
    imageUrl:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    badge: 'Propriétaires · Chauffeurs · Clients',
    title: 'Rejoignez',
    titleAccent: "L'Écosystème",
    subtitle:
        'Monétisez votre flotte, devenez chauffeur certifié ou réservez le véhicule de vos rêves.',
    features: ['Tableau de bord dédié', 'Revenus sécurisés', 'Support 24/7'],
  ),
];

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen>
    with TickerProviderStateMixin {
  final _pageCtrl = PageController();
  int _current = 0;

  late AnimationController _textCtrl;
  late Animation<double> _fadeAnim;
  late Animation<Offset> _slideAnim;

  late AnimationController _shimmerCtrl;
  late Animation<double> _shimmerAnim;

  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.light);

    _textCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _fadeAnim = CurvedAnimation(parent: _textCtrl, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(
      begin: const Offset(0, 0.25),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _textCtrl, curve: Curves.easeOutCubic));

    _shimmerCtrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat();
    _shimmerAnim = _shimmerCtrl;

    _textCtrl.forward();
  }

  @override
  void dispose() {
    _pageCtrl.dispose();
    _textCtrl.dispose();
    _shimmerCtrl.dispose();
    super.dispose();
  }

  void _onPageChanged(int idx) {
    setState(() => _current = idx);
    _textCtrl.reset();
    _textCtrl.forward();
  }

  Future<void> _finish() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('onboarding_done', true);
    if (!mounted) return;
    context.go('/connexion');
  }

  void _next() {
    if (_current < _slides.length - 1) {
      _pageCtrl.nextPage(
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOutCubic,
      );
    } else {
      _finish();
    }
  }

  @override
  Widget build(BuildContext context) {
    final slide = _slides[_current];
    final isLast = _current == _slides.length - 1;

    return Scaffold(
      backgroundColor: AppColors.darkBg,
      body: Stack(
        children: [
          // ── Full-screen PageView ─────────────────────────────────────────
          PageView.builder(
            controller: _pageCtrl,
            onPageChanged: _onPageChanged,
            itemCount: _slides.length,
            itemBuilder: (ctx, i) => _SlideBackground(slide: _slides[i]),
          ),

          // ── Gradient overlay ─────────────────────────────────────────────
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Color(0x66000000),
                    Color(0xCC000000),
                    Color(0xF5000000),
                  ],
                  stops: [0.0, 0.35, 0.6, 1.0],
                ),
              ),
            ),
          ),

          // ── Particles ────────────────────────────────────────────────────
          ..._buildParticles(),

          // ── Top bar ──────────────────────────────────────────────────────
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Logo
                  Row(
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: AppColors.goldPrimary,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Center(
                          child: Text(
                            'LD',
                            style: TextStyle(
                              fontFamily: 'Playfair Display',
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                              fontSize: 11,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      RichText(
                        text: const TextSpan(
                          children: [
                            TextSpan(
                              text: 'Luxe',
                              style: TextStyle(
                                fontFamily: 'Playfair Display',
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                                fontSize: 16,
                              ),
                            ),
                            TextSpan(
                              text: ' Drive',
                              style: TextStyle(
                                fontFamily: 'Playfair Display',
                                fontWeight: FontWeight.bold,
                                color: AppColors.goldPrimary,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  // Skip
                  if (!isLast)
                    TextButton(
                      onPressed: _finish,
                      child: const Text(
                        'Passer',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 13,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),

          // ── Bottom content ────────────────────────────────────────────────
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(28, 0, 28, 32),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Badge
                    FadeTransition(
                      opacity: _fadeAnim,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: AppColors.goldPrimary.withOpacity(0.15),
                          border: Border.all(
                              color: AppColors.goldPrimary.withOpacity(0.3)),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          slide.badge,
                          style: const TextStyle(
                            color: AppColors.goldPrimary,
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            letterSpacing: 1.2,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Title
                    SlideTransition(
                      position: _slideAnim,
                      child: FadeTransition(
                        opacity: _fadeAnim,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              slide.title,
                              style: const TextStyle(
                                fontFamily: 'Playfair Display',
                                fontSize: 38,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                                height: 1.1,
                              ),
                            ),
                            // Shimmer accent title
                            AnimatedBuilder(
                              animation: _shimmerAnim,
                              builder: (_, __) {
                                return ShaderMask(
                                  shaderCallback: (bounds) =>
                                      LinearGradient(
                                    colors: const [
                                      Color(0xFFD4A017),
                                      Color(0xFFFFD75A),
                                      Color(0xFFD4A017),
                                      Color(0xFFB87D10),
                                    ],
                                    stops: const [0.0, 0.4, 0.6, 1.0],
                                    begin: Alignment(
                                        -1.5 + _shimmerAnim.value * 3, 0),
                                    end: Alignment(
                                        -0.5 + _shimmerAnim.value * 3, 0),
                                  ).createShader(bounds),
                                  child: Text(
                                    slide.titleAccent,
                                    style: const TextStyle(
                                      fontFamily: 'Playfair Display',
                                      fontSize: 38,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                      height: 1.1,
                                    ),
                                  ),
                                );
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 14),

                    // Subtitle
                    FadeTransition(
                      opacity: _fadeAnim,
                      child: Text(
                        slide.subtitle,
                        style: const TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 14,
                          height: 1.6,
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Features
                    FadeTransition(
                      opacity: _fadeAnim,
                      child: Wrap(
                        spacing: 10,
                        runSpacing: 8,
                        children: slide.features
                            .map((f) => _FeatureBadge(label: f))
                            .toList(),
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Dots + Button row
                    Row(
                      children: [
                        // Dots
                        Row(
                          children: List.generate(
                            _slides.length,
                            (i) => AnimatedContainer(
                              duration: const Duration(milliseconds: 300),
                              margin: const EdgeInsets.only(right: 6),
                              width: i == _current ? 24 : 8,
                              height: 4,
                              decoration: BoxDecoration(
                                color: i == _current
                                    ? AppColors.goldPrimary
                                    : Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(2),
                              ),
                            ),
                          ),
                        ),
                        const Spacer(),
                        // Next / Start button
                        GestureDetector(
                          onTap: _next,
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 300),
                            padding: EdgeInsets.symmetric(
                              horizontal: isLast ? 28 : 20,
                              vertical: 14,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.goldPrimary,
                              borderRadius: BorderRadius.circular(14),
                              boxShadow: [
                                BoxShadow(
                                  color: AppColors.goldPrimary.withOpacity(0.4),
                                  blurRadius: 16,
                                  offset: const Offset(0, 6),
                                ),
                              ],
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  isLast ? 'Commencer' : 'Suivant',
                                  style: const TextStyle(
                                    color: Colors.black,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                const Icon(Icons.arrow_forward_rounded,
                                    color: Colors.black, size: 18),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildParticles() {
    final positions = [
      const Offset(0.15, 0.25),
      const Offset(0.75, 0.15),
      const Offset(0.35, 0.45),
      const Offset(0.88, 0.55),
      const Offset(0.55, 0.22),
    ];
    return positions.asMap().entries.map((e) {
      final i = e.key;
      final pos = e.value;
      return Positioned(
        left: MediaQuery.of(context).size.width * pos.dx,
        top: MediaQuery.of(context).size.height * pos.dy,
        child: TweenAnimationBuilder<double>(
          tween: Tween(begin: 0, end: 1),
          duration: Duration(seconds: 3 + i),
          builder: (_, v, __) => Opacity(
            opacity: (v * (1 - v) * 4).clamp(0, 0.6),
            child: Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.goldPrimary.withOpacity(0.5),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.goldPrimary.withOpacity(0.3),
                    blurRadius: 8,
                  )
                ],
              ),
            ),
          ),
        ),
      );
    }).toList();
  }
}

class _SlideBackground extends StatefulWidget {
  final _OnboardSlide slide;
  const _SlideBackground({required this.slide});

  @override
  State<_SlideBackground> createState() => _SlideBackgroundState();
}

class _SlideBackgroundState extends State<_SlideBackground>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 7),
    )..forward();
    _scaleAnim = Tween<double>(begin: 1.0, end: 1.08).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: _scaleAnim,
        builder: (_, child) => Transform.scale(
          scale: _scaleAnim.value,
          child: child,
        ),
        child: Image.network(
          widget.slide.imageUrl,
          fit: BoxFit.cover,
          width: double.infinity,
          height: double.infinity,
          errorBuilder: (_, __, ___) => Container(
            color: AppColors.darkSurface,
            child: const Center(
              child: Icon(Icons.directions_car, color: AppColors.goldPrimary, size: 64),
            ),
          ),
        ),
      );
}

class _FeatureBadge extends StatelessWidget {
  final String label;
  const _FeatureBadge({required this.label});

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.08),
          border: Border.all(color: Colors.white.withOpacity(0.15)),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.check_circle_outline,
                color: AppColors.goldPrimary, size: 11),
            const SizedBox(width: 5),
            Text(
              label,
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 11,
              ),
            ),
          ],
        ),
      );
}
