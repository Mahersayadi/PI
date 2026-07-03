import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/api_client.dart';
import '../../core/auth_service.dart';
import '../../widgets/app_drawer.dart';

class CongeScreen extends StatefulWidget {
  const CongeScreen({super.key});

  @override
  State<CongeScreen> createState() => _CongeScreenState();
}

class _CongeScreenState extends State<CongeScreen> {
  final _formKey = GlobalKey<FormState>();
  final _motifController = TextEditingController();
  final _authService = AuthService();

  String _typeConge = 'ANNUEL';
  DateTime? _dateDebut;
  DateTime? _dateFin;
  bool _submitting = false;

  final _types = ['ANNUEL', 'MALADIE', 'MATERNITE', 'SANS_SOLDE', 'AUTRE'];

  @override
  void dispose() {
    _motifController.dispose();
    super.dispose();
  }

  Future<void> _pickDate(bool isStart) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) {
      setState(() {
        if (isStart) {
          _dateDebut = picked;
        } else {
          _dateFin = picked;
        }
      });
    }
  }

  String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
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

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_dateDebut == null || _dateFin == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Veuillez sélectionner les dates')),
      );
      return;
    }

    setState(() => _submitting = true);

    try {
      final employeeId = await _resolveEmployeeId();
      if (employeeId == null) throw Exception('Employee not found');

      final dio = await ApiClient.getInstance();
      await dio.post('/conges/demander', data: {
        'employeeId': employeeId,
        'typeConge': _typeConge,
        'dateDebut': _formatDate(_dateDebut!),
        'dateFin': _formatDate(_dateFin!),
        'motif': _motifController.text,
      });

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Demande de congé envoyée !')),
      );
      context.go('/my-conges');
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Erreur lors de la demande')),
        );
      }
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Demander un congé')),
      drawer: const AppDrawer(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              DropdownButtonFormField<String>(
                value: _typeConge,
                decoration: const InputDecoration(
                  labelText: 'Type de congé',
                  border: OutlineInputBorder(),
                ),
                items: _types
                    .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                    .toList(),
                onChanged: (v) => setState(() => _typeConge = v!),
              ),
              const SizedBox(height: 16),
              ListTile(
                title: const Text('Date de début'),
                subtitle: Text(_dateDebut != null
                    ? _formatDate(_dateDebut!)
                    : 'Sélectionner'),
                trailing: const Icon(Icons.calendar_today),
                onTap: () => _pickDate(true),
                shape: RoundedRectangleBorder(
                  side: const BorderSide(color: Colors.grey),
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              const SizedBox(height: 12),
              ListTile(
                title: const Text('Date de fin'),
                subtitle: Text(
                    _dateFin != null ? _formatDate(_dateFin!) : 'Sélectionner'),
                trailing: const Icon(Icons.calendar_today),
                onTap: () => _pickDate(false),
                shape: RoundedRectangleBorder(
                  side: const BorderSide(color: Colors.grey),
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _motifController,
                maxLines: 4,
                decoration: const InputDecoration(
                  labelText: 'Motif',
                  border: OutlineInputBorder(),
                ),
                validator: (v) =>
                    v != null && v.isNotEmpty ? null : 'Motif requis',
              ),
              const SizedBox(height: 24),
              FilledButton(
                onPressed: _submitting ? null : _submit,
                child: _submitting
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Text('Envoyer la demande'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
