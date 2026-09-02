# Test Cases Specification Matrix

This document provides the exhaustive specification for all automated test cases implemented in the **Automated API Testing Suite** (Section 1).

---

## Summary Matrix

| ID | Test Case Title | Endpoint | Method | Expected Status | Type | Assertions Count |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-HLT-01** | Health Check - Service Status | `/health` | `GET` | `200 OK` | Positive | 4 |
| **TC-AUT-01** | Admin Login - Valid Credentials | `/api/auth/login` | `POST` | `200 OK` | Positive | 3 |
| **TC-AUT-02** | Admin Login - Invalid Credentials | `/api/auth/login` | `POST` | `401 Unauthorized` | Negative | 2 |
| **TC-USR-01** | Get All Users List | `/api/users` | `GET` | `200 OK` | Positive | 3 |
| **TC-USR-02** | Create User - Valid Payload | `/api/users` | `POST` | `201 Created` | Positive | 3 |
| **TC-USR-03** | Get User By ID - Existing User | `/api/users/:id` | `GET` | `200 OK` | Positive | 3 |
| **TC-USR-04** | Update User - Valid Payload | `/api/users/:id` | `PUT` | `200 OK` | Positive | 3 |
| **TC-USR-05** | Delete User - Authenticated | `/api/users/:id` | `DELETE` | `204 No Content` | Positive | 3 |
| **TC-USR-06** | Verify Deleted User Resource | `/api/users/:id` | `GET` | `404 Not Found` | Positive | 2 |
| **TC-NEG-01** | Create User - Missing Required Name | `/api/users` | `POST` | `400 Bad Request` | Negative | 2 |
| **TC-NEG-02** | Create User - Invalid Email Format | `/api/users` | `POST` | `400 Bad Request` | Negative | 2 |
| **TC-NEG-03** | Get User - Non-existent ID (999999) | `/api/users/999999` | `GET` | `404 Not Found` | Negative | 2 |
| **TC-NEG-04** | Get User - Invalid String ID Format | `/api/users/invalid-id-xyz` | `GET` | `400 Bad Request` | Negative | 2 |
| **TC-NEG-05** | Delete User - Missing Bearer Token | `/api/users/1` | `DELETE` | `401 Unauthorized` | Negative | 2 |

**Total Requests**: 14  
**Total Test Assertions**: 36

---

## Detailed Test Case Specifications

### Health & Discovery

#### `TC-HLT-01`: Health Check - Service Status
* **Endpoint**: `GET {{baseUrl}}/health`
* **Purpose**: Verify backend availability and health metadata.
* **Preconditions**: Local server running on port 3000.
* **Request Headers**: None
* **Request Body**: None
* **Assertions**:
  1. `pm.response.to.have.status(200)`
  2. `pm.expect(pm.response.responseTime).to.be.below(300)`
  3. `pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json")`
  4. Response JSON contains `status === "UP"`, string properties `service`, `version`, `timestamp`, `uptime`.

---

### Authentication

#### `TC-AUT-01`: Admin Login - Valid Credentials
* **Endpoint**: `POST {{baseUrl}}/api/auth/login`
* **Purpose**: Authenticate admin user, verify token structure, and save JWT token into environment.
* **Preconditions**: Valid admin credentials configured in environment (`admin@example.com` / `password123`).
* **Request Body**:
  ```json
  {
    "email": "{{adminEmail}}",
    "password": "{{adminPassword}}"
  }
  ```
* **Assertions**:
  1. `pm.response.to.have.status(200)`
  2. `pm.expect(pm.response.responseTime).to.be.below(500)`
  3. Response contains non-empty `token`, `tokenType === "Bearer"`, and `user` profile with matching admin email.
* **Post-Response Action**: `pm.environment.set("token", jsonData.token);`

#### `TC-AUT-02`: Admin Login - Invalid Credentials (Negative)
* **Endpoint**: `POST {{baseUrl}}/api/auth/login`
* **Purpose**: Verify rejected authentication when incorrect password is supplied.
* **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "wrong_password_xyz"
  }
  ```
* **Assertions**:
  1. `pm.response.to.have.status(401)`
  2. Response JSON has `error === "Unauthorized"`, `statusCode === 401`, and message `"Invalid email or password."`.

---

### Users Positive CRUD Lifecycle

#### `TC-USR-01`: Get All Users List
* **Endpoint**: `GET {{baseUrl}}/api/users`
* **Purpose**: Verify retrieval of the initial user directory.
* **Assertions**:
  1. `pm.response.to.have.status(200)`
  2. `pm.expect(pm.response.responseTime).to.be.below(400)`
  3. Response contains numeric `total >= 1` and array `users` with valid user object schema (`id`, `name`, `email`, `role`, `status`, `createdAt`).

#### `TC-USR-02`: Create User - Valid Payload
* **Endpoint**: `POST {{baseUrl}}/api/users`
* **Purpose**: Create a new user with dynamic test data and capture the generated `userId`.
* **Pre-request Script**:
  ```javascript
  const uniqueId = Date.now();
  pm.environment.set("createdEmail", `qa.engineer.${uniqueId}@example.com`);
  ```
* **Request Body**:
  ```json
  {
    "name": "Automation Test User",
    "email": "{{createdEmail}}",
    "role": "qa_engineer",
    "status": "active"
  }
  ```
* **Assertions**:
  1. `pm.response.to.have.status(201)`
  2. `pm.expect(pm.response.responseTime).to.be.below(500)`
  3. Response contains positive integer `id`, matching `name`, `email`, `role`, and valid ISO timestamp `createdAt`.
* **Post-Response Action**: `pm.environment.set("userId", jsonData.id);`

#### `TC-USR-03`: Get User By ID - Existing User
* **Endpoint**: `GET {{baseUrl}}/api/users/{{userId}}`
* **Purpose**: Retrieve the user record created in `TC-USR-02`.
* **Assertions**:
  1. `pm.response.to.have.status(200)`
  2. `pm.expect(pm.response.responseTime).to.be.below(300)`
  3. Response `id` matches `{{userId}}` and `email` matches `{{createdEmail}}`.

#### `TC-USR-04`: Update User - Valid Payload
* **Endpoint**: `PUT {{baseUrl}}/api/users/{{userId}}`
* **Purpose**: Update user details and verify persistent changes.
* **Request Body**:
  ```json
  {
    "name": "Automation Test User - Updated",
    "role": "developer",
    "status": "active"
  }
  ```
* **Assertions**:
  1. `pm.response.to.have.status(200)`
  2. `pm.expect(pm.response.responseTime).to.be.below(400)`
  3. Response contains updated `name`, updated `role`, and updated timestamp string `updatedAt`.

#### `TC-USR-05`: Delete User - Authenticated
* **Endpoint**: `DELETE {{baseUrl}}/api/users/{{userId}}`
* **Purpose**: Delete the created user using Bearer authentication.
* **Request Headers**: `Authorization: Bearer {{token}}`
* **Assertions**:
  1. `pm.response.to.have.status(204)`
  2. `pm.expect(pm.response.responseTime).to.be.below(400)`
  3. Response body is empty string.

#### `TC-USR-06`: Verify User Deleted Resource
* **Endpoint**: `GET {{baseUrl}}/api/users/{{userId}}`
* **Purpose**: Verify that subsequent queries to deleted resource return `404 Not Found`.
* **Assertions**:
  1. `pm.response.to.have.status(404)`
  2. Response body contains `error === "Not Found"` and `statusCode === 404`.

---

### Negative Scenarios

#### `TC-NEG-01`: Create User - Missing Required Name
* **Endpoint**: `POST {{baseUrl}}/api/users`
* **Request Body**:
  ```json
  {
    "email": "missing.name@example.com",
    "role": "developer"
  }
  ```
* **Assertions**:
  1. `pm.response.to.have.status(400)`
  2. Error message indicates missing field `"name"`.

#### `TC-NEG-02`: Create User - Invalid Email Format
* **Endpoint**: `POST {{baseUrl}}/api/users`
* **Request Body**:
  ```json
  {
    "name": "Invalid Email User",
    "email": "not-a-valid-email-address",
    "role": "developer"
  }
  ```
* **Assertions**:
  1. `pm.response.to.have.status(400)`
  2. Error message indicates invalid email format.

#### `TC-NEG-03`: Get User - Non-existent ID
* **Endpoint**: `GET {{baseUrl}}/api/users/999999`
* **Assertions**:
  1. `pm.response.to.have.status(404)`
  2. Response body indicates `error === "Not Found"`.

#### `TC-NEG-04`: Get User - Invalid String ID Format
* **Endpoint**: `GET {{baseUrl}}/api/users/invalid-id-xyz`
* **Assertions**:
  1. `pm.response.to.have.status(400)`
  2. Response message indicates user ID must be a positive integer.

#### `TC-NEG-05`: Delete User - Missing Bearer Token
* **Endpoint**: `DELETE {{baseUrl}}/api/users/1`
* **Request Headers**: None
* **Assertions**:
  1. `pm.response.to.have.status(401)`
  2. Response body indicates `error === "Unauthorized"` and missing authorization header.
