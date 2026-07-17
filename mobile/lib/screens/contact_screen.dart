import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../utils/constants.dart';

class ContactScreen extends StatefulWidget {
  const ContactScreen({super.key});
  @override
  State<ContactScreen> createState() => _ContactScreenState();
}

class _ContactScreenState extends State<ContactScreen> {
  final _formKey = GlobalKey<FormState>();
  final _sujetCtrl   = TextEditingController();
  final _msgCtrl     = TextEditingController();
  String _type = 'general';
  bool _sent = false;

  static const _types = [
    {'key': 'general',      'label': 'Question générale'},
    {'key': 'reservation',  'label': 'Réservation'},
    {'key': 'technique',    'label': 'Problème technique'},
    {'key': 'reclamation',  'label': 'Réclamation'},
  ];

  @override
  void dispose() {
    _sujetCtrl.dispose();
    _msgCtrl.dispose();
    super.dispose();
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      setState(() => _sent = true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light,
      child: Scaffold(
        backgroundColor: AppColors.darkBg,
        appBar: AppBar(
          title: const Text('Nous contacter'),
          backgroundColor: AppColors.darkSurface,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ),
        body: _sent ? _buildSuccess() : _buildForm(),
      ),
    );
  }

  Widget _buildSuccess() => Center(
    child: Padding(
      padding: const EdgeInsets.all(32),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Container(
          width: 80, height: 80,
          decoration: BoxDecoration(color: const Color(0xFF34D399).withOpacity(0.12), shape: BoxShape.circle, border: Border.all(color: const Color(0xFF34D399).withOpacity(0.4))),
          child: const Icon(Icons.check_rounded, color: Color(0xFF34D399), size: 40),
        ),
        const SizedBox(height: 20),
        const Text('Message envoyé !', style: TextStyle(color: AppColors.textPrimary, fontSize: 22, fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        const Text('Notre équipe vous répondra dans les 24 heures ouvrables.', style: TextStyle(color: AppColors.textSecondary, fontSize: 13), textAlign: TextAlign.center),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () => setState(() { _sent = false; _sujetCtrl.clear(); _msgCtrl.clear(); }),
            child: const Text('Nouveau message'),
          ),
        ),
      ]),
    ),
  );

  Widget _buildForm() => ListView(
    padding: const EdgeInsets.all(20),
    children: [
      // ── Canaux de contact ──────────────────────────────────────────────
      const Text('Nos canaux', style: TextStyle(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold)),
      const SizedBox(height: 12),
      ...[
        {'icon': Icons.phone_rounded,        'label': '+237 6 55 123 456', 'sub': 'Lun–Sam · 8h00–20h00', 'color': const Color(0xFF34D399)},
        {'icon': Icons.email_rounded,        'label': 'contact@luxedrive.cm', 'sub': 'Réponse sous 24h', 'color': const Color(0xFF60A5FA)},
        {'icon': Icons.location_on_rounded,  'label': 'Bastos, Yaoundé', 'sub': 'Centre de service', 'color': AppColors.goldPrimary},
      ].map((c) => Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(color: AppColors.darkCard, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppColors.darkBorder)),
        child: Row(children: [
          Container(
            width: 38, height: 38,
            decoration: BoxDecoration(color: (c['color'] as Color).withOpacity(0.12), shape: BoxShape.circle),
            child: Icon(c['icon'] as IconData, color: c['color'] as Color, size: 18),
          ),
          const SizedBox(width: 12),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(c['label'] as String, style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w600)),
            Text(c['sub'] as String, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
          ]),
        ]),
      )),
      const SizedBox(height: 24),

      // ── Formulaire ────────────────────────────────────────────────────
      const Text('Envoyer un message', style: TextStyle(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.bold)),
      const SizedBox(height: 14),
      Form(
        key: _formKey,
        child: Column(children: [
          // Type de demande
          DropdownButtonFormField<String>(
            value: _type,
            dropdownColor: AppColors.darkCard,
            style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
            decoration: const InputDecoration(labelText: 'Type de demande', labelStyle: TextStyle(color: AppColors.textMuted, fontSize: 12)),
            items: _types.map((t) => DropdownMenuItem(value: t['key'], child: Text(t['label']!))).toList(),
            onChanged: (v) => setState(() => _type = v!),
          ),
          const SizedBox(height: 14),
          TextFormField(
            controller: _sujetCtrl,
            style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
            decoration: const InputDecoration(labelText: 'Sujet', labelStyle: TextStyle(color: AppColors.textMuted, fontSize: 12)),
            validator: (v) => v == null || v.isEmpty ? 'Champ requis' : null,
          ),
          const SizedBox(height: 14),
          TextFormField(
            controller: _msgCtrl,
            maxLines: 5,
            style: const TextStyle(color: AppColors.textPrimary, fontSize: 13),
            decoration: const InputDecoration(labelText: 'Votre message', alignLabelWithHint: true, labelStyle: TextStyle(color: AppColors.textMuted, fontSize: 12)),
            validator: (v) => v == null || v.length < 10 ? 'Minimum 10 caractères' : null,
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _submit,
              icon: const Icon(Icons.send_rounded, size: 16),
              label: const Text('Envoyer le message'),
            ),
          ),
        ]),
      ),
    ],
  );
}
