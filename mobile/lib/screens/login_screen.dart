import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../utils/constants.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _formKey       = GlobalKey<FormState>();
  final _identCtrl     = TextEditingController();
  final _passCtrl      = TextEditingController();
  bool  _obscure       = true;
  bool  _identFocused  = false;
  bool  _passFocused   = false;

  late final AnimationController _animCtrl;
  late final Animation<double>    _fadeAnim;
  late final Animation<Offset>    _slideAnim;

  @override
  void initState() {
    super.initState();
    _animCtrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 900));
    _fadeAnim  = CurvedAnimation(parent: _animCtrl, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(begin: const Offset(0, 0.25), end: Offset.zero)
        .animate(CurvedAnimation(parent: _animCtrl, curve: Curves.easeOutCubic));
    _animCtrl.forward();
  }

  @override
  void dispose() {
    _identCtrl.dispose(); _passCtrl.dispose(); _animCtrl.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;
    FocusScope.of(context).unfocus();
    final auth = context.read<AuthProvider>();
    final ok = await auth.login(_identCtrl.text.trim(), _passCtrl.text);
    if (!mounted) return;
    if (ok) {
      final route = AppRoutes.forRole(auth.user?.role);
      context.go(route);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(children: [
            const Icon(Icons.error_outline, color: Colors.white, size: 18),
            const SizedBox(width: 10),
            Expanded(child: Text(auth.error ?? 'Erreur de connexion')),
          ]),
          backgroundColor: AppColors.error,
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          margin: const EdgeInsets.all(16),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final h    = MediaQuery.of(context).size.height;

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light,
      child: Scaffold(
        backgroundColor: AppColors.darkBg,
        body: Stack(
          fit: StackFit.expand,
          children: [
            // ── Arrière-plan image ──────────────────────────────────────────
            Image.network(
              'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?auto=format&fit=crop&w=900&q=60',
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(color: AppColors.darkBg),
            ),
            // ── Gradient overlay ────────────────────────────────────────────
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0xBB0A0A0A),
                    Color(0xDD0A0A0A),
                    Color(0xFF0A0A0A),
                    Color(0xFF0A0A0A),
                  ],
                  stops: [0.0, 0.3, 0.6, 1.0],
                ),
              ),
            ),
            // ── Contenu ─────────────────────────────────────────────────────
            SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 28),
                child: FadeTransition(
                  opacity: _fadeAnim,
                  child: SlideTransition(
                    position: _slideAnim,
                    child: Column(
                      children: [
                        SizedBox(height: h * 0.08),

                        // Logo
                        Container(
                          width: 72, height: 72,
                          decoration: BoxDecoration(
                            color: AppColors.goldPrimary.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: AppColors.goldPrimary.withOpacity(0.4), width: 1.5),
                            boxShadow: [BoxShadow(color: AppColors.goldPrimary.withOpacity(0.25), blurRadius: 30, spreadRadius: 2)],
                          ),
                          child: const Center(
                            child: Text('LD', style: TextStyle(
                              fontFamily: 'Playfair Display', fontSize: 26,
                              fontWeight: FontWeight.bold, color: AppColors.goldPrimary,
                            )),
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Titre
                        ShaderMask(
                          shaderCallback: (b) => const LinearGradient(
                            colors: [AppColors.goldPrimary, Color(0xFFFFD75A), AppColors.goldPrimary],
                          ).createShader(b),
                          child: const Text('Luxe Drive', style: TextStyle(
                            fontFamily: 'Playfair Display', fontSize: 34,
                            fontWeight: FontWeight.bold, color: Colors.white,
                          )),
                        ),
                        const SizedBox(height: 6),
                        const Text('Connectez-vous à votre compte', style: TextStyle(
                          color: AppColors.textSecondary, fontSize: 14, letterSpacing: 0.3,
                        )),

                        SizedBox(height: h * 0.06),

                        // ── Formulaire ──────────────────────────────────────
                        Form(
                          key: _formKey,
                          child: Column(
                            children: [
                              // Champ identifiant
                              _buildField(
                                controller: _identCtrl,
                                hint: 'Email ou téléphone (+237...)',
                                icon: Icons.person_outline_rounded,
                                focused: _identFocused,
                                onFocusChange: (v) => setState(() => _identFocused = v),
                                keyboardType: TextInputType.emailAddress,
                                validator: (v) {
                                  if (v == null || v.trim().isEmpty) return 'Champ obligatoire';
                                  return null;
                                },
                              ),
                              const SizedBox(height: 16),

                              // Champ mot de passe
                              _buildField(
                                controller: _passCtrl,
                                hint: 'Mot de passe',
                                icon: Icons.lock_outline_rounded,
                                focused: _passFocused,
                                onFocusChange: (v) => setState(() => _passFocused = v),
                                obscure: _obscure,
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                                    color: AppColors.textMuted, size: 20,
                                  ),
                                  onPressed: () => setState(() => _obscure = !_obscure),
                                ),
                                validator: (v) {
                                  if (v == null || v.isEmpty) return 'Champ obligatoire';
                                  if (v.length < 6) return 'Minimum 6 caractères';
                                  return null;
                                },
                              ),
                              const SizedBox(height: 10),

                              // Mot de passe oublié
                              Align(
                                alignment: Alignment.centerRight,
                                child: TextButton(
                                  onPressed: () {},
                                  style: TextButton.styleFrom(padding: EdgeInsets.zero, minimumSize: Size.zero),
                                  child: const Text('Mot de passe oublié ?',
                                    style: TextStyle(color: AppColors.goldPrimary, fontSize: 13)),
                                ),
                              ),
                              const SizedBox(height: 24),

                              // Bouton connexion
                              _GoldButton(
                                label: 'Se connecter',
                                loading: auth.loading,
                                onTap: _login,
                              ),
                              const SizedBox(height: 20),

                              // Séparateur
                              Row(children: [
                                Expanded(child: Divider(color: AppColors.darkBorder, thickness: 1)),
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 16),
                                  child: Text('ou', style: TextStyle(color: AppColors.textMuted, fontSize: 13)),
                                ),
                                Expanded(child: Divider(color: AppColors.darkBorder, thickness: 1)),
                              ]),
                              const SizedBox(height: 20),

                              // Bouton Google
                              _GoogleButton(onTap: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: const Text('Google Sign-In — disponible prochainement'),
                                    backgroundColor: AppColors.darkCard,
                                    behavior: SnackBarBehavior.floating,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                    margin: const EdgeInsets.all(16),
                                  ),
                                );
                              }),
                            ],
                          ),
                        ),

                        const SizedBox(height: 32),

                        // Lien inscription
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text("Pas encore de compte ? ", style: TextStyle(color: AppColors.textSecondary, fontSize: 14)),
                            GestureDetector(
                              onTap: () => context.push('/inscription'),
                              child: const Text('Créer un compte', style: TextStyle(
                                color: AppColors.goldPrimary, fontSize: 14, fontWeight: FontWeight.w600,
                              )),
                            ),
                          ],
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

  // ── Widget champ texte ─────────────────────────────────────────────────────
  Widget _buildField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    required bool focused,
    required ValueChanged<bool> onFocusChange,
    TextInputType keyboardType = TextInputType.text,
    bool obscure = false,
    Widget? suffixIcon,
    String? Function(String?)? validator,
  }) {
    return Focus(
      onFocusChange: onFocusChange,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          boxShadow: focused
              ? [BoxShadow(color: AppColors.goldPrimary.withOpacity(0.2), blurRadius: 12, spreadRadius: 1)]
              : [],
        ),
        child: TextFormField(
          controller: controller,
          obscureText: obscure,
          keyboardType: keyboardType,
          style: const TextStyle(color: AppColors.textPrimary, fontSize: 15),
          validator: validator,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 14),
            prefixIcon: Icon(icon, color: focused ? AppColors.goldPrimary : AppColors.textMuted, size: 20),
            suffixIcon: suffixIcon,
            filled: true,
            fillColor: AppColors.darkCard,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.darkBorder)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.darkBorder)),
            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.goldPrimary, width: 1.5)),
            errorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.error)),
            focusedErrorBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.error, width: 1.5)),
            errorStyle: const TextStyle(color: AppColors.error, fontSize: 12),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          ),
        ),
      ),
    );
  }
}

// ── Bouton doré principal ──────────────────────────────────────────────────
class _GoldButton extends StatelessWidget {
  final String label;
  final bool loading;
  final VoidCallback? onTap;
  const _GoldButton({required this.label, required this.loading, this.onTap});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 54,
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
            : Text(label, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 0.5)),
      ),
    );
  }
}

// ── Bouton Google ──────────────────────────────────────────────────────────
class _GoogleButton extends StatelessWidget {
  final VoidCallback? onTap;
  const _GoogleButton({this.onTap});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 54,
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
            // Icône Google (SVG/image simulée avec Container coloré)
            Container(
              width: 22, height: 22,
              decoration: const BoxDecoration(shape: BoxShape.circle),
              child: Image.network(
                'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg',
                width: 22, height: 22,
                errorBuilder: (_, __, ___) => const Icon(Icons.g_mobiledata_rounded, color: Colors.white, size: 22),
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
