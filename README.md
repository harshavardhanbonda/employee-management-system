# Employee Management System

A full-stack Employee Management System built with React, Spring Boot, PostgreSQL, and JWT authentication.

## Tech Stack

**Frontend**
- React
- JavaScript
- CSS
- React Router

**Backend**
- Java
- Spring Boot
- Spring Data JPA
- Spring Security and JWT

**Database**
- PostgreSQL

## Features

- User registration and login
- JWT-based authentication
- Protected dashboard route
- View employees
- Add new employees
- Update employee details
- Delete employees
- Sort employees by ID
- Employee dashboard with summary statistics

## Project Structure

```text
employee-management-system/
├── employee-frontend/
└── employee-service/
```

## Prerequisites

- Node.js and npm
- Java and Gradle
- PostgreSQL

## Setup

### 1. Backend

Configure your database connection and JWT signing secret using environment variables. Do not commit actual credentials.

From the backend directory, run:

```bash
./gradlew bootRun
```

On Windows, use:

```powershell
.\gradlew.bat bootRun
```

### 2. Frontend

From the frontend directory, install dependencies and start the development server:

```bash
npm install
npm run dev
```

### 3. Access the application

Open the local URL printed by Vite in your terminal.

## Security

Never commit database passwords, JWT signing secrets, or other sensitive credentials to source control.

## Author

Created as a full-stack learning project.
