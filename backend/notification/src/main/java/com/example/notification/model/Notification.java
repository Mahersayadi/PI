package com.example.notification.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long employeeId;

    @Column(nullable = false)
    private String type; // Exemple: "CONGE", "PAIE", "EMPLOYEE_UPDATE"

    @Column(nullable = false)
    private String message;

    private String status = "UNREAD"; // "UNREAD" ou "READ"

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public void setUpdatedAt(LocalDateTime now) {
    }
}