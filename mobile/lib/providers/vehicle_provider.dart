import 'package:flutter/material.dart';
import '../models/vehicle_model.dart';
import '../services/api_service.dart';
import '../utils/constants.dart';

class VehicleProvider extends ChangeNotifier {
  List<VehicleModel> _vehicles  = [];
  VehicleModel?      _selected;
  bool               _loading   = false;
  String?            _error;

  List<VehicleModel> get vehicles => _vehicles;
  VehicleModel?      get selected => _selected;
  bool               get loading  => _loading;
  String?            get error    => _error;

  final _api = ApiService();

  Future<void> fetchVehicles({String? service, String? marque}) async {
    _loading = true; _error = null; notifyListeners();
    try {
      final params = <String, dynamic>{};
      if (service != null) params['service'] = service;
      if (marque  != null) params['marque']  = marque;
      final res = await _api.get(AppEndpoints.vehicules, params: params);
      _vehicles = (res.data as List)
          .map((e) => VehicleModel.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false; notifyListeners();
    }
  }

  Future<void> fetchVehicle(String id) async {
    _loading = true; _error = null; notifyListeners();
    try {
      final res = await _api.get('${AppEndpoints.vehicules}/$id');
      _selected = VehicleModel.fromJson(res.data as Map<String, dynamic>);
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false; notifyListeners();
    }
  }

  void clearSelected() { _selected = null; notifyListeners(); }

  List<VehicleModel> get forLocation  => _vehicles.where((v) => v.disponibleLocation).toList();
  List<VehicleModel> get forSale      => _vehicles.where((v) => v.disponibleVente).toList();
  List<VehicleModel> get forChauffeur => _vehicles.where((v) => v.disponibleChauffeur).toList();
}
