import 'package:dio/dio.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/api_client.dart';
import '../../core/auth_service.dart';
import '../../models/job_offer.dart';
import '../../widgets/loading_widget.dart';

class JobApplyScreen extends StatefulWidget {
  final String jobId;

  const JobApplyScreen({super.key, required this.jobId});

  @override
  State<JobApplyScreen> createState() => _JobApplyScreenState();
}

class _JobApplyScreenState extends State<JobApplyScreen> {
  final _coverLetterController = TextEditingController();
  final _authService = AuthService();

  JobOffer? _job;
  PlatformFile? _cvFile;
  bool _loadingJob = true;
  bool _submitting = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadJob();
  }

  @override
  void dispose() {
    _coverLetterController.dispose();
    super.dispose();
  }

  Future<void> _loadJob() async {
    try {
      final dio = await ApiClient.getInstance();
      final response = await dio.get('/jobs/${widget.jobId}');
      setState(() {
        _job = JobOffer.fromJson(
            Map<String, dynamic>.from(response.data as Map));
      });
    } catch (e) {
      setState(() => _error = 'Offre introuvable');
    } finally {
      if (mounted) setState(() => _loadingJob = false);
    }
  }

  Future<void> _pickCv() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'doc', 'docx'],
    );
    if (result != null && result.files.single.size <= 5 * 1024 * 1024) {
      setState(() => _cvFile = result.files.single);
    } else if (result != null) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Fichier trop volumineux (max 5 Mo)')),
        );
      }
    }
  }

  Future<void> _submit() async {
    if (_cvFile == null || _cvFile!.path == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez sélectionner un CV')),
      );
      return;
    }

    final user = await _authService.getUser();
    if (user == null) {
      if (mounted) context.go('/login');
      return;
    }

    setState(() => _submitting = true);

    try {
      final dio = await ApiClient.getInstance();
      final formData = FormData.fromMap({
        'jobOfferId': widget.jobId,
        'candidateUserId': user['id'].toString(),
        'candidateName': user['name']?.toString() ?? '',
        'candidateEmail': user['email']?.toString() ?? '',
        'coverLetter': _coverLetterController.text,
        'cvFile': await MultipartFile.fromFile(
          _cvFile!.path!,
          filename: _cvFile!.name,
        ),
      });

      await dio.post('/applications', data: formData);

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Candidature envoyée avec succès !')),
      );
      context.go('/my-applications');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Erreur lors de l\'envoi')),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loadingJob) {
      return const Scaffold(body: LoadingWidget());
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Postuler')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (_job != null) ...[
              Text(_job!.title,
                  style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 8),
              Text(_job!.description),
              const Divider(height: 32),
            ],
            OutlinedButton.icon(
              onPressed: _pickCv,
              icon: const Icon(Icons.upload_file),
              label: Text(
                _cvFile != null ? _cvFile!.name : 'Sélectionner le CV (PDF/DOC)',
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _coverLetterController,
              maxLines: 6,
              decoration: const InputDecoration(
                labelText: 'Lettre de motivation',
                border: OutlineInputBorder(),
              ),
            ),
            if (_error != null) ...[
              const SizedBox(height: 12),
              Text(_error!, style: const TextStyle(color: Colors.red)),
            ],
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _submitting ? null : _submit,
              child: _submitting
                  ? const SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Envoyer ma candidature'),
            ),
          ],
        ),
      ),
    );
  }
}
