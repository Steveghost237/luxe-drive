import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../utils/constants.dart';

// ── Mock data ─────────────────────────────────────────────────────────────────

class _Chauffeur {
  final String id, prenom, nom, ville, photo;
  final double note;
  final int missions;
  String disponibilite; // disponible | en_course | indisponible
  _Chauffeur({required this.id, required this.prenom, required this.nom,
    required this.ville, required this.photo, required this.note,
    required this.missions, this.disponibilite = 'disponible'});
  String get fullName => '$prenom $nom';
}

final _chauffeurs = [
  _Chauffeur(id:'c1', prenom:'David',   nom:'Kameni',  ville:'Yaoundé', note:4.9, missions:312,
    photo:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'),
  _Chauffeur(id:'c2', prenom:'Alice',   nom:'Nguema',  ville:'Douala',  note:4.8, missions:248,
    photo:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'),
  _Chauffeur(id:'c3', prenom:'Éric',    nom:'Fouda',   ville:'Yaoundé', note:4.7, missions:187,
    photo:'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80'),
  _Chauffeur(id:'c4', prenom:'Jean',    nom:'Mbida',   ville:'Douala',  note:4.6, missions:134,
    photo:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'),
];

class _Vehicle {
  final String id, nom, plaque, type, image;
  String statut; // disponible, en_mission, maintenance
  String? chauffeurId;
  final int tauxOccupation;
  final String revenusMois;
  _Vehicle({required this.id, required this.nom, required this.plaque, required this.type,
    required this.image, required this.statut, required this.tauxOccupation,
    required this.revenusMois, this.chauffeurId});

  _Chauffeur? get chauffeur =>
    chauffeurId != null ? _chauffeurs.firstWhere((c) => c.id == chauffeurId,
      orElse: () => _chauffeurs.first) : null;
}

class _Resa {
  final String ref, client, vehicule, type, date, heure, montant;
  String statut;
  _Resa({required this.ref, required this.client, required this.vehicule, required this.type,
    required this.date, required this.heure, required this.montant, required this.statut});
}

class _Payment {
  final String desc, date, montant;
  final bool credit;
  const _Payment({required this.desc, required this.date, required this.montant, required this.credit});
}

final _vehicles = [
  _Vehicle(id:'V1', nom:'Mercedes-Benz Classe S 580', plaque:'LT-1234-YA', type:'Berline VIP',
    image:'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=400&q=70',
    statut:'en_mission', tauxOccupation:85, revenusMois:'185 000 FCFA', chauffeurId:'c1'),
  _Vehicle(id:'V2', nom:'Audi A8 L', plaque:'LT-5678-YA', type:'Berline Premium',
    image:'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=400&q=70',
    statut:'disponible', tauxOccupation:72, revenusMois:'145 000 FCFA', chauffeurId:'c2'),
  _Vehicle(id:'V3', nom:'Range Rover Autobiography', plaque:'LT-9012-YA', type:'SUV Luxe',
    image:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=400&q=70',
    statut:'disponible', tauxOccupation:68, revenusMois:'120 000 FCFA'),
  _Vehicle(id:'V4', nom:'Bentley Bentayga', plaque:'LT-3456-YA', type:'SUV Ultra-Luxe',
    image:'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=70',
    statut:'maintenance', tauxOccupation:55, revenusMois:'0 FCFA'),
];

final _reservations = [
  _Resa(ref:'RES-2025-0089', client:'M. Etoga Pierre', vehicule:'Mercedes S 580', type:'Location avec chauffeur', date:"Auj.", heure:'14:30', montant:'85 000 FCFA', statut:'en_cours'),
  _Resa(ref:'RES-2025-0088', client:'Ambassade USA', vehicule:'Range Rover', type:'Protocole officiel', date:'13 Jun', heure:'09:00', montant:'150 000 FCFA', statut:'confirmee'),
  _Resa(ref:'RES-2025-0087', client:'Total Energies', vehicule:'Audi A8 L', type:'Mise à disposition', date:'13 Jun', heure:'08:00', montant:'90 000 FCFA', statut:'confirmee'),
  _Resa(ref:'RES-2025-0086', client:'Mme Biya Lucie', vehicule:'Bentley Bentayga', type:'Événement privé', date:'12 Jun', heure:'19:00', montant:'250 000 FCFA', statut:'annulee'),
  _Resa(ref:'RES-2025-0085', client:'M. Ndi Albert', vehicule:'Mercedes S 580', type:'Transfert aéroport', date:'10 Jun', heure:'18:15', montant:'30 000 FCFA', statut:'terminee'),
  _Resa(ref:'RES-2025-0084', client:'Groupe Bolloré', vehicule:'Range Rover', type:'Mise à disposition', date:'09 Jun', heure:'07:30', montant:'180 000 FCFA', statut:'terminee'),
];

const _payments = [
  _Payment(desc:'Location Mercedes S 580 — M. Fouda', date:'12 Jun', montant:'+85 000 FCFA', credit:true),
  _Payment(desc:'Entretien Bentley Bentayga', date:'11 Jun', montant:'-35 000 FCFA', credit:false),
  _Payment(desc:'Location Audi A8 L — Total', date:'10 Jun', montant:'+90 000 FCFA', credit:true),
  _Payment(desc:'Assurance trimestrielle', date:'08 Jun', montant:'-45 000 FCFA', credit:false),
  _Payment(desc:'Location Range Rover — Ambassade', date:'07 Jun', montant:'+150 000 FCFA', credit:true),
  _Payment(desc:'Maintenance Mercedes S 580', date:'05 Jun', montant:'-28 000 FCFA', credit:false),
  _Payment(desc:'Location Audi A8 L — Mme Owona', date:'03 Jun', montant:'+60 000 FCFA', credit:true),
];

// ── Helpers ───────────────────────────────────────────────────────────────────

Color _vColor(String s) {
  switch (s) {
    case 'en_mission':  return const Color(0xFF34D399);
    case 'disponible':  return const Color(0xFF60A5FA);
    case 'maintenance': return const Color(0xFFF59E0B);
    default:            return AppColors.textMuted;
  }
}
String _vLabel(String s) {
  const m = {'en_mission':'En mission','disponible':'Disponible','maintenance':'Maintenance'};
  return m[s] ?? s;
}

Color _rColor(String s) {
  switch (s) {
    case 'confirmee': return const Color(0xFF60A5FA);
    case 'en_cours':  return const Color(0xFF34D399);
    case 'terminee':  return const Color(0xFF9CA3AF);
    case 'annulee':   return const Color(0xFFEF4444);
    default:          return AppColors.textMuted;
  }
}
String _rLabel(String s) {
  const m = {'confirmee':'Confirmée','en_cours':'En cours','terminee':'Terminée','annulee':'Annulée'};
  return m[s] ?? s;
}

Widget _tag(String text, Color color) => Container(
  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
  decoration: BoxDecoration(color: color.withOpacity(0.12), borderRadius: BorderRadius.circular(20), border: Border.all(color: color.withOpacity(0.4))),
  child: Text(text, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
);

Widget _sectionTitle(String t) => Padding(
  padding: const EdgeInsets.only(bottom: 12),
  child: Text(t, style: const TextStyle(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold)),
);

// ── Main widget ───────────────────────────────────────────────────────────────

class OwnerDashboardScreen extends StatefulWidget {
  const OwnerDashboardScreen({super.key});
  @override
  State<OwnerDashboardScreen> createState() => _OwnerDashboardScreenState();
}

class _OwnerDashboardScreenState extends State<OwnerDashboardScreen> {
  int _tab = 0;
  final _vehicleList = List<_Vehicle>.from(_vehicles);
  final _resaList    = List<_Resa>.from(_reservations);

  void _toggleVehicleStatut(String id) => setState(() {
    for (final v in _vehicleList) {
      if (v.id == id) v.statut = v.statut == 'disponible' ? 'maintenance' : 'disponible';
    }
  });

  void _assignChauffeur(String vehicleId, String chauffeurId) => setState(() {
    for (final v in _vehicleList) {
      if (v.id == vehicleId) v.chauffeurId = chauffeurId;
    }
  });

  void _deassignChauffeur(String vehicleId) => setState(() {
    for (final v in _vehicleList) {
      if (v.id == vehicleId) v.chauffeurId = null;
    }
  });

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light,
      child: Scaffold(
        backgroundColor: AppColors.darkBg,
        body: IndexedStack(
          index: _tab,
          children: [
            _HomeTab(user: auth.user, vehicles: _vehicleList, resas: _resaList),
            _FleetTab(vehicles: _vehicleList, onToggle: _toggleVehicleStatut,
              onAssign: _assignChauffeur, onDeassign: _deassignChauffeur),
            _RevenusTab(),
            _ResaTab(resas: _resaList, onUpdate: (ref, s) => setState(() {
              for (final r in _resaList) if (r.ref == ref) r.statut = s;
            })),
            const _MaintenanceTab(),
            const _NotificationsOwnerTab(),
            _ProfilOwnerTab(user: auth.user, onLogout: () async {
              await auth.logout();
              if (context.mounted) context.go(AppRoutes.login);
            }),
          ],
        ),
        bottomNavigationBar: _BottomNav(current: _tab, onTap: (i) => setState(() => _tab = i)),
      ),
    );
  }
}

// ── Bottom nav ────────────────────────────────────────────────────────────────

class _BottomNav extends StatelessWidget {
  final int current;
  final ValueChanged<int> onTap;
  const _BottomNav({required this.current, required this.onTap});

  static const _items = [
    {'icon': Icons.dashboard_rounded,        'label': 'Accueil'},
    {'icon': Icons.directions_car_rounded,   'label': 'Flotte'},
    {'icon': Icons.bar_chart_rounded,        'label': 'Revenus'},
    {'icon': Icons.event_note_rounded,       'label': 'Réservations'},
    {'icon': Icons.build_rounded,            'label': 'Maintenance'},
    {'icon': Icons.notifications_rounded,    'label': 'Alertes'},
    {'icon': Icons.person_rounded,           'label': 'Profil'},
  ];

  @override
  Widget build(BuildContext context) => Container(
    decoration: const BoxDecoration(color: AppColors.darkSurface, border: Border(top: BorderSide(color: AppColors.darkBorder))),
    child: SafeArea(
      child: SizedBox(
        height: 60,
        child: Row(
          children: List.generate(_items.length, (i) {
            final active = i == current;
            return Expanded(
              child: GestureDetector(
                onTap: () => onTap(i),
                behavior: HitTestBehavior.opaque,
                child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Icon(_items[i]['icon'] as IconData, size: 22, color: active ? AppColors.goldPrimary : AppColors.textMuted),
                  const SizedBox(height: 2),
                  Text(_items[i]['label'] as String, style: TextStyle(fontSize: 10, color: active ? AppColors.goldPrimary : AppColors.textMuted, fontWeight: active ? FontWeight.w600 : FontWeight.normal)),
                ]),
              ),
            );
          }),
        ),
      ),
    ),
  );
}

// ── Tab Accueil ───────────────────────────────────────────────────────────────

class _HomeTab extends StatelessWidget {
  final dynamic user;
  final List<_Vehicle> vehicles;
  final List<_Resa> resas;
  const _HomeTab({required this.user, required this.vehicles, required this.resas});

  @override
  Widget build(BuildContext context) {
    final enMission   = vehicles.where((v) => v.statut == 'en_mission').length;
    final dispo       = vehicles.where((v) => v.statut == 'disponible').length;
    final maintenance = vehicles.where((v) => v.statut == 'maintenance').length;
    final resasActives = resas.where((r) => r.statut == 'confirmee' || r.statut == 'en_cours').length;
    return SafeArea(
      child: CustomScrollView(
        slivers: [SliverToBoxAdapter(child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 80),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [

            // Header
            Row(children: [
              Container(
                width: 48, height: 48,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(colors: [Color(0xFFD4A017), Color(0xFF92400E)]),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Center(child: Text((user?.prenom?[0] ?? 'P').toUpperCase(),
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 20))),
              ),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Bonjour, ${user?.prenom ?? 'Propriétaire'} 👋',
                  style: const TextStyle(color: AppColors.textPrimary, fontSize: 17, fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
                const Text('Tableau de bord propriétaire', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
              ])),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(color: AppColors.goldPrimary.withOpacity(0.1), borderRadius: BorderRadius.circular(20), border: Border.all(color: AppColors.goldPrimary.withOpacity(0.3))),
                child: const Text('Propriétaire', style: TextStyle(color: AppColors.goldPrimary, fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            ]),
            const SizedBox(height: 20),

            // KPI
            GridView.count(
              crossAxisCount: 2, shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 10, mainAxisSpacing: 10, childAspectRatio: 2.2,
              children: [
                _KpiTile('${vehicles.length}', 'Véhicules', Icons.directions_car_rounded, const Color(0xFFD4A017)),
                _KpiTile('$enMission', 'En mission',         Icons.navigation_rounded,    const Color(0xFF34D399)),
                _KpiTile('$resasActives', 'Réservations',   Icons.event_note_rounded,    const Color(0xFF60A5FA)),
                _KpiTile('450K', 'FCFA / mois',             Icons.bar_chart_rounded,     const Color(0xFFFBBF24)),
              ],
            ),
            const SizedBox(height: 20),

            // Flotte aperçu
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              _sectionTitle('État de la flotte'),
              Row(children: [
                _tag('$enMission en mission',   const Color(0xFF34D399)),
                const SizedBox(width: 6),
                _tag('$dispo dispo',            const Color(0xFF60A5FA)),
                if (maintenance > 0) ...[const SizedBox(width: 6), _tag('$maintenance maintenance', const Color(0xFFF59E0B))],
              ]),
            ]),
            ...vehicles.map((v) => _VehicleMiniCard(v: v)),
            const SizedBox(height: 20),

            // Dernières réservations
            _sectionTitle('Réservations récentes'),
            ...resas.take(3).map((r) => _ResaMiniCard(r: r)),

            const SizedBox(height: 20),
            // Revenus rapides
            _sectionTitle('Revenus ce mois'),
            Row(children: [
              Expanded(child: _RevCard('650 000', 'FCFA Brut', const Color(0xFF34D399))),
              const SizedBox(width: 10),
              Expanded(child: _RevCard('-108 000', 'FCFA Charges', const Color(0xFFEF4444))),
              const SizedBox(width: 10),
              Expanded(child: _RevCard('542 000', 'FCFA Net', AppColors.goldPrimary)),
            ]),
          ]),
        ))],
      ),
    );
  }
}

class _KpiTile extends StatelessWidget {
  final String value, label;
  final IconData icon;
  final Color color;
  const _KpiTile(this.value, this.label, this.icon, this.color);
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
    decoration: BoxDecoration(
      color: color.withOpacity(0.07),
      borderRadius: BorderRadius.circular(14),
      border: Border.all(color: color.withOpacity(0.2)),
    ),
    child: Row(children: [
      Icon(icon, color: color, size: 22),
      const SizedBox(width: 10),
      Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center, children: [
        Text(value, style: TextStyle(color: color, fontSize: 18, fontWeight: FontWeight.bold)),
        Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
      ]),
    ]),
  );
}

class _RevCard extends StatelessWidget {
  final String value, label;
  final Color color;
  const _RevCard(this.value, this.label, this.color);
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(vertical: 12),
    decoration: BoxDecoration(color: color.withOpacity(0.07), borderRadius: BorderRadius.circular(12), border: Border.all(color: color.withOpacity(0.2))),
    child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      Text(value, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
      const SizedBox(height: 2),
      Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 9), textAlign: TextAlign.center),
    ]),
  );
}

class _VehicleMiniCard extends StatelessWidget {
  final _Vehicle v;
  const _VehicleMiniCard({required this.v});
  @override
  Widget build(BuildContext context) => Container(
    margin: const EdgeInsets.only(bottom: 8),
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.darkBorder)),
    child: Row(children: [
      ClipRRect(
        borderRadius: BorderRadius.circular(8),
        child: Image.network(v.image, width: 52, height: 36, fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => Container(width: 52, height: 36, color: const Color(0xFF1F2937))),
      ),
      const SizedBox(width: 10),
      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(v.nom, style: const TextStyle(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.w600), maxLines: 1, overflow: TextOverflow.ellipsis),
        Text(v.plaque, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
      ])),
      Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
        _tag(_vLabel(v.statut), _vColor(v.statut)),
        const SizedBox(height: 4),
        Text(v.revenusMois, style: const TextStyle(color: AppColors.goldPrimary, fontSize: 10, fontWeight: FontWeight.w600)),
      ]),
    ]),
  );
}

class _ResaMiniCard extends StatelessWidget {
  final _Resa r;
  const _ResaMiniCard({required this.r});
  @override
  Widget build(BuildContext context) {
    final c = _rColor(r.statut);
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(12), border: Border(left: BorderSide(color: c, width: 3), bottom: BorderSide(color: AppColors.darkBorder), top: BorderSide(color: AppColors.darkBorder), right: BorderSide(color: AppColors.darkBorder))),
      child: Row(children: [
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(r.client, style: const TextStyle(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.w600)),
          Text('${r.vehicule} · ${r.date} ${r.heure}', style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
        ])),
        Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
          Text(r.montant, style: const TextStyle(color: AppColors.goldPrimary, fontSize: 12, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          _tag(_rLabel(r.statut), c),
        ]),
      ]),
    );
  }
}

// ── Tab Flotte ────────────────────────────────────────────────────────────────

class _FleetTab extends StatelessWidget {
  final List<_Vehicle> vehicles;
  final void Function(String) onToggle;
  final void Function(String vehicleId, String chauffeurId) onAssign;
  final void Function(String vehicleId) onDeassign;
  const _FleetTab({required this.vehicles, required this.onToggle,
    required this.onAssign, required this.onDeassign});

  @override
  Widget build(BuildContext context) => SafeArea(
    child: ListView(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 80),
      children: [
        Row(children: [
          const Icon(Icons.directions_car_rounded, color: AppColors.goldPrimary, size: 22),
          const SizedBox(width: 8),
          const Text('Ma Flotte', style: TextStyle(color: AppColors.textPrimary, fontSize: 20, fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
          const Spacer(),
          _tag('${vehicles.length} véhicules', AppColors.goldPrimary),
        ]),
        const SizedBox(height: 16),
        ...vehicles.map((v) => _VehicleCard(
          v: v,
          onToggle: () => onToggle(v.id),
          onAssign: (cid) => onAssign(v.id, cid),
          onDeassign: () => onDeassign(v.id),
        )),
      ],
    ),
  );
}

class _VehicleCard extends StatelessWidget {
  final _Vehicle v;
  final VoidCallback onToggle;
  final void Function(String chauffeurId) onAssign;
  final VoidCallback onDeassign;
  const _VehicleCard({required this.v, required this.onToggle,
    required this.onAssign, required this.onDeassign});

  void _showAssignSheet(BuildContext ctx) {
    showModalBottomSheet(
      context: ctx,
      backgroundColor: AppColors.darkSurface,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(margin: const EdgeInsets.symmetric(vertical: 10),
            width: 36, height: 4,
            decoration: BoxDecoration(color: AppColors.darkBorder, borderRadius: BorderRadius.circular(2))),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
            child: Row(children: [
              const Text('Assigner un chauffeur', style: TextStyle(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold)),
              const Spacer(),
              if (v.chauffeur != null)
                TextButton.icon(
                  onPressed: () { Navigator.pop(_); onDeassign(); },
                  icon: const Icon(Icons.person_remove_outlined, size: 14),
                  label: const Text('Désassigner', style: TextStyle(fontSize: 12)),
                  style: TextButton.styleFrom(foregroundColor: AppColors.error),
                ),
            ]),
          ),
          ..._chauffeurs.map((c) {
            final isAssigned = v.chauffeurId == c.id;
            final dispo = c.disponibilite == 'disponible';
            return ListTile(
              leading: CircleAvatar(
                radius: 22,
                backgroundImage: NetworkImage(c.photo),
              ),
              title: Text(c.fullName, style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
              subtitle: Row(children: [
                Container(width: 6, height: 6, margin: const EdgeInsets.only(right: 5),
                  decoration: BoxDecoration(color: dispo ? const Color(0xFF34D399) : const Color(0xFFF59E0B), shape: BoxShape.circle)),
                Text(dispo ? 'Disponible' : 'En course',
                  style: TextStyle(color: dispo ? const Color(0xFF34D399) : const Color(0xFFF59E0B), fontSize: 11)),
                const SizedBox(width: 8),
                Text('★ ${c.note}  ·  ${c.missions} missions', style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
              ]),
              trailing: isAssigned
                ? const Icon(Icons.check_circle_rounded, color: AppColors.goldPrimary, size: 20)
                : const Icon(Icons.chevron_right, color: AppColors.textMuted, size: 18),
              onTap: dispo || isAssigned ? () { Navigator.pop(_); if (!isAssigned) onAssign(c.id); } : null,
            );
          }),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = _vColor(v.statut);
    final ch = v.chauffeur;
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.darkBorder)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Stack(children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: Image.network(v.image, height: 140, width: double.infinity, fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(height: 140, color: const Color(0xFF1F2937))),
          ),
          Positioned(top: 10, left: 10, child: _tag(_vLabel(v.statut), c)),
          Positioned(top: 10, right: 10, child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: Colors.black54, borderRadius: BorderRadius.circular(8)),
            child: Text(v.plaque, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
          )),
        ]),
        Padding(
          padding: const EdgeInsets.all(14),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(v.nom, style: const TextStyle(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold, fontFamily: 'Playfair Display')),
            Text(v.type, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
            const SizedBox(height: 10),

            // ── Chauffeur badge ──
            if (ch != null)
              Container(
                padding: const EdgeInsets.all(10),
                margin: const EdgeInsets.only(bottom: 10),
                decoration: BoxDecoration(
                  color: const Color(0xFF60A5FA).withOpacity(0.07),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF60A5FA).withOpacity(0.25)),
                ),
                child: Row(children: [
                  CircleAvatar(radius: 16, backgroundImage: NetworkImage(ch.photo)),
                  const SizedBox(width: 8),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(ch.fullName, style: const TextStyle(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.w600)),
                    Text('★ ${ch.note}  ·  ${ch.missions} missions',
                      style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
                  ])),
                  GestureDetector(
                    onTap: () => _showAssignSheet(context),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(color: AppColors.goldPrimary.withOpacity(0.1), borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.goldPrimary.withOpacity(0.3))),
                      child: const Text('Changer', style: TextStyle(color: AppColors.goldPrimary, fontSize: 10, fontWeight: FontWeight.w600)),
                    ),
                  ),
                ]),
              )
            else
              GestureDetector(
                onTap: () => _showAssignSheet(context),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  margin: const EdgeInsets.only(bottom: 10),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.darkBorder, style: BorderStyle.solid),
                    color: AppColors.darkBg,
                  ),
                  child: const Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Icon(Icons.person_add_outlined, size: 14, color: AppColors.goldPrimary),
                    SizedBox(width: 6),
                    Text('Assigner un chauffeur', style: TextStyle(color: AppColors.goldPrimary, fontSize: 12, fontWeight: FontWeight.w600)),
                  ]),
                ),
              ),

            // Stats
            Row(children: [
              _StatPill(Icons.bar_chart_rounded, '${v.tauxOccupation}% occ.', AppColors.goldPrimary),
              const SizedBox(width: 8),
              _StatPill(Icons.monetization_on_outlined, v.revenusMois, const Color(0xFF34D399)),
            ]),
            const SizedBox(height: 12),
            if (v.statut != 'en_mission') SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: onToggle,
                icon: Icon(v.statut == 'maintenance' ? Icons.check_circle_outline : Icons.build_outlined, size: 15),
                label: Text(v.statut == 'maintenance' ? 'Marquer disponible' : 'Mettre en maintenance'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: v.statut == 'maintenance' ? const Color(0xFF34D399) : const Color(0xFFF59E0B),
                  side: BorderSide(color: (v.statut == 'maintenance' ? const Color(0xFF34D399) : const Color(0xFFF59E0B)).withOpacity(0.5)),
                ),
              ),
            ),
          ]),
        ),
      ]),
    );
  }
}

class _StatPill extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _StatPill(this.icon, this.label, this.color);
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
    decoration: BoxDecoration(color: color.withOpacity(0.08), borderRadius: BorderRadius.circular(20), border: Border.all(color: color.withOpacity(0.2))),
    child: Row(mainAxisSize: MainAxisSize.min, children: [
      Icon(icon, size: 12, color: color),
      const SizedBox(width: 4),
      Text(label, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.w500)),
    ]),
  );
}

// ── Tab Revenus ───────────────────────────────────────────────────────────────

class _RevenusTab extends StatelessWidget {
  const _RevenusTab();

  @override
  Widget build(BuildContext context) {
    final months = ['Jan','Fév','Mar','Avr','Mai','Jun'];
    final values = [380, 420, 310, 510, 490, 542];
    final peak = values.reduce((a, b) => a > b ? a : b);

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 80),
        children: [
          Row(children: [
            const Icon(Icons.bar_chart_rounded, color: AppColors.goldPrimary, size: 22),
            const SizedBox(width: 8),
            const Text('Revenus', style: TextStyle(color: AppColors.textPrimary, fontSize: 20, fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
          ]),
          const SizedBox(height: 16),

          // Résumé
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: LinearGradient(colors: [AppColors.goldPrimary.withOpacity(0.15), Colors.transparent], begin: Alignment.topLeft, end: Alignment.bottomRight),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.goldPrimary.withOpacity(0.3)),
            ),
            child: Column(children: [
              const Text('Net ce mois', style: TextStyle(color: AppColors.textSecondary, fontSize: 13)),
              const SizedBox(height: 4),
              const Text('542 000 FCFA', style: TextStyle(color: AppColors.goldPrimary, fontSize: 28, fontWeight: FontWeight.bold, fontFamily: 'Playfair Display')),
              const SizedBox(height: 10),
              Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [
                Column(children: [const Text('Brut', style: TextStyle(color: AppColors.textMuted, fontSize: 11)), const Text('650 000', style: TextStyle(color: Color(0xFF34D399), fontSize: 14, fontWeight: FontWeight.bold))]),
                Column(children: [const Text('Charges', style: TextStyle(color: AppColors.textMuted, fontSize: 11)), const Text('-108 000', style: TextStyle(color: Color(0xFFEF4444), fontSize: 14, fontWeight: FontWeight.bold))]),
                Column(children: [const Text('Résas', style: TextStyle(color: AppColors.textMuted, fontSize: 11)), const Text('14', style: TextStyle(color: Color(0xFF60A5FA), fontSize: 14, fontWeight: FontWeight.bold))]),
              ]),
            ]),
          ),
          const SizedBox(height: 20),

          // Bar chart
          const Text('Revenus mensuels (K FCFA)', style: TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
          const SizedBox(height: 14),
          SizedBox(
            height: 140,
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
                      height: 100 * pct,
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
          const SizedBox(height: 20),

          // Par véhicule
          const Text('Par véhicule', style: TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          ..._vehicles.map((v) => Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.darkBorder)),
            child: Row(children: [
              Container(width: 8, height: 44, decoration: BoxDecoration(color: _vColor(v.statut), borderRadius: BorderRadius.circular(4))),
              const SizedBox(width: 10),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(v.nom, style: const TextStyle(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.w600), maxLines: 1, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 4),
                ClipRRect(borderRadius: BorderRadius.circular(3), child: LinearProgressIndicator(value: v.tauxOccupation / 100, backgroundColor: const Color(0xFF1F2937), color: AppColors.goldPrimary, minHeight: 4)),
              ])),
              const SizedBox(width: 10),
              Text(v.revenusMois, style: const TextStyle(color: AppColors.goldPrimary, fontSize: 12, fontWeight: FontWeight.bold)),
            ]),
          )),
          const SizedBox(height: 20),

          // Transactions
          const Text('Transactions récentes', style: TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          ..._payments.map((p) => Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.darkBorder)),
            child: Row(children: [
              Container(width: 36, height: 36, decoration: BoxDecoration(
                color: p.credit ? const Color(0xFF34D399).withOpacity(0.1) : const Color(0xFFEF4444).withOpacity(0.1),
                shape: BoxShape.circle,
              ), child: Icon(p.credit ? Icons.arrow_downward_rounded : Icons.arrow_upward_rounded, size: 16, color: p.credit ? const Color(0xFF34D399) : const Color(0xFFEF4444))),
              const SizedBox(width: 10),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(p.desc, style: const TextStyle(color: AppColors.textPrimary, fontSize: 12), maxLines: 1, overflow: TextOverflow.ellipsis),
                Text(p.date, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
              ])),
              Text(p.montant, style: TextStyle(color: p.credit ? const Color(0xFF34D399) : const Color(0xFFEF4444), fontSize: 12, fontWeight: FontWeight.bold)),
            ]),
          )),
        ],
      ),
    );
  }
}

// ── Tab Réservations ──────────────────────────────────────────────────────────

class _ResaTab extends StatefulWidget {
  final List<_Resa> resas;
  final void Function(String, String) onUpdate;
  const _ResaTab({required this.resas, required this.onUpdate});
  @override
  State<_ResaTab> createState() => _ResaTabState();
}

class _ResaTabState extends State<_ResaTab> with SingleTickerProviderStateMixin {
  late TabController _ctrl;
  @override void initState() { super.initState(); _ctrl = TabController(length: 4, vsync: this); }
  @override void dispose()   { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final tabs  = ['Toutes', 'En cours', 'Confirmées', 'Terminées'];
    final keys  = ['tous', 'en_cours', 'confirmee', 'terminee'];
    return SafeArea(
      child: Column(children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
          child: Row(children: [
            const Icon(Icons.event_note_rounded, color: AppColors.goldPrimary, size: 22),
            const SizedBox(width: 8),
            const Text('Réservations', style: TextStyle(color: AppColors.textPrimary, fontSize: 20, fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
          ]),
        ),
        const SizedBox(height: 10),
        TabBar(
          controller: _ctrl,
          isScrollable: true, tabAlignment: TabAlignment.start,
          labelColor: AppColors.goldPrimary, unselectedLabelColor: AppColors.textMuted,
          indicatorColor: AppColors.goldPrimary, indicatorSize: TabBarIndicatorSize.label,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          labelStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
          tabs: tabs.map((t) => Tab(text: t)).toList(),
        ),
        Expanded(
          child: TabBarView(
            controller: _ctrl,
            children: keys.map((k) {
              final list = k == 'tous' ? widget.resas : widget.resas.where((r) => r.statut == k).toList();
              if (list.isEmpty) return Center(child: Text('Aucune réservation', style: const TextStyle(color: AppColors.textMuted)));
              return ListView.builder(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 80),
                itemCount: list.length,
                itemBuilder: (ctx, i) => _ResaCard(r: list[i], onUpdate: widget.onUpdate),
              );
            }).toList(),
          ),
        ),
      ]),
    );
  }
}

class _ResaCard extends StatelessWidget {
  final _Resa r;
  final void Function(String, String) onUpdate;
  const _ResaCard({required this.r, required this.onUpdate});

  @override
  Widget build(BuildContext context) {
    final c = _rColor(r.statut);
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.darkBorder)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Text(r.ref, style: const TextStyle(color: AppColors.textMuted, fontSize: 11, fontFamily: 'monospace')),
            const Spacer(),
            _tag(_rLabel(r.statut), c),
          ]),
          const SizedBox(height: 8),
          Text(r.client, style: const TextStyle(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold)),
          Text(r.type, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
          const SizedBox(height: 8),
          Row(children: [
            const Icon(Icons.directions_car_rounded, size: 13, color: AppColors.textMuted),
            const SizedBox(width: 4),
            Text(r.vehicule, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
            const Spacer(),
            const Icon(Icons.schedule_rounded, size: 13, color: AppColors.textMuted),
            const SizedBox(width: 4),
            Text('${r.date} ${r.heure}', style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
          ]),
          const SizedBox(height: 8),
          Row(children: [
            Text(r.montant, style: const TextStyle(color: AppColors.goldPrimary, fontSize: 15, fontWeight: FontWeight.bold)),
            const Spacer(),
            if (r.statut == 'confirmee') ...[
              OutlinedButton(
                onPressed: () => onUpdate(r.ref, 'annulee'),
                style: OutlinedButton.styleFrom(foregroundColor: const Color(0xFFEF4444), side: const BorderSide(color: Color(0xFFEF4444)), minimumSize: const Size(80, 32), padding: EdgeInsets.zero),
                child: const Text('Annuler', style: TextStyle(fontSize: 11)),
              ),
            ],
            if (r.statut == 'en_cours') ...[
              ElevatedButton(
                onPressed: () => onUpdate(r.ref, 'terminee'),
                style: ElevatedButton.styleFrom(minimumSize: const Size(100, 32), padding: EdgeInsets.zero),
                child: const Text('Clôturer', style: TextStyle(fontSize: 11)),
              ),
            ],
          ]),
        ]),
      ),
    );
  }
}

// ── Tab Profil ────────────────────────────────────────────────────────────────

class _ProfilOwnerTab extends StatefulWidget {
  final dynamic user;
  final VoidCallback onLogout;
  const _ProfilOwnerTab({required this.user, required this.onLogout});
  @override
  State<_ProfilOwnerTab> createState() => _ProfilOwnerTabState();
}

class _ProfilOwnerTabState extends State<_ProfilOwnerTab> {
  bool _alertes = true;
  bool _rapports = true;

  @override
  Widget build(BuildContext context) {
    final u = widget.user;
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 80),
        children: [
          // Header
          Row(children: [
            Container(width: 60, height: 60,
              decoration: BoxDecoration(gradient: const LinearGradient(colors: [Color(0xFFD4A017), Color(0xFF92400E)]), borderRadius: BorderRadius.circular(16)),
              child: Center(child: Text((u?.prenom?[0] ?? 'P').toUpperCase(), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 24)))),
            const SizedBox(width: 14),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('${u?.prenom ?? ''} ${u?.nom ?? ''}', style: const TextStyle(color: AppColors.textPrimary, fontSize: 17, fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
              Text(u?.telephone ?? '', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
              const SizedBox(height: 4),
              _tag('Propriétaire', AppColors.goldPrimary),
            ])),
          ]),
          const SizedBox(height: 20),

          // Stats
          GridView.count(
            crossAxisCount: 3, shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 8, mainAxisSpacing: 8, childAspectRatio: 1.8,
            children: [
              _RevCard('${_vehicles.length}', 'Véhicules', const Color(0xFFD4A017)),
              _RevCard('542K', 'Net FCFA', const Color(0xFF34D399)),
              _RevCard('78%', 'Occupation', const Color(0xFF60A5FA)),
            ],
          ),
          const SizedBox(height: 16),

          // Ma flotte mini
          const Text('Ma flotte', style: TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          ..._vehicles.map((v) => _VehicleMiniCard(v: v)),
          const SizedBox(height: 16),

          // Notifications
          Container(
            decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppColors.darkBorder)),
            child: Column(children: [
              _SwitchTile('Alertes en temps réel', 'Missions, réservations, incidents', _alertes, (v) => setState(() => _alertes = v)),
              const Divider(color: AppColors.darkBorder, height: 1),
              _SwitchTile('Rapports hebdomadaires', 'Résumé par email chaque lundi', _rapports, (v) => setState(() => _rapports = v)),
            ]),
          ),
          const SizedBox(height: 16),

          // Menu actions
          ...['Mes documents', 'Support Luxe Drive', 'Conditions d\'utilisation'].map((label) => Container(
            margin: const EdgeInsets.only(bottom: 8),
            decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.darkBorder)),
            child: ListTile(
              leading: Icon(label == 'Mes documents' ? Icons.folder_outlined : label == 'Support Luxe Drive' ? Icons.headset_mic_outlined : Icons.article_outlined, color: AppColors.textMuted, size: 20),
              title: Text(label, style: const TextStyle(color: AppColors.textPrimary, fontSize: 13)),
              trailing: const Icon(Icons.chevron_right, color: AppColors.textMuted, size: 18),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
              dense: true,
              onTap: () {},
            ),
          )),
          const SizedBox(height: 8),
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

class _SwitchTile extends StatelessWidget {
  final String title, sub;
  final bool value;
  final ValueChanged<bool> onChanged;
  const _SwitchTile(this.title, this.sub, this.value, this.onChanged);
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
    child: Row(children: [
      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(title, style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w500)),
        Text(sub, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
      ])),
      Switch.adaptive(value: value, onChanged: onChanged, activeColor: AppColors.goldPrimary),
    ]),
  );
}

// ── Tab Maintenance ───────────────────────────────────────────────────────────

class _MaintenanceTab extends StatelessWidget {
  const _MaintenanceTab();

  static const _items = [
    {'vehicule':'Mercedes S 580','plaque':'LT-1234-YA','type':'Vidange + filtres','date':'20 Jun 2025','cout':'45 000 FCFA','statut':'planifie'},
    {'vehicule':'Bentley Bentayga','plaque':'LT-3456-YA','type':'Révision 50 000 km','date':'Auj.','cout':'120 000 FCFA','statut':'en_cours'},
    {'vehicule':'Audi A8 L','plaque':'LT-5678-YA','type':'Contrôle technique','date':'15 Jul 2025','cout':'25 000 FCFA','statut':'planifie'},
    {'vehicule':'Mercedes S 580','plaque':'LT-1234-YA','type':'Remplacement pneus','date':'02 Jun 2025','cout':'80 000 FCFA','statut':'termine'},
    {'vehicule':'Range Rover','plaque':'LT-9012-YA','type':'Freins + disques','date':'28 Mai 2025','cout':'95 000 FCFA','statut':'termine'},
  ];

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 80),
        children: [
          Row(children: [
            const Icon(Icons.build_rounded, color: AppColors.goldPrimary, size: 22),
            const SizedBox(width: 8),
            const Text('Maintenance', style: TextStyle(color: AppColors.textPrimary, fontSize: 20, fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
            const Spacer(),
            _tag('${_items.length} entrées', AppColors.warning),
          ]),
          const SizedBox(height: 16),
          // Summary KPIs
          Row(children: [
            Expanded(child: _RevCard('2', 'À venir', const Color(0xFFF59E0B))),
            const SizedBox(width: 8),
            Expanded(child: _RevCard('1', 'En cours', const Color(0xFF60A5FA))),
            const SizedBox(width: 8),
            Expanded(child: _RevCard('345K', 'FCFA total', const Color(0xFF34D399))),
          ]),
          const SizedBox(height: 20),
          const Text('Interventions', style: TextStyle(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          ..._items.map((m) {
            Color sc; String sl;
            switch (m['statut']) {
              case 'en_cours': sc = const Color(0xFF60A5FA); sl = 'En cours'; break;
              case 'planifie': sc = const Color(0xFFF59E0B); sl = 'Planifié'; break;
              default:         sc = const Color(0xFF9CA3AF); sl = 'Terminé';
            }
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.darkCard,
                borderRadius: BorderRadius.circular(14),
                border: Border(left: BorderSide(color: sc, width: 3),
                  top: BorderSide(color: AppColors.darkBorder), right: BorderSide(color: AppColors.darkBorder), bottom: BorderSide(color: AppColors.darkBorder)),
              ),
              child: Row(children: [
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(m['type']!, style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
                  Text('${m['vehicule']} · ${m['plaque']}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                  const SizedBox(height: 4),
                  Row(children: [
                    const Icon(Icons.schedule_rounded, size: 11, color: AppColors.textMuted),
                    const SizedBox(width: 3),
                    Text(m['date']!, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
                  ]),
                ])),
                Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                  _tag(sl, sc),
                  const SizedBox(height: 6),
                  Text(m['cout']!, style: const TextStyle(color: AppColors.goldPrimary, fontSize: 12, fontWeight: FontWeight.bold)),
                ]),
              ]),
            );
          }),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.add_rounded, size: 16),
              label: const Text('Planifier une intervention'),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Tab Notifications (Owner) ─────────────────────────────────────────────────

class _NotificationsOwnerTab extends StatelessWidget {
  const _NotificationsOwnerTab();

  static const _notifs = [
    {'titre':'Nouvelle réservation','desc':'M. Etoga — Mercedes S 580 · 14h30 Auj.','heure':'Il y a 5 min','type':'resa','lu':false},
    {'titre':'Mission en cours','desc':'David Kameni a démarré la mission MIS-0440','heure':'Il y a 32 min','type':'mission','lu':false},
    {'titre':'Paiement reçu','desc':'+85 000 FCFA — Location Mercedes S 580','heure':'Il y a 2h','type':'paiement','lu':true},
    {'titre':'Alerte maintenance','desc':'Bentley Bentayga — révision due dans 3 jours','heure':'Il y a 4h','type':'maintenance','lu':true},
    {'titre':'Réservation annulée','desc':'Mme Biya Lucie — Bentley Bentayga · 19h00','heure':'Hier','type':'annulation','lu':true},
    {'titre':'Chauffeur indisponible','desc':'M. Fouda Éric a déclaré une indisponibilité demain','heure':'Hier','type':'chauffeur','lu':true},
    {'titre':'Rapport hebdo disponible','desc':'Semaine du 2–8 Jun — Revenus, taux d\'occupation','heure':'Lun.','type':'rapport','lu':true},
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
              case 'resa':        ic = Icons.event_note_rounded;      nc = const Color(0xFF60A5FA); break;
              case 'mission':     ic = Icons.navigation_rounded;       nc = const Color(0xFF34D399); break;
              case 'paiement':    ic = Icons.payments_rounded;         nc = const Color(0xFF34D399); break;
              case 'maintenance': ic = Icons.build_rounded;            nc = AppColors.warning;       break;
              case 'annulation':  ic = Icons.cancel_outlined;          nc = AppColors.error;         break;
              case 'chauffeur':   ic = Icons.person_off_outlined;      nc = AppColors.warning;       break;
              default:            ic = Icons.summarize_rounded;        nc = AppColors.goldPrimary;
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
