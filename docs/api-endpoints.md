# API Endpoints Specification & Catalog

This document details all API endpoints available in the **Automated API Testing Suite** demo application, including authentication requirements, request parameters, payload structures, expected status codes, and response structures.

---

## 1. System Health & Discovery

### `GET /health`
* **Purpose**: Health check endpoint to verify service uptime, status, and environment readiness.
* **Authentication**: None (Public)
* **Request Headers**: None
* **Request Body**: None
* **Expected Success Status**: `200 OK`
* **Response Body Example**:
  ```json
  {
    "status": "UP",
    "service": "Automated API Testing Suite - Demo Backend",
    "version": "1.0.0",
    "timestamp": "2026-08-31T05:57:00.123Z",
    "uptime": "142s",
    "startedAt": "2026-08-31T05:54:38.123Z"
  }
  ```

---

## 2. Authentication

### `POST /api/auth/login`
* **Purpose**: Authenticates credentials and issues a JWT Bearer token for accessing protected routes.
* **Authentication**: None (Public)
* **Request Headers**: `Content-Type: application/json`
* **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
* **Success Status**: `200 OK`
* **Success Response Body**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": "24h",
    "user": {
      "id": 1,
      "name": "Arya Patil",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
  ```
* **Error Statuses**:
  * `400 Bad Request`: When email or password is missing.
  * `401 Unauthorized`: When credentials do not match registered users.

---

## 3. Users Resource (CRUD Operations)

### `GET /api/users`
* **Purpose**: Retrieves a list of users with optional filtering parameters.
* **Authentication**: None (Public)
* **Query Parameters**:
  * `role` (optional, string): Filter by role (`admin`, `developer`, `qa_engineer`, `manager`, `user`).
  * `status` (optional, string): Filter by status (`active`, `inactive`).
  * `search` (optional, string): Filter by name or email substring.
* **Expected Success Status**: `200 OK`
* **Response Body Example**:
  ```json
  {
    "total": 3,
    "users": [
      {
        "id": 1,
        "name": "Arya Patil",
        "email": "arya.patil@example.com",
        "role": "admin",
        "status": "active",
        "createdAt": "2026-01-15T08:30:00.000Z",
        "updatedAt": "2026-01-15T08:30:00.000Z"
      }
    ]
  }
  ```

---

### `GET /api/users/:id`
* **Purpose**: Retrieves a single user record by its numerical ID.
* **Authentication**: None (Public)
* **Path Parameters**: `id` (integer, required)
* **Success Status**: `200 OK`
* **Success Response Body**:
  ```json
  {
    "id": 1,
    "name": "Arya Patil",
    "email": "arya.patil@example.com",
    "role": "admin",
    "status": "active",
    "createdAt": "2026-01-15T08:30:00.000Z",
    "updatedAt": "2026-01-15T08:30:00.000Z"
  }
  ```
* **Error Statuses**:
  * `400 Bad Request`: If `:id` is not a positive integer (e.g. `invalid-id-xyz`).
  * `404 Not Found`: If user with the given `:id` does not exist.

---

### `POST /api/users`
* **Purpose**: Creates a new user record.
* **Authentication**: None (Public)
* **Request Headers**: `Content-Type: application/json`
* **Request Body Fields**:
  * `name` (string, required): User's full name.
  * `email` (string, required): Unique valid email address.
  * `role` (string, optional): One of `admin`, `developer`, `qa_engineer`, `user`, `manager` (default: `user`).
  * `status` (string, optional): `active` or `inactive` (default: `active`).
* **Request Body Example**:
  ```json
  {
    "name": "Automation Test User",
    "email": "qa.engineer.1772431000@example.com",
    "role": "qa_engineer",
    "status": "active"
  }
  ```
* **Success Status**: `201 Created`
* **Success Response Body**:
  ```json
  {
    "id": 4,
    "name": "Automation Test User",
    "email": "qa.engineer.1772431000@example.com",
    "role": "qa_engineer",
    "status": "active",
    "createdAt": "2026-08-31T05:57:02.123Z",
    "updatedAt": "2026-08-31T05:57:02.123Z"
  }
  ```
* **Error Statuses**:
  * `400 Bad Request`: When required fields are missing, email format is invalid, or email already exists.

---

### `PUT /api/users/:id`
* **Purpose**: Updates details of an existing user by ID.
* **Authentication**: None (Public)
* **Path Parameters**: `id` (integer, required)
* **Request Body Example**:
  ```json
  {
    "name": "Automation Test User - Updated",
    "role": "developer",
    "status": "active"
  }
  ```
* **Success Status**: `200 OK`
* **Success Response Body**:
  ```json
  {
    "id": 4,
    "name": "Automation Test User - Updated",
    "email": "qa.engineer.1772431000@example.com",
    "role": "developer",
    "status": "active",
    "createdAt": "2026-08-31T05:57:02.123Z",
    "updatedAt": "2026-08-31T05:57:03.456Z"
  }
  ```
* **Error Statuses**:
  * `400 Bad Request`: If `:id` is invalid or updated email format is invalid.
  * `404 Not Found`: If user with `:id` is not found.

---

### `DELETE /api/users/:id`
* **Purpose**: Deletes a user record by ID.
* **Authentication**: Bearer Token (`Authorization: Bearer <token>`)
* **Path Parameters**: `id` (integer, required)
* **Success Status**: `204 No Content`
* **Success Response Body**: (Empty body)
* **Error Statuses**:
  * `400 Bad Request`: If `:id` is not a valid positive integer.
  * `401 Unauthorized`: If `Authorization` header is missing or malformed.
  * `403 Forbidden`: If provided JWT token is invalid or expired.
  * `404 Not Found`: If user with `:id` does not exist.

---

### `POST /api/users/reset`
* **Purpose**: Resets the in-memory user repository back to initial seed data (Test utility endpoint).
* **Authentication**: None
* **Success Status**: `200 OK`
