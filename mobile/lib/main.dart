import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'core/auth_service.dart';
import 'screens/auth/forgot_password_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/candidate/my_applications_screen.dart';
import 'screens/chatbot/chatbot_screen.dart';
import 'screens/employee/conge_screen.dart';
import 'screens/employee/my_conges_screen.dart';
import 'screens/employee/profile_screen.dart';
import 'screens/jobs/job_apply_screen.dart';
import 'screens/jobs/job_list_screen.dart';

void main() {
  runApp(const SmartTalentApp());
}

final _router = GoRouter(
  initialLocation: '/login',
  redirect: (context, state) async {
    final isLoggedIn = await AuthService().isLoggedIn();
    final isAuthRoute = state.matchedLocation == '/login' ||
        state.matchedLocation == '/forgot-password';

    if (!isLoggedIn && !isAuthRoute) return '/login';
    return null;
  },
  routes: [
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    GoRoute(
      path: '/forgot-password',
      builder: (_, __) => const ForgotPasswordScreen(),
    ),
    GoRoute(path: '/jobs', builder: (_, __) => const JobListScreen()),
    GoRoute(
      path: '/jobs/apply/:id',
      builder: (_, state) =>
          JobApplyScreen(jobId: state.pathParameters['id']!),
    ),
    GoRoute(
      path: '/my-applications',
      builder: (_, __) => const MyApplicationsScreen(),
    ),
    GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
    GoRoute(path: '/conges', builder: (_, __) => const CongeScreen()),
    GoRoute(path: '/my-conges', builder: (_, __) => const MyCongesScreen()),
    GoRoute(path: '/chatbot', builder: (_, __) => const ChatbotScreen()),
  ],
);

class SmartTalentApp extends StatelessWidget {
  const SmartTalentApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'SmartTalent AI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF3F51B5)),
        useMaterial3: true,
      ),
      routerConfig: _router,
    );
  }
}
