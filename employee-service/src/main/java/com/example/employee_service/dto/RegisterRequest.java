package com.example.employee_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotNull
        @Email
        String email,
        @NotNull
        @Size(min = 8,max=72)
        String password

) {
}
