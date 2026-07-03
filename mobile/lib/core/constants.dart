class AppConstants {
  /// Host machine IP as seen from Android emulator (never use localhost).
  static const String gatewayHost = 'http://10.0.2.2:8222';
  static const String baseUrl = '$gatewayHost/api';

  static const String authUrl = '$baseUrl/auth';
  static const String jobsUrl = '$baseUrl/jobs';
  static const String applicationsUrl = '$baseUrl/applications';
  static const String congesUrl = '$baseUrl/conges';
  static const String employeesUrl = '$baseUrl/employees';
  static const String aiUrl = '$baseUrl/ai';
}
