import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../data/catalog_data.dart';
import '../utils/constants.dart';

const _kTelVD = '+237699000001';

String _fmtVD(int n) {
  if (n >= 1000000) return '${(n / 1000000).toStringAsFixed(n % 1000000 == 0 ? 0 : 1)}M';
  if (n >= 1000) return '${(n / 1000).toStringAsFixed(0)}K';
  return n.toString();
}

class VehicleDetailScreen extends StatefulWidget {
  final String id;
  const VehicleDetailScreen({super.key, required this.id});
  @override
  State<VehicleDetailScreen> createState() => _VehicleDetailScreenState();
}

class _VehicleDetailScreenState extends State<VehicleDetailScreen> {
  int _imgIndex = 0;
  final _pageCtrl = PageController();

  @override
  void dispose() { _pageCtrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final v = LocalVehicle.findById(widget.id);
    if (v == null) return const Scaffold(
      backgroundColor: AppColors.darkBg,
      body: Center(child: Text('Véhicule introuvable', style: TextStyle(color: AppColors.textMuted))),
    );

    final sc = _segColor(v.segment);

    return Scaffold(
      backgroundColor: AppColors.darkBg,
      body: CustomScrollView(
        slivers: [
          // ── Photo gallery ─────────────────────────────────────────────────
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            backgroundColor: AppColors.darkSurface,
            leading: GestureDetector(
              onTap: () => Navigator.of(context).pop(),
              child: Container(
                margin: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: Colors.black.withOpacity(0.5), shape: BoxShape.circle),
                child: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 18),
              ),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  PageView.builder(
                    controller: _pageCtrl,
                    itemCount: v.images.length,
                    onPageChanged: (i) => setState(() => _imgIndex = i),
                    itemBuilder: (_, i) => Image.network(
                      v.images[i], fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(color: AppColors.darkCard,
                        child: const Center(child: Icon(Icons.directions_car, color: AppColors.darkBorder, size: 60))),
                    ),
                  ),
                  // Gradient bottom
                  Positioned.fill(child: DecoratedBox(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter,
                        colors: [Colors.transparent, Colors.black.withOpacity(0.7)]),
                    ),
                  )),
                  // Dot indicators
                  if (v.images.length > 1) Positioned(
                    bottom: 14, left: 0, right: 0,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(v.images.length, (i) => AnimatedContainer(
                        duration: const Duration(milliseconds: 250),
                        margin: const EdgeInsets.symmetric(horizontal: 3),
                        width: _imgIndex == i ? 20 : 6,
                        height: 6,
                        decoration: BoxDecoration(
                          color: _imgIndex == i ? AppColors.goldPrimary : Colors.white.withOpacity(0.4),
                          borderRadius: BorderRadius.circular(3),
                        ),
                      )),
                    ),
                  ),
                  // Photo count
                  Positioned(top: 12, right: 16, child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(color: Colors.black.withOpacity(0.55), borderRadius: BorderRadius.circular(20)),
                    child: Row(mainAxisSize: MainAxisSize.min, children: [
                      const Icon(Icons.photo_library_outlined, size: 13, color: Colors.white70),
                      const SizedBox(width: 4),
                      Text('${_imgIndex + 1} / ${v.images.length}', style: const TextStyle(color: Colors.white70, fontSize: 11)),
                    ]),
                  )),
                ],
              ),
            ),
          ),

          // ── Content ───────────────────────────────────────────────────────
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 40),
            sliver: SliverList(delegate: SliverChildListDelegate([

              // Segment badge + title
              Row(children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: sc.withOpacity(0.12), borderRadius: BorderRadius.circular(20), border: Border.all(color: sc.withOpacity(0.35))),
                  child: Text(v.segment, style: TextStyle(color: sc, fontSize: 11, fontWeight: FontWeight.bold)),
                ),
                const Spacer(),
                if (v.disponible)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: Colors.green.withOpacity(0.12), borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.green.withOpacity(0.35))),
                    child: const Text('Disponible', style: TextStyle(color: Colors.green, fontSize: 11, fontWeight: FontWeight.w600)),
                  )
                else
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: Colors.red.withOpacity(0.12), borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.red.withOpacity(0.35))),
                    child: const Text('Indisponible', style: TextStyle(color: Colors.red, fontSize: 11, fontWeight: FontWeight.w600)),
                  ),
              ]),
              const SizedBox(height: 10),
              Text(v.marque.toUpperCase(), style: const TextStyle(color: AppColors.goldPrimary, fontSize: 11, letterSpacing: 2.5, fontWeight: FontWeight.w600)),
              const SizedBox(height: 4),
              Text(v.nom, style: const TextStyle(color: AppColors.textPrimary, fontSize: 24, fontWeight: FontWeight.bold, fontFamily: 'Playfair Display')),
              const SizedBox(height: 6),
              Text(v.description, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13, height: 1.6)),
              const SizedBox(height: 24),

              // Pricing
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppColors.darkBorder)),
                child: Row(children: [
                  const Icon(Icons.payments_outlined, color: AppColors.goldPrimary, size: 20),
                  const SizedBox(width: 12),
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('${_fmtVD(v.prixJour)} FCFA', style: const TextStyle(color: AppColors.goldPrimary, fontSize: 22, fontWeight: FontWeight.bold)),
                    const Text('par jour · hors chauffeur', style: TextStyle(color: AppColors.textMuted, fontSize: 11)),
                  ]),
                  const Spacer(),
                  Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                    const Text('Caution', style: TextStyle(color: AppColors.textMuted, fontSize: 11)),
                    Text('${_fmtVD(v.caution)} FCFA', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.w600)),
                  ]),
                ]),
              ),
              const SizedBox(height: 20),

              // Specs grid
              _SectionTitle('Caractéristiques'),
              const SizedBox(height: 10),
              GridView.count(
                crossAxisCount: 3, shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
                childAspectRatio: 1.5, mainAxisSpacing: 8, crossAxisSpacing: 8,
                children: [
                  _SpecTile(Icons.people_outline_rounded, 'Places', '${v.places}'),
                  _SpecTile(Icons.speed_rounded, 'Puissance', v.puissance),
                  _SpecTile(Icons.settings_outlined, 'Boîte', v.transmission),
                  _SpecTile(Icons.local_gas_station_rounded, 'Énergie', v.carburant),
                  _SpecTile(Icons.palette_outlined, 'Couleur', v.couleur),
                  _SpecTile(Icons.calendar_today_rounded, 'Année', '${v.annee}'),
                ],
              ),
              const SizedBox(height: 20),

              // Features
              if (v.features.isNotEmpty) ...[
                _SectionTitle('Équipements & services'),
                const SizedBox(height: 10),
                Wrap(spacing: 8, runSpacing: 8,
                  children: v.features.map((f) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                    decoration: BoxDecoration(
                      color: AppColors.goldPrimary.withOpacity(0.07),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.goldPrimary.withOpacity(0.2)),
                    ),
                    child: Row(mainAxisSize: MainAxisSize.min, children: [
                      Icon(Icons.check_circle_outline_rounded, size: 13, color: AppColors.goldPrimary),
                      const SizedBox(width: 5),
                      Text(f, style: const TextStyle(color: AppColors.textPrimary, fontSize: 12)),
                    ]),
                  )).toList(),
                ),
                const SizedBox(height: 24),
              ],

              // Thumbnail strip
              if (v.images.length > 1) ...[
                _SectionTitle('Galerie photos'),
                const SizedBox(height: 10),
                SizedBox(
                  height: 70,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: v.images.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (_, i) => GestureDetector(
                      onTap: () { _pageCtrl.animateToPage(i, duration: const Duration(milliseconds: 300), curve: Curves.easeInOut); setState(() => _imgIndex = i); Scrollable.ensureVisible(context); },
                      child: Container(
                        width: 100,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: _imgIndex == i ? AppColors.goldPrimary : Colors.transparent, width: 2),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.network(v.images[i], fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(color: AppColors.darkCard)),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
              ],

              // CTAs
              if (v.disponible) ...[
                SizedBox(width: double.infinity, child: ElevatedButton.icon(
                  onPressed: () => context.push('/reservation/${v.id}'),
                  icon: const Icon(Icons.calendar_today_rounded, size: 16),
                  label: const Text('Réserver ce véhicule'),
                  style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 15)),
                )),
                const SizedBox(height: 10),
              ],
              SizedBox(width: double.infinity, child: OutlinedButton.icon(
                onPressed: () async {
                  final uri = Uri.parse('tel:$_kTelVD');
                  if (await canLaunchUrl(uri)) launchUrl(uri);
                },
                icon: const Icon(Icons.phone_rounded, size: 16),
                label: const Text('Appeler Luxe Drive'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  side: BorderSide(color: Colors.green.withOpacity(0.4)),
                  foregroundColor: Colors.green,
                ),
              )),
            ])),
          ),
        ],
      ),
    );
  }
}

Color _segColor(String s) {
  switch (s) {
    case 'Ultra-Luxe': return const Color(0xFFA855F7);
    case 'Haut-Gamme': return AppColors.goldPrimary;
    default:           return const Color(0xFF60A5FA);
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;
  const _SectionTitle(this.title);
  @override
  Widget build(BuildContext context) => Text(title, style: const TextStyle(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold));
}

class _SpecTile extends StatelessWidget {
  final IconData icon;
  final String label, value;
  const _SpecTile(this.icon, this.label, this.value);
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(10),
    decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.darkBorder)),
    child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      Icon(icon, size: 16, color: AppColors.goldPrimary),
      const SizedBox(height: 4),
      Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 9)),
      const SizedBox(height: 2),
      Text(value, style: const TextStyle(color: AppColors.textPrimary, fontSize: 10, fontWeight: FontWeight.w600), maxLines: 1, overflow: TextOverflow.ellipsis, textAlign: TextAlign.center),
    ]),
  );
}
