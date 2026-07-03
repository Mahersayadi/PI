package com.example.authservice;

import com.example.authservice.model.Role;
import com.example.authservice.model.User;
import com.example.authservice.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }

    // 🌟 Création d’un administrateur par défaut au démarrage
    @Bean
    CommandLineRunner seed(UserRepository repo) {
        return args -> {
            if (!repo.existsByEmail("admin@rh.com")) {
                var enc = new BCryptPasswordEncoder();
                var admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@rh.com");
                admin.setPassword(enc.encode("admin123"));
                admin.setRole(Role.ADMIN);
                repo.save(admin);
                System.out.println("✅ Admin par défaut créé : admin@rh.com / admin123");
            } else {
                System.out.println("ℹ️ Admin existe déjà, aucun ajout effectué.");
            }
        };
    }
}
