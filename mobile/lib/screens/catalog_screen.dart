import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../utils/constants.dart';
import '../services/api_service.dart';

// ── Constants ─────────────────────────────────────────────────────────────────
const _kTel = '+237699000001';
const _kTelDisplay = '+237 699 000 001';
const _kTypesService = [
  'Protocole / VIP', 'Transfert aéroport', 'Corporate / Mise à dispo',
  'Événement privé', 'Mariage & Cérémonie', 'Tourisme',
];

// ── Helpers ───────────────────────────────────────────────────────────────────
Future<void> _callLuxe() async {
  final uri = Uri.parse('tel:$_kTel');
  if (await canLaunchUrl(uri)) await launchUrl(uri);
}

// ── Mock data ─────────────────────────────────────────────────────────────────

class _Vehicule {
  final String id, marque, nom, segment, couleur, carburant;
  final int annee, places, prixJour;
  final bool disponible;
  final List<String> images;
  const _Vehicule({required this.id, required this.marque, required this.nom, required this.segment,
    required this.couleur, required this.carburant,
    required this.annee, required this.places, required this.prixJour,
    required this.disponible, required this.images});
  String get image => images.isNotEmpty ? images.first : '';
}

class _Chauffeur {
  final String id, prenom, nom, ville, photo, bio;
  final double note;
  final int missions;
  final bool disponible;
  final List<String> specialites, certifications;
  const _Chauffeur({required this.id, required this.prenom, required this.nom, required this.ville,
    required this.photo, required this.bio, required this.note, required this.missions,
    required this.disponible, required this.specialites, required this.certifications});
}

class _Vente {
  final String id, marque, nom, image, etat, garantie;
  final int annee, kilometrage, prixVente;
  final bool vendu;
  const _Vente({required this.id, required this.marque, required this.nom, required this.image,
    required this.etat, required this.garantie, required this.annee, required this.kilometrage,
    required this.prixVente, required this.vendu});
}

const _locationVehicles = [
  _Vehicule(id:'RR1', marque:'Rolls-Royce', nom:'Phantom VIII', segment:'Ultra-Luxe', annee:2024,
    couleur:'Noir Diamant', carburant:'Essence', places:4, prixJour:850000, disponible:true,
    images:['https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80']),
  _Vehicule(id:'BN1', marque:'Bentley', nom:'Mulsanne Speed', segment:'Ultra-Luxe', annee:2023,
    couleur:'Argent Mercure', carburant:'Essence', places:4, prixJour:700000, disponible:true,
    images:['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80']),
  _Vehicule(id:'LB1', marque:'Lamborghini', nom:'Urus S', segment:'Ultra-Luxe', annee:2024,
    couleur:'Jaune Giallo Inti', carburant:'Essence', places:5, prixJour:650000, disponible:false,
    images:['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80']),
  _Vehicule(id:'MB1', marque:'Mercedes-Benz', nom:'Classe S 580', segment:'Haut-Gamme', annee:2024,
    couleur:'Obsidian Black', carburant:'Hybride', places:4, prixJour:250000, disponible:true,
    images:['https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80']),
  _Vehicule(id:'BW1', marque:'BMW', nom:'Série 7 750i', segment:'Haut-Gamme', annee:2024,
    couleur:'Tanzanite Blue', carburant:'Hybride', places:5, prixJour:220000, disponible:true,
    images:['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80']),
  _Vehicule(id:'AU1', marque:'Audi', nom:'A8 L 60 TFSIe', segment:'Haut-Gamme', annee:2024,
    couleur:'Argent Floret', carburant:'Hybride', places:5, prixJour:200000, disponible:true,
    images:['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=1200&q=80']),
  _Vehicule(id:'MB2', marque:'Mercedes-Benz', nom:'Classe E 450', segment:'Premium', annee:2024,
    couleur:'Blanc Opale', carburant:'Hybride', places:5, prixJour:120000, disponible:true,
    images:['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=1200&q=80']),
  _Vehicule(id:'PO1', marque:'Porsche', nom:'Taycan 4S', segment:'Premium', annee:2024,
    couleur:'Gentian Blue', carburant:'Électrique', places:4, prixJour:180000, disponible:true,
    images:['https://images.unsplash.com/photo-1611821639601-d25a8c11a821?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1200&q=80']),
  _Vehicule(id:'LX1', marque:'Lexus', nom:'LS 500h AWD', segment:'Premium', annee:2023,
    couleur:'Sonic Titanium', carburant:'Hybride', places:5, prixJour:130000, disponible:true,
    images:['https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80']),
];

const _chauffeurs = [
  _Chauffeur(id:'C1', prenom:'David', nom:'Kameni', ville:'Yaoundé', note:4.9, missions:312, disponible:true,
    photo:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=70',
    bio:'Chauffeur de prestige certifié, ancien protocole gouvernemental.',
    specialites:['Protocole VIP','Aéroport'], certifications:['KYC vérifié','Top Chauffeur 2024']),
  _Chauffeur(id:'C2', prenom:'Alice', nom:'Nguema', ville:'Douala', note:4.8, missions:248, disponible:true,
    photo:'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=70',
    bio:'Professionnelle certifiée, spécialiste du transport corporate.',
    specialites:['Corporate','Mise à dispo'], certifications:['KYC vérifié','Formation VIP']),
  _Chauffeur(id:'C3', prenom:'Éric', nom:'Fouda', ville:'Yaoundé', note:4.7, missions:195, disponible:false,
    photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=70',
    bio:'Expert des événements haut de gamme.',
    specialites:['Événements','Mariages'], certifications:['KYC vérifié']),
  _Chauffeur(id:'C4', prenom:'Sandrine', nom:'Mbarga', ville:'Douala', note:4.9, missions:401, disponible:true,
    photo:'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=70',
    bio:'Top chauffeure 2024. Référence protocole d\'État.',
    specialites:['Ultra-VIP','Ambassades'], certifications:['KYC vérifié','Top Chauffeur 2024','Formation diplomatie']),
  _Chauffeur(id:'C5', prenom:'Jean-Marc', nom:'Eyenga', ville:'Yaoundé', note:4.6, missions:167, disponible:true,
    photo:'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=70',
    bio:'Ponctuel, discret, idéal pour déplacements quotidiens.',
    specialites:['Transfert hôtel','Aéroport'], certifications:['KYC vérifié']),
  _Chauffeur(id:'C6', prenom:'Christelle', nom:'Ondo', ville:'Douala', note:4.8, missions:289, disponible:true,
    photo:'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=200&q=70',
    bio:'Spécialiste corporate et tech VIP.',
    specialites:['VIP Tech','Événementiel'], certifications:['KYC vérifié','Permis B+']),
];

const _venteVehicles = [
  _Vente(id:'V1', marque:'Rolls-Royce', nom:'Ghost Extended', annee:2022, kilometrage:18500,
    image:'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=600&q=70',
    etat:'Excellent', garantie:'12 mois', prixVente:450000000, vendu:false),
  _Vente(id:'V2', marque:'Bentley', nom:'Flying Spur V8', annee:2023, kilometrage:12000,
    image:'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=70',
    etat:'Comme neuf', garantie:'24 mois', prixVente:220000000, vendu:false),
  _Vente(id:'V3', marque:'Mercedes-Benz', nom:'Maybach S680', annee:2023, kilometrage:22000,
    image:'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=600&q=70',
    etat:'Très bon', garantie:'12 mois', prixVente:185000000, vendu:false),
  _Vente(id:'V4', marque:'Lamborghini', nom:'Urus Performante', annee:2023, kilometrage:8500,
    image:'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=70',
    etat:'Excellent', garantie:'18 mois', prixVente:280000000, vendu:true),
  _Vente(id:'V5', marque:'BMW', nom:'Série 7 750i Individual', annee:2022, kilometrage:35000,
    image:'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=70',
    etat:'Très bon', garantie:'6 mois', prixVente:85000000, vendu:false),
  _Vente(id:'V6', marque:'Audi', nom:'A8 L 60 TFSIe Quattro', annee:2023, kilometrage:18000,
    image:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=70',
    etat:'Excellent', garantie:'12 mois', prixVente:95000000, vendu:false),
];

// ── Helpers ───────────────────────────────────────────────────────────────────

String _fmt(int n) {
  if (n >= 1000000) return '${(n/1000000).toStringAsFixed(n%1000000==0?0:1)}M';
  if (n >= 1000) return '${(n/1000).toStringAsFixed(0)}K';
  return n.toString();
}

Color _segColor(String s) {
  switch (s) {
    case 'Ultra-Luxe': return const Color(0xFFA855F7);
    case 'Haut-Gamme': return AppColors.goldPrimary;
    default: return const Color(0xFF60A5FA);
  }
}

// ── Main screen ───────────────────────────────────────────────────────────────

class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key});
  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> with SingleTickerProviderStateMixin {
  late TabController _ctrl;
  String _search = '';
  String _segment = 'Tous';

  @override
  void initState() { super.initState(); _ctrl = TabController(length: 3, vsync: this); }
  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: AppBar(
        backgroundColor: AppColors.darkSurface,
        title: const Text('Catalogue Luxe Drive'),
        bottom: TabBar(
          controller: _ctrl,
          labelColor: AppColors.goldPrimary,
          unselectedLabelColor: AppColors.textMuted,
          indicatorColor: AppColors.goldPrimary,
          tabs: const [Tab(text:'🚗 Location'), Tab(text:'👤 Chauffeurs'), Tab(text:'🏷️ Achat')],
        ),
      ),
      body: Column(children: [
        // Search
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
          child: TextField(
            onChanged: (v) => setState(() => _search = v.toLowerCase()),
            style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
            decoration: const InputDecoration(
              hintText: 'Rechercher…',
              prefixIcon: Icon(Icons.search_rounded, color: AppColors.goldPrimary, size: 20),
              contentPadding: EdgeInsets.symmetric(vertical: 10),
            ),
          ),
        ),
        Expanded(
          child: TabBarView(
            controller: _ctrl,
            children: [
              _LocationTab(search: _search, segment: _segment, onSegment: (s) => setState(() => _segment = s)),
              _ChauffeursTab(search: _search),
              _VenteTab(search: _search),
            ],
          ),
        ),
      ]),
    );
  }
}

// ── Location tab ──────────────────────────────────────────────────────────────

class _LocationTab extends StatelessWidget {
  final String search, segment;
  final ValueChanged<String> onSegment;
  const _LocationTab({required this.search, required this.segment, required this.onSegment});

  @override
  Widget build(BuildContext context) {
    final all = _locationVehicles.where((v) {
      final q = search;
      return (q.isEmpty || v.nom.toLowerCase().contains(q) || v.marque.toLowerCase().contains(q))
        && (segment == 'Tous' || v.segment == segment);
    }).toList();

    return CustomScrollView(slivers: [
      SliverToBoxAdapter(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const SizedBox(height: 12),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(children: ['Tous','Ultra-Luxe','Haut-Gamme','Premium'].map((s) =>
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: GestureDetector(
                onTap: () => onSegment(s),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    color: segment == s ? AppColors.goldPrimary.withOpacity(0.12) : AppColors.darkCard,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: segment == s ? AppColors.goldPrimary.withOpacity(0.4) : AppColors.darkBorder),
                  ),
                  child: Text(s, style: TextStyle(color: segment == s ? AppColors.goldPrimary : AppColors.textMuted, fontSize: 12, fontWeight: FontWeight.w500)),
                ),
              ),
            )
          ).toList()),
        ),
        const SizedBox(height: 12),
      ])),
      if (all.isEmpty) const SliverFillRemaining(
        child: Center(child: Text('Aucun véhicule', style: TextStyle(color: AppColors.textMuted))),
      ) else SliverPadding(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 80),
        sliver: SliverList(delegate: SliverChildBuilderDelegate(
          (_, i) => _VehicleCard(v: all[i]),
          childCount: all.length,
        )),
      ),
    ]);
  }
}

class _VehicleCard extends StatelessWidget {
  final _Vehicule v;
  const _VehicleCard({required this.v});
  @override
  Widget build(BuildContext context) {
    final sc = _segColor(v.segment);
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.darkBorder)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Image
        Stack(children: [
          GestureDetector(
            onTap: () => context.push('/vehicule/${v.id}'),
            child: ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              child: Image.network(v.image, height: 160, width: double.infinity, fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => Container(height: 160, color: const Color(0xFF1F2937),
                  child: const Center(child: Icon(Icons.directions_car, color: Color(0xFF374151), size: 40)))),
            ),
          ),
          Positioned(top: 10, left: 10, child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(color: sc.withOpacity(0.15), borderRadius: BorderRadius.circular(20), border: Border.all(color: sc.withOpacity(0.4))),
            child: Text(v.segment, style: TextStyle(color: sc, fontSize: 10, fontWeight: FontWeight.bold)),
          )),
          // Photo count badge
          if (v.images.length > 1) Positioned(top: 10, right: 10, child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
            decoration: BoxDecoration(color: Colors.black.withOpacity(0.6), borderRadius: BorderRadius.circular(12)),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              const Icon(Icons.photo_library_outlined, size: 11, color: Colors.white70),
              const SizedBox(width: 3),
              Text('${v.images.length}', style: const TextStyle(color: Colors.white70, fontSize: 10)),
            ]),
          )),
          if (!v.disponible) Positioned.fill(child: Container(
            decoration: BoxDecoration(color: Colors.black.withOpacity(0.6), borderRadius: const BorderRadius.vertical(top: Radius.circular(16))),
            child: const Center(child: Text('Indisponible', style: TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.bold, fontSize: 13))),
          )),
        ]),
        // Info
        Padding(
          padding: const EdgeInsets.all(14),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(v.marque, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
            Text(v.nom, style: const TextStyle(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            Row(children: [
              _Pill(Icons.people_outline_rounded, '${v.places} places'),
              const SizedBox(width: 6),
              _Pill(Icons.local_gas_station_rounded, v.carburant),
              const SizedBox(width: 6),
              _Pill(Icons.calendar_today_rounded, '${v.annee}'),
            ]),
            const SizedBox(height: 10),
            Row(children: [
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('${_fmt(v.prixJour)} FCFA', style: const TextStyle(color: AppColors.goldPrimary, fontSize: 16, fontWeight: FontWeight.bold)),
                const Text('par jour', style: TextStyle(color: AppColors.textMuted, fontSize: 11)),
              ])),
              // Voir détail
              OutlinedButton(
                onPressed: () => context.push('/vehicule/${v.id}'),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(80, 32), padding: const EdgeInsets.symmetric(horizontal: 10),
                  side: BorderSide(color: AppColors.goldPrimary.withOpacity(0.5)),
                  foregroundColor: AppColors.goldPrimary,
                ),
                child: const Text('Détail', style: TextStyle(fontSize: 11)),
              ),
              const SizedBox(width: 8),
              // Réserver
              ElevatedButton(
                onPressed: v.disponible ? () => _showLocationBookingSheet(context, v) : null,
                style: ElevatedButton.styleFrom(minimumSize: const Size(80, 32), padding: const EdgeInsets.symmetric(horizontal: 10)),
                child: const Text('Réserver', style: TextStyle(fontSize: 11)),
              ),
            ]),
          ]),
        ),
      ]),
    );
  }
}

class _Pill extends StatelessWidget {
  final IconData icon;
  final String label;
  const _Pill(this.icon, this.label);
  @override
  Widget build(BuildContext context) => Row(mainAxisSize: MainAxisSize.min, children: [
    Icon(icon, size: 11, color: AppColors.textMuted),
    const SizedBox(width: 3),
    Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
  ]);
}

// ── Chauffeurs tab ────────────────────────────────────────────────────────────

class _ChauffeursTab extends StatelessWidget {
  final String search;
  const _ChauffeursTab({required this.search});

  @override
  Widget build(BuildContext context) {
    final list = _chauffeurs.where((c) {
      final q = search;
      return q.isEmpty || '${c.prenom} ${c.nom}'.toLowerCase().contains(q) || c.ville.toLowerCase().contains(q);
    }).toList();

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
      itemCount: list.length + 1,
      itemBuilder: (ctx, i) {
        if (i == list.length) return Container(
          margin: const EdgeInsets.only(top: 16),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.goldPrimary.withOpacity(0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.goldPrimary.withOpacity(0.2)),
          ),
          child: Column(children: [
            const Text('Vous souhaitez devenir chauffeur ?', style: TextStyle(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
            const SizedBox(height: 8),
            const Text('Rejoignez notre réseau d\'élite certifié', style: TextStyle(color: AppColors.textSecondary, fontSize: 12), textAlign: TextAlign.center),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () => context.push('/devenir-chauffeur'),
              style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 40)),
              child: const Text('Déposer ma candidature'),
            ),
          ]),
        );
        return _ChauffeurCard(c: list[i]);
      },
    );
  }
}

class _ChauffeurCard extends StatelessWidget {
  final _Chauffeur c;
  const _ChauffeurCard({required this.c});

  @override
  Widget build(BuildContext context) => Container(
    margin: const EdgeInsets.only(bottom: 14),
    padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.darkBorder)),
    child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Stack(children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: Image.network(c.photo, width: 64, height: 64, fit: BoxFit.cover,
            errorBuilder: (_, __, ___) => Container(width: 64, height: 64, color: const Color(0xFF1F2937))),
        ),
        Positioned(bottom: 0, right: 0, child: Container(
          width: 14, height: 14,
          decoration: BoxDecoration(
            color: c.disponible ? const Color(0xFF34D399) : AppColors.textMuted,
            shape: BoxShape.circle,
            border: Border.all(color: AppColors.darkCard, width: 2),
          ),
        )),
      ]),
      const SizedBox(width: 12),
      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Text('${c.prenom} ${c.nom}', style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
          if (c.certifications.contains('Top Chauffeur 2024')) ...[
            const SizedBox(width: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(color: AppColors.goldPrimary.withOpacity(0.1), borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.goldPrimary.withOpacity(0.3))),
              child: const Text('⭐ Top', style: TextStyle(color: AppColors.goldPrimary, fontSize: 9, fontWeight: FontWeight.bold)),
            ),
          ],
        ]),
        const SizedBox(height: 3),
        Row(children: [
          ...List.generate(5, (i) => Icon(Icons.star_rounded, size: 12,
            color: i < c.note.floor() ? const Color(0xFFFBBF24) : const Color(0xFF374151))),
          const SizedBox(width: 4),
          Text('${c.note} (${c.missions} missions)', style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
        ]),
        const SizedBox(height: 4),
        Text('📍 ${c.ville}', style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
        const SizedBox(height: 6),
        Wrap(spacing: 4, runSpacing: 4, children: c.specialites.map((s) => Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
          decoration: BoxDecoration(color: const Color(0xFF60A5FA).withOpacity(0.1), borderRadius: BorderRadius.circular(10), border: Border.all(color: const Color(0xFF60A5FA).withOpacity(0.2))),
          child: Text(s, style: const TextStyle(color: Color(0xFF60A5FA), fontSize: 9)),
        )).toList()),
        const SizedBox(height: 8),
        Row(children: [
          Expanded(child: OutlinedButton.icon(
            onPressed: () => _showChauffeurBookingSheet(context, c),
            style: OutlinedButton.styleFrom(
              minimumSize: const Size(0, 34),
              side: BorderSide(color: AppColors.goldPrimary.withOpacity(0.4)),
              foregroundColor: AppColors.goldPrimary,
            ),
            icon: const Icon(Icons.calendar_today_rounded, size: 13),
            label: const Text('Réserver', style: TextStyle(fontSize: 11)),
          )),
          const SizedBox(width: 8),
          OutlinedButton(
            onPressed: _callLuxe,
            style: OutlinedButton.styleFrom(
              minimumSize: const Size(40, 34), padding: const EdgeInsets.symmetric(horizontal: 10),
              side: BorderSide(color: Colors.green.withOpacity(0.4)),
              foregroundColor: Colors.green,
            ),
            child: const Icon(Icons.phone_rounded, size: 15),
          ),
        ]),
      ])),
    ]),
  );
}

// ── Modal helpers ──────────────────────────────────────────────────────────────

void _showLocationBookingSheet(BuildContext context, _Vehicule v) {
  showModalBottomSheet(
    context: context, isScrollControlled: true, backgroundColor: Colors.transparent,
    builder: (_) => _LocationBookingSheet(vehicule: v),
  );
}

void _showChauffeurBookingSheet(BuildContext context, _Chauffeur c) {
  showModalBottomSheet(
    context: context, isScrollControlled: true, backgroundColor: Colors.transparent,
    builder: (_) => _ChauffeurBookingSheet(chauffeur: c),
  );
}

void _showVenteContactSheet(BuildContext context, _Vente v) {
  showModalBottomSheet(
    context: context, isScrollControlled: true, backgroundColor: Colors.transparent,
    builder: (_) => _VenteContactSheet(vente: v),
  );
}

// ── Location booking sheet ─────────────────────────────────────────────────────

class _LocationBookingSheet extends StatefulWidget {
  final _Vehicule vehicule;
  const _LocationBookingSheet({required this.vehicule});
  @override
  State<_LocationBookingSheet> createState() => _LocationBookingSheetState();
}

class _LocationBookingSheetState extends State<_LocationBookingSheet> {
  final _nomCtrl = TextEditingController();
  final _telCtrl = TextEditingController();
  DateTime? _debut, _fin;
  bool _loading = false, _done = false;

  String _fmtDate(DateTime? d) => d == null ? 'Sélectionner' : '${d.day.toString().padLeft(2,'0')}/${d.month.toString().padLeft(2,'0')}/${d.year}';

  Future<void> _pickDate(bool isDebut) async {
    final d = await showDatePicker(
      context: context, initialDate: DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 365)),
      builder: (_, child) => Theme(data: Theme.of(context).copyWith(colorScheme: const ColorScheme.dark(primary: AppColors.goldPrimary)), child: child!),
    );
    if (d != null) setState(() => isDebut ? _debut = d : _fin = d);
  }

  Future<void> _submit() async {
    if (_nomCtrl.text.isEmpty || _telCtrl.text.isEmpty || _debut == null || _fin == null) return;
    setState(() => _loading = true);
    try {
      await ApiService().post('/api/reservations', data: {
        'type': 'location', 'vehicule_nom': '${widget.vehicule.marque} ${widget.vehicule.nom}',
        'client_nom': _nomCtrl.text, 'client_tel': _telCtrl.text,
        'date_debut': _debut!.toIso8601String().substring(0, 10),
        'date_fin': _fin!.toIso8601String().substring(0, 10),
      });
    } catch (_) {}
    setState(() { _loading = false; _done = true; });
  }

  @override
  void initState() {
    super.initState();
    _nomCtrl.addListener(() => setState(() {}));
    _telCtrl.addListener(() => setState(() {}));
  }

  @override
  void dispose() { _nomCtrl.dispose(); _telCtrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final ins = MediaQuery.of(context).viewInsets;
    return Container(
      margin: EdgeInsets.only(bottom: ins.bottom),
      decoration: const BoxDecoration(color: Color(0xFF111111), borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: _done ? _SuccessContent(
            title: 'Demande envoyée !',
            subtitle: "L'équipe Luxe Drive vous contactera sous 24h au ${_telCtrl.text}.",
            onClose: () => Navigator.pop(context),
          ) : Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _SheetHandle(),
            Text('${widget.vehicule.marque} ${widget.vehicule.nom}', style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            Text('${_fmt(widget.vehicule.prixJour)} FCFA / jour', style: const TextStyle(color: AppColors.goldPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
            const SizedBox(height: 20),
            _FormField(controller: _nomCtrl, label: 'Nom complet *', hint: 'Jean Dupont', icon: Icons.person_outline_rounded),
            const SizedBox(height: 12),
            _FormField(controller: _telCtrl, label: 'Téléphone *', hint: '+237 6XX XXX XXX', icon: Icons.phone_outlined, keyboard: TextInputType.phone),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(child: _DateButton(label: 'Début', value: _fmtDate(_debut), onTap: () => _pickDate(true))),
              const SizedBox(width: 12),
              Expanded(child: _DateButton(label: 'Fin', value: _fmtDate(_fin), onTap: () => _pickDate(false))),
            ]),
            const SizedBox(height: 24),
            SizedBox(width: double.infinity, child: ElevatedButton.icon(
              onPressed: (_nomCtrl.text.isNotEmpty && _telCtrl.text.isNotEmpty && _debut != null && _fin != null && !_loading)
                  ? _submit : null,
              icon: _loading ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black))
                : const Icon(Icons.send_rounded, size: 16),
              label: Text(_loading ? 'Envoi…' : 'Confirmer la réservation'),
              style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
            )),
            const SizedBox(height: 8),
            SizedBox(width: double.infinity, child: TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Annuler', style: TextStyle(color: AppColors.textMuted)),
            )),
          ]),
        ),
      ),
    );
  }
}

// ── Chauffeur booking sheet ────────────────────────────────────────────────────

class _ChauffeurBookingSheet extends StatefulWidget {
  final _Chauffeur chauffeur;
  const _ChauffeurBookingSheet({required this.chauffeur});
  @override
  State<_ChauffeurBookingSheet> createState() => _ChauffeurBookingSheetState();
}

class _ChauffeurBookingSheetState extends State<_ChauffeurBookingSheet> {
  final _nomCtrl    = TextEditingController();
  final _telCtrl    = TextEditingController();
  final _departCtrl = TextEditingController();
  final _destCtrl   = TextEditingController();
  String _typeService = _kTypesService[0];
  DateTime? _date;
  bool _loading = false, _done = false;

  Future<void> _pickDate() async {
    final d = await showDatePicker(
      context: context, initialDate: DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 365)),
      builder: (_, child) => Theme(data: Theme.of(context).copyWith(colorScheme: const ColorScheme.dark(primary: AppColors.goldPrimary)), child: child!),
    );
    if (d != null) setState(() => _date = d);
  }

  Future<void> _submit() async {
    if (_nomCtrl.text.isEmpty || _telCtrl.text.isEmpty || _date == null) return;
    setState(() => _loading = true);
    try {
      await ApiService().post('/api/reservations', data: {
        'type': 'chauffeur', 'chauffeur_nom': '${widget.chauffeur.prenom} ${widget.chauffeur.nom}',
        'client_nom': _nomCtrl.text, 'client_tel': _telCtrl.text,
        'type_service': _typeService, 'depart': _departCtrl.text, 'destination': _destCtrl.text,
        'date': _date!.toIso8601String().substring(0, 10),
      });
    } catch (_) {}
    setState(() { _loading = false; _done = true; });
  }

  @override
  void initState() {
    super.initState();
    _nomCtrl.addListener(() => setState(() {}));
    _telCtrl.addListener(() => setState(() {}));
  }

  @override
  void dispose() { _nomCtrl.dispose(); _telCtrl.dispose(); _departCtrl.dispose(); _destCtrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final ins = MediaQuery.of(context).viewInsets;
    return Container(
      margin: EdgeInsets.only(bottom: ins.bottom),
      decoration: const BoxDecoration(color: Color(0xFF111111), borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: _done ? _SuccessContent(
            title: 'Demande envoyée !',
            subtitle: "Nous confirmerons votre mission avec ${widget.chauffeur.prenom} dans les 24h.",
            onClose: () => Navigator.pop(context),
          ) : Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _SheetHandle(),
            Row(children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.network(widget.chauffeur.photo, width: 50, height: 50, fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(width: 50, height: 50, color: const Color(0xFF1F2937))),
              ),
              const SizedBox(width: 12),
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('${widget.chauffeur.prenom} ${widget.chauffeur.nom}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                Text('📍 ${widget.chauffeur.ville} · ⭐ ${widget.chauffeur.note}', style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
              ]),
            ]),
            const SizedBox(height: 20),
            _FormField(controller: _nomCtrl, label: 'Votre nom *', hint: 'Jean Dupont', icon: Icons.person_outline_rounded),
            const SizedBox(height: 12),
            _FormField(controller: _telCtrl, label: 'Téléphone *', hint: '+237 6XX XXX XXX', icon: Icons.phone_outlined, keyboard: TextInputType.phone),
            const SizedBox(height: 12),
            // Type service
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('Type de service *', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                value: _typeService,
                dropdownColor: const Color(0xFF1A1A1A),
                decoration: InputDecoration(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF2A2A2A))),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF2A2A2A))),
                  filled: true, fillColor: AppColors.darkCard,
                ),
                style: const TextStyle(color: Colors.white, fontSize: 13),
                items: _kTypesService.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                onChanged: (val) { if (val != null) setState(() => _typeService = val); },
              ),
            ]),
            const SizedBox(height: 12),
            _FormField(controller: _departCtrl, label: 'Lieu de départ', hint: 'Hôtel Hilton Yaoundé', icon: Icons.location_on_outlined),
            const SizedBox(height: 12),
            _FormField(controller: _destCtrl, label: 'Destination', hint: 'Aéroport Nsimalen', icon: Icons.flag_outlined),
            const SizedBox(height: 12),
            // Date
            GestureDetector(
              onTap: _pickDate,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(10), border: Border.all(color: const Color(0xFF2A2A2A))),
                child: Row(children: [
                  const Icon(Icons.calendar_today_outlined, size: 16, color: AppColors.goldPrimary),
                  const SizedBox(width: 10),
                  Text(_date == null ? 'Sélectionner une date *' : 'Date : ${_date!.day.toString().padLeft(2,'0')}/${_date!.month.toString().padLeft(2,'0')}/${_date!.year}',
                    style: TextStyle(color: _date == null ? AppColors.textMuted : Colors.white, fontSize: 13)),
                ]),
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(width: double.infinity, child: ElevatedButton.icon(
              onPressed: (_nomCtrl.text.isNotEmpty && _telCtrl.text.isNotEmpty && _date != null && !_loading) ? _submit : null,
              icon: _loading ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black))
                : const Icon(Icons.send_rounded, size: 16),
              label: Text(_loading ? 'Envoi…' : 'Réserver ce chauffeur'),
              style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
            )),
            const SizedBox(height: 8),
            SizedBox(width: double.infinity, child: OutlinedButton.icon(
              onPressed: _callLuxe,
              style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 12), side: BorderSide(color: Colors.green.withOpacity(0.4)), foregroundColor: Colors.green),
              icon: const Icon(Icons.phone_rounded, size: 15),
              label: Text('Appeler Luxe Drive — $_kTelDisplay'),
            )),
            const SizedBox(height: 8),
            SizedBox(width: double.infinity, child: TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Annuler', style: TextStyle(color: AppColors.textMuted)),
            )),
          ]),
        ),
      ),
    );
  }
}

// ── Vente contact sheet ────────────────────────────────────────────────────────

class _VenteContactSheet extends StatefulWidget {
  final _Vente vente;
  const _VenteContactSheet({required this.vente});
  @override
  State<_VenteContactSheet> createState() => _VenteContactSheetState();
}

class _VenteContactSheetState extends State<_VenteContactSheet> {
  final _nomCtrl = TextEditingController();
  final _telCtrl = TextEditingController();
  final _msgCtrl = TextEditingController();
  bool _loading = false, _done = false;

  Future<void> _submit() async {
    if (_nomCtrl.text.isEmpty || _telCtrl.text.isEmpty) return;
    setState(() => _loading = true);
    try {
      await ApiService().post('/api/reservations', data: {
        'type': 'achat', 'vehicule_nom': '${widget.vente.marque} ${widget.vente.nom}',
        'client_nom': _nomCtrl.text, 'client_tel': _telCtrl.text, 'message': _msgCtrl.text,
      });
    } catch (_) {}
    setState(() { _loading = false; _done = true; });
  }

  @override
  void initState() {
    super.initState();
    _nomCtrl.addListener(() => setState(() {}));
    _telCtrl.addListener(() => setState(() {}));
  }

  @override
  void dispose() { _nomCtrl.dispose(); _telCtrl.dispose(); _msgCtrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final ins = MediaQuery.of(context).viewInsets;
    return Container(
      margin: EdgeInsets.only(bottom: ins.bottom),
      decoration: const BoxDecoration(color: Color(0xFF111111), borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: _done ? _SuccessContent(
            title: 'Message envoyé !',
            subtitle: "L'équipe Luxe Drive vous contactera sous 24h au ${_telCtrl.text} pour le ${widget.vente.marque} ${widget.vente.nom}.",
            onClose: () => Navigator.pop(context),
          ) : Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            _SheetHandle(),
            Text('${widget.vente.marque} ${widget.vente.nom}', style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            Text('${_fmt(widget.vente.prixVente)} FCFA · ${widget.vente.etat}', style: const TextStyle(color: AppColors.goldPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
            const SizedBox(height: 20),
            _FormField(controller: _nomCtrl, label: 'Votre nom *', hint: 'Jean Dupont', icon: Icons.person_outline_rounded),
            const SizedBox(height: 12),
            _FormField(controller: _telCtrl, label: 'Téléphone *', hint: '+237 6XX XXX XXX', icon: Icons.phone_outlined, keyboard: TextInputType.phone),
            const SizedBox(height: 12),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('Message (optionnel)', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
              const SizedBox(height: 6),
              TextField(
                controller: _msgCtrl, maxLines: 3,
                style: const TextStyle(color: Colors.white, fontSize: 13),
                decoration: InputDecoration(
                  hintText: 'Votre question ou offre…',
                  contentPadding: const EdgeInsets.all(12),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF2A2A2A))),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF2A2A2A))),
                  filled: true, fillColor: AppColors.darkCard,
                ),
              ),
            ]),
            const SizedBox(height: 24),
            SizedBox(width: double.infinity, child: ElevatedButton.icon(
              onPressed: (_nomCtrl.text.isNotEmpty && _telCtrl.text.isNotEmpty && !_loading) ? _submit : null,
              icon: _loading ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black))
                : const Icon(Icons.send_rounded, size: 16),
              label: Text(_loading ? 'Envoi…' : 'Envoyer ma demande'),
              style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
            )),
            const SizedBox(height: 8),
            SizedBox(width: double.infinity, child: TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Annuler', style: TextStyle(color: AppColors.textMuted)),
            )),
          ]),
        ),
      ),
    );
  }
}

// ── Shared widgets ─────────────────────────────────────────────────────────────

class _SheetHandle extends StatelessWidget {
  @override
  Widget build(BuildContext context) => Column(children: [
    Center(child: Container(width: 40, height: 4, margin: const EdgeInsets.only(bottom: 20), decoration: BoxDecoration(color: const Color(0xFF374151), borderRadius: BorderRadius.circular(2)))),
  ]);
}

class _FormField extends StatelessWidget {
  final TextEditingController controller;
  final String label, hint;
  final IconData icon;
  final TextInputType keyboard;
  const _FormField({required this.controller, required this.label, required this.hint, required this.icon, this.keyboard = TextInputType.text});
  @override
  Widget build(BuildContext context) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
    const SizedBox(height: 6),
    TextField(
      controller: controller, keyboardType: keyboard,
      style: const TextStyle(color: Colors.white, fontSize: 13),
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: Icon(icon, size: 17, color: AppColors.goldPrimary),
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF2A2A2A))),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Color(0xFF2A2A2A))),
        filled: true, fillColor: AppColors.darkCard,
      ),
    ),
  ]);
}

class _DateButton extends StatelessWidget {
  final String label, value;
  final VoidCallback onTap;
  const _DateButton({required this.label, required this.value, required this.onTap});
  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
      decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(10), border: Border.all(color: const Color(0xFF2A2A2A))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
        const SizedBox(height: 4),
        Row(children: [
          const Icon(Icons.calendar_today_outlined, size: 13, color: AppColors.goldPrimary),
          const SizedBox(width: 6),
          Text(value, style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w500)),
        ]),
      ]),
    ),
  );
}

class _SuccessContent extends StatelessWidget {
  final String title, subtitle;
  final VoidCallback onClose;
  const _SuccessContent({required this.title, required this.subtitle, required this.onClose});
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 32),
    child: Column(mainAxisSize: MainAxisSize.min, children: [
      Container(width: 64, height: 64, decoration: BoxDecoration(color: Colors.green.withOpacity(0.15), shape: BoxShape.circle),
        child: const Icon(Icons.check_circle_outline_rounded, size: 36, color: Colors.green)),
      const SizedBox(height: 16),
      Text(title, style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
      const SizedBox(height: 8),
      Text(subtitle, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13), textAlign: TextAlign.center),
      const SizedBox(height: 24),
      SizedBox(width: double.infinity, child: ElevatedButton(
        onPressed: onClose,
        child: const Text('Fermer'),
        style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
      )),
    ]),
  );
}

// ── Vente tab ─────────────────────────────────────────────────────────────────

class _VenteTab extends StatelessWidget {
  final String search;
  const _VenteTab({required this.search});

  @override
  Widget build(BuildContext context) {
    final list = _venteVehicles.where((v) {
      final q = search;
      return q.isEmpty || v.nom.toLowerCase().contains(q) || v.marque.toLowerCase().contains(q);
    }).toList();

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
      itemCount: list.length + 1,
      itemBuilder: (ctx, i) {
        if (i == list.length) return Container(
          margin: const EdgeInsets.only(top: 8),
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: AppColors.goldPrimary.withOpacity(0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.goldPrimary.withOpacity(0.2)),
          ),
          child: Column(children: [
            const Text('Vendre votre véhicule ?', style: TextStyle(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            const Text('Inscrivez-le sur Luxe Drive et touchez une clientèle premium', style: TextStyle(color: AppColors.textSecondary, fontSize: 12), textAlign: TextAlign.center),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: () => context.push('/inscription-vehicule'),
              style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 40)),
              child: const Text('Inscrire mon véhicule'),
            ),
          ]),
        );
        return _VenteCard(v: list[i]);
      },
    );
  }
}

class _VenteCard extends StatelessWidget {
  final _Vente v;
  const _VenteCard({required this.v});

  @override
  Widget build(BuildContext context) => Opacity(
    opacity: v.vendu ? 0.55 : 1.0,
    child: Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.darkBorder)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Stack(children: [
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            child: Image.network(v.image, height: 150, width: double.infinity, fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(height: 150, color: const Color(0xFF1F2937))),
          ),
          if (v.vendu) Positioned.fill(child: Container(
            decoration: BoxDecoration(color: Colors.black.withOpacity(0.5), borderRadius: const BorderRadius.vertical(top: Radius.circular(16))),
            child: const Center(child: Text('VENDU', style: TextStyle(color: Color(0xFFEF4444), fontWeight: FontWeight.bold, fontSize: 18, letterSpacing: 2))),
          )) else Positioned(top: 10, right: 10, child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(color: const Color(0xFF34D399).withOpacity(0.15), borderRadius: BorderRadius.circular(20), border: Border.all(color: const Color(0xFF34D399).withOpacity(0.3))),
            child: const Text('Disponible', style: TextStyle(color: Color(0xFF34D399), fontSize: 10, fontWeight: FontWeight.bold)),
          )),
        ]),
        Padding(
          padding: const EdgeInsets.all(14),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(v.marque, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
            Text(v.nom, style: const TextStyle(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Row(children: [
              _Pill(Icons.speed_rounded, '${_fmt(v.kilometrage)} km'),
              const SizedBox(width: 8),
              _Pill(Icons.calendar_today_rounded, '${v.annee}'),
              const SizedBox(width: 8),
              _Pill(Icons.verified_outlined, v.etat),
            ]),
            const SizedBox(height: 10),
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('${_fmt(v.prixVente)} FCFA', style: const TextStyle(color: AppColors.goldPrimary, fontSize: 16, fontWeight: FontWeight.bold)),
                Text('Garantie : ${v.garantie}', style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
              ]),
              if (!v.vendu) ElevatedButton(
                onPressed: () => _showVenteContactSheet(context, v),
                style: ElevatedButton.styleFrom(minimumSize: const Size(90, 34), padding: const EdgeInsets.symmetric(horizontal: 12)),
                child: const Text('Contacter', style: TextStyle(fontSize: 12)),
              ),
            ]),
          ]),
        ),
      ]),
    ),
  );
}
