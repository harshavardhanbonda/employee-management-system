package com.example.employee_service.dto;

import jakarta.validation.constraints.*;

public record EmployeeRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 100)
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        @Size(max = 255)
        String email,

        @NotBlank(message = "Department is required")
        String department,

        @NotNull(message = "Salary is required")
        @PositiveOrZero(message = "Salary cannot be negative")
        Double salary
) {

}
