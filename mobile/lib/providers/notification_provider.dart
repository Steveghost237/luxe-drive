import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:collection';
import '../services/api_service.dart';

class AppNotification {
  final String id;
  final String titre;
  final String message;
  final String type;
  final bool estLue;
  final DateTime createdAt;

  AppNotification({
    required this.id,
    required this.titre,
    required this.message,
    required this.type,
    required this.estLue,
    required this.createdAt,
  });

  factory AppNotification.fromJson(Map<String, dynamic> j) => AppNotification(
        id: j['id'] as String? ?? '',
        titre: j['titre'] as String? ?? 'Notification',
        message: j['message'] as String? ?? '',
        type: j['type'] as String? ?? 'info',
        estLue: j['est_lue'] as bool? ?? false,
        createdAt:
            DateTime.tryParse(j['created_at'] as String? ?? '') ?? DateTime.now(),
      );

  AppNotification copyWith({bool? estLue}) => AppNotification(
        id: id, titre: titre, message: message, type: type,
        estLue: estLue ?? this.estLue, createdAt: createdAt,
      );
}

class NotificationProvider extends ChangeNotifier {
  final _api = ApiService();
  List<AppNotification> _all = [];
  final Queue<AppNotification> _queue = Queue();
  AppNotification? _active;
  Timer? _timer;
  String? _uid;
  Set<String> _seenIds = {};

  List<AppNotification> get all => _all;
  int get unreadCount => _all.where((n) => !n.estLue).length;
  AppNotification? get activePopup => _active;

  // ── Polling ──────────────────────────────────────────────────────────────

  void start(String userId) {
    if (_uid == userId) return;
    _uid = userId;
    _seenIds = {};
    _fetch();
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 30), (_) => _fetch());
  }

  void stop() {
    _timer?.cancel();
    _uid = null;
  }

  Future<void> refresh() async => _fetch();

  Future<void> _fetch() async {
    if (_uid == null) return;
    try {
      final res = await _api.get('/api/notifications/$_uid');
      final data = (res.data as List)
          .map((e) => AppNotification.fromJson(e as Map<String, dynamic>))
          .toList();

      final newOnes = data
          .where((n) => !n.estLue && !_seenIds.contains(n.id))
          .toList();

      _all = data;
      for (final n in newOnes) {
        _seenIds.add(n.id);
        _queue.add(n);
      }
      _maybeShow();
      notifyListeners();
    } catch (_) {}
  }

  // ── Popup queue ──────────────────────────────────────────────────────────

  void _maybeShow() {
    if (_active != null || _queue.isEmpty) return;
    _active = _queue.removeFirst();
    notifyListeners();
  }

  void dismissActive() {
    _active = null;
    Future.delayed(const Duration(milliseconds: 300), () {
      _maybeShow();
      notifyListeners();
    });
  }

  // Inject a local notification (e.g. after a reservation)
  void push(String titre, String message, {String type = 'succes'}) {
    final n = AppNotification(
      id: 'local_${DateTime.now().millisecondsSinceEpoch}',
      titre: titre, message: message, type: type,
      estLue: false, createdAt: DateTime.now(),
    );
    _all.insert(0, n);
    _queue.add(n);
    _maybeShow();
    notifyListeners();
  }

  // ── Mark read ─────────────────────────────────────────────────────────────

  Future<void> markRead(String id) async {
    try {
      await _api.patch('/api/notifications/$id/lue');
      _all = _all.map((n) => n.id == id ? n.copyWith(estLue: true) : n).toList();
      notifyListeners();
    } catch (_) {}
  }

  Future<void> markAllRead() async {
    if (_uid == null) return;
    try {
      await _api.patch('/api/notifications/$_uid/tout-lire');
      _all = _all.map((n) => n.copyWith(estLue: true)).toList();
      notifyListeners();
    } catch (_) {}
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
