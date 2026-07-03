package com.example.employee.feign;

import com.example.employee.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.math.BigDecimal;

@FeignClient(name = "paie-service", url = "http://localhost:8082", configuration = FeignConfig.class)
public interface PaieServiceClient {

    @GetMapping("/api/paie/salaires/employee/{employeeId}/salaire-base")
    BigDecimal getSalaireBase(@PathVariable Long employeeId);

    @GetMapping("/api/paie/salaires/employee/{employeeId}/exists")
    Boolean checkSalaireExists(@PathVariable Long employeeId);
}