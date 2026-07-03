import 'package:flutter/material.dart';

import '../../core/api_client.dart';
import '../../core/auth_service.dart';
import '../../models/application.dart';
import '../../widgets/app_drawer.dart';
import '../../widgets/loading_widget.dart';

class MyApplicationsScreen extends StatefulWidget {
  const MyApplicationsScreen({super.key});

  @override
  State<MyApplicationsScreen> createState() => _MyApplicationsScreenState();
}

class _MyApplicationsScreenState extends State<MyApplicationsScreen> {
  final _authService = AuthService();
  List<Application> _applications = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadApplications();
  }

  Future<void> _loadApplications() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final userId = await _authService.getUserId();
      if (userId == null) {
        setState(() => _error = 'Utilisateur non connecté');
        return;
      }

      final dio = await ApiClient.getInstance();
      final response = await dio.get('/applications/candidate/$userId');
      final list = (response.data as List)
          .map((e) => Application.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList();
      setState(() => _applications = list);
    } catch (e) {
      setState(() => _error = 'Impossible de charger les candidatures');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Color _statusColor(String? status) {
    switch (status) {
      case 'ACCEPTED':
        return Colors.green;
      case 'REJECTED':
        return Colors.red;
      case 'INTERVIEW':
        return Colors.blue;
      case 'REVIEWED':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mes candidatures'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadApplications,
          ),
        ],
      ),
      drawer: const AppDrawer(),
      body: _loading
          ? const LoadingWidget()
          : _error != null
              ? Center(child: Text(_error!))
              : _applications.isEmpty
                  ? const Center(child: Text('Aucune candidature pour le moment'))
                  : RefreshIndicator(
                      onRefresh: _loadApplications,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(12),
                        itemCount: _applications.length,
                        itemBuilder: (context, index) {
                          final app = _applications[index];
                          return Card(
                            child: ListTile(
                              title: Text('Offre #${app.jobOfferId}'),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  if (app.coverLetter != null)
                                    Text(app.coverLetter!,
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis),
                                  if (app.hrComment != null)
                                    Text('RH: ${app.hrComment}',
                                        style: const TextStyle(
                                            fontStyle: FontStyle.italic)),
                                ],
                              ),
                              trailing: Chip(
                                label: Text(
                                  app.status ?? 'PENDING',
                                  style: const TextStyle(
                                      color: Colors.white, fontSize: 11),
                                ),
                                backgroundColor: _statusColor(app.status),
                              ),
                              isThreeLine: true,
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
