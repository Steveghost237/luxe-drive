import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../utils/constants.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});
  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen>
    with SingleTickerProviderStateMixin {
  final _formKey      = GlobalKey<FormState>();
  final _prenomCtrl   = TextEditingController();
  final _nomCtrl      = TextEditingController();
  final _telCtrl      = TextEditingController();
  final _emailCtrl    = TextEditingController();
  final _passCtrl     = TextEditingController();
  final _confirmCtrl  = TextEditingController();

  bool _obscurePass    = true;
  bool _obscureConfirm = true;
  bool _acceptTerms    = false;
  String _selectedRole = 'client';

  late final AnimationController _animCtrl;
  late final Animation<double>    _fadeAnim;
  late final Animation<Offset>    _slideAnim;

  final _roles = const [
    _RoleItem('client',    '🧑', 'Client',      'Louer & réserver'),
    _RoleItem('chauffeur', '🎩', 'Chauffeur',   'Missions & courses'),
    _RoleItem('admin',     '🏢', 'Propriétaire','Gérer ma flotte'),
  ];

  @override
  void initState() {
    super.initState();
    _animCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 900));
    _fadeAnim  = CurvedAnimation(parent: _animCtrl, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(begin: const Offset(0, 0.2), end: Offset.zero)
        .animate(CurvedAnimation(parent: _animCtrl, curve: Curves.easeOutCubic));
    _animCtrl.forward();
  }

  @override
  void dispose() {
    _prenomCtrl.dispose(); _nomCtrl.dispose(); _telCtrl.dispose();
    _emailCtrl.dispose();  _passCtrl.dispose(); _confirmCtrl.dispose();
    _animCtrl.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;
    if (!_acceptTerms) {
      _showSnack('Veuillez accepter les conditions d\'utilisation', isError: true);
      return;
    }
    FocusScope.of(context).unfocus();
    final auth = context.read<AuthProvider>();
    final ok = await auth.register(
      telephone:   _telCtrl.text.trim(),
      motDePasse:  _passCtrl.text,
      prenom:      _prenomCtrl.text.trim(),
      nom:         _nomCtrl.text.trim(),
      email:       _emailCtrl.text.trim().isEmpty ? null : _emailCtrl.text.trim(),
      role:        _selectedRole == 'admin' ? 'client' : _selectedRole,
    );
    if (!mounted) return;
    if (ok) {
      _showSnack('Compte créé avec succès ! Bienvenue 🎉', isError: false);
      await Future.delayed(const Duration(milliseconds: 800));
      if (mounted) {
        final route = AppRoutes.forRole(auth.user?.role);
        context.go(route);
      }
    } else {
      _showSnack(auth.error ?? 'Erreur lors de la création du compte', isError: true);
    }
  }

  void _showSnack(String msg, {required bool isError}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(children: [
          Icon(isError ? Icons.error_outline : Icons.check_circle_outline,
              color: Colors.white, size: 18),
          const SizedBox(width: 10),
          Expanded(child: Text(msg)),
        ]),
        backgroundColor: isError ? AppColors.error : AppColors.success,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        margin: const EdgeInsets.all(16),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light,
      child: Scaffold(
        backgroundColor: AppColors.darkBg,
        body: Stack(
          fit: StackFit.expand,
          children: [
            // Arrière-plan
            Image.network(
              'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=60',
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(color: AppColors.darkBg),
            ),
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter, end: Alignment.bottomCenter,
                  colors: [Color(0xCC0A0A0A), Color(0xEE0A0A0A), Color(0xFF0A0A0A)],
                  stops: [0.0, 0.4, 0.7],
                ),
              ),
            ),
            // Contenu scrollable
            SafeArea(
              child: FadeTransition(
                opacity: _fadeAnim,
                child: SlideTransition(
                  position: _slideAnim,
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 16),

                        // Header : bouton retour + logo
                        Row(
                          children: [
                            GestureDetector(
                              onTap: () => context.canPop() ? context.pop() : context.go('/connexion'),
                              child: Container(
                                width: 40, height: 40,
                                decoration: BoxDecoration(
                                  color: AppColors.darkCard,
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: AppColors.darkBorder),
                                ),
                                child: const Icon(Icons.arrow_back_ios_new_rounded,
                                    color: AppColors.textPrimary, size: 16),
                              ),
                            ),
                            const Spacer(),
                            Container(
                              width: 44, height: 44,
                              decoration: BoxDecoration(
                                color: AppColors.goldPrimary.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppColors.goldPrimary.withOpacity(0.4)),
                                boxShadow: [BoxShadow(color: AppColors.goldPrimary.withOpacity(0.2), blurRadius: 20)],
                              ),
                              child: const Center(
                                child: Text('LD', style: TextStyle(
                                  fontFamily: 'Playfair Display', fontSize: 18,
                                  fontWeight: FontWeight.bold, color: AppColors.goldPrimary,
                                )),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),

                        // Titre
                        ShaderMask(
                          shaderCallback: (b) => const LinearGradient(
                            colors: [AppColors.goldPrimary, Color(0xFFFFD75A), AppColors.goldPrimary],
                          ).createShader(b),
                          child: const Text('Créer un compte', style: TextStyle(
                            fontFamily: 'Playfair Display', fontSize: 30,
                            fontWeight: FontWeight.bold, color: Colors.white,
                          )),
                        ),
                        const SizedBox(height: 4),
                        const Text('Rejoignez l\'écosystème Luxe Drive', style: TextStyle(
                          color: AppColors.textSecondary, fontSize: 14,
                        )),
                        const SizedBox(height: 24),

                        // ── Sélecteur de rôle ────────────────────────────────
                        const Text('Je suis...', style: TextStyle(
                          color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.w500,
                          letterSpacing: 0.5,
                        )),
                        const SizedBox(height: 10),
                        Row(
                          children: _roles.map((r) => Expanded(
                            child: GestureDetector(
                              onTap: () => setState(() => _selectedRole = r.value),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                margin: const EdgeInsets.only(right: 8),
                                padding: const EdgeInsets.symmetric(vertical: 12),
                                decoration: BoxDecoration(
                                  color: _selectedRole == r.value
                                      ? AppColors.goldPrimary.withOpacity(0.15)
                                      : AppColors.darkCard,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: _selectedRole == r.value
                                        ? AppColors.goldPrimary
                                        : AppColors.darkBorder,
                                    width: _selectedRole == r.value ? 1.5 : 1,
                                  ),
                                ),
                                child: Column(
                                  children: [
                                    Text(r.emoji, style: const TextStyle(fontSize: 20)),
                                    const SizedBox(height: 4),
                                    Text(r.label, style: TextStyle(
                                      color: _selectedRole == r.value
                                          ? AppColors.goldPrimary
                                          : AppColors.textPrimary,
                                      fontSize: 12, fontWeight: FontWeight.w600,
                                    )),
                                    Text(r.sub, style: const TextStyle(
                                      color: AppColors.textMuted, fontSize: 10,
                                    )),
                                  ],
                                ),
                              ),
                            ),
                          )).toList(),
                        ),
                        const SizedBox(height: 20),

                        // ── Formulaire ────────────────────────────────────────
                        Form(
                          key: _formKey,
                          child: Column(
                            children: [
                              // Prénom + Nom
                              Row(
                                children: [
                                  Expanded(child: _buildField(
                                    controller: _prenomCtrl,
                                    hint: 'Prénom',
                                    icon: Icons.person_outline_rounded,
                                    validator: (v) => v == null || v.trim().isEmpty ? 'Requis' : null,
                                  )),
                                  const SizedBox(width: 12),
                                  Expanded(child: _buildField(
                                    controller: _nomCtrl,
                                    hint: 'Nom',
                                    icon: Icons.badge_outlined,
                                    validator: (v) => v == null || v.trim().isEmpty ? 'Requis' : null,
                                  )),
                                ],
                              ),
                              const SizedBox(height: 14),

                              // Téléphone
                              _buildField(
                                controller: _telCtrl,
                                hint: 'Téléphone (+237 6XX XXX XXX)',
                                icon: Icons.phone_outlined,
                                type: TextInputType.phone,
                                validator: (v) {
                                  if (v == null || v.trim().isEmpty) return 'Champ obligatoire';
                                  if (v.trim().length < 9) return 'Numéro invalide';
                                  return null;
                                },
                              ),
                              const SizedBox(height: 14),

                              // Email (optionnel)
                              _buildField(
                                controller: _emailCtrl,
                                hint: 'Email (optionnel)',
                                icon: Icons.email_outlined,
                                type: TextInputType.emailAddress,
                                validator: (v) {
                                  if (v != null && v.isNotEmpty && !v.contains('@')) {
                                    return 'Format email invalide';
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 14),

                              // Mot de passe
                              _buildField(
                                controller: _passCtrl,
                                hint: 'Mot de passe (min. 6 caractères)',
                                icon: Icons.lock_outline_rounded,
                                obscure: _obscurePass,
                                suffix: IconButton(
                                  icon: Icon(
                                    _obscurePass ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                                    color: AppColors.textMuted, size: 20,
                                  ),
                                  onPressed: () => setState(() => _obscurePass = !_obscurePass),
                                ),
                                validator: (v) {
                                  if (v == null || v.isEmpty) return 'Champ obligatoire';
                                  if (v.length < 6) return 'Minimum 6 caractères';
                                  return null;
                                },
                              ),
                              const SizedBox(height: 14),

                              // Confirmation mot de passe
                              _buildField(
                                controller: _confirmCtrl,
                                hint: 'Confirmer le mot de passe',
                                icon: Icons.lock_outline_rounded,
                                obscure: _obscureConfirm,
                                suffix: IconButton(
                                  icon: Icon(
                                    _obscureConfirm ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                                    color: AppColors.textMuted, size: 20,
                                  ),
                                  onPressed: () => setState(() => _obscureConfirm = !_obscureConfirm),
                                ),
                                validator: (v) {
                                  if (v == null || v.isEmpty) return 'Champ obligatoire';
                                  if (v != _passCtrl.text) return 'Les mots de passe ne correspondent pas';
                                  return null;
                                },
                              ),
                              const SizedBox(height: 16),

                              // Checkbox CGU
                              GestureDetector(
                                onTap: () => setState(() => _acceptTerms = !_acceptTerms),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    AnimatedContainer(
                                      duration: const Duration(milliseconds: 150),
                                      width: 22, height: 22,
                                      decoration: BoxDecoration(
                                        color: _acceptTerms ? AppColors.goldPrimary : Colors.transparent,
                                        borderRadius: BorderRadius.circular(6),
                                        border: Border.all(
                                          color: _acceptTerms ? AppColors.goldPrimary : AppColors.darkBorder,
                                          width: 1.5,
                                        ),
                                      ),
                                      child: _acceptTerms
                                          ? const Icon(Icons.check_rounded, color: Colors.black, size: 14)
                                          : null,
                                    ),
                                    const SizedBox(width: 10),
                                    Expanded(
                                      child: RichText(
                                        text: const TextSpan(
                                          style: TextStyle(color: AppColors.textSecondary, fontSize: 13, height: 1.5),
                                          children: [
                                            TextSpan(text: "J'accepte les "),
                                            TextSpan(text: "Conditions d'utilisation",
                                                style: TextStyle(color: AppColors.goldPrimary, fontWeight: FontWeight.w600)),
                                            TextSpan(text: " et la "),
                                            TextSpan(text: "Politique de confidentialité",
                                                style: TextStyle(color: AppColors.goldPrimary, fontWeight: FontWeight.w600)),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 24),

                              // Bouton créer compte
                              _GoldButton(
                                label: 'Créer mon compte',
                                loading: auth.loading,
                                onTap: _register,
                              ),
                              const SizedBox(height: 16),

                              // Séparateur
                              Row(children: [
                                Expanded(child: Divider(color: AppColors.darkBorder, thickness: 1)),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 14),
                                  child: Text('ou', style: TextStyle(color: AppColors.textMuted, fontSize: 13)),
                                ),
                                Expanded(child: Divider(color: AppColors.darkBorder, thickness: 1)),
                              ]),
                              const SizedBox(height: 16),

                              // Bouton Google
                              _GoogleButton(onTap: () {
                                _showSnack('Google Sign-In — disponible prochainement', isError: false);
                              }),
                            ],
                          ),
                        ),

                        const SizedBox(height: 28),

                        // Lien connexion
                        Center(
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text('Déjà un compte ? ', style: TextStyle(
                                color: AppColors.textSecondary, fontSize: 14,
                              )),
                              GestureDetector(
                                onTap: () => context.go('/connexion'),
                                child: const Text('Se connecter', style: TextStyle(
                                  color: AppColors.goldPrimary, fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                )),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 32),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Champ texte ────────────────────────────────────────────────────────────
  Widget _buildField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    TextInputType type = TextInputType.text,
    bool obscure = false,
    Widget? suffix,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      obscureText: obscure,
      keyboardType: type,
      style: const TextStyle(color: AppColors.textPrimary, fontSize: 15),
      validator: validator,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 13),
        prefixIcon: Icon(icon, color: AppColors.textMuted, size: 19),
        suffixIcon: suffix,
        filled: true,
        fillColor: AppColors.darkCard,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.darkBorder)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.darkBorder)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.goldPrimary, width: 1.5)),
        errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.error)),
        focusedErrorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.error, width: 1.5)),
        errorStyle: const TextStyle(color: AppColors.error, fontSize: 11),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
      ),
    );
  }
}

// ── Modèle rôle ──────────────────────────────────────────────────────────────
class _RoleItem {
  final String value, emoji, label, sub;
  const _RoleItem(this.value, this.emoji, this.label, this.sub);
}

// ── Bouton doré ──────────────────────────────────────────────────────────────
class _GoldButton extends StatelessWidget {
  final String label;
  final bool loading;
  final VoidCallback? onTap;
  const _GoldButton({required this.label, required this.loading, this.onTap});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity, height: 54,
      child: ElevatedButton(
        onPressed: loading ? null : onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.goldPrimary,
          disabledBackgroundColor: AppColors.goldPrimary.withOpacity(0.5),
          foregroundColor: Colors.black,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          elevation: 0,
        ),
        child: loading
            ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2.5))
            : Text(label, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
      ),
    );
  }
}

// ── Bouton Google ─────────────────────────────────────────────────────────────
class _GoogleButton extends StatelessWidget {
  final VoidCallback? onTap;
  const _GoogleButton({this.onTap});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity, height: 54,
      child: OutlinedButton(
        onPressed: onTap,
        style: OutlinedButton.styleFrom(
          side: const BorderSide(color: AppColors.darkBorder, width: 1.5),
          backgroundColor: AppColors.darkCard,
          foregroundColor: AppColors.textPrimary,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 22, height: 22,
              child: Image.network(
                'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg',
                width: 22, height: 22,
                errorBuilder: (_, __, ___) => const Icon(Icons.g_mobiledata_rounded, color: Colors.white, size: 24),
              ),
            ),
            const SizedBox(width: 12),
            const Text('Continuer avec Google', style: TextStyle(
              fontSize: 15, fontWeight: FontWeight.w500, color: AppColors.textPrimary,
            )),
          ],
        ),
      ),
    );
  }
}
