package com.example.gatewayserver.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthFilterGatewayFilterFactory extends AbstractGatewayFilterFactory<Object> {

    private final JwtAuthFilter jwtAuthFilter;

    public JwtAuthFilterGatewayFilterFactory(JwtAuthFilter jwtAuthFilter) {
        super(Object.class);
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Override
    public GatewayFilter apply(Object config) {
        return jwtAuthFilter;
    }
}
