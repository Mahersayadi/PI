import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/auth_service.dart';
import '../../models/conge.dart';
import '../../widgets/app_drawer.dart';
import '../../widgets/loading_widget.dart';

class MyCongesScreen extends StatefulWidget {
  const MyCongesScreen({super.key});

  @override
  State<MyCongesScreen> createState() => _MyCongesScreenState();
}

class _MyCongesScreenState extends State<MyCongesScreen> {
  final _authService = AuthService();
  List<Conge> _conges = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadConges();
  }

  Future<int?> _resolveEmployeeId() async {
    final userId = await _authService.getUserId();
    if (userId == null) return null;

    try {
      final dio = await ApiClient.getInstance();
      final response = await dio.get('/employees');
      for (final e in response.data as List) {
        final map = Map<String, dynamic>.from(e as Map);
        if (map['userId'] == userId && map['id'] != null) {
          return (map['id'] as num).toInt();
        }
      }
    } catch (_) {}

    return userId;
  }

  Future<void> _loadConges() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final employeeId = await _resolveEmployeeId();
      if (employeeId == null) {
        setState(() => _error = 'Utilisateur non connecté');
        return;
      }

      final dio = await ApiClient.getInstance();
      final response = await dio.get('/conges/employee/$employeeId');
      final list = (response.data as List)
          .map((e) => Conge.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList();
      setState(() => _conges = list);
    } catch (e) {
      setState(() => _error = 'Impossible de charger les congés');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Color _statutColor(String statut) {
    switch (statut) {
      case 'APPROUVE':
        return Colors.green;
      case 'REFUSE':
        return Colors.red;
      default:
        return Colors.orange;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mes congés'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadConges),
        ],
      ),
      drawer: const AppDrawer(),
      body: _loading
          ? const LoadingWidget()
          : _error != null
              ? Center(child: Text(_error!))
              : _conges.isEmpty
                  ? const Center(child: Text('Aucun congé enregistré'))
                  : RefreshIndicator(
                      onRefresh: _loadConges,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(12),
                        itemCount: _conges.length,
                        itemBuilder: (context, index) {
                          final conge = _conges[index];
                          return Card(
                            child: ListTile(
                              title: Text('${conge.typeConge} — ${conge.statut}'),
                              subtitle: Text(
                                '${conge.dateDebut} → ${conge.dateFin}\n${conge.motif}',
                              ),
                              isThreeLine: true,
                              trailing: Chip(
                                label: Text(
                                  conge.statut,
                                  style: const TextStyle(
                                      color: Colors.white, fontSize: 11),
                                ),
                                backgroundColor: _statutColor(conge.statut),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
