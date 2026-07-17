import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../utils/constants.dart';

class GaragePartnerScreen extends StatefulWidget {
  const GaragePartnerScreen({super.key});
  @override
  State<GaragePartnerScreen> createState() => _GaragePartnerScreenState();
}

class _GaragePartnerScreenState extends State<GaragePartnerScreen> with SingleTickerProviderStateMixin {
  late TabController _tab;
  @override
  void initState() { super.initState(); _tab = TabController(length: 3, vsync: this); }
  @override
  void dispose() { _tab.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: AppBar(
        backgroundColor: AppColors.darkSurface,
        title: const Text('Partenaires Agréés'),
        bottom: TabBar(
          controller: _tab,
          labelColor: AppColors.goldPrimary,
          unselectedLabelColor: AppColors.textMuted,
          indicatorColor: AppColors.goldPrimary,
          labelStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
          tabs: const [Tab(text: '📋 Normes'), Tab(text: '🔧 Garagiste'), Tab(text: '🚚 Livreur')],
        ),
      ),
      body: TabBarView(
        controller: _tab,
        children: [
          _NormesTab(),
          _CandidatureTab(type: 'garagiste'),
          _CandidatureTab(type: 'livreur'),
        ],
      ),
    );
  }
}

// ── Normes ────────────────────────────────────────────────────────────────────

class _NormesTab extends StatelessWidget {
  const _NormesTab();

  static const _garageNormes = [
    ('🔧 Infrastructure', [
      'Surface minimum : 200 m² couverts avec fosse de visite',
      'Équipement de diagnostic OBD-II multi-marques',
      'Zone dédiée véhicules de luxe (couverte, sécurisée)',
      'Vidéosurveillance 24h/24 dans l\'atelier',
    ]),
    ('👨‍🔧 Personnel', [
      'Mécanicien certifié constructeur (Mercedes, BMW, etc.)',
      'Formation véhicules hybrides/électriques exigée',
      'Formation protocole client Luxe Drive (½ journée)',
      'Maîtrise français ou anglais',
    ]),
    ('📋 Qualité & process', [
      'Rapport d\'intervention détaillé + photos avant/après',
      'Délais : 24h pannes simples, 72h max révisions',
      'Garantie main d\'œuvre minimum 3 mois',
      'Pièces d\'origine ou équivalent OEM uniquement',
    ]),
    ('🛡️ Légal & assurances', [
      'Assurance RC Pro obligatoire',
      'Agrément Ministère des Transports',
      'RCCM et NIU valides',
      'Conformité normes environnementales',
    ]),
  ];

  static const _livreurNormes = [
    ('🚚 Véhicule', [
      'Véhicule propre, excellent état mécanique',
      'GPS tracker obligatoire',
      'Kit de protection véhicule (couvertures, sangles)',
      'Possibilité plateau pour véhicules non-roulants',
    ]),
    ('👤 Livreur', [
      'Permis B minimum, catégorie C recommandée',
      'Casier judiciaire vierge (< 3 mois)',
      '2 ans d\'expérience en livraison de véhicules',
      'Formation Luxe Drive (1 journée, gratuite)',
    ]),
    ('📦 Processus', [
      'Photos horodatées avant prise en charge',
      'Traçabilité GPS temps réel partagée avec le client',
      'Livraison uniquement sur présentation CNI',
      'Rapport de livraison + signature numérique',
    ]),
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Header card
        Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.goldPrimary.withOpacity(0.07),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.goldPrimary.withOpacity(0.2)),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('Charte d\'excellence Luxe Drive', style: TextStyle(color: AppColors.goldPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
            const SizedBox(height: 6),
            const Text('Tous nos partenaires doivent respecter ces normes strictes pour garantir une expérience haut de gamme à notre clientèle d\'élite.', style: TextStyle(color: AppColors.textSecondary, fontSize: 12, height: 1.4)),
            const SizedBox(height: 12),
            Row(children: [
              _Stat('12+', 'Garagistes agréés'),
              const SizedBox(width: 16),
              _Stat('28+', 'Livreurs certifiés'),
              const SizedBox(width: 16),
              _Stat('40+', 'Partenaires'),
            ]),
          ]),
        ),

        // Garagiste normes
        _Section('Normes Garagiste Agréé'),
        ..._garageNormes.map((n) => _NormeCard(cat: n.$1, items: n.$2)),

        const SizedBox(height: 8),

        // Livreur normes
        _Section('Normes Livreur Agréé'),
        ..._livreurNormes.map((n) => _NormeCard(cat: n.$1, items: n.$2)),

        // Audit notice
        Container(
          margin: const EdgeInsets.only(top: 12),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFF60A5FA).withOpacity(0.06),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF60A5FA).withOpacity(0.2)),
          ),
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Icon(Icons.info_outline_rounded, size: 16, color: Color(0xFF60A5FA)),
            const SizedBox(width: 8),
            const Expanded(child: Text('Audit annuel : Chaque partenaire fait l\'objet d\'un audit qualité annuel par un inspecteur Luxe Drive.', style: TextStyle(color: Color(0xFF93C5FD), fontSize: 12, height: 1.4))),
          ]),
        ),
        const SizedBox(height: 80),
      ]),
    );
  }

  Widget _Section(String t) => Padding(padding: const EdgeInsets.only(bottom: 10, top: 6),
    child: Text(t, style: const TextStyle(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold)));
}

class _Stat extends StatelessWidget {
  final String val, label;
  const _Stat(this.val, this.label);
  @override
  Widget build(BuildContext context) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Text(val, style: const TextStyle(color: AppColors.goldPrimary, fontSize: 16, fontWeight: FontWeight.bold)),
    Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
  ]);
}

class _NormeCard extends StatelessWidget {
  final String cat;
  final List<String> items;
  const _NormeCard({required this.cat, required this.items});
  @override
  Widget build(BuildContext context) => Container(
    margin: const EdgeInsets.only(bottom: 10),
    padding: const EdgeInsets.all(13),
    decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.darkBorder)),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(cat, style: const TextStyle(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.bold)),
      const SizedBox(height: 8),
      ...items.map((i) => Padding(
        padding: const EdgeInsets.only(bottom: 5),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Icon(Icons.check_circle_outline_rounded, size: 12, color: Color(0xFF34D399)),
          const SizedBox(width: 6),
          Expanded(child: Text(i, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11, height: 1.35))),
        ]),
      )),
    ]),
  );
}

// ── Candidature form ─────────────────────────────────────────────────────────

class _CandidatureTab extends StatefulWidget {
  final String type;
  const _CandidatureTab({required this.type});
  @override
  State<_CandidatureTab> createState() => _CandidatureTabState();
}

class _CandidatureTabState extends State<_CandidatureTab> {
  bool _submitted = false;
  final _nomCtrl  = TextEditingController();
  final _bizCtrl  = TextEditingController();
  final _telCtrl  = TextEditingController();
  final _emailCtrl= TextEditingController();
  final _villeCtrl= TextEditingController();
  final _descCtrl = TextEditingController();
  final Map<String, String> _docs = {};

  bool get _canSubmit => _nomCtrl.text.isNotEmpty && _telCtrl.text.isNotEmpty && _emailCtrl.text.isNotEmpty && _villeCtrl.text.isNotEmpty;

  final List<String> _garageDocs = ['registreCommerce','assurancePro','agrementTransport','certifTech'];
  final List<String> _livreurDocs= ['permisConduire','casierJudiciaire','assuranceVehicule','photoVehicule'];

  static const _docLabels = {
    'registreCommerce': '📋 Registre de Commerce',
    'assurancePro':     '🛡️ Assurance RC Pro',
    'agrementTransport':'📜 Agrément Transport',
    'certifTech':       '🔧 Certif. technicien',
    'permisConduire':   '🪪 Permis de conduire',
    'casierJudiciaire': '📄 Casier judiciaire B3',
    'assuranceVehicule':'🛡️ Assurance véhicule',
    'photoVehicule':    '📸 Photos du véhicule',
  };

  @override
  void dispose() {
    for (final c in [_nomCtrl,_bizCtrl,_telCtrl,_emailCtrl,_villeCtrl,_descCtrl]) c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_submitted) return _SuccessWidget(
      ref: 'PART-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
    );

    final isGarage = widget.type == 'garagiste';
    final docList  = isGarage ? _garageDocs : _livreurDocs;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Benefits
        Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: AppColors.goldPrimary.withOpacity(0.07), borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.goldPrimary.withOpacity(0.2))),
          child: Column(children: (isGarage ? [
            ('💰','Commission sur révisions','10% sur chaque prestation'),
            ('📋','Contrats prioritaires','120+ véhicules Luxe Drive'),
            ('⭐','Badge officiel','Label visible sur votre devanture'),
          ] : [
            ('📦','15 000–50 000 FCFA/mission','Selon distance et véhicule'),
            ('📱','Missions via l\'app','Gestion mobile simple'),
            ('🛡️','Couverture assurance','Sur chaque mission'),
          ]).map((a) => Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Row(children: [
              Text(a.$1, style: const TextStyle(fontSize: 16)),
              const SizedBox(width: 8),
              Expanded(child: RichText(text: TextSpan(children: [
                TextSpan(text: '${a.$2} ', style: const TextStyle(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.w500)),
                TextSpan(text: a.$3, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
              ]))),
            ]),
          )).toList()),
        ),

        Text('Candidature ${isGarage ? 'Garagiste Agréé' : 'Livreur Agréé'}',
          style: const TextStyle(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 14),

        _fld('Nom complet *', _nomCtrl, 'Jean Mbida'),
        _fld('Nom du ${isGarage ? 'garage' : 'entreprise'} *', _bizCtrl, isGarage ? 'Garage Excel Auto' : 'Transport Express'),
        _fld('Téléphone *', _telCtrl, '+237 6XX XXX XXX'),
        _fld('Email *', _emailCtrl, 'contact@garage.cm'),
        _fld('Ville *', _villeCtrl, 'Yaoundé'),
        _fldArea('Présentez votre ${isGarage ? 'garage & équipements' : 'expérience & véhicule'}', _descCtrl),

        const SizedBox(height: 4),
        const Text('Documents requis', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
        const SizedBox(height: 8),
        ...docList.map((d) => GestureDetector(
          onTap: () => setState(() => _docs[d] = '$d.pdf'),
          child: Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: _docs.containsKey(d) ? const Color(0xFF34D399).withOpacity(0.06) : AppColors.darkCard,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: _docs.containsKey(d) ? const Color(0xFF34D399).withOpacity(0.3) : AppColors.darkBorder),
            ),
            child: Row(children: [
              Icon(_docs.containsKey(d) ? Icons.check_circle_rounded : Icons.upload_file_rounded,
                size: 18, color: _docs.containsKey(d) ? const Color(0xFF34D399) : AppColors.textMuted),
              const SizedBox(width: 8),
              Expanded(child: Text(_docLabels[d] ?? d,
                style: TextStyle(color: _docs.containsKey(d) ? const Color(0xFF34D399) : AppColors.textPrimary, fontSize: 12))),
              Text(_docs.containsKey(d) ? 'Chargé' : 'Appuyer', style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
            ]),
          ),
        )),
        const SizedBox(height: 20),
        ElevatedButton(
          onPressed: _canSubmit ? () => setState(() => _submitted = true) : null,
          style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
          child: const Text('Envoyer ma candidature', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
        ),
        const SizedBox(height: 60),
      ]),
    );
  }

  Widget _fld(String label, TextEditingController ctrl, String hint) => Padding(
    padding: const EdgeInsets.only(bottom: 10),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
      const SizedBox(height: 4),
      TextField(controller: ctrl, onChanged: (_) => setState(() {}),
        style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
        decoration: InputDecoration(hintText: hint, contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12))),
    ]),
  );

  Widget _fldArea(String label, TextEditingController ctrl) => Padding(
    padding: const EdgeInsets.only(bottom: 14),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
      const SizedBox(height: 4),
      TextField(controller: ctrl, maxLines: 3,
        style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
        decoration: const InputDecoration(hintText: 'Description…', contentPadding: EdgeInsets.all(14))),
    ]),
  );
}

class _SuccessWidget extends StatelessWidget {
  final String ref;
  const _SuccessWidget({required this.ref});
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.all(32),
    child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      Container(width: 64, height: 64, decoration: BoxDecoration(color: const Color(0xFF34D399).withOpacity(0.1), shape: BoxShape.circle, border: Border.all(color: const Color(0xFF34D399).withOpacity(0.3))),
        child: const Icon(Icons.check_circle_rounded, color: Color(0xFF34D399), size: 32)),
      const SizedBox(height: 20),
      const Text('Candidature envoyée !', style: TextStyle(color: AppColors.textPrimary, fontSize: 18, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
      const SizedBox(height: 10),
      const Text('Notre équipe partenariats vous contactera sous 48–72h.', style: TextStyle(color: AppColors.textSecondary, fontSize: 13), textAlign: TextAlign.center),
      const SizedBox(height: 8),
      Text('Réf : $ref', style: const TextStyle(color: AppColors.goldPrimary, fontSize: 12)),
    ]),
  );
}
