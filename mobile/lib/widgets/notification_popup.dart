import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'dart:async';
import 'dart:math' as math;
import '../providers/notification_provider.dart';
import '../utils/constants.dart';

// ── Overlay wrapper ──────────────────────────────────────────────────────────

class NotificationOverlay extends StatefulWidget {
  final Widget child;
  const NotificationOverlay({required this.child, super.key});

  @override
  State<NotificationOverlay> createState() => _NotificationOverlayState();
}

class _NotificationOverlayState extends State<NotificationOverlay>
    with TickerProviderStateMixin {
  late final AnimationController _entry;
  late final AnimationController _progress;
  late final AnimationController _targetAnim;
  late final Animation<Offset> _entryOffset;
  late final Animation<double> _fade;

  AppNotification? _shown;
  Timer? _auto;

  // Drag state
  bool _dragging = false;
  double _dragY = 0;
  double _dragX = 0;
  bool _inTarget = false;

  // Target circle position (bottom-center of screen)
  static const double _targetSize = 64.0;
  static const double _targetBottomOffset = 80.0;

  @override
  void initState() {
    super.initState();
    _entry = AnimationController(vsync: this, duration: const Duration(milliseconds: 450));
    _progress = AnimationController(vsync: this, duration: const Duration(seconds: 4));
    _targetAnim = AnimationController(vsync: this, duration: const Duration(milliseconds: 250));

    _entryOffset = Tween(begin: const Offset(0, -1.6), end: Offset.zero)
        .animate(CurvedAnimation(parent: _entry, curve: Curves.easeOutBack));
    _fade = CurvedAnimation(parent: _entry, curve: Curves.easeOut);
  }

  @override
  void dispose() {
    _entry.dispose();
    _progress.dispose();
    _targetAnim.dispose();
    _auto?.cancel();
    super.dispose();
  }

  void _show(AppNotification n) {
    setState(() { _shown = n; _dragging = false; _dragY = 0; _dragX = 0; _inTarget = false; });
    _entry.forward(from: 0);
    _progress.forward(from: 0);
    _auto?.cancel();
    _auto = Timer(const Duration(seconds: 4), _autoDismiss);
  }

  void _autoDismiss() {
    if (_dragging) return;
    _dismiss();
  }

  void _dismiss() {
    _auto?.cancel();
    _targetAnim.reverse();
    _entry.reverse().then((_) {
      if (mounted) {
        setState(() { _shown = null; _dragging = false; _dragY = 0; _dragX = 0; });
        context.read<NotificationProvider>().dismissActive();
      }
    });
  }

  void _onLongPressStart(LongPressStartDetails d) {
    HapticFeedback.mediumImpact();
    _auto?.cancel();
    _progress.stop();
    setState(() { _dragging = true; });
    _targetAnim.forward();
  }

  void _onLongPressMoveUpdate(LongPressMoveUpdateDetails d) {
    final size = MediaQuery.of(context).size;
    final newY = (_dragY + d.offsetFromOrigin.dy).clamp(0.0, size.height * 0.7);
    final newX = d.offsetFromOrigin.dx.clamp(-size.width * 0.4, size.width * 0.4);

    // Check if near target (bottom center)
    final targetCenterY = size.height - _targetBottomOffset - _targetSize / 2;
    final cardTopY = 60 + newY; // approx card top
    final dist = math.sqrt(math.pow(newX, 2) + math.pow(newY - (targetCenterY - 60), 2));
    final inTarget = dist < _targetSize;

    if (inTarget != _inTarget) HapticFeedback.lightImpact();

    setState(() { _dragY = newY; _dragX = newX; _inTarget = inTarget; });
  }

  void _onLongPressEnd(LongPressEndDetails d) {
    if (_inTarget) {
      _dismiss();
    } else {
      // Snap back
      setState(() { _dragging = false; _dragY = 0; _dragX = 0; _inTarget = false; });
      _targetAnim.reverse();
      _progress.forward();
      _auto = Timer(Duration(seconds: math.max(1, (4 * (1 - _progress.value)).round())), _autoDismiss);
    }
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
    final size = MediaQuery.of(context).size;
    return Consumer<NotificationProvider>(
      builder: (ctx, prov, _) {
        final active = prov.activePopup;
        if (active != null && active != _shown) {
          WidgetsBinding.instance.addPostFrameCallback((_) => _show(active));
        }

        return Stack(
          children: [
            widget.child,

            // ── Dismiss target circle ──────────────────────────────────
            if (_dragging)
              Positioned(
                bottom: _targetBottomOffset,
                left: size.width / 2 - _targetSize / 2,
                child: AnimatedBuilder(
                  animation: _targetAnim,
                  builder: (_, __) => Transform.scale(
                    scale: _targetAnim.value,
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 150),
                      width: _inTarget ? _targetSize * 1.2 : _targetSize,
                      height: _inTarget ? _targetSize * 1.2 : _targetSize,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _inTarget
                            ? const Color(0xFFEF4444).withOpacity(0.9)
                            : const Color(0xFF1F1F1F).withOpacity(0.92),
                        border: Border.all(
                          color: _inTarget ? Colors.white : const Color(0xFFEF4444),
                          width: 2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFFEF4444).withOpacity(_inTarget ? 0.5 : 0.3),
                            blurRadius: _inTarget ? 24 : 12,
                          ),
                        ],
                      ),
                      child: Icon(
                        Icons.close_rounded,
                        color: _inTarget ? Colors.white : const Color(0xFFEF4444),
                        size: _inTarget ? 32 : 26,
                      ),
                    ),
                  ),
                ),
              ),

            // ── Popup card ────────────────────────────────────────────
            if (_shown != null)
              Positioned(
                top: 0, left: 0, right: 0,
                child: SafeArea(
                  child: Transform.translate(
                    offset: Offset(_dragX, _dragging ? _dragY : 0),
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(12, 6, 12, 0),
                      child: _dragging
                          ? _buildCard(_color(_shown!.type), _icon(_shown!.type))
                          : SlideTransition(
                              position: _entryOffset,
                              child: FadeTransition(
                                opacity: _fade,
                                child: _buildCard(_color(_shown!.type), _icon(_shown!.type)),
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

  Widget _buildCard(Color accent, IconData icon) {
    return GestureDetector(
      onLongPressStart: _onLongPressStart,
      onLongPressMoveUpdate: _onLongPressMoveUpdate,
      onLongPressEnd: _onLongPressEnd,
      child: AnimatedScale(
        scale: _dragging ? 0.96 : 1.0,
        duration: const Duration(milliseconds: 150),
        child: Container(
          decoration: BoxDecoration(
            color: const Color(0xFF0F0F0F),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: _inTarget
                  ? const Color(0xFFEF4444).withOpacity(0.8)
                  : accent.withOpacity(0.5),
              width: 1.2,
            ),
            boxShadow: [
              BoxShadow(color: accent.withOpacity(0.18), blurRadius: 20),
              BoxShadow(color: Colors.black.withOpacity(0.6), blurRadius: 10, offset: const Offset(0, 4)),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                IntrinsicHeight(
                  child: Row(children: [
                    Container(width: 4, color: accent),
                    const SizedBox(width: 12),
                    Container(
                      margin: const EdgeInsets.symmetric(vertical: 14),
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(color: accent.withOpacity(0.12), shape: BoxShape.circle),
                      child: Icon(icon, color: accent, size: 20),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Row(children: [
                            Expanded(
                              child: Text(_shown!.titre,
                                style: const TextStyle(fontFamily: 'Playfair Display',
                                  color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold),
                                maxLines: 1, overflow: TextOverflow.ellipsis),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.goldPrimary.withOpacity(0.08),
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(color: AppColors.goldPrimary.withOpacity(0.25)),
                              ),
                              child: const Text('LUXE DRIVE',
                                style: TextStyle(color: AppColors.goldPrimary, fontSize: 8,
                                  fontWeight: FontWeight.bold, letterSpacing: 1)),
                            ),
                          ]),
                          const SizedBox(height: 3),
                          Text(_shown!.message,
                            style: const TextStyle(color: AppColors.textSecondary, fontSize: 12, height: 1.4),
                            maxLines: 2, overflow: TextOverflow.ellipsis),
                          if (_dragging)
                            Padding(
                              padding: const EdgeInsets.only(top: 5),
                              child: Row(children: const [
                                Icon(Icons.south_rounded, color: AppColors.textMuted, size: 10),
                                SizedBox(width: 4),
                                Text('Glisser vers ✕ pour fermer',
                                  style: TextStyle(color: AppColors.textMuted, fontSize: 9)),
                              ]),
                            ),
                        ]),
                      ),
                    ),
                    // Long-press hint icon
                    Padding(
                      padding: const EdgeInsets.all(12),
                      child: Icon(
                        _dragging ? Icons.drag_indicator_rounded : Icons.touch_app_outlined,
                        color: AppColors.textMuted, size: 16,
                      ),
                    ),
                  ]),
                ),
                if (!_dragging)
                  AnimatedBuilder(
                    animation: _progress,
                    builder: (_, __) => LinearProgressIndicator(
                      value: 1 - _progress.value,
                      backgroundColor: Colors.transparent,
                      color: accent.withOpacity(0.6),
                      minHeight: 2,
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
