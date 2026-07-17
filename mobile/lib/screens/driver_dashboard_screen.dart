import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../utils/constants.dart';

// ── Mock data ─────────────────────────────────────────────────────────────────

class _Mission {
  final String ref, vehicule, plaque, client, telephone, type, depart, arrivee, date, heure, montant;
  String statut;
  _Mission({required this.ref, required this.vehicule, required this.plaque, required this.client,
    required this.telephone, required this.type, required this.depart, required this.arrivee,
    required this.date, required this.heure, required this.montant, required this.statut});
}

final _missions = [
  _Mission(ref:'MIS-0447', vehicule:'Mercedes S 580', plaque:'LT-1234-YA', client:'M. Fouda Serge',     telephone:'+237 699 887 766', type:'Transfert Aéroport', depart:'Hôtel Pullman',    arrivee:'Aéroport Nsimalen', date:'13 Jun', heure:'10:00', montant:'25 000 FCFA', statut:'en_attente'),
  _Mission(ref:'MIS-0446', vehicule:'Audi A8 L',      plaque:'LT-5678-YA', client:'Mme Owona Sandrine', telephone:'+237 677 112 233', type:'Mise à disposition',  depart:'Bastos',           arrivee:'Melen',             date:'13 Jun', heure:'14:00', montant:'60 000 FCFA', statut:'en_attente'),
  _Mission(ref:'MIS-0445', vehicule:'Mercedes S 580', plaque:'LT-1234-YA', client:'M. Ondoua',          telephone:'+237 677 123 456', type:'Transfert Aéroport', depart:'Hôtel Hilton',     arrivee:'Aéroport Nsimalen', date:'Auj.',   heure:'14:30', montant:'25 000 FCFA', statut:'confirmee'),
  _Mission(ref:'MIS-0440', vehicule:'Range Rover',    plaque:'LT-9012-YA', client:'Ambassade France',   telephone:'+237 222 230 100', type:'Protocole officiel', depart:'Ambassade France', arrivee:'Palais de l\'Unité', date:'Auj.',  heure:'09:00', montant:'80 000 FCFA', statut:'en_cours'),
  _Mission(ref:'MIS-0435', vehicule:'Mercedes S 580', plaque:'LT-1234-YA', client:'M. Ndi Albert',      telephone:'+237 655 443 322', type:'Transfert hôtel',    depart:'Aéroport',         arrivee:'Hôtel Mont Fébé',   date:'10 Jun',heure:'18:15', montant:'30 000 FCFA', statut:'terminee'),
  _Mission(ref:'MIS-0430', vehicule:'Audi A8 L',      plaque:'LT-5678-YA', client:'Mme Bika Grace',     telephone:'+237 677 556 677', type:'Mise à disposition', depart:'Centre-ville',     arrivee:'Diverses',          date:'08 Jun',heure:'08:00', montant:'90 000 FCFA', statut:'terminee'),
];

class _Eval {
  final String client;
  final int note;
  final String comment, date;
  const _Eval({required this.client, required this.note, required this.comment, required this.date});
}

const _evals = [
  _Eval(client:'M. Etoga Jean',  note:5, comment:'Ponctuel, courtois, dress code impeccable.', date:'05 Jun'),
  _Eval(client:'Mme Bika Grace', note:5, comment:'Excellent chauffeur, conduite très douce.',  date:'03 Jun'),
  _Eval(client:'Amb. de France', note:4, comment:'Très professionnel. Légère imprécision GPS.',date:'01 Jun'),
  _Eval(client:'M. Ndi Albert',  note:5, comment:'Parfait de bout en bout.',                   date:'28 Mai'),
];

const _dressCode = [
  {'item': 'Costume noir', 'ok': true},
  {'item': 'Chemise blanche', 'ok': true},
  {'item': 'Cravate noire', 'ok': true},
  {'item': 'Chaussures noires', 'ok': true},
  {'item': 'Chaussettes noires', 'ok': false},
];

// ── Helpers UI ────────────────────────────────────────────────────────────────

Widget _stars(int n, {double size = 14}) {
  return Row(
    mainAxisSize: MainAxisSize.min,
    children: List.generate(5, (i) => Icon(
      i < n ? Icons.star_rounded : Icons.star_outline_rounded,
      size: size,
      color: i < n ? const Color(0xFFFBBF24) : const Color(0xFF374151),
    )),
  );
}

Color _statutColor(String s) {
  switch (s) {
    case 'en_attente': return const Color(0xFFF59E0B);
    case 'confirmee':  return const Color(0xFF60A5FA);
    case 'en_cours':   return const Color(0xFF34D399);
    case 'terminee':   return const Color(0xFF9CA3AF);
    case 'annulee':    return const Color(0xFFEF4444);
    default:           return AppColors.textMuted;
  }
}

String _statutLabel(String s) {
  const m = {'en_attente':'En attente','confirmee':'Confirmée','en_cours':'En cours','terminee':'Terminée','annulee':'Annulée'};
  return m[s] ?? s;
}

Widget _card({required Widget child, EdgeInsets? padding, Color? border}) {
  return Container(
    margin: const EdgeInsets.only(bottom: 12),
    decoration: BoxDecoration(
      color: AppColors.darkCard,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(color: border ?? AppColors.darkBorder),
    ),
    child: padding != null ? Padding(padding: padding, child: child) : child,
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────

class DriverDashboardScreen extends StatefulWidget {
  const DriverDashboardScreen({super.key});
  @override
  State<DriverDashboardScreen> createState() => _DriverDashboardScreenState();
}

class _DriverDashboardScreenState extends State<DriverDashboardScreen> {
  int _tab = 0;
  bool _disponible = true;
  final _missionsList = List<_Mission>.from(_missions);

  void _updateStatut(String ref, String statut) =>
    setState(() { for (final m in _missionsList) { if (m.ref == ref) m.statut = statut; } });

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light,
      child: Scaffold(
        backgroundColor: AppColors.darkBg,
        body: IndexedStack(
          index: _tab,
          children: [
            _HomeTab(user: user, disponible: _disponible, onToggle: (v) => setState(() => _disponible = v), missions: _missionsList),
            _MissionsTab(missions: _missionsList, onUpdate: _updateStatut),
            _PlanningTab(missions: _missionsList),
            const _EvalsTab(),
            const _PerformanceTab(),
            const _NotificationsDriverTab(),
            _ProfilTab(user: user, onLogout: () async { await auth.logout(); if (context.mounted) context.go(AppRoutes.login); }),
          ],
        ),
        bottomNavigationBar: _BottomNav(current: _tab, onTap: (i) => setState(() => _tab = i)),
      ),
    );
  }
}

// ── Bottom navigation ─────────────────────────────────────────────────────────

class _BottomNav extends StatelessWidget {
  final int current;
  final ValueChanged<int> onTap;
  const _BottomNav({required this.current, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final items = [
      {'icon': Icons.dashboard_rounded,      'label': 'Accueil'},
      {'icon': Icons.directions_car_rounded, 'label': 'Missions'},
      {'icon': Icons.calendar_month_rounded, 'label': 'Planning'},
      {'icon': Icons.star_rounded,           'label': 'Évals'},
      {'icon': Icons.bar_chart_rounded,      'label': 'Perfs'},
      {'icon': Icons.notifications_rounded,  'label': 'Alertes'},
      {'icon': Icons.person_rounded,         'label': 'Profil'},
    ];
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.darkSurface,
        border: Border(top: BorderSide(color: AppColors.darkBorder)),
      ),
      child: SafeArea(
        child: SizedBox(
          height: 60,
          child: Row(
            children: List.generate(items.length, (i) {
              final active = i == current;
              return Expanded(
                child: GestureDetector(
                  onTap: () => onTap(i),
                  behavior: HitTestBehavior.opaque,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(items[i]['icon'] as IconData,
                        size: 22,
                        color: active ? AppColors.goldPrimary : AppColors.textMuted),
                      const SizedBox(height: 2),
                      Text(items[i]['label'] as String,
                        style: TextStyle(
                          fontSize: 10,
                          color: active ? AppColors.goldPrimary : AppColors.textMuted,
                          fontWeight: active ? FontWeight.w600 : FontWeight.normal,
                        )),
                    ],
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}

// ── Tab Accueil ───────────────────────────────────────────────────────────────

class _HomeTab extends StatelessWidget {
  final dynamic user;
  final bool disponible;
  final ValueChanged<bool> onToggle;
  final List<_Mission> missions;
  const _HomeTab({required this.user, required this.disponible, required this.onToggle, required this.missions});

  @override
  Widget build(BuildContext context) {
    final next = missions.firstWhere((m) => m.statut == 'confirmee' || m.statut == 'en_cours',
        orElse: () => missions.first);
    final dressOk = _dressCode.every((d) => d['ok'] == true);
    final double avgNote = _evals.fold(0, (s, e) => s + e.note) / _evals.length;

    return SafeArea(
      child: CustomScrollView(
        slivers: [
          // Header
          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 44, height: 44,
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(colors: [Color(0xFFD4A017), Color(0xFFB87D10)]),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Center(child: Text(
                          (user?.prenom?[0] ?? 'C').toUpperCase(),
                          style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 18),
                        )),
                      ),
                      const SizedBox(width: 12),
                      Expanded(child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Bonjour, ${user?.prenom ?? 'Chauffeur'} 👋',
                            style: const TextStyle(color: AppColors.textPrimary, fontSize: 18, fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
                          Row(children: [
                            _stars(avgNote.round(), size: 12),
                            const SizedBox(width: 4),
                            Text(avgNote.toStringAsFixed(1), style: const TextStyle(color: Color(0xFFFBBF24), fontSize: 12, fontWeight: FontWeight.bold)),
                          ]),
                        ],
                      )),
                      // Toggle disponibilité
                      GestureDetector(
                        onTap: () => onToggle(!disponible),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            color: disponible ? const Color(0xFF16A34A).withOpacity(0.15) : AppColors.darkCard,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: disponible ? const Color(0xFF34D399) : AppColors.darkBorder),
                          ),
                          child: Row(children: [
                            Container(width: 8, height: 8, decoration: BoxDecoration(
                              color: disponible ? const Color(0xFF34D399) : AppColors.textMuted,
                              shape: BoxShape.circle,
                            )),
                            const SizedBox(width: 6),
                            Text(disponible ? 'Dispo' : 'Occupé',
                              style: TextStyle(color: disponible ? const Color(0xFF34D399) : AppColors.textMuted, fontSize: 12, fontWeight: FontWeight.w600)),
                          ]),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // KPI stats
                  Row(children: [
                    _StatCard('18', 'Missions', const Color(0xFFD4A017)),
                    const SizedBox(width: 10),
                    _StatCard('4.9★', 'Note', const Color(0xFFFBBF24)),
                    const SizedBox(width: 10),
                    _StatCard('185K', 'FCFA', const Color(0xFF34D399)),
                    const SizedBox(width: 10),
                    _StatCard('1 240', 'Km', const Color(0xFF60A5FA)),
                  ]),
                  const SizedBox(height: 20),

                  // Prochaine mission
                  const Text('Prochaine mission', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 15)),
                  const SizedBox(height: 10),
                  _MissionBanner(m: next),
                  const SizedBox(height: 20),

                  // Dress code
                  _card(
                    padding: const EdgeInsets.all(16),
                    border: dressOk ? const Color(0xFF34D399).withOpacity(0.4) : const Color(0xFFF59E0B).withOpacity(0.4),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(children: [
                          Icon(dressOk ? Icons.check_circle_rounded : Icons.warning_rounded,
                            color: dressOk ? const Color(0xFF34D399) : const Color(0xFFF59E0B), size: 18),
                          const SizedBox(width: 8),
                          const Text('Dress Code du jour', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14)),
                        ]),
                        const SizedBox(height: 10),
                        ..._dressCode.map((d) => Padding(
                          padding: const EdgeInsets.only(bottom: 6),
                          child: Row(children: [
                            Icon(d['ok'] == true ? Icons.check_circle_outline_rounded : Icons.cancel_outlined,
                              size: 16,
                              color: d['ok'] == true ? const Color(0xFF34D399) : const Color(0xFFF59E0B)),
                            const SizedBox(width: 8),
                            Text(d['item'] as String, style: TextStyle(
                              color: d['ok'] == true ? AppColors.textSecondary : const Color(0xFFFBBF24),
                              fontSize: 13,
                            )),
                          ]),
                        )),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // ── Courses disponibles ──────────────────────────────────
                  const Text('Courses disponibles', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 15)),
                  const SizedBox(height: 10),
                  ...[
                    {'ref':'CRS-001', 'type':'Transfert Aéroport', 'depart':'Hôtel Hilton', 'arrivee':'Nsimalen', 'montant':'25 000 FCFA', 'heure':'15h00'},
                    {'ref':'CRS-002', 'type':'Mise à disposition',  'depart':'Bastos',       'arrivee':'Centre-ville','montant':'60 000 FCFA','heure':'17h30'},
                  ].map((c) => _card(
                    border: AppColors.goldPrimary.withOpacity(0.2),
                    padding: const EdgeInsets.all(14),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Row(children: [
                        Text(c['ref']!, style: const TextStyle(color: AppColors.textMuted, fontSize: 10, fontFamily: 'monospace')),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(color: AppColors.goldPrimary.withOpacity(0.1), borderRadius: BorderRadius.circular(20), border: Border.all(color: AppColors.goldPrimary.withOpacity(0.3))),
                          child: Text(c['heure']!, style: const TextStyle(color: AppColors.goldPrimary, fontSize: 10, fontWeight: FontWeight.bold)),
                        ),
                      ]),
                      const SizedBox(height: 6),
                      Text(c['type']!, style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Row(children: [
                        const Icon(Icons.location_on_rounded, size: 12, color: Color(0xFF34D399)),
                        const SizedBox(width: 4),
                        Expanded(child: Text('${c['depart']} → ${c['arrivee']}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 11), overflow: TextOverflow.ellipsis)),
                        Text(c['montant']!, style: const TextStyle(color: Color(0xFF34D399), fontSize: 12, fontWeight: FontWeight.bold)),
                      ]),
                      const SizedBox(height: 10),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: disponible ? () {} : null,
                          icon: const Icon(Icons.check_rounded, size: 14),
                          label: Text(disponible ? 'Prendre la course' : 'Planning bloqué'),
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 10),
                            backgroundColor: disponible ? AppColors.goldPrimary : AppColors.darkCard,
                            foregroundColor: disponible ? Colors.black : AppColors.textMuted,
                          ),
                        ),
                      ),
                    ]),
                  )),
                  const SizedBox(height: 20),

                  // Performance rapide
                  _card(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Performance ce mois', style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.bold, fontSize: 14)),
                        const SizedBox(height: 12),
                        ...[
                          {'label': 'Ponctualité', 'pct': 0.96},
                          {'label': 'Satisfaction', 'pct': 0.98},
                          {'label': 'Dress code',   'pct': 0.90},
                        ].map((p) => Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                                Text(p['label'] as String, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                                Text('${((p['pct'] as double) * 100).round()}%', style: const TextStyle(color: AppColors.goldPrimary, fontSize: 12, fontWeight: FontWeight.bold)),
                              ]),
                              const SizedBox(height: 4),
                              ClipRRect(
                                borderRadius: BorderRadius.circular(4),
                                child: LinearProgressIndicator(
                                  value: p['pct'] as double,
                                  backgroundColor: const Color(0xFF1F2937),
                                  color: AppColors.goldPrimary,
                                  minHeight: 6,
                                ),
                              ),
                            ],
                          ),
                        )),
                      ],
                    ),
                  ),
                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String value, label;
  final Color color;
  const _StatCard(this.value, this.label, this.color);
  @override
  Widget build(BuildContext context) => Expanded(
    child: Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.25)),
      ),
      child: Column(children: [
        Text(value, style: TextStyle(color: color, fontSize: 15, fontWeight: FontWeight.bold)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
      ]),
    ),
  );
}

class _MissionBanner extends StatefulWidget {
  final _Mission m;
  const _MissionBanner({required this.m});
  @override
  State<_MissionBanner> createState() => _MissionBannerState();
}

class _MissionBannerState extends State<_MissionBanner> {
  bool _started = false;
  @override
  Widget build(BuildContext context) {
    final m = widget.m;
    return _card(
      border: AppColors.goldPrimary.withOpacity(0.3),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: SizedBox(
              height: 120,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network('https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=600&q=70', fit: BoxFit.cover),
                  Container(decoration: const BoxDecoration(gradient: LinearGradient(
                    begin: Alignment.topLeft, end: Alignment.bottomRight,
                    colors: [Color(0xCC000000), Color(0x66000000)],
                  ))),
                  Positioned(left: 12, top: 12, child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: _statutColor(m.statut).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: _statutColor(m.statut).withOpacity(0.5)),
                    ),
                    child: Text(_statutLabel(m.statut), style: TextStyle(color: _statutColor(m.statut), fontSize: 11, fontWeight: FontWeight.bold)),
                  )),
                  Positioned(left: 12, bottom: 12, child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(m.vehicule, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontFamily: 'Playfair Display')),
                      Text(m.plaque, style: const TextStyle(color: Color(0xFFD1D5DB), fontSize: 11)),
                    ],
                  )),
                  Positioned(right: 12, bottom: 12, child: Text(m.montant, style: const TextStyle(color: AppColors.goldPrimary, fontWeight: FontWeight.bold))),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(children: [
                  const Icon(Icons.schedule_rounded, size: 14, color: AppColors.goldPrimary),
                  const SizedBox(width: 6),
                  Text('${m.heure} — ${m.date}', style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
                ]),
                const SizedBox(height: 6),
                Row(children: [
                  const Icon(Icons.person_outline_rounded, size: 14, color: Color(0xFF60A5FA)),
                  const SizedBox(width: 6),
                  Text(m.client, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                ]),
                const SizedBox(height: 8),
                Row(children: [
                  const Icon(Icons.location_on_rounded, size: 14, color: Color(0xFF34D399)),
                  const SizedBox(width: 6),
                  Expanded(child: Text('${m.depart}  →  ${m.arrivee}',
                    style: const TextStyle(color: AppColors.textSecondary, fontSize: 12), maxLines: 1, overflow: TextOverflow.ellipsis)),
                ]),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () => setState(() => _started = !_started),
                    icon: Icon(_started ? Icons.stop_circle_outlined : Icons.navigation_rounded, size: 16),
                    label: Text(_started ? 'Terminer la mission' : 'Démarrer la mission'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _started ? const Color(0xFFEF4444).withOpacity(0.15) : AppColors.goldPrimary,
                      foregroundColor: _started ? const Color(0xFFEF4444) : Colors.black,
                      side: _started ? const BorderSide(color: Color(0xFFEF4444), width: 0.5) : BorderSide.none,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Tab Missions ──────────────────────────────────────────────────────────────

class _MissionsTab extends StatefulWidget {
  final List<_Mission> missions;
  final void Function(String ref, String statut) onUpdate;
  const _MissionsTab({required this.missions, required this.onUpdate});
  @override
  State<_MissionsTab> createState() => _MissionsTabState();
}

class _MissionsTabState extends State<_MissionsTab> with SingleTickerProviderStateMixin {
  late TabController _tabCtrl;
  final _tabs = ['Tous', 'Attente', 'Confirmée', 'En cours', 'Terminée'];
  final _keys = ['tous', 'en_attente', 'confirmee', 'en_cours', 'terminee'];

  @override void initState() { super.initState(); _tabCtrl = TabController(length: _tabs.length, vsync: this); }
  @override void dispose()   { _tabCtrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
            child: Row(children: [
              const Icon(Icons.directions_car_rounded, color: AppColors.goldPrimary, size: 22),
              const SizedBox(width: 8),
              const Text('Mes Missions', style: TextStyle(color: AppColors.textPrimary, fontSize: 20, fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: AppColors.goldPrimary.withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
                child: Text('${widget.missions.length} total', style: const TextStyle(color: AppColors.goldPrimary, fontSize: 11, fontWeight: FontWeight.w600)),
              ),
            ]),
          ),
          const SizedBox(height: 12),
          TabBar(
            controller: _tabCtrl,
            isScrollable: true,
            tabAlignment: TabAlignment.start,
            labelColor: AppColors.goldPrimary,
            unselectedLabelColor: AppColors.textMuted,
            indicatorColor: AppColors.goldPrimary,
            indicatorSize: TabBarIndicatorSize.label,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            labelStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
            tabs: _tabs.map((t) => Tab(text: t)).toList(),
          ),
          Expanded(
            child: TabBarView(
              controller: _tabCtrl,
              children: _keys.map((key) {
                final filtered = key == 'tous' ? widget.missions : widget.missions.where((m) => m.statut == key).toList();
                if (filtered.isEmpty) {
                  return Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
                    const Icon(Icons.directions_car_outlined, color: AppColors.textMuted, size: 40),
                    const SizedBox(height: 8),
                    Text('Aucune mission', style: const TextStyle(color: AppColors.textMuted)),
                  ]));
                }
                return ListView.builder(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 80),
                  itemCount: filtered.length,
                  itemBuilder: (ctx, i) => _MissionCard(m: filtered[i], onUpdate: widget.onUpdate),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}

class _MissionCard extends StatelessWidget {
  final _Mission m;
  final void Function(String, String) onUpdate;
  const _MissionCard({required this.m, required this.onUpdate});

  @override
  Widget build(BuildContext context) {
    final c = _statutColor(m.statut);
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppColors.darkCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.darkBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 14, 14, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(children: [
                  Text(m.ref, style: const TextStyle(color: AppColors.textMuted, fontSize: 11, fontFamily: 'monospace')),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(color: c.withOpacity(0.1), borderRadius: BorderRadius.circular(20), border: Border.all(color: c.withOpacity(0.4))),
                    child: Text(_statutLabel(m.statut), style: TextStyle(color: c, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ]),
                const SizedBox(height: 6),
                Text(m.type, style: const TextStyle(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold)),
                Text(m.vehicule, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(color: const Color(0xFF111111), borderRadius: BorderRadius.circular(10)),
                  child: Row(children: [
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      const Text('Départ', style: TextStyle(color: AppColors.textMuted, fontSize: 10)),
                      Text(m.depart, style: const TextStyle(color: AppColors.textPrimary, fontSize: 11, fontWeight: FontWeight.w500), maxLines: 1, overflow: TextOverflow.ellipsis),
                    ])),
                    const Icon(Icons.arrow_forward_rounded, size: 14, color: AppColors.textMuted),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                      const Text('Arrivée', style: TextStyle(color: AppColors.textMuted, fontSize: 10)),
                      Text(m.arrivee, style: const TextStyle(color: AppColors.textPrimary, fontSize: 11, fontWeight: FontWeight.w500), maxLines: 1, overflow: TextOverflow.ellipsis),
                    ])),
                  ]),
                ),
                const SizedBox(height: 8),
                Row(children: [
                  const Icon(Icons.schedule_rounded, size: 13, color: AppColors.textMuted),
                  const SizedBox(width: 4),
                  Text('${m.date} à ${m.heure}', style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
                  const Spacer(),
                  Text(m.montant, style: const TextStyle(color: AppColors.goldPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
                ]),
              ],
            ),
          ),
          if (m.statut == 'en_attente') Padding(
            padding: const EdgeInsets.fromLTRB(12, 10, 12, 12),
            child: Row(children: [
              Expanded(child: OutlinedButton.icon(
                onPressed: () => onUpdate(m.ref, 'annulee'),
                icon: const Icon(Icons.close_rounded, size: 14),
                label: const Text('Refuser'),
                style: OutlinedButton.styleFrom(foregroundColor: const Color(0xFFEF4444), side: const BorderSide(color: Color(0xFFEF4444), width: 0.8)),
              )),
              const SizedBox(width: 8),
              Expanded(child: ElevatedButton.icon(
                onPressed: () => onUpdate(m.ref, 'confirmee'),
                icon: const Icon(Icons.check_rounded, size: 14),
                label: const Text('Accepter'),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF16A34A), foregroundColor: Colors.white),
              )),
            ]),
          ),
          if (m.statut == 'confirmee') Padding(
            padding: const EdgeInsets.fromLTRB(12, 10, 12, 12),
            child: SizedBox(width: double.infinity, child: ElevatedButton.icon(
              onPressed: () => onUpdate(m.ref, 'en_cours'),
              icon: const Icon(Icons.navigation_rounded, size: 14),
              label: const Text('Démarrer la mission'),
            )),
          ),
          if (m.statut == 'en_cours') Padding(
            padding: const EdgeInsets.fromLTRB(12, 10, 12, 12),
            child: SizedBox(width: double.infinity, child: ElevatedButton.icon(
              onPressed: () => onUpdate(m.ref, 'terminee'),
              icon: const Icon(Icons.stop_circle_outlined, size: 14),
              label: const Text('Terminer la mission'),
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEF4444).withOpacity(0.15), foregroundColor: const Color(0xFFEF4444), side: const BorderSide(color: Color(0xFFEF4444), width: 0.8)),
            )),
          ),
          if (m.statut == 'terminee') Padding(
            padding: const EdgeInsets.fromLTRB(12, 6, 12, 10),
            child: Row(children: [
              const Icon(Icons.check_circle_rounded, size: 14, color: Color(0xFF9CA3AF)),
              const SizedBox(width: 6),
              const Text('Mission terminée', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
              const Spacer(),
              Text(m.montant, style: const TextStyle(color: Color(0xFF34D399), fontSize: 12, fontWeight: FontWeight.bold)),
            ]),
          ),
        ],
      ),
    );
  }
}

// ── Tab Planning ──────────────────────────────────────────────────────────────

class _PlanningTab extends StatelessWidget {
  final List<_Mission> missions;
  const _PlanningTab({required this.missions});

  @override
  Widget build(BuildContext context) {
    final upcoming = missions.where((m) => m.statut != 'terminee' && m.statut != 'annulee').toList();
    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
            child: Row(children: [
              const Icon(Icons.calendar_month_rounded, color: AppColors.goldPrimary, size: 22),
              const SizedBox(width: 8),
              const Text('Planning', style: TextStyle(color: AppColors.textPrimary, fontSize: 20, fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
            ]),
          ),
          // Semaine rapide
          SizedBox(
            height: 72,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: 7,
              itemBuilder: (ctx, i) {
                final date = DateTime(2025, 6, 12 + i);
                final isToday = i == 0;
                final dayMissions = upcoming.where((m) => m.date == (isToday ? 'Auj.' : '${date.day} Jun')).length;
                return Container(
                  width: 52, margin: const EdgeInsets.only(right: 8),
                  decoration: BoxDecoration(
                    color: isToday ? AppColors.goldPrimary : AppColors.darkCard,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: isToday ? AppColors.goldPrimary : AppColors.darkBorder),
                  ),
                  child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Text(['L','M','M','J','V','S','D'][date.weekday - 1],
                      style: TextStyle(color: isToday ? Colors.black : AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.w600)),
                    Text('${date.day}',
                      style: TextStyle(color: isToday ? Colors.black : AppColors.textPrimary, fontSize: 18, fontWeight: FontWeight.bold)),
                    if (dayMissions > 0) Container(width: 6, height: 6, decoration: BoxDecoration(
                      color: isToday ? Colors.black : AppColors.goldPrimary, shape: BoxShape.circle)),
                  ]),
                );
              },
            ),
          ),
          const SizedBox(height: 16),
          Padding(padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Text('Missions à venir (${upcoming.length})', style: const TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.w600))),
          const SizedBox(height: 8),
          Expanded(
            child: upcoming.isEmpty
                ? const Center(child: Text('Aucune mission planifiée', style: TextStyle(color: AppColors.textMuted)))
                : ListView.builder(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 80),
              itemCount: upcoming.length,
              itemBuilder: (ctx, i) {
                final m = upcoming[i];
                final c = _statutColor(m.statut);
                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.darkCard,
                    borderRadius: BorderRadius.circular(14),
                    border: Border(left: BorderSide(color: c, width: 3), bottom: BorderSide(color: AppColors.darkBorder), top: BorderSide(color: AppColors.darkBorder), right: BorderSide(color: AppColors.darkBorder)),
                  ),
                  child: Row(children: [
                    Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(m.heure, style: TextStyle(color: c, fontSize: 16, fontWeight: FontWeight.bold)),
                      Text(m.date, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
                    ]),
                    const SizedBox(width: 14),
                    Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(m.type, style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
                      Text(m.client, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                      Text('${m.depart} → ${m.arrivee}', style: const TextStyle(color: AppColors.textMuted, fontSize: 10), maxLines: 1, overflow: TextOverflow.ellipsis),
                    ])),
                    Text(m.montant, style: const TextStyle(color: AppColors.goldPrimary, fontSize: 12, fontWeight: FontWeight.bold)),
                  ]),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

// ── Tab Évaluations ───────────────────────────────────────────────────────────

class _EvalsTab extends StatelessWidget {
  const _EvalsTab();

  @override
  Widget build(BuildContext context) {
    final avg = _evals.fold(0, (s, e) => s + e.note) / _evals.length;
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 80),
        children: [
          Row(children: [
            const Icon(Icons.star_rounded, color: AppColors.goldPrimary, size: 22),
            const SizedBox(width: 8),
            const Text('Évaluations', style: TextStyle(color: AppColors.textPrimary, fontSize: 20, fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
          ]),
          const SizedBox(height: 16),
          // Score card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: [AppColors.goldPrimary.withOpacity(0.15), Colors.transparent], begin: Alignment.topLeft, end: Alignment.bottomRight),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.goldPrimary.withOpacity(0.3)),
            ),
            child: Row(children: [
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(avg.toStringAsFixed(1), style: const TextStyle(color: AppColors.goldPrimary, fontSize: 48, fontWeight: FontWeight.bold, height: 1)),
                _stars(avg.round(), size: 18),
                Text('${_evals.length} évaluations', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
              ]),
              const Spacer(),
              Column(children: List.generate(5, (i) {
                final n = 5 - i;
                final count = _evals.where((e) => e.note == n).length;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 4),
                  child: Row(children: [
                    Text('$n', style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
                    const SizedBox(width: 4),
                    SizedBox(
                      width: 80, height: 8,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: _evals.isEmpty ? 0 : count / _evals.length,
                          backgroundColor: const Color(0xFF1F2937),
                          color: AppColors.goldPrimary,
                          minHeight: 8,
                        ),
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text('$count', style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
                  ]),
                );
              })),
            ]),
          ),
          const SizedBox(height: 16),
          ..._evals.map((e) => Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppColors.darkBorder)),
            child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Container(
                width: 36, height: 36,
                decoration: BoxDecoration(color: const Color(0xFF1F2937), shape: BoxShape.circle, border: Border.all(color: AppColors.darkBorder)),
                child: Center(child: Text(e.client.split(' ').map((w) => w[0]).take(2).join(), style: const TextStyle(color: AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.bold))),
              ),
              const SizedBox(width: 10),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Expanded(child: Text(e.client, style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600))),
                  _stars(e.note, size: 12),
                ]),
                const SizedBox(height: 4),
                Text('"${e.comment}"', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12, fontStyle: FontStyle.italic), maxLines: 2, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 4),
                Text(e.date, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
              ])),
            ]),
          )),
        ],
      ),
    );
  }
}

// ── Tab Profil ────────────────────────────────────────────────────────────────

class _ProfilTab extends StatefulWidget {
  final dynamic user;
  final VoidCallback onLogout;
  const _ProfilTab({required this.user, required this.onLogout});
  @override
  State<_ProfilTab> createState() => _ProfilTabState();
}

class _ProfilTabState extends State<_ProfilTab> {
  bool _dispo = true;
  final _dressState = List<bool>.from(_dressCode.map((d) => d['ok'] == true));

  @override
  Widget build(BuildContext context) {
    final u = widget.user;
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 80),
        children: [
          // Profile header
          Row(children: [
            Container(
              width: 60, height: 60,
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFFD4A017), Color(0xFFB87D10)]),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(child: Text((u?.prenom?[0] ?? 'C').toUpperCase(),
                style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 24))),
            ),
            const SizedBox(width: 14),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('${u?.prenom ?? ''} ${u?.nom ?? ''}', style: const TextStyle(color: AppColors.textPrimary, fontSize: 18, fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
              Text(u?.telephone ?? '', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                decoration: BoxDecoration(color: AppColors.goldPrimary.withOpacity(0.1), borderRadius: BorderRadius.circular(20), border: Border.all(color: AppColors.goldPrimary.withOpacity(0.3))),
                child: const Text('Chauffeur VIP', style: TextStyle(color: AppColors.goldPrimary, fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            ])),
          ]),
          const SizedBox(height: 20),

          // Disponibilité
          _card(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            border: _dispo ? const Color(0xFF34D399).withOpacity(0.3) : AppColors.darkBorder,
            child: Row(children: [
              Icon(Icons.circle, size: 10, color: _dispo ? const Color(0xFF34D399) : AppColors.textMuted),
              const SizedBox(width: 10),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Text('Statut de disponibilité', style: TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
                Text(_dispo ? 'Disponible pour des missions' : 'Non disponible',
                  style: TextStyle(color: _dispo ? const Color(0xFF34D399) : AppColors.textMuted, fontSize: 11)),
              ])),
              Switch.adaptive(
                value: _dispo,
                onChanged: (v) => setState(() => _dispo = v),
                activeColor: AppColors.goldPrimary,
              ),
            ]),
          ),

          // Stats
          Row(children: [
            _StatCard('18', 'Missions', const Color(0xFFD4A017)),
            const SizedBox(width: 10),
            _StatCard('4.9', 'Note /5', const Color(0xFFFBBF24)),
            const SizedBox(width: 10),
            _StatCard('185K', 'FCFA', const Color(0xFF34D399)),
          ]),
          const SizedBox(height: 12),

          // Dress code
          _card(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Dress Code', style: TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                ..._dressCode.asMap().entries.map((e) => GestureDetector(
                  onTap: () => setState(() => _dressState[e.key] = !_dressState[e.key]),
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(children: [
                      Icon(_dressState[e.key] ? Icons.check_box_rounded : Icons.check_box_outline_blank_rounded,
                        color: _dressState[e.key] ? AppColors.goldPrimary : AppColors.textMuted, size: 20),
                      const SizedBox(width: 8),
                      Text(e.value['item'] as String, style: TextStyle(
                        color: _dressState[e.key] ? AppColors.textPrimary : AppColors.textMuted, fontSize: 13)),
                    ]),
                  ),
                )),
              ],
            ),
          ),

          // Documents
          _card(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Documents', style: TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                ...[
                  {'name':'Permis de conduire', 'status':'expiring', 'exp':'12 Jul 2025'},
                  {'name':'Assurance',          'status':'valid',    'exp':'30 Déc 2025'},
                  {'name':'Carte grise',        'status':'valid',    'exp': null},
                ].map((d) {
                  final isOk = d['status'] == 'valid';
                  final isWarn = d['status'] == 'expiring';
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(children: [
                      Icon(isOk ? Icons.description_rounded : Icons.warning_amber_rounded,
                        color: isOk ? const Color(0xFF34D399) : const Color(0xFFF59E0B), size: 18),
                      const SizedBox(width: 8),
                      Expanded(child: Text(d['name'] as String, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12))),
                      if (d['exp'] != null) Text(d['exp'] as String, style: TextStyle(color: isWarn ? const Color(0xFFF59E0B) : AppColors.textMuted, fontSize: 10)),
                    ]),
                  );
                }),
              ],
            ),
          ),

          // Déconnexion
          const SizedBox(height: 4),
          OutlinedButton.icon(
            onPressed: widget.onLogout,
            icon: const Icon(Icons.logout_rounded, size: 16),
            label: const Text('Se déconnecter'),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.error,
              side: BorderSide(color: AppColors.error.withOpacity(0.5)),
              minimumSize: const Size(double.infinity, 48),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Tab Performance ───────────────────────────────────────────────────────────

class _PerformanceTab extends StatelessWidget {
  const _PerformanceTab();

  @override
  Widget build(BuildContext context) {
    final months = ['Jan','Fév','Mar','Avr','Mai','Jun'];
    final values = [14, 18, 12, 22, 20, 18];
    final peak = values.reduce((a, b) => a > b ? a : b);

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 80),
        children: [
          Row(children: [
            const Icon(Icons.bar_chart_rounded, color: AppColors.goldPrimary, size: 22),
            const SizedBox(width: 8),
            const Text('Performances', style: TextStyle(color: AppColors.textPrimary, fontSize: 20, fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
          ]),
          const SizedBox(height: 16),

          // Score global
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: [AppColors.goldPrimary.withOpacity(0.15), Colors.transparent], begin: Alignment.topLeft, end: Alignment.bottomRight),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.goldPrimary.withOpacity(0.3)),
            ),
            child: Column(children: [
              const Text('Score global', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
              const SizedBox(height: 6),
              const Text('97 / 100', style: TextStyle(color: AppColors.goldPrimary, fontSize: 36, fontWeight: FontWeight.bold, fontFamily: 'Playfair Display')),
              const SizedBox(height: 12),
              Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [
                _StatCard('18', 'Missions', const Color(0xFFD4A017)),
                _StatCard('4.9', 'Note', const Color(0xFFFBBF24)),
                _StatCard('96%', 'Ponctualité', const Color(0xFF34D399)),
                _StatCard('1240', 'Km', const Color(0xFF60A5FA)),
              ]),
            ]),
          ),
          const SizedBox(height: 20),

          // Critères détaillés
          const Text('Indicateurs ce mois', style: TextStyle(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          ...[
            {'label':'Ponctualité',     'pct':0.96, 'val':'96%',  'color': const Color(0xFF34D399)},
            {'label':'Satisfaction client', 'pct':0.98, 'val':'98%', 'color': const Color(0xFF60A5FA)},
            {'label':'Dress code',      'pct':0.90, 'val':'90%',  'color': AppColors.goldPrimary},
            {'label':'Conduite',        'pct':0.99, 'val':'99%',  'color': const Color(0xFF34D399)},
            {'label':'Communication',   'pct':0.95, 'val':'95%',  'color': const Color(0xFFFBBF24)},
          ].map((p) => Padding(
            padding: const EdgeInsets.only(bottom: 14),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text(p['label'] as String, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                Text(p['val'] as String, style: TextStyle(color: p['color'] as Color, fontSize: 13, fontWeight: FontWeight.bold)),
              ]),
              const SizedBox(height: 6),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: p['pct'] as double,
                  backgroundColor: const Color(0xFF1F2937),
                  color: p['color'] as Color,
                  minHeight: 7,
                ),
              ),
            ]),
          )),
          const SizedBox(height: 20),

          // Graphe missions par mois
          const Text('Missions par mois', style: TextStyle(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold)),
          const SizedBox(height: 14),
          SizedBox(
            height: 130,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: List.generate(months.length, (i) {
                final pct = values[i] / peak;
                return Expanded(child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: Column(mainAxisAlignment: MainAxisAlignment.end, children: [
                    Text('${values[i]}', style: const TextStyle(color: AppColors.textMuted, fontSize: 9)),
                    const SizedBox(height: 2),
                    Flexible(child: Container(
                      height: 90 * pct,
                      decoration: BoxDecoration(
                        color: AppColors.goldPrimary.withOpacity(0.15),
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
                        border: const Border(top: BorderSide(color: AppColors.goldPrimary, width: 2)),
                      ),
                    )),
                    const SizedBox(height: 4),
                    Text(months[i], style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
                  ]),
                ));
              }),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Tab Notifications (Driver) ────────────────────────────────────────────────

class _NotificationsDriverTab extends StatelessWidget {
  const _NotificationsDriverTab();

  static const _notifs = [
    {'titre':'Nouvelle course disponible','desc':'Transfert Aéroport · 25 000 FCFA · 15h00','heure':'Il y a 3 min','type':'course','lu':false},
    {'titre':'Course acceptée','desc':'MIS-0445 confirmée — Client: M. Ondoua','heure':'Il y a 1h','type':'mission','lu':false},
    {'titre':'Évaluation reçue','desc':'M. Etoga Jean vous a donné 5★ — "Parfait de bout en bout"','heure':'Il y a 3h','type':'eval','lu':true},
    {'titre':'Paiement reçu','desc':'+25 000 FCFA — MIS-0445 Transfert Aéroport','heure':'Il y a 4h','type':'paiement','lu':true},
    {'titre':'Rappel planning','desc':'Demain : 3 missions prévues entre 08h00 et 18h00','heure':'Hier','type':'planning','lu':true},
    {'titre':'Véhicule assigné','desc':'Mercedes S 580 · LT-1234-YA — Propriétaire: M. Ateba Paul','heure':'Lun.','type':'vehicule','lu':true},
  ];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 80),
        children: [
          Row(children: [
            const Icon(Icons.notifications_rounded, color: AppColors.goldPrimary, size: 22),
            const SizedBox(width: 8),
            const Text('Notifications', style: TextStyle(color: AppColors.textPrimary, fontSize: 20, fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
            const Spacer(),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(color: AppColors.error.withOpacity(0.15), borderRadius: BorderRadius.circular(20)),
              child: const Text('2 non lues', style: TextStyle(color: AppColors.error, fontSize: 11, fontWeight: FontWeight.bold)),
            ),
          ]),
          const SizedBox(height: 16),
          ..._notifs.map((n) {
            final lu = n['lu'] == true;
            IconData ic; Color nc;
            switch (n['type']) {
              case 'course':   ic = Icons.directions_car_rounded; nc = AppColors.goldPrimary;      break;
              case 'mission':  ic = Icons.navigation_rounded;     nc = const Color(0xFF34D399);   break;
              case 'eval':     ic = Icons.star_rounded;            nc = const Color(0xFFFBBF24);   break;
              case 'paiement': ic = Icons.payments_rounded;        nc = const Color(0xFF34D399);   break;
              case 'planning': ic = Icons.calendar_month_rounded;  nc = const Color(0xFF60A5FA);   break;
              default:         ic = Icons.directions_car_filled;   nc = const Color(0xFF60A5FA);
            }
            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: lu ? AppColors.darkCard : nc.withOpacity(0.06),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: lu ? AppColors.darkBorder : nc.withOpacity(0.3)),
              ),
              child: Row(children: [
                Container(
                  width: 38, height: 38,
                  decoration: BoxDecoration(color: nc.withOpacity(0.12), shape: BoxShape.circle),
                  child: Icon(ic, color: nc, size: 18),
                ),
                const SizedBox(width: 12),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    Expanded(child: Text(n['titre'] as String, style: TextStyle(color: lu ? AppColors.textSecondary : AppColors.textPrimary, fontSize: 13, fontWeight: lu ? FontWeight.normal : FontWeight.bold))),
                    if (!lu) Container(width: 8, height: 8, decoration: BoxDecoration(color: nc, shape: BoxShape.circle)),
                  ]),
                  const SizedBox(height: 2),
                  Text(n['desc'] as String, style: const TextStyle(color: AppColors.textMuted, fontSize: 11), maxLines: 2, overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 3),
                  Text(n['heure'] as String, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
                ])),
              ]),
            );
          }),
        ],
      ),
    );
  }
}
