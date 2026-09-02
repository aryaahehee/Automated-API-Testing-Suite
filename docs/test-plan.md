# Test Plan — Section 1: API Testing Foundation

## 1. Project Objective
The primary objective of the **Automated API Testing Suite** (Section 1) is to establish a robust, maintainable, and presentation-ready API automation testing foundation. It serves as a realistic QA engineering showcase, verifying endpoints across health discovery, authentication, and CRUD resource lifecycles with automated assertions covering HTTP status codes, response times (SLAs), schemas, data types, and error handling.

---

## 2. Scope of Testing

### In Scope (Section 1 Milestone)
* **Functional API Testing**: Positive and negative functional testing of all core REST endpoints.
* **Status Code Assertions**: Validation of accurate HTTP statuses (`200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`).
* **Response Payload & Schema Validation**: JSON property presence, exact value matching, and data-type verification.
* **Performance / Response-Time SLAs**: Validating that all endpoint responses execute within specified time thresholds (< 300ms to 500ms).
* **State & Environment Management**: Automated token extraction, dynamic ID chaining, and parameterized execution.
* **CLI Automated Test Execution**: Executing the Postman collection via Newman test runner with structured reporting.

### Out of Scope (Scheduled for Sections 2 & 3)
* CI/CD pipeline automation (GitHub Actions / GitLab CI) — scheduled for Section 2.
* Advanced contract testing, mock servers, and security fuzzing — scheduled for Section 2.
* Production deployment handover and monitoring dashboards — scheduled for Section 3.

---

## 3. Technology Stack & Tools

| Component | Tool / Technology | Purpose |
| :--- | :--- | :--- |
| **API Backend** | Node.js / Express.js | Target REST API service under test |
| **Test Design** | Postman v11 (Collection v2.1) | Authoring modular test requests & assertions |
| **CLI Runner** | Newman (v6.2.1) | Headless command-line execution & test reporting |
| **Runtime & Scripts** | Node.js (v22.11.0), npm | Test execution harness & lifecycle management |
| **Reporting** | Newman CLI & JSON Reporter | Machine-readable and console summary reports |

---

## 4. API Under Test Architecture

* **Base URL**: `http://localhost:3000`
* **Health Check**: `GET /health`
* **Authentication**: `POST /api/auth/login` (JWT Bearer token)
* **Resource Endpoints**: `/api/users` (CRUD operations)
* **Data Layer**: Thread-safe in-memory store with deterministic seed fixtures and reset capabilities.

---

## 5. Test Strategy & Assertion Levels

For every test scenario, a multi-layered verification strategy is implemented:

```
┌────────────────────────────────────────────────────────┐
│ 1. HTTP Status Code Assertion (200, 201, 204, 400, 401, 404) │
├────────────────────────────────────────────────────────┤
│ 2. Response Time / SLA Assertion (< 300ms - 500ms)     │
├────────────────────────────────────────────────────────┤
│ 3. Header Validation (Content-Type: application/json)  │
├────────────────────────────────────────────────────────┤
│ 4. Payload Schema & Property Existence Assertion       │
├────────────────────────────────────────────────────────┤
│ 5. Data Type Validation (string, number, array, obj)   │
├────────────────────────────────────────────────────────┤
│ 6. Business Value & Dynamic Data Consistency Check     │
└────────────────────────────────────────────────────────┘
```

---

## 6. Test Scenarios Overview

### Positive Scenarios
1. **Health Check**: Verify service status is `UP`, valid version, and uptime.
2. **Admin Login**: Verify valid login returns Bearer token and user payload; save token to environment.
3. **Get All Users**: Verify user list retrieval with correct array schema and pagination totals.
4. **Create User**: Verify creation with dynamic data; capture generated `userId`.
5. **Get User By ID**: Verify retrieval of the created user with matching properties.
6. **Update User**: Verify modification of user attributes and updated timestamp.
7. **Delete User**: Verify authenticated deletion returning `204 No Content`.
8. **Verify Deleted Resource**: Verify subsequent retrieval returns `404 Not Found`.

### Negative Scenarios
1. **Invalid Login Credentials**: Attempt login with incorrect password; verify `401 Unauthorized`.
2. **Missing Required Fields**: Create user without `name`; verify `400 Bad Request`.
3. **Invalid Email Format**: Create user with malformed email; verify `400 Bad Request`.
4. **Non-existent Resource ID**: Request user ID `999999`; verify `404 Not Found`.
5. **Invalid ID Data Type**: Request user ID `invalid-id-xyz`; verify `400 Bad Request`.
6. **Unauthorized Delete**: Attempt deleting a user without Bearer token; verify `401 Unauthorized`.

---

## 7. Environment Configuration

The environment file `postman/environments/Local.postman_environment.json` contains:
* `baseUrl`: Target API server (`http://localhost:3000`).
* `adminEmail`: Admin username (`admin@example.com`).
* `adminPassword`: Admin password (`password123`).
* `token`: Dynamically populated JWT token.
* `userId`: Dynamically populated user ID across CRUD test chaining.

---

## 8. Test Execution Workflow

### Method 1: Automated Command Line (Newman)
```bash
# Start API and execute all tests in one command:
npm run test:api
```

### Method 2: Postman GUI
1. Open Postman.
2. Import `postman/collections/Automated_API_Testing_Suite.postman_collection.json`.
3. Import `postman/environments/Local.postman_environment.json`.
4. Select `Local Environment` in the environment dropdown.
5. Click **Run collection** to execute the complete test suite.

---

## 9. Current Limitations & Future Improvements

### Current Limitations (Section 1)
* Datastore is currently in-memory and resets upon server restart (by design for test isolation).
* Execution is currently local command-line and GUI based.

### Future Improvements (Section 2 & 3)
* Integration with GitHub Actions CI pipeline on push/pull-request.
* HTML visual test report dashboards (Newman HTML Extra).
* Integration with Docker containerized backend and automated mock servers.
* Contract testing with OpenAPI / Swagger schema validation.
