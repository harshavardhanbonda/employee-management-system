package com.example.employee_service.service;

import com.example.employee_service.dto.EmployeeRequest;
import com.example.employee_service.dto.EmployeeResponse;
import com.example.employee_service.entity.Employee;
import com.example.employee_service.exception.ResourceNotFoundException;
import com.example.employee_service.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    //mapping Employee to EmployeeResponse
    public EmployeeResponse mapToResponse(Employee employee) {
        return new EmployeeResponse(employee.getId(),employee.getName(),employee.getEmail(),employee.getDepartment(),employee.getSalary());
    }

    public EmployeeResponse createEmployee(EmployeeRequest request) {
        Employee employee = new Employee(request.name(), request.email(),  request.department(), request.salary());
        Employee savedEmployee = employeeRepository.save(employee);
        return mapToResponse(savedEmployee);
    }

    public List<EmployeeResponse> getAllEmployees() {

        return employeeRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    public EmployeeResponse getById(int id) {
        Employee employee = findEmployeeById(id);

        return mapToResponse(employee);
    }

    private Employee findEmployeeById(int id) {
        return employeeRepository.findById(id).orElseThrow(()->new ResourceNotFoundException("Employee not found with ID: " + id));
    }

    public EmployeeResponse updateEmployee(EmployeeRequest request,int id) {

        Employee employee = findEmployeeById(id);
        employee.setName(request.name());
        employee.setEmail(request.email());
        employee.setDepartment(request.department());
        employee.setSalary(request.salary());
        Employee updatedEmployee = employeeRepository.save(employee);
        return mapToResponse(updatedEmployee);
    }

    public void deleteEmployee(int id) {
        Employee employee = findEmployeeById(id);
        employeeRepository.delete(employee);
    }


}
