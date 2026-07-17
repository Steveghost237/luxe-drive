import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/user_model.dart';
import '../services/api_service.dart';
import '../utils/constants.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? _user;
  String?    _token;
  bool       _loading = false;
  String?    _error;

  UserModel? get user            => _user;
  String?    get token           => _token;
  bool       get loading         => _loading;
  String?    get error           => _error;
  bool       get isAuthenticated => _user != null && _token != null;
  bool       get isAdmin         => _user?.role == 'admin' || _user?.role == 'super_admin';

  final _api = ApiService();

  // ─── Persistance session ──────────────────────────────────────────────────

  Future<void> loadFromStorage() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString(AppConstants.kTokenKey);
    final userJson = prefs.getString(AppConstants.kUserKey);
    if (userJson != null) {
      try {
        _user = UserModel.fromJson(jsonDecode(userJson));
      } catch (_) {}
    }
    notifyListeners();
  }

  Future<void> _saveSession(Map<String, dynamic> data) async {
    _token = data['access_token'] as String;
    _user  = UserModel.fromJson(data['utilisateur'] as Map<String, dynamic>);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(AppConstants.kTokenKey, _token!);
    await prefs.setString(AppConstants.kRefreshTokenKey, data['refresh_token'] as String? ?? '');
    await prefs.setString(AppConstants.kUserKey, jsonEncode(_user!.toJson()));
  }

  // ─── Connexion (email ou téléphone + mot de passe) ────────────────────────

  Future<bool> login(String identifiant, String motDePasse) async {
    _loading = true; _error = null; notifyListeners();
    try {
      final res = await _api.post(
        AppEndpoints.login,
        data: {'identifiant': identifiant, 'mot_de_passe': motDePasse},
      );
      await _saveSession(res.data as Map<String, dynamic>);
      notifyListeners();
      return true;
    } catch (e) {
      _error = _extractError(e);
      return false;
    } finally {
      _loading = false; notifyListeners();
    }
  }

  // ─── Inscription ──────────────────────────────────────────────────────────

  Future<bool> register({
    required String telephone,
    required String motDePasse,
    String? prenom,
    String? nom,
    String? email,
    String role = 'client',
  }) async {
    _loading = true; _error = null; notifyListeners();
    try {
      final res = await _api.post(
        AppEndpoints.register,
        data: {
          'telephone': telephone,
          'mot_de_passe': motDePasse,
          'prenom': prenom,
          'nom': nom,
          'email': email,
          'role': role,
        },
      );
      await _saveSession(res.data as Map<String, dynamic>);
      notifyListeners();
      return true;
    } catch (e) {
      _error = _extractError(e);
      return false;
    } finally {
      _loading = false; notifyListeners();
    }
  }

  // ─── Déconnexion ──────────────────────────────────────────────────────────

  Future<void> logout() async {
    _user = null; _token = null; _error = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConstants.kTokenKey);
    await prefs.remove(AppConstants.kRefreshTokenKey);
    await prefs.remove(AppConstants.kUserKey);
    notifyListeners();
  }

  // ─── Helper extraction erreur Dio ─────────────────────────────────────────

  String _extractError(Object e) {
    final str = e.toString();
    final match = RegExp(r'"detail":"([^"]+)"').firstMatch(str);
    if (match != null) return match.group(1)!;
    if (str.contains('401')) return 'Identifiant ou mot de passe incorrect';
    if (str.contains('400')) return 'Données invalides — vérifiez vos informations';
    if (str.contains('SocketException') || str.contains('ConnectTimeout')) {
      return 'Impossible de joindre le serveur — vérifiez votre connexion';
    }
    return 'Une erreur est survenue. Réessayez.';
  }
}
