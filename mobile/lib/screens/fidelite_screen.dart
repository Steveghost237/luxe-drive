import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import '../utils/constants.dart';

class FideliteScreen extends StatefulWidget {
  const FideliteScreen({super.key});

  @override
  State<FideliteScreen> createState() => _FideliteScreenState();
}

class _FideliteScreenState extends State<FideliteScreen> {
  bool _loading = true;
  String? _error;
  Map<String, dynamic>? _compte;
  List<dynamic> _recompenses = [];
  List<dynamic> _transactions = [];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    setState(() { _loading = true; _error = null; });
    final uid = context.read<AuthProvider>().user?.id;
    if (uid == null) { setState(() { _loading = false; _error = 'Non connecté'; }); return; }
    final api = ApiService();
    try {
      final results = await Future.wait([
        api.get('/api/fidelite/$uid').catchError((_) => null),
        api.get('/api/fidelite/recompenses').catchError((_) => null),
      ]);
      if (mounted) {
        setState(() {
          if (results[0] != null) {
            _compte = results[0]!.data as Map<String, dynamic>?;
            _transactions = (_compte?['transactions'] as List?) ?? [];
          }
          if (results[1] != null) _recompenses = results[1]!.data as List? ?? [];
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() { _loading = false; _error = 'Impossible de charger les données'; });
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  int get _points => _compte?['solde_points'] as int? ?? 0;

  String get _niveau {
    if (_points >= 10000) return 'Diamant';
    if (_points >= 5000)  return 'Platine';
    if (_points >= 1000)  return 'Or';
    return 'Argent';
  }

  String get _nextLevel {
    if (_points >= 10000) return 'Diamant';
    if (_points >= 5000)  return 'Diamant';
    if (_points >= 1000)  return 'Platine';
    return 'Or';
  }

  int get _pointsNext {
    if (_points >= 5000)  return 10000;
    if (_points >= 1000)  return 5000;
    return 1000;
  }

  Color get _niveauColor {
    switch (_niveau) {
      case 'Diamant': return const Color(0xFF34D399);
      case 'Platine': return const Color(0xFF60A5FA);
      case 'Or':      return AppColors.goldPrimary;
      default:        return const Color(0xFF9CA3AF);
    }
  }

  // ── Build ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
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
          actions: [
            IconButton(
              icon: const Icon(Icons.refresh_rounded, color: AppColors.textSecondary),
              onPressed: _load,
            ),
          ],
        ),
        body: _loading
            ? const Center(child: CircularProgressIndicator(color: AppColors.goldPrimary))
            : _error != null && _compte == null
                ? _buildError()
                : RefreshIndicator(
                    color: AppColors.goldPrimary,
                    onRefresh: _load,
                    child: ListView(
                      padding: const EdgeInsets.fromLTRB(16, 20, 16, 40),
                      children: [
                        _buildNiveauCard(),
                        const SizedBox(height: 24),
                        _buildAvantages(),
                        const SizedBox(height: 24),
                        _buildRecompenses(),
                        const SizedBox(height: 24),
                        _buildHistorique(),
                      ],
                    ),
                  ),
      ),
    );
  }

  // ── Niveau card ────────────────────────────────────────────────────────────

  Widget _buildNiveauCard() {
    final nc = _niveauColor;
    final progress = (_points / _pointsNext).clamp(0.0, 1.0);
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [nc.withOpacity(0.28), AppColors.darkCard],
          begin: Alignment.topLeft, end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: nc.withOpacity(0.5)),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
            decoration: BoxDecoration(
              color: nc.withOpacity(0.2), borderRadius: BorderRadius.circular(20),
              border: Border.all(color: nc),
            ),
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
        Text('$_points pts', style: TextStyle(
          color: nc, fontSize: 40, fontWeight: FontWeight.bold,
          fontFamily: 'Playfair Display', height: 1.1,
        )),
        const SizedBox(height: 14),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(value: progress, backgroundColor: const Color(0xFF1F2937), color: nc, minHeight: 8),
        ),
        const SizedBox(height: 6),
        Text('$_points / $_pointsNext pts pour atteindre $_nextLevel',
          style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
        const SizedBox(height: 12),
        Row(children: [
          _statBadge('Gagnés', '${_compte?['total_points_gagnes'] ?? 0}', const Color(0xFF22C55E)),
          const SizedBox(width: 10),
          _statBadge('Dépensés', '${_compte?['total_points_depenses'] ?? 0}', const Color(0xFFEF4444)),
        ]),
      ]),
    );
  }

  Widget _statBadge(String label, String val, Color c) => Expanded(
    child: Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: c.withOpacity(0.08), borderRadius: BorderRadius.circular(10),
        border: Border.all(color: c.withOpacity(0.25)),
      ),
      child: Column(children: [
        Text(val, style: TextStyle(color: c, fontSize: 16, fontWeight: FontWeight.bold)),
        Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
      ]),
    ),
  );

  // ── Avantages ──────────────────────────────────────────────────────────────

  Widget _buildAvantages() {
    final nc = _niveauColor;
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text('Avantages niveau $_niveau', style: const TextStyle(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold)),
      const SizedBox(height: 10),
      ...[
        {'icon': Icons.local_offer_rounded,  'label': 'Remises exclusives jusqu\'à 20%'},
        {'icon': Icons.star_rounded,          'label': 'Accès prioritaire aux véhicules premium'},
        {'icon': Icons.headset_mic_rounded,   'label': 'Support dédié 24h/24'},
        {'icon': Icons.card_giftcard_rounded, 'label': '×2 points sur locations longue durée'},
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
    ]);
  }

  // ── Récompenses ────────────────────────────────────────────────────────────

  Widget _buildRecompenses() {
    final nc = _niveauColor;
    if (_recompenses.isEmpty) {
      return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text('Récompenses disponibles', style: TextStyle(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.darkBorder)),
          child: const Center(child: Text('Aucune récompense disponible pour l\'instant', style: TextStyle(color: AppColors.textMuted, fontSize: 13))),
        ),
      ]);
    }
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      const Text('Récompenses disponibles', style: TextStyle(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold)),
      const SizedBox(height: 10),
      GridView.count(
        crossAxisCount: 2, shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
        crossAxisSpacing: 10, mainAxisSpacing: 10, childAspectRatio: 1.4,
        children: _recompenses.map((r) {
          final pts = (r['points_requis'] as int?) ?? (r['points'] as int?) ?? 0;
          final canRedeem = _points >= pts;
          return Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: canRedeem ? nc.withOpacity(0.08) : AppColors.darkCard,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: canRedeem ? nc.withOpacity(0.4) : AppColors.darkBorder),
            ),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text(r['nom'] as String? ?? r['titre'] as String? ?? '', style: TextStyle(
                color: canRedeem ? AppColors.textPrimary : AppColors.textSecondary,
                fontSize: 12, fontWeight: FontWeight.bold,
              ), maxLines: 2),
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('$pts pts', style: TextStyle(color: canRedeem ? nc : AppColors.textMuted, fontSize: 13, fontWeight: FontWeight.bold)),
                if (canRedeem) const Text('Échangeable', style: TextStyle(color: Color(0xFF34D399), fontSize: 9)),
              ]),
            ]),
          );
        }).toList(),
      ),
    ]);
  }

  // ── Historique ─────────────────────────────────────────────────────────────

  Widget _buildHistorique() {
    if (_transactions.isEmpty) {
      return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text('Historique des points', style: TextStyle(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.darkBorder)),
          child: const Center(child: Text('Aucune transaction pour l\'instant', style: TextStyle(color: AppColors.textMuted, fontSize: 13))),
        ),
      ]);
    }
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      const Text('Historique des points', style: TextStyle(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold)),
      const SizedBox(height: 10),
      ..._transactions.map((t) {
        final isGain = (t['type'] as String?) == 'gain';
        final pts = t['points'] as int? ?? 0;
        final desc = t['description'] as String? ?? '';
        final date = DateTime.tryParse(t['created_at'] as String? ?? '');
        final dateStr = date != null ? '${date.day}/${date.month}' : '—';
        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.darkBorder)),
          child: Row(children: [
            Container(
              width: 34, height: 34,
              decoration: BoxDecoration(
                color: isGain ? const Color(0xFF22C55E).withOpacity(0.1) : const Color(0xFFEF4444).withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(isGain ? Icons.add_rounded : Icons.remove_rounded,
                color: isGain ? const Color(0xFF22C55E) : const Color(0xFFEF4444), size: 16),
            ),
            const SizedBox(width: 10),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(desc.isNotEmpty ? desc : (isGain ? 'Points gagnés' : 'Points dépensés'),
                style: const TextStyle(color: AppColors.textPrimary, fontSize: 12)),
              Text(dateStr, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
            ])),
            Text(isGain ? '+$pts' : '-$pts',
              style: TextStyle(
                color: isGain ? const Color(0xFF22C55E) : const Color(0xFFEF4444),
                fontSize: 13, fontWeight: FontWeight.bold,
              )),
          ]),
        );
      }),
    ]);
  }

  // ── Error ──────────────────────────────────────────────────────────────────

  Widget _buildError() => Center(
    child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      const Icon(Icons.wifi_off_rounded, color: AppColors.textMuted, size: 48),
      const SizedBox(height: 16),
      Text(_error!, style: const TextStyle(color: AppColors.textSecondary)),
      const SizedBox(height: 16),
      ElevatedButton(onPressed: _load, child: const Text('Réessayer')),
    ]),
  );
}
