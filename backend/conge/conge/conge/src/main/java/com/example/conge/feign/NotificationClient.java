package com.example.conge.feign;

import com.example.conge.dto.NotificationRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "notification-service", url = "http://localhost:8084/api/notifications")
public interface NotificationClient {

    @PostMapping
    void sendNotification(NotificationRequestDTO request);
}
