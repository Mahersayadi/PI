import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/auth_service.dart';
import '../../models/user.dart';
import '../../widgets/app_drawer.dart';
import '../../widgets/loading_widget.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _authService = AuthService();
  User? _user;
  Map<String, dynamic>? _employee;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final userData = await _authService.fetchCurrentUser();
      final user = User.fromJson(userData);

      Map<String, dynamic>? employee;
      try {
        final dio = await ApiClient.getInstance();
        final response = await dio.get('/employees');
        final employees = response.data as List;
        for (final e in employees) {
          final map = Map<String, dynamic>.from(e as Map);
          if (map['userId'] == user.id) {
            employee = map;
            break;
          }
        }
      } catch (_) {
        // Employee record optional
      }

      setState(() {
        _user = user;
        _employee = employee;
      });
    } catch (e) {
      final cached = await _authService.getUser();
      if (cached != null) {
        setState(() => _user = User.fromJson(cached));
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Widget _infoTile(IconData icon, String label, String value) {
    return ListTile(
      leading: Icon(icon, color: const Color(0xFF3F51B5)),
      title: Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      subtitle: Text(value, style: const TextStyle(fontSize: 16)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mon profil'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadProfile),
        ],
      ),
      drawer: const AppDrawer(),
      body: _loading
          ? const LoadingWidget()
          : _user == null
              ? const Center(child: Text('Profil introuvable'))
              : RefreshIndicator(
                  onRefresh: _loadProfile,
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      CircleAvatar(
                        radius: 48,
                        backgroundColor: const Color(0xFF3F51B5),
                        child: Text(
                          _user!.name.isNotEmpty
                              ? _user!.name[0].toUpperCase()
                              : '?',
                          style: const TextStyle(
                              fontSize: 36, color: Colors.white),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Center(
                        child: Text(
                          _user!.name,
                          style: Theme.of(context).textTheme.headlineSmall,
                        ),
                      ),
                      Center(
                        child: Chip(label: Text(_user!.role)),
                      ),
                      const SizedBox(height: 24),
                      Card(
                        child: Column(
                          children: [
                            _infoTile(Icons.email, 'Email', _user!.email),
                            _infoTile(
                                Icons.badge, 'ID utilisateur', '${_user!.id}'),
                            if (_employee != null) ...[
                              const Divider(),
                              _infoTile(
                                Icons.work,
                                'Poste',
                                _employee!['position']?.toString() ?? '-',
                              ),
                              _infoTile(
                                Icons.phone,
                                'Téléphone',
                                _employee!['phone']?.toString() ?? '-',
                              ),
                              _infoTile(
                                Icons.location_on,
                                'Adresse',
                                _employee!['address']?.toString() ?? '-',
                              ),
                            ],
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }
}
