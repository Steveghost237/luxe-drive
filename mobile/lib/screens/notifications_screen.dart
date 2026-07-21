import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/notification_provider.dart';
import '../providers/auth_provider.dart';
import '../utils/constants.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    final auth = context.read<AuthProvider>();
    final prov = context.read<NotificationProvider>();
    if (auth.user != null) await prov.refresh();
    if (mounted) setState(() => _loading = false);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  static Color _color(String type) {
    switch (type) {
      case 'succes':    return const Color(0xFF22C55E);
      case 'alerte':    return const Color(0xFFEF4444);
      case 'promotion': return AppColors.goldPrimary;
      default:          return const Color(0xFF60A5FA);
    }
  }

  static IconData _icon(String type) {
    switch (type) {
      case 'succes':    return Icons.check_circle_rounded;
      case 'alerte':    return Icons.warning_amber_rounded;
      case 'promotion': return Icons.local_offer_rounded;
      default:          return Icons.notifications_rounded;
    }
  }

  static String _timeAgo(DateTime dt) {
    final d = DateTime.now().difference(dt);
    if (d.inMinutes < 1)  return 'À l\'instant';
    if (d.inMinutes < 60) return 'il y a ${d.inMinutes} min';
    if (d.inHours < 24)   return 'il y a ${d.inHours} h';
    if (d.inDays < 7)     return 'il y a ${d.inDays} j';
    return '${dt.day}/${dt.month}/${dt.year}';
  }

  // ── Build ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final prov = context.watch<NotificationProvider>();
    final notifs = prov.all;
    final unread = notifs.where((n) => !n.estLue).toList();
    final read   = notifs.where((n) => n.estLue).toList();

    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: AppBar(
        title: Row(children: [
          const Text('Notifications'),
          if (prov.unreadCount > 0) ...[
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: AppColors.goldPrimary,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text('${prov.unreadCount}',
                style: const TextStyle(color: Colors.black, fontSize: 11, fontWeight: FontWeight.bold)),
            ),
          ],
        ]),
        backgroundColor: AppColors.darkSurface,
        actions: [
          if (prov.unreadCount > 0)
            TextButton(
              onPressed: () => prov.markAllRead(),
              child: const Text('Tout lire', style: TextStyle(color: AppColors.goldPrimary, fontSize: 12)),
            ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppColors.goldPrimary))
          : notifs.isEmpty
              ? _empty()
              : RefreshIndicator(
                  color: AppColors.goldPrimary,
                  onRefresh: _load,
                  child: ListView(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 40),
                    children: [
                      if (unread.isNotEmpty) ...[
                        _sectionLabel('Nouvelles'),
                        const SizedBox(height: 8),
                        ...unread.map((n) => _NotifCard(
                          notif: n, color: _color(n.type), icon: _icon(n.type),
                          timeAgo: _timeAgo(n.createdAt),
                          onTap: () => prov.markRead(n.id),
                        )),
                        const SizedBox(height: 20),
                      ],
                      if (read.isNotEmpty) ...[
                        _sectionLabel('Lues'),
                        const SizedBox(height: 8),
                        ...read.map((n) => _NotifCard(
                          notif: n, color: _color(n.type), icon: _icon(n.type),
                          timeAgo: _timeAgo(n.createdAt),
                          onTap: null,
                        )),
                      ],
                    ],
                  ),
                ),
    );
  }

  Widget _sectionLabel(String label) => Padding(
    padding: const EdgeInsets.only(bottom: 4),
    child: Text(label.toUpperCase(),
      style: const TextStyle(color: AppColors.textMuted, fontSize: 10, letterSpacing: 1.5, fontWeight: FontWeight.w600)),
  );

  Widget _empty() => Center(
    child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: AppColors.darkCard,
            shape: BoxShape.circle,
            border: Border.all(color: AppColors.darkBorder),
          ),
          child: const Icon(Icons.notifications_off_outlined, color: AppColors.textMuted, size: 40),
        ),
        const SizedBox(height: 16),
        const Text('Aucune notification', style: TextStyle(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w600)),
        const SizedBox(height: 6),
        const Text('Vos activités apparaîtront ici', style: TextStyle(color: AppColors.textMuted, fontSize: 13)),
      ],
    ),
  );
}

// ── Notification Card ─────────────────────────────────────────────────────────

class _NotifCard extends StatelessWidget {
  final AppNotification notif;
  final Color color;
  final IconData icon;
  final String timeAgo;
  final VoidCallback? onTap;

  const _NotifCard({
    required this.notif, required this.color, required this.icon,
    required this.timeAgo, this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isUnread = !notif.estLue;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        decoration: BoxDecoration(
          color: isUnread ? color.withOpacity(0.05) : AppColors.darkCard,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isUnread ? color.withOpacity(0.3) : AppColors.darkBorder,
          ),
        ),
        child: IntrinsicHeight(
          child: Row(
            children: [
              // Accent bar
              Container(
                width: 3,
                decoration: BoxDecoration(
                  color: isUnread ? color : Colors.transparent,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(14), bottomLeft: Radius.circular(14),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              // Icon
              Container(
                margin: const EdgeInsets.symmetric(vertical: 14),
                padding: const EdgeInsets.all(9),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: color, size: 18),
              ),
              const SizedBox(width: 12),
              // Content
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(children: [
                        Expanded(
                          child: Text(notif.titre,
                            style: TextStyle(
                              color: isUnread ? AppColors.textPrimary : AppColors.textSecondary,
                              fontSize: 13, fontWeight: FontWeight.bold,
                              fontFamily: 'Playfair Display',
                            ),
                            maxLines: 1, overflow: TextOverflow.ellipsis),
                        ),
                        Text(timeAgo,
                          style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
                      ]),
                      const SizedBox(height: 3),
                      Text(notif.message,
                        style: const TextStyle(color: AppColors.textSecondary, fontSize: 12, height: 1.4),
                        maxLines: 2, overflow: TextOverflow.ellipsis),
                    ],
                  ),
                ),
              ),
              // Unread dot
              if (isUnread)
                Padding(
                  padding: const EdgeInsets.only(right: 14),
                  child: Container(
                    width: 7, height: 7,
                    decoration: BoxDecoration(color: color, shape: BoxShape.circle),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
