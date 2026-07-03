class Application {
  final int? id;
  final int jobOfferId;
  final int candidateUserId;
  final String? candidateName;
  final String? candidateEmail;
  final String? cvFilePath;
  final String? coverLetter;
  final String? status;
  final int? aiScore;
  final String? hrComment;
  final String? interviewDate;
  final String? createdAt;

  const Application({
    this.id,
    required this.jobOfferId,
    required this.candidateUserId,
    this.candidateName,
    this.candidateEmail,
    this.cvFilePath,
    this.coverLetter,
    this.status,
    this.aiScore,
    this.hrComment,
    this.interviewDate,
    this.createdAt,
  });

  factory Application.fromJson(Map<String, dynamic> json) {
    return Application(
      id: json['id'] != null ? (json['id'] as num).toInt() : null,
      jobOfferId: (json['jobOfferId'] as num).toInt(),
      candidateUserId: (json['candidateUserId'] as num).toInt(),
      candidateName: json['candidateName']?.toString(),
      candidateEmail: json['candidateEmail']?.toString(),
      cvFilePath: json['cvFilePath']?.toString(),
      coverLetter: json['coverLetter']?.toString(),
      status: json['status']?.toString(),
      aiScore:
          json['aiScore'] != null ? (json['aiScore'] as num).toInt() : null,
      hrComment: json['hrComment']?.toString(),
      interviewDate: json['interviewDate']?.toString(),
      createdAt: json['createdAt']?.toString(),
    );
  }
}
