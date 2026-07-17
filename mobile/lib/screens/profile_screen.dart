import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../utils/constants.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;

    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: AppBar(title: const Text('Mon Profil'), backgroundColor: AppColors.darkSurface),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Avatar
            Container(
              width: 80, height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.darkCard,
                border: Border.all(color: AppColors.goldPrimary, width: 2),
              ),
              child: const Icon(Icons.person, color: AppColors.goldPrimary, size: 36),
            ),
            const SizedBox(height: 12),
            Text(user?.displayName ?? '—',
              style: const TextStyle(color: AppColors.textPrimary, fontSize: 20,
                fontFamily: 'Playfair Display', fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.goldPrimary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.goldPrimary.withOpacity(0.3)),
              ),
              child: Text(user?.role ?? '—',
                style: const TextStyle(color: AppColors.goldPrimary, fontSize: 12)),
            ),
            const SizedBox(height: 32),

            // Info card
            _InfoCard(items: [
              _InfoItem(Icons.phone_outlined, 'Téléphone', user?.telephone ?? '—'),
              if (user?.email != null)
                _InfoItem(Icons.email_outlined, 'Email', user!.email!),
            ]),
            const SizedBox(height: 16),

            // Actions
            _ActionTile(icon: Icons.receipt_long_outlined, label: 'Mes réservations',
              onTap: () => context.push('/reservations')),
            _ActionTile(icon: Icons.star_outline, label: 'Programme fidélité',
              onTap: () {}),
            _ActionTile(icon: Icons.notifications_outlined, label: 'Notifications',
              onTap: () {}),
            const SizedBox(height: 24),

            // Logout
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () async {
                  await auth.logout();
                  if (context.mounted) context.go('/connexion');
                },
                icon: const Icon(Icons.logout, color: Colors.red),
                label: const Text('Déconnexion', style: TextStyle(color: Colors.red)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.red),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoItem { final IconData icon; final String label, value;
  const _InfoItem(this.icon, this.label, this.value); }

class _InfoCard extends StatelessWidget {
  final List<_InfoItem> items;
  const _InfoCard({required this.items});
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      color: AppColors.darkCard,
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: AppColors.darkBorder),
    ),
    child: Column(
      children: items.map((item) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(children: [
          Icon(item.icon, color: AppColors.goldPrimary, size: 18),
          const SizedBox(width: 12),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(item.label, style: const TextStyle(color: AppColors.textMuted, fontSize: 11)),
            Text(item.value, style: const TextStyle(color: AppColors.textPrimary, fontSize: 14)),
          ]),
        ]),
      )).toList(),
    ),
  );
}

class _ActionTile extends StatelessWidget {
  final IconData icon; final String label; final VoidCallback onTap;
  const _ActionTile({required this.icon, required this.label, required this.onTap});
  @override
  Widget build(BuildContext context) => ListTile(
    onTap: onTap,
    leading: Icon(icon, color: AppColors.goldPrimary),
    title: Text(label, style: const TextStyle(color: AppColors.textPrimary)),
    trailing: const Icon(Icons.chevron_right, color: AppColors.textMuted),
    tileColor: AppColors.darkCard,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
  );
}
