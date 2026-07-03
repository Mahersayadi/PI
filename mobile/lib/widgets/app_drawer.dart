import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../core/auth_service.dart';
import '../models/user.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  Future<User?> _loadUser() async {
    final data = await AuthService().getUser();
    if (data == null) return null;
    return User.fromJson(data);
  }

  Future<void> _logout(BuildContext context) async {
    await AuthService().logout();
    if (context.mounted) context.go('/login');
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: FutureBuilder<User?>(
        future: _loadUser(),
        builder: (context, snapshot) {
          final user = snapshot.data;
          return ListView(
            padding: EdgeInsets.zero,
            children: [
              UserAccountsDrawerHeader(
                accountName: Text(user?.name ?? 'Utilisateur'),
                accountEmail: Text(user?.email ?? ''),
                currentAccountPicture: CircleAvatar(
                  backgroundColor: Colors.white,
                  child: Text(
                    (user?.name.isNotEmpty == true)
                        ? user!.name[0].toUpperCase()
                        : '?',
                    style: const TextStyle(
                      fontSize: 24,
                      color: Color(0xFF3F51B5),
                    ),
                  ),
                ),
                decoration: const BoxDecoration(color: Color(0xFF3F51B5)),
              ),
              if (user?.isCandidate == true || user?.isAdmin == true) ...[
                ListTile(
                  leading: const Icon(Icons.work_outline),
                  title: const Text('Offres d\'emploi'),
                  onTap: () {
                    Navigator.pop(context);
                    context.go('/jobs');
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.assignment_ind),
                  title: const Text('Mes candidatures'),
                  onTap: () {
                    Navigator.pop(context);
                    context.go('/my-applications');
                  },
                ),
              ],
              if (user?.isEmployee == true ||
                  user?.isRhManager == true ||
                  user?.isAdmin == true) ...[
                ListTile(
                  leading: const Icon(Icons.person_outline),
                  title: const Text('Mon profil'),
                  onTap: () {
                    Navigator.pop(context);
                    context.go('/profile');
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.beach_access),
                  title: const Text('Demander un congé'),
                  onTap: () {
                    Navigator.pop(context);
                    context.go('/conges');
                  },
                ),
                ListTile(
                  leading: const Icon(Icons.event_note),
                  title: const Text('Mes congés'),
                  onTap: () {
                    Navigator.pop(context);
                    context.go('/my-conges');
                  },
                ),
              ],
              ListTile(
                leading: const Icon(Icons.smart_toy_outlined),
                title: const Text('Assistant RH (IA)'),
                onTap: () {
                  Navigator.pop(context);
                  context.go('/chatbot');
                },
              ),
              const Divider(),
              ListTile(
                leading: const Icon(Icons.logout),
                title: const Text('Déconnexion'),
                onTap: () => _logout(context),
              ),
            ],
          );
        },
      ),
    );
  }
}
