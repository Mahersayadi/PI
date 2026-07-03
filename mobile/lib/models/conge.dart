class Conge {
  final int? id;
  final int employeeId;
  final String? employeeNom;
  final String typeConge;
  final String dateDebut;
  final String dateFin;
  final String motif;
  final String statut;
  final String? commentaireResponsable;
  final int? nombreJours;

  const Conge({
    this.id,
    required this.employeeId,
    this.employeeNom,
    required this.typeConge,
    required this.dateDebut,
    required this.dateFin,
    required this.motif,
    required this.statut,
    this.commentaireResponsable,
    this.nombreJours,
  });

  factory Conge.fromJson(Map<String, dynamic> json) {
    return Conge(
      id: json['id'] != null ? (json['id'] as num).toInt() : null,
      employeeId: (json['employeeId'] as num).toInt(),
      employeeNom: json['employeeNom']?.toString(),
      typeConge: json['typeConge']?.toString() ?? '',
      dateDebut: json['dateDebut']?.toString() ?? '',
      dateFin: json['dateFin']?.toString() ?? '',
      motif: json['motif']?.toString() ?? '',
      statut: json['statut']?.toString() ?? 'EN_ATTENTE',
      commentaireResponsable: json['commentaireResponsable']?.toString(),
      nombreJours: json['nombreJours'] != null
          ? (json['nombreJours'] as num).toInt()
          : null,
    );
  }

  Map<String, dynamic> toRequestJson() => {
        'employeeId': employeeId,
        'typeConge': typeConge,
        'dateDebut': dateDebut,
        'dateFin': dateFin,
        'motif': motif,
      };
}
