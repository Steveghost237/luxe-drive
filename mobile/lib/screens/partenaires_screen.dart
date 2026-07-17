import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../utils/constants.dart';

// ── Mock data ──────────────────────────────────────────────────────────────────

const _categories = ['Tous', 'Hôtellerie', 'Événementiel', 'Corporate', 'Médical'];

const _partenaires = [
  {
    'nom': 'Hôtel Hilton Yaoundé',
    'type': 'Hôtellerie',
    'desc': 'Transferts VIP pour clients séjournant à l\'Hilton. Tarifs négociés, service prioritaire.',
    'image': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=70',
    'avantage': '-15% sur toutes les courses',
    'badge': 'Premium',
  },
  {
    'nom': 'Total Energies Cameroun',
    'type': 'Corporate',
    'desc': 'Mise à disposition de chauffeurs pour cadres et délégations. Contrat annuel.',
    'image': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=70',
    'avantage': 'Facturation mensuelle',
    'badge': 'Corporate',
  },
  {
    'nom': 'Palais des Congrès',
    'type': 'Événementiel',
    'desc': 'Transport officiel pour événements, conférences et sommets diplomatiques.',
    'image': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=70',
    'avantage': 'Véhicules labellisés VIP',
    'badge': 'Officiel',
  },
  {
    'nom': 'Clinique Générale de Yaoundé',
    'type': 'Médical',
    'desc': 'Transport de patients et personnel médical. Confidentialité et ponctualité garanties.',
    'image': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=70',
    'avantage': 'Disponibilité 24h/24',
    'badge': 'Médical',
  },
  {
    'nom': 'Ambassade de France',
    'type': 'Corporate',
    'desc': 'Protocole diplomatique. Chauffeurs certifiés, véhicules blindés disponibles.',
    'image': 'https://images.unsplash.com/photo-1529419412599-7bb870e11810?auto=format&fit=crop&w=400&q=70',
    'avantage': 'Chauffeurs bilingues',
    'badge': 'Diplomatique',
  },
  {
    'nom': 'Les Grandes Occasions CM',
    'type': 'Événementiel',
    'desc': 'Mariages, galas et cérémonies privées. Décoration véhicule incluse sur demande.',
    'image': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=70',
    'avantage': 'Pack mariage disponible',
    'badge': 'Premium',
  },
];

Color _badgeColor(String b) {
  switch (b) {
    case 'Premium':     return const Color(0xFFD4A017);
    case 'Corporate':   return const Color(0xFF60A5FA);
    case 'Officiel':    return const Color(0xFF34D399);
    case 'Médical':     return const Color(0xFFEF4444);
    case 'Diplomatique': return const Color(0xFF9333EA);
    default:            return AppColors.textMuted;
  }
}

// ── Screen ────────────────────────────────────────────────────────────────────

class PartenairesScreen extends StatefulWidget {
  const PartenairesScreen({super.key});
  @override
  State<PartenairesScreen> createState() => _PartenairesScreenState();
}

class _PartenairesScreenState extends State<PartenairesScreen> {
  String _selected = 'Tous';

  @override
  Widget build(BuildContext context) {
    final filtered = _selected == 'Tous'
        ? _partenaires
        : _partenaires.where((p) => p['type'] == _selected).toList();

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light,
      child: Scaffold(
        backgroundColor: AppColors.darkBg,
        appBar: AppBar(
          title: const Text('Nos Partenaires'),
          backgroundColor: AppColors.darkSurface,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ),
        body: Column(
          children: [
            // ── Header hero ───────────────────────────────────────────────
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [AppColors.goldPrimary.withOpacity(0.2), AppColors.darkCard],
                  begin: Alignment.topLeft, end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.goldPrimary.withOpacity(0.3)),
              ),
              child: Row(children: [
                const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Réseau de Partenaires', style: TextStyle(color: AppColors.textPrimary, fontSize: 16, fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
                  SizedBox(height: 4),
                  Text('Accédez à des avantages exclusifs avec nos partenaires certifiés', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                ])),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(color: AppColors.goldPrimary.withOpacity(0.1), borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.goldPrimary.withOpacity(0.3))),
                  child: const Column(children: [
                    Text('6+', style: TextStyle(color: AppColors.goldPrimary, fontSize: 22, fontWeight: FontWeight.bold)),
                    Text('Partenaires', style: TextStyle(color: AppColors.textMuted, fontSize: 9)),
                  ]),
                ),
              ]),
            ),

            // ── Filtres catégorie ─────────────────────────────────────────
            SizedBox(
              height: 38,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                itemCount: _categories.length,
                itemBuilder: (ctx, i) {
                  final cat = _categories[i];
                  final active = cat == _selected;
                  return GestureDetector(
                    onTap: () => setState(() => _selected = cat),
                    child: Container(
                      margin: const EdgeInsets.only(right: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: active ? AppColors.goldPrimary : AppColors.darkCard,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: active ? AppColors.goldPrimary : AppColors.darkBorder),
                      ),
                      child: Text(cat, style: TextStyle(color: active ? Colors.black : AppColors.textSecondary, fontSize: 12, fontWeight: active ? FontWeight.bold : FontWeight.normal)),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 8),

            // ── Liste partenaires ─────────────────────────────────────────
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 40),
                itemCount: filtered.length,
                itemBuilder: (ctx, i) {
                  final p = filtered[i];
                  final bc = _badgeColor(p['badge'] as String);
                  return Container(
                    margin: const EdgeInsets.only(bottom: 14),
                    decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.darkBorder)),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      // Image + badge
                      Stack(children: [
                        ClipRRect(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                          child: Image.network(p['image'] as String, height: 120, width: double.infinity, fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(height: 120, color: const Color(0xFF1F2937))),
                        ),
                        Positioned(top: 10, left: 10, child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(color: bc.withOpacity(0.2), borderRadius: BorderRadius.circular(20), border: Border.all(color: bc.withOpacity(0.6))),
                          child: Text(p['badge'] as String, style: TextStyle(color: bc, fontSize: 10, fontWeight: FontWeight.bold)),
                        )),
                        Positioned(top: 10, right: 10, child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(8)),
                          child: Text(p['type'] as String, style: const TextStyle(color: Colors.white70, fontSize: 10)),
                        )),
                      ]),
                      // Contenu
                      Padding(
                        padding: const EdgeInsets.all(14),
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(p['nom'] as String, style: const TextStyle(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold, fontFamily: 'Playfair Display')),
                          const SizedBox(height: 4),
                          Text(p['desc'] as String, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12), maxLines: 2, overflow: TextOverflow.ellipsis),
                          const SizedBox(height: 10),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(color: AppColors.goldPrimary.withOpacity(0.08), borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.goldPrimary.withOpacity(0.25))),
                            child: Row(mainAxisSize: MainAxisSize.min, children: [
                              const Icon(Icons.star_rounded, color: AppColors.goldPrimary, size: 12),
                              const SizedBox(width: 5),
                              Text(p['avantage'] as String, style: const TextStyle(color: AppColors.goldPrimary, fontSize: 11, fontWeight: FontWeight.w600)),
                            ]),
                          ),
                          const SizedBox(height: 10),
                          SizedBox(
                            width: double.infinity,
                            child: OutlinedButton(
                              onPressed: () {},
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppColors.goldPrimary,
                                side: BorderSide(color: AppColors.goldPrimary.withOpacity(0.4)),
                                padding: const EdgeInsets.symmetric(vertical: 10),
                              ),
                              child: const Text('En savoir plus', style: TextStyle(fontSize: 12)),
                            ),
                          ),
                        ]),
                      ),
                    ]),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
