import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:async';
import '../providers/notification_provider.dart';
import '../utils/constants.dart';

// ── Overlay wrapper — place in MaterialApp builder ──────────────────────────

class NotificationOverlay extends StatefulWidget {
  final Widget child;
  const NotificationOverlay({required this.child, super.key});

  @override
  State<NotificationOverlay> createState() => _NotificationOverlayState();
}

class _NotificationOverlayState extends State<NotificationOverlay>
    with TickerProviderStateMixin {
  late final AnimationController _slide;
  late final AnimationController _progress;
  late final Animation<Offset> _offset;
  late final Animation<double> _fade;
  AppNotification? _shown;
  Timer? _auto;

  @override
  void initState() {
    super.initState();
    _slide = AnimationController(vsync: this, duration: const Duration(milliseconds: 450));
    _progress = AnimationController(vsync: this, duration: const Duration(seconds: 4));
    _offset = Tween(begin: const Offset(0, -1.6), end: Offset.zero)
        .animate(CurvedAnimation(parent: _slide, curve: Curves.easeOutBack));
    _fade = CurvedAnimation(parent: _slide, curve: Curves.easeOut);
  }

  @override
  void dispose() {
    _slide.dispose();
    _progress.dispose();
    _auto?.cancel();
    super.dispose();
  }

  void _show(AppNotification n) {
    _shown = n;
    _slide.forward(from: 0);
    _progress.forward(from: 0);
    _auto?.cancel();
    _auto = Timer(const Duration(seconds: 4), _dismiss);
  }

  void _dismiss() {
    _auto?.cancel();
    _slide.reverse().then((_) {
      if (mounted) context.read<NotificationProvider>().dismissActive();
    });
  }

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

  @override
  Widget build(BuildContext context) {
    return Consumer<NotificationProvider>(
      builder: (ctx, prov, _) {
        final active = prov.activePopup;
        if (active != null && active != _shown) {
          WidgetsBinding.instance.addPostFrameCallback((_) => _show(active));
        }

        return Stack(
          children: [
            widget.child,
            if (_shown != null)
              Positioned(
                top: 0, left: 0, right: 0,
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(12, 6, 12, 0),
                    child: SlideTransition(
                      position: _offset,
                      child: FadeTransition(
                        opacity: _fade,
                        child: _PopupCard(
                          notif: _shown!,
                          accentColor: _color(_shown!.type),
                          icon: _icon(_shown!.type),
                          progress: _progress,
                          onDismiss: _dismiss,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
          ],
        );
      },
    );
  }
}

// ── The Card ─────────────────────────────────────────────────────────────────

class _PopupCard extends StatelessWidget {
  final AppNotification notif;
  final Color accentColor;
  final IconData icon;
  final AnimationController progress;
  final VoidCallback onDismiss;

  const _PopupCard({
    required this.notif, required this.accentColor,
    required this.icon, required this.progress, required this.onDismiss,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onDismiss,
      onHorizontalDragEnd: (d) { if (d.primaryVelocity != null) onDismiss(); },
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF111111),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: accentColor.withOpacity(0.5), width: 1.2),
          boxShadow: [
            BoxShadow(color: accentColor.withOpacity(0.2), blurRadius: 20, spreadRadius: 0),
            BoxShadow(color: Colors.black.withOpacity(0.5), blurRadius: 10, offset: const Offset(0, 4)),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // ── Left accent bar + content ───────────────────────────────
              IntrinsicHeight(
                child: Row(
                  children: [
                    Container(width: 4, color: accentColor),
                    const SizedBox(width: 12),
                    // Icon
                    Container(
                      margin: const EdgeInsets.symmetric(vertical: 14),
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: accentColor.withOpacity(0.12),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(icon, color: accentColor, size: 20),
                    ),
                    const SizedBox(width: 12),
                    // Text
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(children: [
                              Expanded(
                                child: Text(
                                  notif.titre,
                                  style: const TextStyle(
                                    fontFamily: 'Playfair Display',
                                    color: AppColors.textPrimary,
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              // Luxe Drive badge
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppColors.goldPrimary.withOpacity(0.08),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: AppColors.goldPrimary.withOpacity(0.25)),
                                ),
                                child: const Text(
                                  'LUXE DRIVE',
                                  style: TextStyle(
                                    color: AppColors.goldPrimary,
                                    fontSize: 8,
                                    fontWeight: FontWeight.bold,
                                    letterSpacing: 1,
                                  ),
                                ),
                              ),
                            ]),
                            const SizedBox(height: 3),
                            Text(
                              notif.message,
                              style: const TextStyle(
                                color: AppColors.textSecondary,
                                fontSize: 12,
                                height: 1.4,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ),
                    // Dismiss
                    GestureDetector(
                      onTap: onDismiss,
                      child: const Padding(
                        padding: EdgeInsets.all(12),
                        child: Icon(Icons.close_rounded, color: AppColors.textMuted, size: 16),
                      ),
                    ),
                  ],
                ),
              ),

              // ── Progress bar ───────────────────────────────────────────
              AnimatedBuilder(
                animation: progress,
                builder: (_, __) => LinearProgressIndicator(
                  value: 1 - progress.value,
                  backgroundColor: Colors.transparent,
                  color: accentColor.withOpacity(0.6),
                  minHeight: 2,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
