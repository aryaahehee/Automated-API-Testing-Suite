# Section 1 Internship Presentation & Live Demo Guide

This guide is designed for presenting **Section 1: API Testing Foundation** during internship evaluations and technical demonstrations.

---

## 1. Project Objective & Vision
The **Automated API Testing Suite** is an industry-standard API quality engineering project. The goal of Section 1 is to build a solid, reliable, and professional API automation testing foundation using **Postman** and **Newman**, providing comprehensive functional coverage, dynamic variable chaining, multi-layered assertions, and automated reporting before scaling into full CI/CD pipelines.

---

## 2. Architecture & Testing Workflow

```
┌────────────────────────┐      ┌─────────────────────────┐      ┌────────────────────────┐
│   Postman Collection   │ ---> │     Target REST API     │ ---> │    Test Assertions     │
│  - Health & Discovery  │      │  - Express Node.js App  │      │  - Status Codes        │
│  - JWT Authentication  │      │  - In-Memory Datastore  │      │  - SLA / Response Time │
│  - Positive CRUD Flow  │      │  - Dynamic Port Config  │      │  - JSON Schema & Types │
│  - Negative Scenarios  │      │  - Token Auth Middleware│      │  - Business Logic      │
└────────────────────────┘      └─────────────────────────┘      └────────────────────────┘
            │                                                                │
            └───────────────────────► [ Newman Runner ] ◄────────────────────┘
                                            │
                                            ▼
                                ┌────────────────────────┐
                                │  Reports & Execution   │
                                │  - CLI Console Table   │
                                │  - JSON Test Artifacts │
                                └────────────────────────┘
```

---

## 3. API Endpoints Tested

| Endpoint | Method | Purpose | Auth | Expected Status |
| :--- | :--- | :--- | :--- | :--- |
| `/health` | `GET` | System health check & uptime | Public | `200 OK` |
| `/api/auth/login` | `POST` | Authenticate & issue Bearer token | Public | `200 OK` / `401 Unauthorized` |
| `/api/users` | `GET` | List all users | Public | `200 OK` |
| `/api/users` | `POST` | Create new user | Public | `201 Created` / `400 Bad Request` |
| `/api/users/:id` | `GET` | Retrieve user by ID | Public | `200 OK` / `400` / `404` |
| `/api/users/:id` | `PUT` | Update user details | Public | `200 OK` / `400` / `404` |
| `/api/users/:id` | `DELETE` | Delete user by ID | Bearer Token | `204 No Content` / `401` / `404` |

---

## 4. Test Cases & Coverage

* **Total Requests**: 14
* **Total Assertions**: 36
* **Positive Scenarios (8 requests)**:
  * Health verification
  * Admin login & Bearer token extraction
  * Full user CRUD lifecycle (`GET` all -> `POST` create -> `GET` single -> `PUT` update -> `DELETE` remove -> `GET` verify deleted)
* **Negative Scenarios (6 requests)**:
  * Invalid credentials on login (`401`)
  * Missing required fields on user creation (`400`)
  * Invalid email syntax format (`400`)
  * Non-existent ID retrieval (`404`)
  * Malformed string ID (`400`)
  * Unauthorized deletion without token (`401`)

---

## 5. Assertions Implemented

1. **Status Code Assertions**: `pm.response.to.have.status(expectedCode)`
2. **Response Time SLAs**: `pm.expect(pm.response.responseTime).to.be.below(thresholdMs)`
3. **Headers Validation**: Verifying JSON MIME types and encodings
4. **Schema & Property Checks**: Validating presence of key identifiers (`id`, `name`, `email`, `role`, `status`, `createdAt`)
5. **Data-type Assertions**: Validating strings, numbers, arrays, and objects
6. **State & Variable Chaining**: Extracting `token` and `userId` dynamically to drive downstream requests

---

## 6. Test Execution Methods

### Option A: One-Command CLI Runner (Newman)
```bash
npm run test:api
```

### Option B: Postman Collection Runner (Interactive GUI)
1. Import `postman/collections/Automated_API_Testing_Suite.postman_collection.json`.
2. Import `postman/environments/Local.postman_environment.json`.
3. Select `Local Environment` and run the collection.

---

## 7. Actual Execution Results (Demonstration Evidence)

```text
┌─────────────────────────┬─────────────────┬─────────────────┐
│                         │        executed │          failed │
├─────────────────────────┼─────────────────┼─────────────────┤
│              iterations │               1 │               0 │
├─────────────────────────┼─────────────────┼─────────────────┤
│                requests │              14 │               0 │
├─────────────────────────┼─────────────────┼─────────────────┤
│            test-scripts │              14 │               0 │
├─────────────────────────┼─────────────────┼─────────────────┤
│      prerequest-scripts │               1 │               0 │
├─────────────────────────┼─────────────────┼─────────────────┤
│              assertions │              36 │               0 │
├─────────────────────────┴─────────────────┴─────────────────┤
│ total run duration: 211ms                                   │
├─────────────────────────────────────────────────────────────┤
│ average response time: 2ms [min: 1ms, max: 12ms, s.d.: 3ms] │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Step-by-Step Live Demo Flow

When presenting this project to your mentor, evaluator, or team, follow this structured demo script:

### Step 1: Architecture & Project Introduction (1 min)
* Open the project in IDE / terminal.
* Show `README.md` and explain the 3-section roadmap.
* Explain that Section 1 establishes the API under test, Postman collection, environment isolation, assertions, and headless runner.

### Step 2: Show Postman Collection & Environment Setup (1.5 mins)
* Show `postman/environments/Local.postman_environment.json` and explain how `baseUrl`, `token`, and `userId` prevent hardcoding secrets and IDs.
* Show `postman/collections/Automated_API_Testing_Suite.postman_collection.json` organized into logical folders (`Health`, `Auth`, `CRUD`, `Negative`).

### Step 3: Demonstrate Positive CRUD & Dynamic Chaining (2 mins)
* Show `POST /api/auth/login` capturing the JWT Bearer token via test script:
  ```javascript
  pm.environment.set("token", jsonData.token);
  ```
* Show `POST /api/users` creating a user with dynamically generated unique email (`qa.engineer.<timestamp>@example.com`) and storing `userId`.
* Show downstream `GET`, `PUT`, and `DELETE` requests consuming `{{userId}}` and `{{token}}`.

### Step 4: Demonstrate Negative Testing & Robustness (1.5 mins)
* Show negative test cases in `04_Negative_Scenarios`:
  * Missing fields returning structured `400 Bad Request`
  * Invalid token returning `401 Unauthorized`
  * Non-existent ID returning `404 Not Found`
* Highlight that the assertions check not just for errors, but for the **exact expected error structure and message**.

### Step 5: Live Execution & Report Generation (1 min)
* Run the automated test runner in the terminal:
  ```bash
  npm run test:api
  ```
* Point out the real-time execution table: 14 requests, 36 assertions, 100% pass rate, 2ms average latency.
* Show the exported JSON test report in `reports/newman-run-summary.json`.

---

## 9. Project Roadmap & Next Steps

### Completed in Section 1 (Current Milestone)
- [x] REST API architecture & modular routes
- [x] Postman collection with organized folders
- [x] Postman environment with dynamic variable chaining
- [x] 14 API test requests with 36 assertions (status, SLA, schema, types, business logic)
- [x] Positive CRUD lifecycle testing
- [x] Negative error validation testing
- [x] Newman CLI automation runner & JSON reporting
- [x] Comprehensive QA documentation (`docs/`) and demo guide

### Planned for Section 2 (Next Milestone)
- [ ] Automated GitHub Actions CI/CD workflow running Newman on every push/PR
- [ ] Newman HTML Extra rich visual report dashboard generation
- [ ] Schema contract testing with JSON Schema validation
- [ ] Mock server integration for isolated third-party simulation

### Planned for Section 3 (Final Milestone)
- [ ] Docker containerization of API and test runner
- [ ] Performance and stress testing baselines
- [ ] Final handover documentation and video walkthrough
