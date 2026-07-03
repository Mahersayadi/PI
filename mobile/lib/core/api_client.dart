import 'package:dio/dio.dart';

import 'auth_service.dart';
import 'constants.dart';

class ApiClient {
  static Dio? _dio;
  static final AuthService _authService = AuthService();

  static Future<Dio> getInstance() async {
    if (_dio == null) {
      _dio = Dio(BaseOptions(
        baseUrl: AppConstants.baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 30),
        headers: {'Content-Type': 'application/json'},
      ));

      _dio!.interceptors.add(InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _authService.getToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            await _authService.logout();
          }
          handler.next(error);
        },
      ));
    }
    return _dio!;
  }
}
