import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'constants.dart';

class AuthService {
  static const _tokenKey = 'token';
  static const _userKey = 'user';

  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  Future<void> saveUser(Map<String, dynamic> user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_userKey, jsonEncode(user));
  }

  Future<Map<String, dynamic>?> getUser() async {
    final prefs = await SharedPreferences.getInstance();
    final str = prefs.getString(_userKey);
    if (str == null) return null;
    return jsonDecode(str) as Map<String, dynamic>;
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
  }

  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  Future<String?> getUserRole() async {
    final user = await getUser();
    return user?['role']?.toString();
  }

  Future<int?> getUserId() async {
    final user = await getUser();
    final id = user?['id'];
    if (id is int) return id;
    if (id is num) return id.toInt();
    return null;
  }

  /// POST /auth/login
  Future<Map<String, dynamic>> login(String email, String password) async {
    final dio = Dio(BaseOptions(baseUrl: AppConstants.baseUrl));
    final response = await dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });

    final data = Map<String, dynamic>.from(response.data as Map);
    final token = data['token'] as String?;
    if (token == null || token.isEmpty) {
      throw Exception('Token manquant dans la réponse');
    }

    await saveToken(token);
    await saveUser({
      'id': data['id'],
      'name': data['name'],
      'email': data['email'],
      'role': data['role']?.toString(),
    });

    return data;
  }

  /// POST /auth/forgot-password
  Future<void> forgotPassword(String email) async {
    final dio = Dio(BaseOptions(baseUrl: AppConstants.baseUrl));
    await dio.post('/auth/forgot-password', data: {'email': email});
  }

  /// GET /auth/me
  Future<Map<String, dynamic>> fetchCurrentUser() async {
    final dio = Dio(BaseOptions(baseUrl: AppConstants.baseUrl));
    final token = await getToken();
    final response = await dio.get(
      '/auth/me',
      options: Options(headers: {'Authorization': 'Bearer $token'}),
    );
    final data = Map<String, dynamic>.from(response.data as Map);
    await saveUser(data);
    return data;
  }
}
