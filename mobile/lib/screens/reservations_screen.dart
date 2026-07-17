import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import '../utils/constants.dart';

class ReservationsScreen extends StatefulWidget {
  const ReservationsScreen({super.key});
  @override
  State<ReservationsScreen> createState() => _ReservationsScreenState();
}

class _ReservationsScreenState extends State<ReservationsScreen> {
  List<dynamic> _reservations = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  Future<void> _fetch() async {
    final user = context.read<AuthProvider>().user;
    if (user == null) return;
    try {
      final res = await ApiService().get(
        AppEndpoints.reservations,
        params: {'client_id': user.id},
      );
      if (mounted) setState(() { _reservations = res.data as List; _loading = false; });
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'confirmee':  return Colors.blue;
      case 'en_cours':   return Colors.green;
      case 'terminee':   return Colors.grey;
      case 'annulee':    return Colors.red;
      default:           return Colors.orange;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: AppBar(title: const Text('Mes Réservations'), backgroundColor: AppColors.darkSurface),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppColors.goldPrimary))
          : _reservations.isEmpty
              ? Center(
                  child: Column(mainAxisSize: MainAxisSize.min, children: [
                    const Icon(Icons.calendar_today_outlined, color: AppColors.textMuted, size: 48),
                    const SizedBox(height: 12),
                    const Text('Aucune réservation', style: TextStyle(color: AppColors.textMuted)),
                  ]),
                )
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: _reservations.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 10),
                  itemBuilder: (_, i) {
                    final r = _reservations[i] as Map<String, dynamic>;
                    final status = r['statut'] as String? ?? 'en_attente';
                    return Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.darkCard,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.darkBorder),
                      ),
                      child: Row(children: [
                        Container(
                          width: 42, height: 42,
                          decoration: BoxDecoration(
                            color: AppColors.goldPrimary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: const Icon(Icons.directions_car, color: AppColors.goldPrimary, size: 20),
                        ),
                        const SizedBox(width: 12),
                        Expanded(child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(r['reference'] as String? ?? '—',
                              style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w600)),
                            Text((r['type_reservation'] as String? ?? '').toUpperCase(),
                              style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
                          ],
                        )),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: _statusColor(status).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: _statusColor(status).withOpacity(0.3)),
                          ),
                          child: Text(status,
                            style: TextStyle(color: _statusColor(status), fontSize: 11, fontWeight: FontWeight.w600)),
                        ),
                      ]),
                    );
                  },
                ),
    );
  }
}
