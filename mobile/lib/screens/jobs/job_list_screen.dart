import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/api_client.dart';
import '../../models/job_offer.dart';
import '../../widgets/app_drawer.dart';
import '../../widgets/loading_widget.dart';

class JobListScreen extends StatefulWidget {
  const JobListScreen({super.key});

  @override
  State<JobListScreen> createState() => _JobListScreenState();
}

class _JobListScreenState extends State<JobListScreen> {
  List<JobOffer> _jobs = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadJobs();
  }

  Future<void> _loadJobs() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final dio = await ApiClient.getInstance();
      final response = await dio.get('/jobs');
      final list = (response.data as List)
          .map((e) => JobOffer.fromJson(Map<String, dynamic>.from(e as Map)))
          .toList();
      setState(() => _jobs = list);
    } catch (e) {
      setState(() => _error = 'Impossible de charger les offres');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Offres d\'emploi'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadJobs,
          ),
        ],
      ),
      drawer: const AppDrawer(),
      body: _loading
          ? const LoadingWidget(message: 'Chargement des offres...')
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(_error!),
                      const SizedBox(height: 12),
                      FilledButton(
                        onPressed: _loadJobs,
                        child: const Text('Réessayer'),
                      ),
                    ],
                  ),
                )
              : _jobs.isEmpty
                  ? const Center(child: Text('Aucune offre disponible'))
                  : RefreshIndicator(
                      onRefresh: _loadJobs,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(12),
                        itemCount: _jobs.length,
                        itemBuilder: (context, index) {
                          final job = _jobs[index];
                          return Card(
                            child: ListTile(
                              title: Text(job.title,
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold)),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  if (job.location != null)
                                    Text('📍 ${job.location}'),
                                  if (job.contractType != null)
                                    Text('📄 ${job.contractType}'),
                                  const SizedBox(height: 4),
                                  Text(
                                    job.description,
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                              isThreeLine: true,
                              trailing: const Icon(Icons.chevron_right),
                              onTap: () =>
                                  context.push('/jobs/apply/${job.id}'),
                            ),
                          );
                        },
                      ),
                    ),
    );
  }
}
