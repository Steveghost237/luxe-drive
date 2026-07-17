import 'package:flutter/material.dart';
import '../data/catalog_data.dart';
import '../utils/constants.dart';
import '../services/api_service.dart';

class BookingScreen extends StatefulWidget {
  final String vehicleId;
  const BookingScreen({super.key, required this.vehicleId});
  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  final _nomCtrl    = TextEditingController();
  final _telCtrl    = TextEditingController();
  final _emailCtrl  = TextEditingController();
  final _noteCtrl   = TextEditingController();
  DateTime? _debut, _fin;
  bool _loading = false, _done = false;

  LocalVehicle? get _vehicle => LocalVehicle.findById(widget.vehicleId);

  int get _jours {
    if (_debut == null || _fin == null) return 0;
    return _fin!.difference(_debut!).inDays.clamp(0, 999);
  }

  String _fmtDate(DateTime? d) => d == null ? 'Sélectionner' : '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year}';

  Future<void> _pickDate(bool isDebut) async {
    final init = isDebut ? DateTime.now().add(const Duration(days: 1)) : (_debut ?? DateTime.now().add(const Duration(days: 2)));
    final d = await showDatePicker(
      context: context, initialDate: init,
      firstDate: DateTime.now(), lastDate: DateTime.now().add(const Duration(days: 365)),
      builder: (_, child) => Theme(
        data: Theme.of(context).copyWith(colorScheme: const ColorScheme.dark(primary: AppColors.goldPrimary, surface: Color(0xFF1A1A1A))),
        child: child!,
      ),
    );
    if (d == null) return;
    setState(() {
      if (isDebut) { _debut = d; if (_fin != null && !_fin!.isAfter(d)) _fin = null; }
      else _fin = d;
    });
  }

  Future<void> _submit() async {
    if (_nomCtrl.text.isEmpty || _telCtrl.text.isEmpty || _debut == null || _fin == null || _jours < 1) return;
    setState(() => _loading = true);
    try {
      await ApiService().post('/api/reservations', data: {
        'vehicule_id': widget.vehicleId,
        'vehicule_nom': _vehicle != null ? '${_vehicle!.marque} ${_vehicle!.nom}' : widget.vehicleId,
        'type': 'location',
        'client_nom': _nomCtrl.text,
        'client_tel': _telCtrl.text,
        'client_email': _emailCtrl.text,
        'date_debut': _debut!.toIso8601String().substring(0, 10),
        'date_fin': _fin!.toIso8601String().substring(0, 10),
        'note': _noteCtrl.text,
        'montant_total': _vehicle != null ? _vehicle!.prixJour * _jours : 0,
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
  void dispose() { _nomCtrl.dispose(); _telCtrl.dispose(); _emailCtrl.dispose(); _noteCtrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final v = _vehicle;
    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: AppBar(
        title: const Text('Réservation'),
        backgroundColor: AppColors.darkSurface,
        leading: IconButton(onPressed: () => Navigator.of(context).pop(), icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18)),
      ),
      body: _done ? _SuccessView(vehicleName: v != null ? '${v.marque} ${v.nom}' : '') : SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          // Vehicle info card
          if (v != null) Container(
            padding: const EdgeInsets.all(14),
            margin: const EdgeInsets.only(bottom: 24),
            decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppColors.darkBorder)),
            child: Row(children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.network(v.images.first, width: 70, height: 50, fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(width: 70, height: 50, color: const Color(0xFF1F2937))),
              ),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('${v.marque} ${v.nom}', style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.bold)),
                Text('${v.places} places · ${v.carburant}', style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
              ])),
              Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                Text('${_fmtNum(v.prixJour)}', style: const TextStyle(color: AppColors.goldPrimary, fontSize: 14, fontWeight: FontWeight.bold)),
                const Text('FCFA/jour', style: TextStyle(color: AppColors.textMuted, fontSize: 10)),
              ]),
            ]),
          ),

          // Client info
          _Section('Vos coordonnées'),
          const SizedBox(height: 12),
          _Field(controller: _nomCtrl, label: 'Nom complet *', hint: 'Jean Dupont', icon: Icons.person_outline_rounded),
          const SizedBox(height: 12),
          _Field(controller: _telCtrl, label: 'Téléphone *', hint: '+237 6XX XXX XXX', icon: Icons.phone_outlined, keyboard: TextInputType.phone),
          const SizedBox(height: 12),
          _Field(controller: _emailCtrl, label: 'Email (optionnel)', hint: 'jean@email.com', icon: Icons.email_outlined, keyboard: TextInputType.emailAddress),
          const SizedBox(height: 24),

          // Dates
          _Section('Dates de location'),
          const SizedBox(height: 12),
          Row(children: [
            Expanded(child: _DateTile(label: 'Date de début *', value: _fmtDate(_debut), onTap: () => _pickDate(true))),
            const SizedBox(width: 12),
            Expanded(child: _DateTile(label: 'Date de fin *', value: _fmtDate(_fin), onTap: () => _pickDate(false))),
          ]),
          const SizedBox(height: 8),
          if (_jours > 0 && v != null) Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(color: AppColors.goldPrimary.withOpacity(0.07), borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.goldPrimary.withOpacity(0.2))),
            child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Text('$_jours jour${_jours > 1 ? 's' : ''}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
              Text('${_fmtNum(v.prixJour * _jours)} FCFA', style: const TextStyle(color: AppColors.goldPrimary, fontSize: 15, fontWeight: FontWeight.bold)),
            ]),
          ),
          const SizedBox(height: 24),

          // Notes
          _Section('Note / Demande spéciale'),
          const SizedBox(height: 12),
          TextField(
            controller: _noteCtrl, maxLines: 3,
            style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Ex : Chauffeur bilingue, siège bébé, accueil aéroport…',
              contentPadding: const EdgeInsets.all(14),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.darkBorder)),
              enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.darkBorder)),
              filled: true, fillColor: AppColors.darkCard,
            ),
          ),
          const SizedBox(height: 28),

          // Submit
          SizedBox(width: double.infinity, child: ElevatedButton.icon(
            onPressed: (_nomCtrl.text.isNotEmpty && _telCtrl.text.isNotEmpty && _debut != null && _fin != null && _jours >= 1 && !_loading)
                ? _submit : null,
            icon: _loading
                ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black))
                : const Icon(Icons.send_rounded, size: 17),
            label: Text(_loading ? 'Envoi en cours…' : 'Confirmer ma réservation'),
            style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
          )),
          const SizedBox(height: 12),
          const Center(child: Text('Notre équipe vous confirmera sous 2h', style: TextStyle(color: AppColors.textMuted, fontSize: 11))),
        ]),
      ),
    );
  }

  String _fmtNum(int n) {
    if (n >= 1000000) return '${(n / 1000000).toStringAsFixed(1)}M';
    if (n >= 1000) return '${(n / 1000).toStringAsFixed(0)} 000';
    return '$n';
  }
}

class _Section extends StatelessWidget {
  final String title;
  const _Section(this.title);
  @override
  Widget build(BuildContext context) => Text(title, style: const TextStyle(color: AppColors.textPrimary, fontSize: 14, fontWeight: FontWeight.bold));
}

class _Field extends StatelessWidget {
  final TextEditingController controller;
  final String label, hint;
  final IconData icon;
  final TextInputType keyboard;
  const _Field({required this.controller, required this.label, required this.hint, required this.icon, this.keyboard = TextInputType.text});
  @override
  Widget build(BuildContext context) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
    const SizedBox(height: 6),
    TextField(
      controller: controller, keyboardType: keyboard,
      style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: Icon(icon, size: 18, color: AppColors.goldPrimary),
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.darkBorder)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppColors.darkBorder)),
        filled: true, fillColor: AppColors.darkCard,
      ),
    ),
  ]);
}

class _DateTile extends StatelessWidget {
  final String label, value;
  final VoidCallback onTap;
  const _DateTile({required this.label, required this.value, required this.onTap});
  @override
  Widget build(BuildContext context) => GestureDetector(
    onTap: onTap,
    child: Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
      decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(10), border: Border.all(color: AppColors.darkBorder)),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 10)),
        const SizedBox(height: 5),
        Row(children: [
          const Icon(Icons.event_outlined, size: 14, color: AppColors.goldPrimary),
          const SizedBox(width: 6),
          Flexible(child: Text(value, style: const TextStyle(color: AppColors.textPrimary, fontSize: 12, fontWeight: FontWeight.w600))),
        ]),
      ]),
    ),
  );
}

class _SuccessView extends StatelessWidget {
  final String vehicleName;
  const _SuccessView({required this.vehicleName});
  @override
  Widget build(BuildContext context) => Center(
    child: Padding(
      padding: const EdgeInsets.all(32),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Container(width: 80, height: 80, decoration: BoxDecoration(color: Colors.green.withOpacity(0.12), shape: BoxShape.circle),
          child: const Icon(Icons.check_circle_outline_rounded, size: 48, color: Colors.green)),
        const SizedBox(height: 20),
        const Text('Réservation envoyée !', style: TextStyle(color: AppColors.textPrimary, fontSize: 20, fontWeight: FontWeight.bold)),
        const SizedBox(height: 10),
        Text(vehicleName.isNotEmpty ? 'Votre demande pour le $vehicleName a bien été transmise.' : 'Votre demande a bien été transmise.',
          style: const TextStyle(color: AppColors.textSecondary, fontSize: 14), textAlign: TextAlign.center),
        const SizedBox(height: 6),
        const Text('Notre équipe vous contactera sous 2h.', style: TextStyle(color: AppColors.textMuted, fontSize: 13), textAlign: TextAlign.center),
        const SizedBox(height: 32),
        SizedBox(width: double.infinity, child: ElevatedButton(
          onPressed: () => Navigator.of(context).pop(),
          style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
          child: const Text('Retour au catalogue'),
        )),
      ]),
    ),
  );
}
