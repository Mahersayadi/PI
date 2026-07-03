package com.example.conge.feign;

import com.example.conge.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "employee-service", url = "http://localhost:8081", configuration = FeignConfig.class)
public interface EmployeeServiceClient {

    @GetMapping("/api/employees/{employeeId}/exists")
    Boolean checkEmployeeExists(@PathVariable Long employeeId);

    @GetMapping("/api/employees/{employeeId}")
    EmployeeInfo getEmployeeInfo(@PathVariable Long employeeId);

    // DTO pour recevoir les infos employé
    class EmployeeInfo {
        private Long id;
        private String firstName;
        private String lastName;
        private String position;

        // Getters et Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getPosition() { return position; }
        public void setPosition(String position) { this.position = position; }

        public String getFullName() {
            return firstName + " " + lastName;
        }
    }
}