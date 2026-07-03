class JobOffer {
  final int? id;
  final String title;
  final String description;
  final String? location;
  final String? contractType;
  final String? requiredSkills;
  final int? experienceYears;
  final String? salaryRange;
  final String? status;
  final int? departmentId;
  final String? deadline;

  const JobOffer({
    this.id,
    required this.title,
    required this.description,
    this.location,
    this.contractType,
    this.requiredSkills,
    this.experienceYears,
    this.salaryRange,
    this.status,
    this.departmentId,
    this.deadline,
  });

  factory JobOffer.fromJson(Map<String, dynamic> json) {
    return JobOffer(
      id: json['id'] != null ? (json['id'] as num).toInt() : null,
      title: json['title']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      location: json['location']?.toString(),
      contractType: json['contractType']?.toString(),
      requiredSkills: json['requiredSkills']?.toString(),
      experienceYears: json['experienceYears'] != null
          ? (json['experienceYears'] as num).toInt()
          : null,
      salaryRange: json['salaryRange']?.toString(),
      status: json['status']?.toString(),
      departmentId: json['departmentId'] != null
          ? (json['departmentId'] as num).toInt()
          : null,
      deadline: json['deadline']?.toString(),
    );
  }
}
