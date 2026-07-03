package com.example.authservice.dto;

import com.example.authservice.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;     // V1: "no-token" ; V2 (JWT): vrai token
    private Long id;
    private String name;
    private String email;
    private Role role;
}