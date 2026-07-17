import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../utils/constants.dart';

// ── Mock data ──────────────────────────────────────────────────────────────────

const _points = 2840;
const _niveau = 'Or';
const _nextLevel = 'Platine';
const _pointsNext = 5000;

const _recompenses = [
  {'titre': 'Course gratuite', 'desc': 'Transfert aéroport offert', 'points': 800, 'dispo': true},
  {'titre': 'Surclassement VIP', 'desc': 'Passage en Berline VIP sur votre prochaine résa', 'points': 1200, 'dispo': true},
  {'titre': 'Weekend chauffeur', 'desc': '2 jours de mise à disposition inclus', 'points': 3000, 'dispo': false},
  {'titre': 'Accès Lounge', 'desc': 'Accès salon VIP aéroport Nsimalen', 'points': 500, 'dispo': true},
  {'titre': 'Remise 20%', 'desc': 'Réduction sur votre prochaine réservation', 'points': 600, 'dispo': true},
  {'titre': 'Conciergerie privée', 'desc': 'Service conciergerie premium 24h/24', 'points': 5000, 'dispo': false},
];

const _historique = [
  {'desc': 'Location Mercedes S 580', 'date': '12 Jun', 'pts': '+180', 'credit': true},
  {'desc': 'Parrainage M. Ondoua', 'date': '10 Jun', 'pts': '+500', 'credit': true},
  {'desc': 'Échange — Course gratuite', 'date': '05 Jun', 'pts': '-800', 'credit': false},
  {'desc': 'Location Audi A8 L', 'date': '02 Jun', 'pts': '+120', 'credit': true},
  {'desc': 'Bonus fidélité mensuel', 'date': '01 Jun', 'pts': '+200', 'credit': true},
];

// ── Helpers ────────────────────────────────────────────────────────────────────

Color _niveauColor(String n) {
  switch (n) {
    case 'Or':       return const Color(0xFFD4A017);
    case 'Platine':  return const Color(0xFF60A5FA);
    case 'Diamant':  return const Color(0xFF34D399);
    default:         return const Color(0xFF9CA3AF);
  }
}

// ── Screen ────────────────────────────────────────────────────────────────────

class FideliteScreen extends StatelessWidget {
  const FideliteScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final progress = _points / _pointsNext;
    final nc = _niveauColor(_niveau);

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light,
      child: Scaffold(
        backgroundColor: AppColors.darkBg,
        appBar: AppBar(
          title: const Text('Programme Fidélité'),
          backgroundColor: AppColors.darkSurface,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ),
        body: ListView(
          padding: const EdgeInsets.fromLTRB(16, 20, 16, 40),
          children: [
            // ── Carte niveau ──────────────────────────────────────────────
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [nc.withOpacity(0.3), AppColors.darkCard],
                  begin: Alignment.topLeft, end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: nc.withOpacity(0.5)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                      decoration: BoxDecoration(color: nc.withOpacity(0.2), borderRadius: BorderRadius.circular(20), border: Border.all(color: nc)),
                      child: Row(mainAxisSize: MainAxisSize.min, children: [
                        Icon(Icons.workspace_premium_rounded, color: nc, size: 14),
                        const SizedBox(width: 6),
                        Text('Niveau $_niveau', style: TextStyle(color: nc, fontSize: 12, fontWeight: FontWeight.bold)),
                      ]),
                    ),
                    const Spacer(),
                    const Text('Luxe Drive', style: TextStyle(color: AppColors.textMuted, fontSize: 11, fontFamily: 'Playfair Display')),
                  ]),
                  const SizedBox(height: 16),
                  const Text('Mes points', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                  Text('$_points pts', style: TextStyle(color: nc, fontSize: 40, fontWeight: FontWeight.bold, fontFamily: 'Playfair Display', height: 1.1)),
                  const SizedBox(height: 14),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(value: progress, backgroundColor: const Color(0xFF1F2937), color: nc, minHeight: 8),
                  ),
                  const SizedBox(height: 6),
                  Text('$_points / $_pointsNext pts pour atteindre $_nextLevel',
                    style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // ── Avantages niveau ──────────────────────────────────────────
            const Text('Avantages niveau Or', style: TextStyle(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            ...[
              {'icon': Icons.local_offer_rounded,    'label': 'Remises exclusives jusqu\'à 20%'},
              {'icon': Icons.star_rounded,            'label': 'Accès prioritaire aux véhicules premium'},
              {'icon': Icons.headset_mic_rounded,     'label': 'Support dédié 24h/24'},
              {'icon': Icons.card_giftcard_rounded,   'label': '×2 points sur locations longue durée'},
            ].map((a) => Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.darkBorder)),
              child: Row(children: [
                Icon(a['icon'] as IconData, color: nc, size: 18),
                const SizedBox(width: 12),
                Text(a['label'] as String, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
              ]),
            )),
            const SizedBox(height: 24),

            // ── Récompenses ───────────────────────────────────────────────
            const Text('Récompenses disponibles', style: TextStyle(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            GridView.count(
              crossAxisCount: 2, shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 10, mainAxisSpacing: 10, childAspectRatio: 1.5,
              children: _recompenses.map((r) {
                final canRedeem = (r['dispo'] == true) && (_points >= (r['points'] as int));
                return Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: canRedeem ? nc.withOpacity(0.08) : AppColors.darkCard,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: canRedeem ? nc.withOpacity(0.4) : AppColors.darkBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(r['titre'] as String, style: TextStyle(color: canRedeem ? AppColors.textPrimary : AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.bold), maxLines: 2),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('${r['points']} pts', style: TextStyle(color: canRedeem ? nc : AppColors.textMuted, fontSize: 13, fontWeight: FontWeight.bold)),
                          if (canRedeem)
                            const Text('Échangeable', style: TextStyle(color: Color(0xFF34D399), fontSize: 9)),
                        ],
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // ── Historique ────────────────────────────────────────────────
            const Text('Historique des points', style: TextStyle(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            ..._historique.map((h) {
              final credit = h['credit'] == true;
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.darkBorder)),
                child: Row(children: [
                  Container(
                    width: 34, height: 34,
                    decoration: BoxDecoration(
                      color: credit ? const Color(0xFF34D399).withOpacity(0.1) : const Color(0xFFEF4444).withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(credit ? Icons.add_rounded : Icons.remove_rounded,
                      color: credit ? const Color(0xFF34D399) : const Color(0xFFEF4444), size: 16),
                  ),
                  const SizedBox(width: 10),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(h['desc'] as String, style: const TextStyle(color: AppColors.textPrimary, fontSize: 12)),
                    Text(h['date'] as String, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
                  ])),
                  Text(h['pts'] as String, style: TextStyle(color: credit ? const Color(0xFF34D399) : const Color(0xFFEF4444), fontSize: 13, fontWeight: FontWeight.bold)),
                ]),
              );
            }),
          ],
        ),
      ),
    );
  }
}
