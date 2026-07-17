import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../utils/constants.dart';

class ChauffeurFormScreen extends StatefulWidget {
  const ChauffeurFormScreen({super.key});
  @override
  State<ChauffeurFormScreen> createState() => _ChauffeurFormScreenState();
}

class _ChauffeurFormScreenState extends State<ChauffeurFormScreen> {
  int _step = 0;
  bool _submitted = false;

  // Step 0 — Identité
  final _prenomCtrl    = TextEditingController();
  final _nomCtrl       = TextEditingController();
  final _telCtrl       = TextEditingController();
  final _emailCtrl     = TextEditingController();
  String _ville        = '';
  String _sexe         = '';

  // Step 1 — Expérience
  String _experience   = '';
  String _permis       = 'B';
  final _anneeCtrl     = TextEditingController();
  List<String> _langues = [];
  List<String> _specs  = [];

  // Step 2 — Documents
  final Map<String, String> _docs = {};

  // Step 3 — Conditions
  bool _cond1 = false, _cond2 = false, _cond3 = false;

  final List<String> _villes = ['Yaoundé','Douala','Bafoussam','Garoua','Bamenda','Bertoua'];
  final List<String> _expChoices = ['2-3 ans','3-5 ans','5-10 ans','10+ ans'];
  final List<String> _permisChoices = ['B','C','D','B+C'];
  final List<String> _langChoices = ['Français','Anglais','Fulfulde','Ewondo','Duala','Espagnol'];
  final List<String> _specChoices = ['Transfert aéroport','Protocole officiel','Événementiel','Mariage','Corporate','Longue distance'];

  bool get _canContinue {
    switch (_step) {
      case 0: return _prenomCtrl.text.isNotEmpty && _nomCtrl.text.isNotEmpty
          && _telCtrl.text.isNotEmpty && _ville.isNotEmpty && _sexe.isNotEmpty;
      case 1: return _experience.isNotEmpty && _anneeCtrl.text.isNotEmpty && _langues.isNotEmpty;
      case 2: return _docs.containsKey('permis') && _docs.containsKey('cni') && _docs.containsKey('medical') && _docs.containsKey('casier');
      case 3: return _cond1 && _cond2 && _cond3;
      default: return false;
    }
  }

  void _next() {
    if (_step < 3) setState(() => _step++);
    else setState(() => _submitted = true);
  }

  void _prev() { if (_step > 0) setState(() => _step--); }

  @override
  void dispose() {
    _prenomCtrl.dispose(); _nomCtrl.dispose(); _telCtrl.dispose();
    _emailCtrl.dispose(); _anneeCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_submitted) return _SuccessScreen(ref: 'CAND-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}');

    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: AppBar(
        backgroundColor: AppColors.darkSurface,
        title: const Text('Candidature Chauffeur'),
        leading: _step > 0
            ? IconButton(icon: const Icon(Icons.arrow_back_ios_rounded), onPressed: _prev)
            : IconButton(icon: const Icon(Icons.close), onPressed: () => context.pop()),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(4),
          child: LinearProgressIndicator(
            value: (_step + 1) / 4,
            backgroundColor: AppColors.darkCard,
            color: AppColors.goldPrimary,
            minHeight: 3,
          ),
        ),
      ),
      body: SafeArea(
        child: Column(children: [
          // Step pills
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 0),
            child: Row(children: ['Identité','Expérience','Documents','Conditions'].asMap().entries.map((e) {
              final done = _step > e.key; final active = _step == e.key;
              return Expanded(child: Container(
                margin: const EdgeInsets.only(right: 4),
                padding: const EdgeInsets.symmetric(vertical: 5),
                decoration: BoxDecoration(
                  color: done ? const Color(0xFF34D399).withOpacity(0.12) :
                    active ? AppColors.goldPrimary.withOpacity(0.12) : AppColors.darkCard,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: done ? const Color(0xFF34D399).withOpacity(0.3) :
                    active ? AppColors.goldPrimary.withOpacity(0.3) : AppColors.darkBorder),
                ),
                child: Text(e.value, textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600,
                    color: done ? const Color(0xFF34D399) :
                      active ? AppColors.goldPrimary : AppColors.textMuted)),
              ));
            }).toList()),
          ),
          const SizedBox(height: 16),

          Expanded(child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 100),
            child: [_step0(), _step1(), _step2(), _step3()][_step],
          )),
        ]),
      ),
      bottomNavigationBar: Padding(
        padding: EdgeInsets.fromLTRB(16, 8, 16, MediaQuery.of(context).padding.bottom + 12),
        child: ElevatedButton(
          onPressed: _canContinue ? _next : null,
          style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
          child: Text(_step < 3 ? 'Continuer →' : '✓  Soumettre ma candidature',
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
        ),
      ),
    );
  }

  // ── Step builders ─────────────────────────────────────────────────────────

  Widget _step0() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    _heading('Informations personnelles'),
    _row([_field('Prénom *', _prenomCtrl), _field('Nom *', _nomCtrl)]),
    _field('Téléphone *', _telCtrl, hint: '+237 6XX XXX XXX'),
    _field('Email', _emailCtrl, hint: 'votre@email.com'),
    _dropLabel('Ville *'),
    _drop(_villes, _ville, (v) => setState(() => _ville = v!)),
    _dropLabel('Sexe *'),
    _drop(['Masculin','Féminin'], _sexe, (v) => setState(() => _sexe = v!)),
    const SizedBox(height: 8),
    // Prérequis card
    _infoCard('📋 Prérequis essentiels', [
      'Permis de conduire catégorie B valide',
      'Casier judiciaire vierge (< 3 mois)',
      'Certificat médical (< 6 mois)',
      '2 ans d\'expérience conduite pro',
    ]),
  ]);

  Widget _step1() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    _heading('Expérience & compétences'),
    _dropLabel('Années d\'expérience *'),
    _drop(_expChoices, _experience, (v) => setState(() => _experience = v!)),
    _dropLabel('Catégorie de permis *'),
    _drop(_permisChoices, _permis, (v) => setState(() => _permis = v!)),
    _field('Année d\'obtention du permis *', _anneeCtrl, hint: '2015', keyboard: TextInputType.number),
    _multiLabel('Langues maîtrisées *'),
    _chips(_langChoices, _langues, const Color(0xFF60A5FA)),
    const SizedBox(height: 10),
    _multiLabel('Spécialités souhaitées'),
    _chips(_specChoices, _specs, AppColors.goldPrimary),
  ]);

  Widget _step2() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    _heading('Documents requis'),
    _subtitle('PDF ou JPG lisible, en cours de validité'),
    const SizedBox(height: 12),
    ...[
      ('permis',   '📄 Permis de conduire (recto-verso)', true),
      ('cni',      '🪪 Carte nationale d\'identité', true),
      ('medical',  '🩺 Certificat médical (< 6 mois)', true),
      ('casier',   '📜 Casier judiciaire B3 (< 3 mois)', true),
      ('photo_pro','📸 Photo professionnelle en costume', false),
    ].map((d) => _docTile(d.$1, d.$2, d.$3)).toList(),
  ]);

  Widget _step3() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    _heading('Engagements & conditions'),
    const SizedBox(height: 4),
    // Summary
    _summaryCard(),
    const SizedBox(height: 16),
    _checkTile('J\'accepte les Conditions Générales d\'Utilisation et la Charte des Chauffeurs Luxe Drive', _cond1, (v) => setState(() => _cond1 = v!)),
    const SizedBox(height: 8),
    _checkTile('Je m\'engage à respecter le dress code Luxe Drive (costume sombre, chemise blanche, cravate)', _cond2, (v) => setState(() => _cond2 = v!)),
    const SizedBox(height: 8),
    _checkTile('Je m\'engage à suivre la formation d\'intégration Luxe Drive avant ma première mission', _cond3, (v) => setState(() => _cond3 = v!)),
    const SizedBox(height: 8),
    _checkTile('J\'accepte que mon profil soit visible par les clients cherchant un chauffeur (optionnel)', false, (_) {}, optional: true),
  ]);

  // ── Component helpers ─────────────────────────────────────────────────────

  Widget _heading(String t) => Padding(padding: const EdgeInsets.only(bottom: 14),
    child: Text(t, style: const TextStyle(color: AppColors.textPrimary, fontSize: 17, fontWeight: FontWeight.bold)));

  Widget _subtitle(String t) => Text(t, style: const TextStyle(color: AppColors.textMuted, fontSize: 12));

  Widget _dropLabel(String l) => Padding(padding: const EdgeInsets.only(bottom: 4, top: 10),
    child: Text(l, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)));

  Widget _multiLabel(String l) => Padding(padding: const EdgeInsets.only(bottom: 8, top: 10),
    child: Text(l, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)));

  Widget _field(String label, TextEditingController ctrl, {String? hint, TextInputType? keyboard}) => Padding(
    padding: const EdgeInsets.only(bottom: 10),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
      const SizedBox(height: 4),
      TextField(
        controller: ctrl,
        keyboardType: keyboard,
        onChanged: (_) => setState(() {}),
        style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
        decoration: InputDecoration(hintText: hint, contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12)),
      ),
    ]),
  );

  Widget _row(List<Widget> children) => Row(children: children.map((c) => Expanded(child: Padding(padding: const EdgeInsets.only(right: 8), child: c))).toList());

  Widget _drop(List<String> items, String value, ValueChanged<String?> onChanged) => Padding(
    padding: const EdgeInsets.only(bottom: 10),
    child: DropdownButtonFormField<String>(
      value: value.isEmpty ? null : value,
      hint: Text('Sélectionner…', style: TextStyle(color: AppColors.textMuted, fontSize: 13)),
      onChanged: onChanged,
      dropdownColor: AppColors.darkSurface,
      decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12)),
      style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
      items: items.map((i) => DropdownMenuItem(value: i, child: Text(i))).toList(),
    ),
  );

  Widget _chips(List<String> items, List<String> selected, Color color) => Wrap(
    spacing: 6, runSpacing: 6,
    children: items.map((item) {
      final sel = selected.contains(item);
      return GestureDetector(
        onTap: () => setState(() => sel ? selected.remove(item) : selected.add(item)),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: sel ? color.withOpacity(0.12) : AppColors.darkCard,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: sel ? color.withOpacity(0.4) : AppColors.darkBorder),
          ),
          child: Text(item, style: TextStyle(color: sel ? color : AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.w500)),
        ),
      );
    }).toList(),
  );

  Widget _docTile(String key, String label, bool required) {
    final uploaded = _docs.containsKey(key);
    return GestureDetector(
      onTap: () => setState(() => _docs[key] = 'document.pdf'),
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: uploaded ? const Color(0xFF34D399).withOpacity(0.06) : AppColors.darkCard,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: uploaded ? const Color(0xFF34D399).withOpacity(0.3) : AppColors.darkBorder),
        ),
        child: Row(children: [
          Icon(uploaded ? Icons.check_circle_rounded : Icons.upload_file_rounded,
            color: uploaded ? const Color(0xFF34D399) : AppColors.textMuted, size: 20),
          const SizedBox(width: 10),
          Expanded(child: Text('$label${required ? ' *' : ''}',
            style: TextStyle(color: uploaded ? const Color(0xFF34D399) : AppColors.textPrimary, fontSize: 12))),
          Text(uploaded ? 'Chargé' : 'Appuyer', style: TextStyle(color: uploaded ? const Color(0xFF34D399) : AppColors.textMuted, fontSize: 10)),
        ]),
      ),
    );
  }

  Widget _checkTile(String label, bool value, ValueChanged<bool?> onChanged, {bool optional = false}) => GestureDetector(
    onTap: () => onChanged(!value),
    child: Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: value ? AppColors.goldPrimary.withOpacity(0.06) : AppColors.darkCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: value ? AppColors.goldPrimary.withOpacity(0.25) : AppColors.darkBorder),
      ),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Checkbox(value: value, onChanged: onChanged,
          activeColor: AppColors.goldPrimary,
          materialTapTargetSize: MaterialTapTargetSize.shrinkWrap),
        const SizedBox(width: 6),
        Expanded(child: Text(
          optional ? '$label (optionnel)' : label,
          style: const TextStyle(color: AppColors.textPrimary, fontSize: 12, height: 1.4))),
      ]),
    ),
  );

  Widget _infoCard(String title, List<String> items) => Container(
    margin: const EdgeInsets.only(top: 16),
    padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(
      color: AppColors.goldPrimary.withOpacity(0.05),
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: AppColors.goldPrimary.withOpacity(0.15)),
    ),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(title, style: const TextStyle(color: AppColors.goldPrimary, fontSize: 12, fontWeight: FontWeight.bold)),
      const SizedBox(height: 8),
      ...items.map((i) => Padding(
        padding: const EdgeInsets.only(bottom: 4),
        child: Row(children: [
          const Icon(Icons.check_circle_outline_rounded, size: 12, color: Color(0xFF34D399)),
          const SizedBox(width: 6),
          Expanded(child: Text(i, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11))),
        ]),
      )),
    ]),
  );

  Widget _summaryCard() => Container(
    padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(
      color: AppColors.goldPrimary.withOpacity(0.06),
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: AppColors.goldPrimary.withOpacity(0.2)),
    ),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      const Text('Récapitulatif', style: TextStyle(color: AppColors.goldPrimary, fontSize: 12, fontWeight: FontWeight.bold)),
      const SizedBox(height: 10),
      ...[
        ('Nom', '${_prenomCtrl.text} ${_nomCtrl.text}'),
        ('Téléphone', _telCtrl.text),
        ('Ville', _ville),
        ('Expérience', _experience),
        ('Permis', _permis),
        ('Documents', '${_docs.length}/4 chargés'),
      ].map((e) => Padding(
        padding: const EdgeInsets.only(bottom: 5),
        child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
          Text(e.$1, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
          Text(e.$2.isNotEmpty ? e.$2 : '—', style: TextStyle(color: e.$2.isNotEmpty ? AppColors.textPrimary : const Color(0xFFEF4444), fontSize: 11, fontWeight: FontWeight.w600)),
        ]),
      )),
    ]),
  );
}

// ── Success screen ─────────────────────────────────────────────────────────────

class _SuccessScreen extends StatelessWidget {
  final String ref;
  const _SuccessScreen({required this.ref});
  @override
  Widget build(BuildContext context) => Scaffold(
    backgroundColor: AppColors.darkBg,
    body: SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          Container(width: 80, height: 80, decoration: BoxDecoration(color: const Color(0xFF34D399).withOpacity(0.1), shape: BoxShape.circle, border: Border.all(color: const Color(0xFF34D399).withOpacity(0.3))),
            child: const Icon(Icons.check_circle_rounded, color: Color(0xFF34D399), size: 40)),
          const SizedBox(height: 24),
          const Text('Candidature envoyée !', style: TextStyle(color: AppColors.textPrimary, fontSize: 22, fontWeight: FontWeight.bold), textAlign: TextAlign.center),
          const SizedBox(height: 12),
          const Text('Notre équipe examinera votre dossier sous 48–72h ouvrables.', style: TextStyle(color: AppColors.textSecondary, fontSize: 14), textAlign: TextAlign.center),
          const SizedBox(height: 8),
          Text('Réf : $ref', style: const TextStyle(color: AppColors.goldPrimary, fontSize: 12, fontFamily: 'monospace')),
          const SizedBox(height: 32),
          ElevatedButton(onPressed: () => context.go('/connexion'), style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)), child: const Text('Se connecter / Créer mon compte')),
          const SizedBox(height: 12),
          TextButton(onPressed: () => context.go('/catalogue'), child: const Text('Retour au catalogue', style: TextStyle(color: AppColors.textMuted))),
        ]),
      ),
    ),
  );
}
