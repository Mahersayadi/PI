package com.example.notification.feign;

import com.example.notification.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.Map;

@FeignClient(name = "employee-service", url = "http://localhost:8081/api/employees", configuration = FeignConfig.class)
public interface EmployeeServiceClient {

    @GetMapping("/{id}")
    Map<String, Object> getEmployeeById(@PathVariable Long id);
}
