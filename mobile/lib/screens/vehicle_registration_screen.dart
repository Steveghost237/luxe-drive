import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../utils/constants.dart';

class VehicleRegistrationScreen extends StatefulWidget {
  const VehicleRegistrationScreen({super.key});
  @override
  State<VehicleRegistrationScreen> createState() => _VehicleRegistrationScreenState();
}

class _VehicleRegistrationScreenState extends State<VehicleRegistrationScreen> {
  int _step = 0;
  bool _submitted = false;

  // Step 0
  String _marque = '', _couleur = '', _carburant = '', _transmission = '', _places = '5';
  final _modeleCtrl = TextEditingController();
  final _anneeCtrl  = TextEditingController();
  final _plaqueCtrl = TextEditingController();
  final _vinCtrl    = TextEditingController();
  final _kmCtrl     = TextEditingController();
  List<String> _options = [];

  // Step 1 — Photos (mocked)
  final List<String> _photos = [];

  // Step 2 — Services & prix
  List<String> _services = [];
  final _prixJourCtrl    = TextEditingController();
  final _cautionCtrl     = TextEditingController();
  final _prixVenteCtrl   = TextEditingController();

  // Step 3 — Documents
  final Map<String, String> _docs = {};

  // Step 4 — Validation
  final _propNomCtrl = TextEditingController();
  final _propTelCtrl = TextEditingController();
  final _propEmailCtrl = TextEditingController();
  bool _cond1 = false, _cond2 = false;
  bool _ownerPrefilled = false;

  static const _marques = ['Mercedes-Benz','BMW','Audi','Rolls-Royce','Bentley','Porsche','Lamborghini','Ferrari','Land Rover','Lexus','Maserati','Maybach'];
  static const _carburants = ['Essence','Diesel','Hybride','Hybride rechargeable','Électrique'];
  static const _transmissions = ['Automatique','Manuelle','Semi-automatique'];
  static const _couleurs = ['Noir','Blanc','Argent','Gris','Bleu','Rouge','Bordeaux','Or','Autre'];
  static const _optionsList = ['GPS','Toit panoramique','Massage sièges','Mini-bar','Wifi','HUD','Sono premium','Caméra 360°','Sièges chauffants'];

  bool get _canNext {
    switch (_step) {
      case 0: return _marque.isNotEmpty && _modeleCtrl.text.isNotEmpty && _anneeCtrl.text.isNotEmpty
          && _plaqueCtrl.text.isNotEmpty && _carburant.isNotEmpty && _transmission.isNotEmpty;
      case 1: return _photos.length >= 4;
      case 2: return _services.isNotEmpty && (_services.contains('location') ? _prixJourCtrl.text.isNotEmpty : true) && (_services.contains('vente') ? _prixVenteCtrl.text.isNotEmpty : true);
      case 3: return _docs.containsKey('carteGrise') && _docs.containsKey('assurance');
      case 4: return (_ownerPrefilled || (_propNomCtrl.text.isNotEmpty && _propTelCtrl.text.isNotEmpty)) && _cond1 && _cond2;
      default: return false;
    }
  }

  @override
  void dispose() {
    for (final c in [_modeleCtrl,_anneeCtrl,_plaqueCtrl,_vinCtrl,_kmCtrl,_prixJourCtrl,_cautionCtrl,_prixVenteCtrl,_propNomCtrl,_propTelCtrl,_propEmailCtrl]) { c.dispose(); }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_submitted) return _SuccessScreen(ref: 'VEH-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}');

    const titles = ['Véhicule','Photos','Tarifs','Documents','Validation'];
    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: AppBar(
        backgroundColor: AppColors.darkSurface,
        title: Text(titles[_step]),
        leading: _step > 0
            ? IconButton(icon: const Icon(Icons.arrow_back_ios_rounded), onPressed: () => setState(() => _step--))
            : IconButton(icon: const Icon(Icons.close), onPressed: () => context.pop()),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(3),
          child: LinearProgressIndicator(value: (_step + 1) / 5, backgroundColor: AppColors.darkCard, color: AppColors.goldPrimary, minHeight: 3),
        ),
      ),
      body: SafeArea(child: Column(children: [
        // Step dots
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
          child: Row(children: titles.asMap().entries.map((e) {
            final done = _step > e.key; final active = _step == e.key;
            return Expanded(child: Container(
              margin: const EdgeInsets.only(right: 4),
              height: 4,
              decoration: BoxDecoration(
                color: done ? const Color(0xFF34D399) : active ? AppColors.goldPrimary : AppColors.darkCard,
                borderRadius: BorderRadius.circular(2),
              ),
            ));
          }).toList()),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(children: titles.asMap().entries.map((e) {
            final active = _step == e.key;
            return Expanded(child: Text(e.value, textAlign: TextAlign.center,
              style: TextStyle(fontSize: 9, color: active ? AppColors.goldPrimary : AppColors.textMuted, fontWeight: active ? FontWeight.w600 : FontWeight.normal)));
          }).toList()),
        ),
        const SizedBox(height: 8),
        Expanded(child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 4, 16, 100),
          child: [_step0(), _step1(), _step2(), _step3(), _step4()][_step],
        )),
      ])),
      bottomNavigationBar: Padding(
        padding: EdgeInsets.fromLTRB(16, 8, 16, MediaQuery.of(context).padding.bottom + 12),
        child: ElevatedButton(
          onPressed: _canNext ? () { if (_step < 4) setState(() => _step++); else setState(() => _submitted = true); } : null,
          style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
          child: Text(_step < 4 ? 'Suivant →' : '✓  Soumettre le véhicule', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
        ),
      ),
    );
  }

  // ── Steps ─────────────────────────────────────────────────────────────────

  Widget _step0() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    _h('Informations du véhicule'),
    _drop('Marque *', _marques, _marque, (v) => setState(() => _marque = v!)),
    _field('Modèle / Version *', _modeleCtrl, hint: 'Classe S 580 AMG Line'),
    _row([_field('Année *', _anneeCtrl, hint: '2024', kb: TextInputType.number), _field('Places *', TextEditingController(text: _places), hint: '5', kb: TextInputType.number)]),
    _field('Plaque immatriculation *', _plaqueCtrl, hint: 'LT-1234-YA'),
    _drop('Carburant *', _carburants, _carburant, (v) => setState(() => _carburant = v!)),
    _drop('Transmission *', _transmissions, _transmission, (v) => setState(() => _transmission = v!)),
    _drop('Couleur *', _couleurs, _couleur, (v) => setState(() => _couleur = v!)),
    _field('Kilométrage', _kmCtrl, hint: '24 800', kb: TextInputType.number),
    _field('VIN / Châssis', _vinCtrl, hint: 'WDB2210561A123456'),
    _label('Options & équipements'),
    _chips(_optionsList, _options, AppColors.goldPrimary),
  ]);

  Widget _step1() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    _h('Photos du véhicule'),
    const Text('Minimum 4 photos requises (appuyez sur chaque angle)', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
    const SizedBox(height: 14),
    Wrap(spacing: 10, runSpacing: 10, children: [
      'Extérieur avant','Extérieur arrière','Profil droit','Intérieur avant','Intérieur arrière','Tableau de bord','Coffre','Moteur',
    ].map((pos) {
      final has = _photos.contains(pos);
      return GestureDetector(
        onTap: () => setState(() => has ? _photos.remove(pos) : _photos.add(pos)),
        child: Container(
          width: (MediaQuery.of(context).size.width - 52) / 2,
          height: 80,
          decoration: BoxDecoration(
            color: has ? const Color(0xFF34D399).withOpacity(0.08) : AppColors.darkCard,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(style: BorderStyle.solid, color: has ? const Color(0xFF34D399).withOpacity(0.35) : AppColors.darkBorder),
          ),
          child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
            Icon(has ? Icons.check_circle_rounded : Icons.add_a_photo_rounded,
              size: 22, color: has ? const Color(0xFF34D399) : AppColors.textMuted),
            const SizedBox(height: 4),
            Text(pos, style: TextStyle(fontSize: 9, color: has ? const Color(0xFF34D399) : AppColors.textMuted), textAlign: TextAlign.center),
          ]),
        ),
      );
    }).toList()),
    const SizedBox(height: 16),
    Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: _photos.length >= 4 ? const Color(0xFF34D399).withOpacity(0.06) : const Color(0xFFF59E0B).withOpacity(0.06),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: _photos.length >= 4 ? const Color(0xFF34D399).withOpacity(0.2) : const Color(0xFFF59E0B).withOpacity(0.2)),
      ),
      child: Row(children: [
        Icon(_photos.length >= 4 ? Icons.check_circle_outline : Icons.warning_amber_rounded,
          size: 16, color: _photos.length >= 4 ? const Color(0xFF34D399) : const Color(0xFFF59E0B)),
        const SizedBox(width: 8),
        Text('${_photos.length}/4 photos requises', style: TextStyle(
          color: _photos.length >= 4 ? const Color(0xFF34D399) : const Color(0xFFF59E0B), fontSize: 12, fontWeight: FontWeight.w500)),
      ]),
    ),
  ]);

  Widget _step2() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    _h('Services & tarification'),
    _label('Services proposés *'),
    ...[
      ('location','🚗 Location journalière / hebdomadaire'),
      ('chauffeur','👔 Location avec chauffeur Luxe Drive'),
      ('vente','🏷️ Mise en vente directe'),
    ].map((s) {
      final sel = _services.contains(s.$1);
      return GestureDetector(
        onTap: () => setState(() => sel ? _services.remove(s.$1) : _services.add(s.$1)),
        child: Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: sel ? AppColors.goldPrimary.withOpacity(0.08) : AppColors.darkCard,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: sel ? AppColors.goldPrimary.withOpacity(0.3) : AppColors.darkBorder),
          ),
          child: Row(children: [
            Checkbox(value: sel, onChanged: (_) {}, activeColor: AppColors.goldPrimary, materialTapTargetSize: MaterialTapTargetSize.shrinkWrap),
            const SizedBox(width: 6),
            Text(s.$2, style: TextStyle(color: sel ? AppColors.goldPrimary : AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w500)),
          ]),
        ),
      );
    }),
    if (_services.contains('location') || _services.contains('chauffeur')) ...[
      const Divider(color: AppColors.darkBorder, height: 24),
      _label('Tarifs location (FCFA)'),
      _row([_field('Prix/jour *', _prixJourCtrl, hint: '250 000', kb: TextInputType.number), _field('Caution *', _cautionCtrl, hint: '1 500 000', kb: TextInputType.number)]),
    ],
    if (_services.contains('vente')) ...[
      const Divider(color: AppColors.darkBorder, height: 24),
      _label('Prix de vente (FCFA)'),
      _field('Prix TTC *', _prixVenteCtrl, hint: '85 000 000', kb: TextInputType.number),
    ],
  ]);

  Widget _step3() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    _h('Documents légaux'),
    const Text('Nécessaires pour la validation par notre équipe', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
    const SizedBox(height: 14),
    ...[
      ('carteGrise', '📋 Carte grise', true),
      ('assurance', '🛡️ Attestation assurance', true),
      ('controleTech', '🔧 Contrôle technique', false),
      ('facture', '🧾 Facture d\'achat', false),
    ].map((d) => GestureDetector(
      onTap: () => setState(() => _docs[d.$1] = '${d.$1}.pdf'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: _docs.containsKey(d.$1) ? const Color(0xFF34D399).withOpacity(0.06) : AppColors.darkCard,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: _docs.containsKey(d.$1) ? const Color(0xFF34D399).withOpacity(0.3) : AppColors.darkBorder),
        ),
        child: Row(children: [
          Icon(_docs.containsKey(d.$1) ? Icons.check_circle_rounded : Icons.upload_file_rounded,
            size: 20, color: _docs.containsKey(d.$1) ? const Color(0xFF34D399) : AppColors.textMuted),
          const SizedBox(width: 10),
          Expanded(child: Text('${d.$2}${d.$3 ? ' *' : ''}', style: TextStyle(color: _docs.containsKey(d.$1) ? const Color(0xFF34D399) : AppColors.textPrimary, fontSize: 13))),
          Text(_docs.containsKey(d.$1) ? 'Chargé' : 'Appuyer', style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
        ]),
      ),
    )),
  ]);

  Widget _step4() {
    final auth = context.read<AuthProvider>();
    final user = auth.user;
    if (user != null && !_ownerPrefilled) {
      _propNomCtrl.text  = '${user.prenom ?? ''} ${user.nom ?? ''}'.trim();
      _propTelCtrl.text  = user.telephone ?? '';
      _propEmailCtrl.text = user.email ?? '';
      _ownerPrefilled = true;
    }
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    _h('Informations propriétaire'),
    if (user != null) ..._buildOwnerBadge(user)
    else ...[
      _field('Nom complet *', _propNomCtrl, hint: 'Jean-Pierre Nkomo'),
      _field('Téléphone *', _propTelCtrl, hint: '+237 6XX XXX XXX'),
      _field('Email *', _propEmailCtrl, hint: 'prop@email.com'),
    ],
    const Divider(color: AppColors.darkBorder, height: 24),
    _label('Récapitulatif'),
    Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: AppColors.goldPrimary.withOpacity(0.06), borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.goldPrimary.withOpacity(0.2))),
      child: Column(children: [
        ...[
          ('Véhicule', '$_marque ${_modeleCtrl.text}'),
          ('Plaque', _plaqueCtrl.text),
          ('Services', _services.join(', ')),
          ('Photos', '${_photos.length} chargées'),
          ('Documents', '${_docs.length}/2 requis'),
        ].map((e) => Padding(
          padding: const EdgeInsets.only(bottom: 5),
          child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Text(e.$1, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
            Text(e.$2.isNotEmpty ? e.$2 : '—', style: const TextStyle(color: AppColors.textPrimary, fontSize: 11, fontWeight: FontWeight.w600)),
          ]),
        )),
      ]),
    ),
    const SizedBox(height: 16),
    _checkTile("J'accepte les CGU Luxe Drive et la charte propriétaire", _cond1, (v) => setState(() => _cond1 = v!)),
    const SizedBox(height: 8),
    _checkTile("J'accepte qu'un agent Luxe Drive inspecte physiquement le véhicule avant mise en ligne", _cond2, (v) => setState(() => _cond2 = v!)),
  ]);
  }

  List<Widget> _buildOwnerBadge(dynamic user) => [
    Container(
      padding: const EdgeInsets.all(14),
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: AppColors.goldPrimary.withOpacity(0.07),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.goldPrimary.withOpacity(0.3)),
      ),
      child: Row(children: [
        Container(
          width: 44, height: 44,
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [Color(0xFFD4A017), Color(0xFF92400E)]),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Center(child: Text(
            ((user.prenom ?? 'P') as String)[0].toUpperCase(),
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 20),
          )),
        ),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text('${user.prenom ?? ''} ${user.nom ?? ''}'.trim(),
            style: const TextStyle(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold)),
          if ((user.telephone ?? '').isNotEmpty)
            Text(user.telephone, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
          if ((user.email ?? '').isNotEmpty)
            Text(user.email, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
        ])),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(color: AppColors.goldPrimary.withOpacity(0.1), borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.goldPrimary.withOpacity(0.3))),
          child: const Text('Connecté', style: TextStyle(color: AppColors.goldPrimary, fontSize: 10, fontWeight: FontWeight.w600)),
        ),
      ]),
    ),
  ];

  // ── Helpers ───────────────────────────────────────────────────────────────

  Widget _h(String t) => Padding(padding: const EdgeInsets.only(bottom: 14), child: Text(t, style: const TextStyle(color: AppColors.textPrimary, fontSize: 17, fontWeight: FontWeight.bold)));
  Widget _label(String t) => Padding(padding: const EdgeInsets.only(bottom: 6, top: 8), child: Text(t, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)));

  Widget _field(String label, TextEditingController ctrl, {String? hint, TextInputType? kb}) => Padding(
    padding: const EdgeInsets.only(bottom: 10),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
      const SizedBox(height: 4),
      TextField(controller: ctrl, keyboardType: kb, onChanged: (_) => setState(() {}),
        style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
        decoration: InputDecoration(hintText: hint, contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12))),
    ]),
  );

  Widget _row(List<Widget> children) => Row(children: children.map((c) => Expanded(child: Padding(padding: const EdgeInsets.only(right: 6), child: c))).toList());

  Widget _drop(String label, List<String> items, String val, ValueChanged<String?> cb) => Padding(
    padding: const EdgeInsets.only(bottom: 10),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
      const SizedBox(height: 4),
      DropdownButtonFormField<String>(
        value: val.isEmpty ? null : val,
        hint: const Text('Sélectionner…', style: TextStyle(color: AppColors.textMuted, fontSize: 13)),
        onChanged: cb, dropdownColor: AppColors.darkSurface,
        decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12)),
        style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
        items: items.map((i) => DropdownMenuItem(value: i, child: Text(i))).toList(),
      ),
    ]),
  );

  Widget _chips(List<String> all, List<String> sel, Color color) => Wrap(
    spacing: 6, runSpacing: 6,
    children: all.map((o) {
      final s = sel.contains(o);
      return GestureDetector(
        onTap: () => setState(() => s ? sel.remove(o) : sel.add(o)),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
          decoration: BoxDecoration(
            color: s ? color.withOpacity(0.1) : AppColors.darkCard,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: s ? color.withOpacity(0.35) : AppColors.darkBorder),
          ),
          child: Text(o, style: TextStyle(fontSize: 10, color: s ? color : AppColors.textMuted, fontWeight: FontWeight.w500)),
        ),
      );
    }).toList(),
  );

  Widget _checkTile(String label, bool val, ValueChanged<bool?> cb) => GestureDetector(
    onTap: () => cb(!val),
    child: Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: val ? AppColors.goldPrimary.withOpacity(0.06) : AppColors.darkCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: val ? AppColors.goldPrimary.withOpacity(0.25) : AppColors.darkBorder),
      ),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Checkbox(value: val, onChanged: cb, activeColor: AppColors.goldPrimary, materialTapTargetSize: MaterialTapTargetSize.shrinkWrap),
        const SizedBox(width: 6),
        Expanded(child: Text(label, style: const TextStyle(color: AppColors.textPrimary, fontSize: 12, height: 1.4))),
      ]),
    ),
  );
}

class _SuccessScreen extends StatelessWidget {
  final String ref;
  const _SuccessScreen({required this.ref});
  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: AppColors.darkBg,
    body: SafeArea(child: Padding(
      padding: const EdgeInsets.all(32),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Container(width: 80, height: 80, decoration: BoxDecoration(color: const Color(0xFF34D399).withOpacity(0.1), shape: BoxShape.circle, border: Border.all(color: const Color(0xFF34D399).withOpacity(0.3))),
          child: const Icon(Icons.check_circle_rounded, color: Color(0xFF34D399), size: 40)),
        const SizedBox(height: 24),
        const Text('Véhicule inscrit !', style: TextStyle(color: AppColors.textPrimary, fontSize: 22, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        const Text('Validation sous 3–5 jours ouvrables après inspection physique.', style: TextStyle(color: AppColors.textSecondary, fontSize: 14), textAlign: TextAlign.center),
        const SizedBox(height: 8),
        Text('Réf : $ref', style: const TextStyle(color: AppColors.goldPrimary, fontSize: 12)),
        const SizedBox(height: 32),
        Consumer<AuthProvider>(builder: (ctx, auth, _) {
              final loggedIn = auth.user != null;
              return Column(children: [
                if (loggedIn)
                  ElevatedButton(
                    onPressed: () => ctx.go('/proprietaire'),
                    style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
                    child: const Text('Voir ma flotte'),
                  )
                else
                  ElevatedButton(
                    onPressed: () => ctx.go('/compte-pro'),
                    style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
                    child: const Text('Créer mon compte Pro'),
                  ),
                const SizedBox(height: 12),
                TextButton(
                  onPressed: () => ctx.go('/catalogue'),
                  child: const Text('Retour au catalogue', style: TextStyle(color: AppColors.textMuted)),
                ),
              ]);
            }),
      ]),
    )),
  );
}
