package com.example.employee_service.dto;

public record AuthResponse(
        String accessToken,
        String tokenType
) {}
