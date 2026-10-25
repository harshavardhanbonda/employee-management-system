package com.example.employee_service.dto;

public record EmployeeResponse(
        Integer id,
        String name,
        String email,
        String department,
        Double salary
) {
}
