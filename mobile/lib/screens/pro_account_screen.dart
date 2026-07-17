import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../utils/constants.dart';

class ProAccountScreen extends StatefulWidget {
  const ProAccountScreen({super.key});
  @override
  State<ProAccountScreen> createState() => _ProAccountScreenState();
}

class _ProAccountScreenState extends State<ProAccountScreen> {
  int _step = 0;
  bool _submitted = false;

  // Step 0 — Entreprise
  final _raisonCtrl = TextEditingController();
  final _rccmCtrl   = TextEditingController();
  final _adresseCtrl= TextEditingController();
  final _telCtrl    = TextEditingController();
  final _emailCtrl  = TextEditingController();
  final _siteCtrl   = TextEditingController();
  String _formeJur  = '', _secteur = '', _ville = '', _taille = '';

  // Step 1 — Représentant
  final _repPrenomCtrl  = TextEditingController();
  final _repNomCtrl     = TextEditingController();
  final _repFonctionCtrl= TextEditingController();
  final _repTelCtrl     = TextEditingController();
  final _repEmailCtrl   = TextEditingController();

  // Step 2 — Besoins
  List<String> _services   = [];
  String _nbVehicules       = '', _nbChauffeurs = '';
  final _zoneCtrl           = TextEditingController();

  // Step 3 — Docs
  final Map<String, String> _docs = {};

  // Step 4 — Conditions
  bool _cond1 = false, _cond2 = false;

  static const _formes    = ['SARL','SA','SAS','Association','ONG','Ambassade','Administration','Autre'];
  static const _secteurs  = ['Transport privé','Événementiel','Immobilier','Hôtellerie','Corporate','Ambassade/Org.','Autre'];
  static const _villes    = ['Yaoundé','Douala','Bafoussam','Garoua','Bamenda','Bertoua'];
  static const _tailles   = ['TPE (1–5)','PME (6–50)','ETI (51–250)','Grande (250+)'];
  static const _nbVeh     = ['1–2','3–5','6–10','11–20','21–50','50+'];
  static const _nbChauf   = ['0','1–2','3–5','6–10','10+'];

  bool get _canNext {
    switch (_step) {
      case 0: return _raisonCtrl.text.isNotEmpty && _formeJur.isNotEmpty && _telCtrl.text.isNotEmpty && _emailCtrl.text.isNotEmpty && _secteur.isNotEmpty && _ville.isNotEmpty;
      case 1: return _repPrenomCtrl.text.isNotEmpty && _repNomCtrl.text.isNotEmpty && _repFonctionCtrl.text.isNotEmpty && _repTelCtrl.text.isNotEmpty && _repEmailCtrl.text.isNotEmpty;
      case 2: return _services.isNotEmpty && _nbVehicules.isNotEmpty;
      case 3: return _docs.containsKey('registreCommerce');
      case 4: return _cond1 && _cond2;
      default: return false;
    }
  }

  @override
  void dispose() {
    for (final c in [_raisonCtrl,_rccmCtrl,_adresseCtrl,_telCtrl,_emailCtrl,_siteCtrl,
      _repPrenomCtrl,_repNomCtrl,_repFonctionCtrl,_repTelCtrl,_repEmailCtrl,_zoneCtrl]) { c.dispose(); }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_submitted) return _SuccessScreen(ref: 'PRO-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}', email: _emailCtrl.text);

    const stepLabels = ['Entreprise','Représentant','Besoins','Documents','Conditions'];
    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: AppBar(
        backgroundColor: AppColors.darkSurface,
        title: const Text('Compte Professionnel'),
        leading: _step > 0
            ? IconButton(icon: const Icon(Icons.arrow_back_ios_rounded), onPressed: () => setState(() => _step--))
            : IconButton(icon: const Icon(Icons.close), onPressed: () => context.pop()),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(3),
          child: LinearProgressIndicator(value: (_step + 1) / 5, backgroundColor: AppColors.darkCard, color: AppColors.goldPrimary, minHeight: 3),
        ),
      ),
      body: SafeArea(child: Column(children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
          child: Row(children: stepLabels.asMap().entries.map((e) {
            final done = _step > e.key; final active = _step == e.key;
            return Expanded(child: Container(
              margin: const EdgeInsets.only(right: 4),
              padding: const EdgeInsets.symmetric(vertical: 5),
              decoration: BoxDecoration(
                color: done ? const Color(0xFF34D399).withOpacity(0.1) : active ? AppColors.goldPrimary.withOpacity(0.1) : AppColors.darkCard,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: done ? const Color(0xFF34D399).withOpacity(0.3) : active ? AppColors.goldPrimary.withOpacity(0.3) : AppColors.darkBorder),
              ),
              child: Text(e.value, textAlign: TextAlign.center,
                style: TextStyle(fontSize: 9, fontWeight: FontWeight.w600,
                  color: done ? const Color(0xFF34D399) : active ? AppColors.goldPrimary : AppColors.textMuted)),
            ));
          }).toList()),
        ),
        const SizedBox(height: 10),
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
          child: Text(_step < 4 ? 'Suivant →' : '✓  Créer mon compte Pro', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
        ),
      ),
    );
  }

  Widget _step0() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    _h('Informations de l\'entreprise'),
    _field('Raison sociale *', _raisonCtrl, hint: 'ACME Transport Sarl'),
    _drop('Forme juridique *', _formes, _formeJur, (v) => setState(() => _formeJur = v!)),
    _drop('Ville *', _villes, _ville, (v) => setState(() => _ville = v!)),
    _field('Adresse du siège', _adresseCtrl, hint: 'Quartier Bastos, Yaoundé'),
    _field('Téléphone *', _telCtrl, hint: '+237 222 XXX XXX'),
    _field('Email professionnel *', _emailCtrl, hint: 'contact@entreprise.cm'),
    _field('N° RCCM', _rccmCtrl, hint: 'RC/YAO/2019/B/1234'),
    _drop('Secteur d\'activité *', _secteurs, _secteur, (v) => setState(() => _secteur = v!)),
    _drop('Taille', _tailles, _taille, (v) => setState(() => _taille = v!)),
    _field('Site web', _siteCtrl, hint: 'https://entreprise.cm'),
  ]);

  Widget _step1() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    _h('Représentant légal'),
    const Text('Interlocuteur principal pour la gestion du compte Pro.', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
    const SizedBox(height: 12),
    _row([_field('Prénom *', _repPrenomCtrl), _field('Nom *', _repNomCtrl)]),
    _field('Fonction *', _repFonctionCtrl, hint: 'Directeur Général'),
    _field('Téléphone direct *', _repTelCtrl, hint: '+237 6XX XXX XXX'),
    _field('Email direct *', _repEmailCtrl, hint: 'jean@entreprise.cm'),
  ]);

  Widget _step2() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    _h('Besoins & activités'),
    _label('Services recherchés *'),
    ...[
      ('location_flotte', '🚗 Mise en location de ma flotte'),
      ('gestion_chauf',   '👥 Gestion de chauffeurs'),
      ('reservation_corp','💼 Réservations corporate'),
      ('evenementiel',    '🎪 Transport événementiel'),
      ('mise_dispo',      '📅 Mise à disposition longue durée'),
    ].map((s) {
      final sel = _services.contains(s.$1);
      return GestureDetector(
        onTap: () => setState(() => sel ? _services.remove(s.$1) : _services.add(s.$1)),
        child: Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(13),
          decoration: BoxDecoration(
            color: sel ? AppColors.goldPrimary.withOpacity(0.08) : AppColors.darkCard,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: sel ? AppColors.goldPrimary.withOpacity(0.3) : AppColors.darkBorder),
          ),
          child: Row(children: [
            Checkbox(value: sel, onChanged: (_){}, activeColor: AppColors.goldPrimary, materialTapTargetSize: MaterialTapTargetSize.shrinkWrap),
            const SizedBox(width: 6),
            Text(s.$2, style: TextStyle(color: sel ? AppColors.goldPrimary : AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w500)),
          ]),
        ),
      );
    }),
    _drop('Nb véhicules estimé *', _nbVeh, _nbVehicules, (v) => setState(() => _nbVehicules = v!)),
    _drop('Nb chauffeurs estimé', _nbChauf, _nbChauffeurs, (v) => setState(() => _nbChauffeurs = v!)),
    _field('Zones d\'activité', _zoneCtrl, hint: 'Yaoundé, Douala, Bafoussam…'),
  ]);

  Widget _step3() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    _h('Documents entreprise'),
    const Text('Pour la validation KYB (Know Your Business).', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
    const SizedBox(height: 12),
    ...[
      ('registreCommerce',  '📋 Registre de Commerce (RCCM)', true),
      ('carteContribuable', '💳 Carte de contribuable (NIU)', false),
      ('statuts',           '📄 Statuts de la société', false),
      ('cniRep',            '🪪 CNI du représentant légal', false),
    ].map((d) => GestureDetector(
      onTap: () => setState(() => _docs[d.$1] = '${d.$1}.pdf'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(13),
        decoration: BoxDecoration(
          color: _docs.containsKey(d.$1) ? const Color(0xFF34D399).withOpacity(0.06) : AppColors.darkCard,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: _docs.containsKey(d.$1) ? const Color(0xFF34D399).withOpacity(0.3) : AppColors.darkBorder),
        ),
        child: Row(children: [
          Icon(_docs.containsKey(d.$1) ? Icons.check_circle_rounded : Icons.upload_file_rounded, size: 20,
            color: _docs.containsKey(d.$1) ? const Color(0xFF34D399) : AppColors.textMuted),
          const SizedBox(width: 10),
          Expanded(child: Text('${d.$2}${d.$3 ? ' *' : ''}',
            style: TextStyle(color: _docs.containsKey(d.$1) ? const Color(0xFF34D399) : AppColors.textPrimary, fontSize: 12))),
          Text(_docs.containsKey(d.$1) ? 'Chargé' : 'Appuyer', style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
        ]),
      ),
    )),
  ]);

  Widget _step4() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    _h('Conditions Luxe Drive Pro'),
    // Avantages
    Container(
      padding: const EdgeInsets.all(14),
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(color: AppColors.goldPrimary.withOpacity(0.06), borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.goldPrimary.withOpacity(0.2))),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Text('Votre offre Luxe Drive Pro', style: TextStyle(color: AppColors.goldPrimary, fontSize: 12, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        ...[
          ('🚗', 'Flotte multi-véhicules', 'Jusqu\'à 50 véhicules'),
          ('👥', 'Gestion chauffeurs', 'Planning, évaluations'),
          ('📊', 'Reporting avancé', 'Temps réel'),
          ('💳', 'Facturation pro', 'PDF, TVA, comptabilité'),
          ('📞', 'Account manager', 'Dédié Luxe Drive'),
        ].map((a) => Padding(
          padding: const EdgeInsets.only(bottom: 6),
          child: Row(children: [
            Text(a.$1, style: const TextStyle(fontSize: 14)),
            const SizedBox(width: 8),
            Expanded(child: RichText(text: TextSpan(children: [
              TextSpan(text: '${a.$2} ', style: const TextStyle(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.w500)),
              TextSpan(text: a.$3, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
            ]))),
          ]),
        )),
      ]),
    ),
    // Checks
    _checkTile("J'accepte les CGU Luxe Drive Pro et la Charte des Partenaires", _cond1, (v) => setState(() => _cond1 = v!)),
    const SizedBox(height: 8),
    _checkTile("Je certifie que les informations fournies sont exactes et complètes", _cond2, (v) => setState(() => _cond2 = v!)),
  ]);

  Widget _h(String t) => Padding(padding: const EdgeInsets.only(bottom: 14), child: Text(t, style: const TextStyle(color: AppColors.textPrimary, fontSize: 17, fontWeight: FontWeight.bold)));
  Widget _label(String t) => Padding(padding: const EdgeInsets.only(bottom: 6, top: 8), child: Text(t, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)));

  Widget _field(String label, TextEditingController ctrl, {String? hint}) => Padding(
    padding: const EdgeInsets.only(bottom: 10),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
      const SizedBox(height: 4),
      TextField(controller: ctrl, onChanged: (_) => setState(() {}),
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
  final String ref, email;
  const _SuccessScreen({required this.ref, required this.email});
  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: AppColors.darkBg,
    body: SafeArea(child: Padding(
      padding: const EdgeInsets.all(32),
      child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
        Container(width: 80, height: 80, decoration: BoxDecoration(color: const Color(0xFF34D399).withOpacity(0.1), shape: BoxShape.circle, border: Border.all(color: const Color(0xFF34D399).withOpacity(0.3))),
          child: const Icon(Icons.business_rounded, color: Color(0xFF34D399), size: 40)),
        const SizedBox(height: 24),
        const Text('Compte Pro créé !', style: TextStyle(color: AppColors.textPrimary, fontSize: 22, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        const Text('Notre équipe vous contactera sous 24–48h pour finaliser l\'activation.', style: TextStyle(color: AppColors.textSecondary, fontSize: 14), textAlign: TextAlign.center),
        const SizedBox(height: 8),
        Text('Réf : $ref', style: const TextStyle(color: AppColors.goldPrimary, fontSize: 12)),
        if (email.isNotEmpty) Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text('Email : $email', style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
        ),
        const SizedBox(height: 32),
        ElevatedButton(onPressed: () => context.go('/connexion'), style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)), child: const Text('Se connecter à mon espace Pro')),
        const SizedBox(height: 12),
        TextButton(onPressed: () => context.go('/inscription-vehicule'), child: const Text('Inscrire mes véhicules →', style: TextStyle(color: AppColors.goldPrimary))),
      ]),
    )),
  );
}
