import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:go_router/go_router.dart';
import 'package:shimmer/shimmer.dart';
import '../models/vehicle_model.dart';
import '../utils/constants.dart';

class VehicleCard extends StatelessWidget {
  final VehicleModel vehicle;
  const VehicleCard({super.key, required this.vehicle});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/vehicule/${vehicle.id}'),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.darkCard,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.darkBorder),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
              child: SizedBox(
                height: 110,
                width: double.infinity,
                child: vehicle.firstImage != null
                    ? CachedNetworkImage(
                        imageUrl: vehicle.firstImage!,
                        fit: BoxFit.cover,
                        placeholder: (ctx, _) => Shimmer.fromColors(
                          baseColor: AppColors.darkBorder,
                          highlightColor: AppColors.darkCard,
                          child: Container(color: AppColors.darkBorder),
                        ),
                        errorWidget: (ctx, _, __) => const _PlaceholderImage(),
                      )
                    : const _PlaceholderImage(),
              ),
            ),

            // Info
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    vehicle.marque.toUpperCase(),
                    style: const TextStyle(
                      color: AppColors.goldPrimary,
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    vehicle.nom,
                    style: const TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 6),
                  if (vehicle.prixLocationJour != null)
                    Text(
                      '${vehicle.prixLocationJour!.toStringAsFixed(0)} XOF/j',
                      style: const TextStyle(color: AppColors.goldPrimary, fontSize: 12, fontWeight: FontWeight.bold),
                    )
                  else if (vehicle.prixVente != null)
                    Text(
                      '${vehicle.prixVente!.toStringAsFixed(0)} XOF',
                      style: const TextStyle(color: AppColors.goldPrimary, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PlaceholderImage extends StatelessWidget {
  const _PlaceholderImage();
  @override
  Widget build(BuildContext context) => Container(
    color: AppColors.darkSurface,
    child: const Center(
      child: Icon(Icons.directions_car, color: AppColors.darkBorder, size: 36),
    ),
  );
}
