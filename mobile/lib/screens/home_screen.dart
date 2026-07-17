import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/vehicle_provider.dart';
import '../utils/constants.dart';
import '../widgets/vehicle_card.dart';
import '../data/catalog_data.dart';

// ── Hero Carousel Data ────────────────────────────────────────────────────────

class _HeroSlide {
  final String imageUrl;
  final String badge;
  final String title;
  final String titleAccent;
  final String subtitle;
  final String ctaLabel;
  final String ctaRoute;

  const _HeroSlide({
    required this.imageUrl,
    required this.badge,
    required this.title,
    required this.titleAccent,
    required this.subtitle,
    required this.ctaLabel,
    required this.ctaRoute,
  });
}

const _heroSlides = [
  _HeroSlide(
    imageUrl: 'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=900&q=80',
    badge: 'Yaoundé · Douala',
    title: "L'Excellence",
    titleAccent: 'Automobile',
    subtitle: 'Véhicules de prestige livrés à votre porte.',
    ctaLabel: 'Explorer',
    ctaRoute: '/catalogue',
  ),
  _HeroSlide(
    imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
    badge: 'Service Premium',
    title: 'Chauffeur',
    titleAccent: 'Privé',
    subtitle: 'Dress code strict, KYC vérifié, disponible 24h/7j.',
    ctaLabel: 'Réserver',
    ctaRoute: '/catalogue',
  ),
  _HeroSlide(
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80',
    badge: 'Liberté & Prestige',
    title: 'Prenez Le',
    titleAccent: 'Volant',
    subtitle: 'Assurance tous risques incluse sur chaque trajet.',
    ctaLabel: 'Location',
    ctaRoute: '/catalogue',
  ),
  _HeroSlide(
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    badge: 'Partenaires & Flotte',
    title: 'Rejoignez',
    titleAccent: "L'Écosystème",
    subtitle: 'Propriétaires, chauffeurs et partenaires — bienvenue.',
    ctaLabel: 'Découvrir',
    ctaRoute: '/catalogue',
  ),
];

// ── Hero Carousel Widget ──────────────────────────────────────────────────────

class _HeroCarousel extends StatefulWidget {
  const _HeroCarousel();

  @override
  State<_HeroCarousel> createState() => _HeroCarouselState();
}

class _HeroCarouselState extends State<_HeroCarousel>
    with TickerProviderStateMixin {
  final _pageCtrl = PageController();
  int _current = 0;
  Timer? _timer;

  late AnimationController _textCtrl;
  late Animation<double>   _textFade;
  late Animation<Offset>   _textSlide;

  late AnimationController _shimmerCtrl;

  @override
  void initState() {
    super.initState();

    _textCtrl = AnimationController(
      vsync: this, duration: const Duration(milliseconds: 600));
    _textFade  = CurvedAnimation(parent: _textCtrl, curve: Curves.easeOut);
    _textSlide = Tween<Offset>(
      begin: const Offset(0, 0.2), end: Offset.zero,
    ).animate(CurvedAnimation(parent: _textCtrl, curve: Curves.easeOutCubic));

    _shimmerCtrl = AnimationController(
      vsync: this, duration: const Duration(seconds: 3))..repeat();

    _textCtrl.forward();
    _startTimer();
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 5), (_) => _next());
  }

  void _next() {
    final next = (_current + 1) % _heroSlides.length;
    _pageCtrl.animateToPage(next,
        duration: const Duration(milliseconds: 700),
        curve: Curves.easeInOutCubic);
  }

  void _goTo(int idx) {
    _pageCtrl.animateToPage(idx,
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOutCubic);
    _startTimer();
  }

  void _onPageChanged(int idx) {
    setState(() => _current = idx);
    _textCtrl.reset();
    _textCtrl.forward();
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageCtrl.dispose();
    _textCtrl.dispose();
    _shimmerCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final slide = _heroSlides[_current];
    final size  = MediaQuery.of(context).size;

    return SizedBox(
      height: size.height * 0.52,
      child: Stack(
        children: [
          // ── Background pages ──────────────────────────────────────────
          PageView.builder(
            controller: _pageCtrl,
            onPageChanged: _onPageChanged,
            itemCount: _heroSlides.length,
            itemBuilder: (_, i) => _HeroImage(imageUrl: _heroSlides[i].imageUrl),
          ),

          // ── Dark gradient overlay ─────────────────────────────────────
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0x44000000),
                    Color(0x77000000),
                    Color(0xDD000000),
                    Color(0xFF000000),
                  ],
                  stops: [0.0, 0.4, 0.75, 1.0],
                ),
              ),
            ),
          ),

          // ── Left gradient ─────────────────────────────────────────────
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                  colors: [Color(0xAA000000), Colors.transparent],
                  stops: [0.0, 0.6],
                ),
              ),
            ),
          ),

          // ── Gold particle dots ────────────────────────────────────────
          ...List.generate(4, (i) => Positioned(
            left: size.width * (0.2 + i * 0.18),
            top: size.height * (0.08 + (i % 2) * 0.06),
            child: TweenAnimationBuilder<double>(
              tween: Tween(begin: 0.0, end: 1.0),
              duration: Duration(seconds: 2 + i),
              builder: (_, v, __) => Opacity(
                opacity: (v * (1 - v) * 4).clamp(0.0, 0.5),
                child: Container(
                  width: 5, height: 5,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.goldPrimary.withOpacity(0.6),
                    boxShadow: [BoxShadow(
                      color: AppColors.goldPrimary.withOpacity(0.4),
                      blurRadius: 6,
                    )],
                  ),
                ),
              ),
            ),
          )),

          // ── Text content ──────────────────────────────────────────────
          Positioned(
            left: 20,
            right: 80,
            bottom: 56,
            child: SlideTransition(
              position: _textSlide,
              child: FadeTransition(
                opacity: _textFade,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Badge
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
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
                    const SizedBox(height: 10),

                    // Title
                    Text(
                      slide.title,
                      style: const TextStyle(
                        fontFamily: 'Playfair Display',
                        fontSize: 30,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        height: 1.1,
                      ),
                    ),

                    // Shimmer accent
                    AnimatedBuilder(
                      animation: _shimmerCtrl,
                      builder: (_, __) => ShaderMask(
                        shaderCallback: (bounds) => LinearGradient(
                          colors: const [
                            Color(0xFFD4A017),
                            Color(0xFFFFD75A),
                            Color(0xFFD4A017),
                          ],
                          stops: const [0.0, 0.5, 1.0],
                          begin: Alignment(
                              -1.5 + _shimmerCtrl.value * 3, 0),
                          end: Alignment(
                              -0.5 + _shimmerCtrl.value * 3, 0),
                        ).createShader(bounds),
                        child: Text(
                          slide.titleAccent,
                          style: const TextStyle(
                            fontFamily: 'Playfair Display',
                            fontSize: 30,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                            height: 1.1,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),

                    Text(
                      slide.subtitle,
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 14),

                    // CTA
                    GestureDetector(
                      onTap: () => context.push(slide.ctaRoute),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 18, vertical: 10),
                        decoration: BoxDecoration(
                          color: AppColors.goldPrimary,
                          borderRadius: BorderRadius.circular(10),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.goldPrimary.withOpacity(0.35),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              slide.ctaLabel,
                              style: const TextStyle(
                                color: Colors.black,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                            const SizedBox(width: 6),
                            const Icon(Icons.arrow_forward_rounded,
                                color: Colors.black, size: 14),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // ── Dots ─────────────────────────────────────────────────────
          Positioned(
            right: 20,
            bottom: 56,
            child: Column(
              children: List.generate(
                _heroSlides.length,
                (i) => GestureDetector(
                  onTap: () => _goTo(i),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    margin: const EdgeInsets.symmetric(vertical: 3),
                    width: 4,
                    height: i == _current ? 20 : 8,
                    decoration: BoxDecoration(
                      color: i == _current
                          ? AppColors.goldPrimary
                          : Colors.white.withOpacity(0.25),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
              ),
            ),
          ),

          // ── Slide counter ─────────────────────────────────────────────
          Positioned(
            right: 20,
            top: 52,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.4),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.white.withOpacity(0.1)),
              ),
              child: Text(
                '${_current + 1}/${_heroSlides.length}',
                style: const TextStyle(
                  color: AppColors.goldPrimary,
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 1,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HeroImage extends StatefulWidget {
  final String imageUrl;
  const _HeroImage({required this.imageUrl});
  @override
  State<_HeroImage> createState() => _HeroImageState();
}

class _HeroImageState extends State<_HeroImage>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
        vsync: this, duration: const Duration(seconds: 6))
      ..forward();
    _scale = Tween<double>(begin: 1.0, end: 1.06).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut));
  }

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
    animation: _scale,
    builder: (_, child) => Transform.scale(scale: _scale.value, child: child),
    child: Image.network(
      widget.imageUrl,
      fit: BoxFit.cover,
      width: double.infinity,
      height: double.infinity,
      errorBuilder: (_, __, ___) => Container(
        color: AppColors.darkSurface,
        child: const Center(
          child: Icon(Icons.directions_car,
              color: AppColors.goldPrimary, size: 48)),
      ),
    ),
  );
}

// ── HomeScreen ────────────────────────────────────────────────────────────────

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _navIndex = 0;

  @override
  void initState() {
    super.initState();
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.light);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<VehicleProvider>().fetchVehicles();
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth     = context.watch<AuthProvider>();
    final vehicles = context.watch<VehicleProvider>();

    return Scaffold(
      backgroundColor: AppColors.darkBg,
      body: CustomScrollView(
        slivers: [

          // ── Transparent app bar ─────────────────────────────────────────
          SliverAppBar(
            backgroundColor: Colors.transparent,
            elevation: 0,
            floating: true,
            pinned: false,
            leading: Padding(
              padding: const EdgeInsets.only(left: 16),
              child: Row(
                children: [
                  Container(
                    width: 30, height: 30,
                    decoration: BoxDecoration(
                      color: AppColors.goldPrimary,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Center(
                      child: Text('LD', style: TextStyle(
                        fontFamily: 'Playfair Display',
                        fontWeight: FontWeight.bold,
                        color: Colors.black, fontSize: 10,
                      )),
                    ),
                  ),
                ],
              ),
            ),
            title: RichText(
              text: const TextSpan(children: [
                TextSpan(text: 'Luxe', style: TextStyle(
                  fontFamily: 'Playfair Display', fontWeight: FontWeight.bold,
                  color: Colors.white, fontSize: 16)),
                TextSpan(text: ' Drive', style: TextStyle(
                  fontFamily: 'Playfair Display', fontWeight: FontWeight.bold,
                  color: AppColors.goldPrimary, fontSize: 16)),
              ]),
            ),
            actions: [
              IconButton(
                onPressed: () => context.push('/profil'),
                icon: Container(
                  width: 34, height: 34,
                  decoration: BoxDecoration(
                    color: AppColors.darkCard,
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.darkBorder),
                  ),
                  child: const Icon(Icons.person_outline,
                      color: AppColors.textSecondary, size: 18),
                ),
              ),
              const SizedBox(width: 8),
            ],
            systemOverlayStyle: SystemUiOverlayStyle.light,
          ),

          // ── Hero Carousel ───────────────────────────────────────────────
          const SliverToBoxAdapter(child: _HeroCarousel()),

          // ── Greeting ────────────────────────────────────────────────────
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 4),
              child: Row(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Bonjour, ${auth.user?.prenom ?? 'Bienvenue'} 👋',
                        style: const TextStyle(
                            color: AppColors.textSecondary, fontSize: 13),
                      ),
                      const Text(
                        'Que recherchez-vous ?',
                        style: TextStyle(
                          color: AppColors.textPrimary,
                          fontSize: 18,
                          fontFamily: 'Playfair Display',
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // ── Services rapides ────────────────────────────────────────────
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 4),
              child: Row(
                children: [
                  Expanded(child: _ServiceCard(
                    icon: Icons.car_rental,
                    label: 'Location',
                    subtitle: 'Libre-service',
                    color: AppColors.goldPrimary,
                    onTap: () => context.push('/catalogue'),
                  )),
                  const SizedBox(width: 10),
                  Expanded(child: _ServiceCard(
                    icon: Icons.drive_eta,
                    label: 'Chauffeur',
                    subtitle: 'Avec chauffeur',
                    color: const Color(0xFF60A5FA),
                    onTap: () => context.push('/catalogue'),
                  )),
                  const SizedBox(width: 10),
                  Expanded(child: _ServiceCard(
                    icon: Icons.business_center_outlined,
                    label: 'Entreprise',
                    subtitle: 'Flotte B2B',
                    color: const Color(0xFF34D399),
                    onTap: () => context.push('/catalogue'),
                  )),
                ],
              ),
            ),
          ),

          // ── Stats row ───────────────────────────────────────────────────
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 4),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.darkCard,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.darkBorder),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: const [
                    _StatItem(value: '50+', label: 'Véhicules'),
                    _Divider(),
                    _StatItem(value: '200+', label: 'Clients'),
                    _Divider(),
                    _StatItem(value: '24/7', label: 'Support'),
                  ],
                ),
              ),
            ),
          ),

          // ── Accès rapide ────────────────────────────────────────────────
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 4),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Accès rapide', style: TextStyle(
                    color: AppColors.textPrimary, fontSize: 15,
                    fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  Row(children: [
                    Expanded(child: _QuickLink(
                      icon: Icons.workspace_premium_rounded,
                      label: 'Fidélité',
                      color: const Color(0xFFD4A017),
                      onTap: () => context.push('/fidelite'),
                    )),
                    const SizedBox(width: 8),
                    Expanded(child: _QuickLink(
                      icon: Icons.handshake_rounded,
                      label: 'Partenaires',
                      color: const Color(0xFF34D399),
                      onTap: () => context.push('/partenaires'),
                    )),
                    const SizedBox(width: 8),
                    Expanded(child: _QuickLink(
                      icon: Icons.headset_mic_rounded,
                      label: 'Contact',
                      color: const Color(0xFF60A5FA),
                      onTap: () => context.push('/contact'),
                    )),
                    const SizedBox(width: 8),
                    Expanded(child: _QuickLink(
                      icon: Icons.garage_rounded,
                      label: 'Garages',
                      color: const Color(0xFFF59E0B),
                      onTap: () => context.push('/garages-partenaires'),
                    )),
                  ]),
                ],
              ),
            ),
          ),

          // ── Section title ───────────────────────────────────────────────
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 28, 20, 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Véhicules disponibles', style: TextStyle(
                    color: AppColors.textPrimary, fontSize: 18,
                    fontFamily: 'Playfair Display', fontWeight: FontWeight.bold,
                  )),
                  GestureDetector(
                    onTap: () => context.push('/catalogue'),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: AppColors.goldPrimary.withOpacity(0.1),
                        border: Border.all(
                            color: AppColors.goldPrimary.withOpacity(0.3)),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text('Voir tout',
                          style: TextStyle(
                              color: AppColors.goldPrimary,
                              fontSize: 12,
                              fontWeight: FontWeight.w600)),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ── Vehicle grid ────────────────────────────────────────────────
          if (vehicles.loading)
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.all(40),
                child: Center(
                  child: CircularProgressIndicator(color: AppColors.goldPrimary),
                ),
              ),
            )
          else if (vehicles.vehicles.isNotEmpty)
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              sliver: SliverGrid(
                delegate: SliverChildBuilderDelegate(
                  (ctx, i) => VehicleCard(vehicle: vehicles.vehicles[i]),
                  childCount: vehicles.vehicles.take(6).length,
                ),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2, mainAxisSpacing: 12, crossAxisSpacing: 12, childAspectRatio: 0.75,
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              sliver: SliverGrid(
                delegate: SliverChildBuilderDelegate(
                  (ctx, i) => _LocalVehicleCard(v: kLocationVehicles[i]),
                  childCount: kLocationVehicles.take(6).length,
                ),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2, mainAxisSpacing: 12, crossAxisSpacing: 12, childAspectRatio: 0.75,
                ),
              ),
            ),

          const SliverPadding(padding: EdgeInsets.only(bottom: 40)),
        ],
      ),

      // ── Bottom nav ──────────────────────────────────────────────────────
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: AppColors.darkSurface,
          border: const Border(top: BorderSide(color: AppColors.darkBorder)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.5),
              blurRadius: 20,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: NavigationBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          selectedIndex: _navIndex,
          indicatorColor: AppColors.goldPrimary.withOpacity(0.15),
          labelBehavior: NavigationDestinationLabelBehavior.onlyShowSelected,
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.home_outlined, color: AppColors.textMuted),
              selectedIcon: Icon(Icons.home_rounded, color: AppColors.goldPrimary),
              label: 'Accueil',
            ),
            NavigationDestination(
              icon: Icon(Icons.directions_car_outlined, color: AppColors.textMuted),
              selectedIcon: Icon(Icons.directions_car, color: AppColors.goldPrimary),
              label: 'Catalogue',
            ),
            NavigationDestination(
              icon: Icon(Icons.receipt_long_outlined, color: AppColors.textMuted),
              selectedIcon: Icon(Icons.receipt_long, color: AppColors.goldPrimary),
              label: 'Réservations',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline, color: AppColors.textMuted),
              selectedIcon: Icon(Icons.person, color: AppColors.goldPrimary),
              label: 'Profil',
            ),
          ],
          onDestinationSelected: (i) {
            setState(() => _navIndex = i);
            switch (i) {
              case 1: context.push('/catalogue');    break;
              case 2: context.push('/reservations'); break;
              case 3: context.push('/profil');       break;
            }
          },
        ),
      ),
    );
  }
}

// ── Helper Widgets ────────────────────────────────────────────────────────────

class _ServiceCard extends StatelessWidget {
  final IconData icon;
  final String   label;
  final String   subtitle;
  final Color    color;
  final VoidCallback onTap;
  const _ServiceCard({
    required this.icon, required this.label,
    required this.subtitle, required this.color, required this.onTap,
  });

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 14),
      decoration: BoxDecoration(
        color: AppColors.darkCard,
        border: Border.all(color: AppColors.darkBorder),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        children: [
          Container(
            width: 40, height: 40,
            decoration: BoxDecoration(
              color: color.withOpacity(0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(
            color: AppColors.textPrimary, fontSize: 12,
            fontWeight: FontWeight.w600)),
          const SizedBox(height: 2),
          Text(subtitle, style: const TextStyle(
            color: AppColors.textMuted, fontSize: 9)),
        ],
      ),
    ),
  );
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;
  const _StatItem({required this.value, required this.label});

  @override
  Widget build(BuildContext context) => Column(
    children: [
      Text(value, style: const TextStyle(
        color: AppColors.goldPrimary,
        fontSize: 18,
        fontFamily: 'Playfair Display',
        fontWeight: FontWeight.bold,
      )),
      const SizedBox(height: 2),
      Text(label, style: const TextStyle(
          color: AppColors.textMuted, fontSize: 11)),
    ],
  );
}

class _Divider extends StatelessWidget {
  const _Divider();
  @override
  Widget build(BuildContext context) => Container(
    width: 1, height: 28,
    color: AppColors.darkBorder,
  );
}

class _QuickLink extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  const _QuickLink({required this.icon, required this.label, required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(height: 5),
        Text(label, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.w600)),
      ]),
    ),
  );
}

// ── Local vehicle card (fallback when API unavailable) ─────────────────────────

class _LocalVehicleCard extends StatelessWidget {
  final LocalVehicle v;
  const _LocalVehicleCard({required this.v});

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: () => context.push('/vehicule/${v.id}'),
    child: Container(
      decoration: BoxDecoration(
        color: AppColors.darkCard,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.darkBorder),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
          child: SizedBox(
            height: 110, width: double.infinity,
            child: Image.network(
              v.images.first, fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                color: AppColors.darkSurface,
                child: const Center(child: Icon(Icons.directions_car, color: AppColors.darkBorder, size: 36))),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(10),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(v.marque.toUpperCase(), style: const TextStyle(
              color: AppColors.goldPrimary, fontSize: 10, fontWeight: FontWeight.w600, letterSpacing: 1)),
            const SizedBox(height: 2),
            Text(v.nom, style: const TextStyle(
              color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600),
              maxLines: 1, overflow: TextOverflow.ellipsis),
            const SizedBox(height: 6),
            Text('${v.prixJour ~/ 1000}K FCFA/j', style: const TextStyle(
              color: AppColors.goldPrimary, fontSize: 12, fontWeight: FontWeight.bold)),
          ]),
        ),
      ]),
    ),
  );
}
