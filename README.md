# Automated API Testing Suite

> **A professional, API automation testing suite built with Node.js, Express, Postman, and Newman.**

[![Newman Test Run](https://img.shields.io/badge/Newman-Passing%20(36%2F36)-success?style=flat-square&logo=postman)](docs/test-results.md)
[![API Status](https://img.shields.io/badge/API-v1.0.0-blue?style=flat-square)](docs/api-endpoints.md)
[![Milestone](https://img.shields.io/badge/Milestone-Section%201%20Completed-brightgreen?style=flat-square)](docs/presentation/section-1-demo.md)

---

## 📌 Project Overview

**Automated API Testing Suite** is an industry-standard QA automation engineering project designed to demonstrate automated API discovery, authentication handling, CRUD lifecycle validation, negative error testing, SLA response-time assertions, and headless CLI test execution.

---

## 🚀 Key Features

* **Modular REST API**: Built with Node.js & Express featuring health discovery, JWT Bearer authentication, and Users CRUD resources.
* **Organized Postman Collection**: Postman v2.1 collection partitioned into logical folders (`Health & Discovery`, `Authentication`, `Positive CRUD`, `Negative Scenarios`).
* **Multi-Layered Automated Assertions**:
  * HTTP Status Code verification (`200`, `201`, `204`, `400`, `401`, `404`)
  * Response time SLA assertions (< 300ms to 500ms)
  * JSON schema and property presence validation
  * Data type assertions (string, number, array, boolean)
  * Business logic and data consistency checks
* **Dynamic Variable Chaining**: Automatically extracts JWT tokens and generated resource IDs (`userId`, `createdEmail`) across requests.
* **One-Command Headless Execution**: Newman-powered test runner that boots the server, runs tests, and exports structured reports.

---

## 📁 Repository Structure

```
Automated-API-Testing-Suite/
├── src/                                  # API Service under test
│   ├── app.js                            # Express app configuration & middleware
│   ├── server.js                         # Server listener entry point (Port 3000)
│   ├── data/
│   │   └── store.js                      # In-memory data store with seed fixtures
│   ├── middleware/
│   │   └── auth.js                       # JWT Bearer token authentication
│   └── routes/
│       ├── health.js                     # GET /health
│       ├── auth.js                       # POST /api/auth/login
│       └── users.js                      # CRUD /api/users
├── postman/                              # Postman artifacts
│   ├── collections/
│   │   └── Automated_API_Testing_Suite.postman_collection.json # v2.1 collection
│   ├── environments/
│   │   └── Local.postman_environment.json                     # Variables config
│   └── test-data/
│       └── users.json                    # Controlled test fixtures
├── reports/                              # Automated test run outputs
│   └── newman-run-summary.json           # Machine-readable test report
├── docs/                                 # Project documentation
│   ├── api-endpoints.md                  # Detailed API specification & catalog
│   ├── test-plan.md                      # QA test plan & strategy
│   ├── test-cases.md                     # Exhaustive test matrix & specifications
│   ├── test-results.md                   # Actual execution results & metrics
│   └── presentation/
│       └── section-1-demo.md             # Internship presentation & demo guide
├── scripts/
│   └── run-tests.js                      # Automated Newman test runner harness
├── package.json                          # Dependencies & NPM scripts
└── README.md                             # Project overview & quickstart
```

---

## 🛠️ Quick Start

### Prerequisites
* **Node.js**: v18.0.0 or higher (`v22.11.0` recommended)
* **npm**: v9.0.0 or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the API Server
```bash
npm start
```
The API will be accessible at `http://localhost:3000`. You can verify by visiting `http://localhost:3000/health`.

### 3. Run Automated Tests via Newman
```bash
npm run test:api
```
This script automatically starts the local API (if not already running), executes all 14 requests with 36 assertions, displays a colored summary table, and exports the JSON results into `reports/newman-run-summary.json`.

---

## 🧪 Postman GUI Setup

If you wish to execute or inspect the tests within Postman GUI:

1. Open **Postman**.
2. Click **Import** and select:
   * `postman/collections/Automated_API_Testing_Suite.postman_collection.json`
   * `postman/environments/Local.postman_environment.json`
3. Set the active environment to **Local Environment**.
4. Click on the collection name and select **Run collection**.

---

## 📊 Test Execution Summary

| Metric | Metric Value | Status |
| :--- | :--- | :--- |
| **Total Test Requests** | 14 | ✅ Executed |
| **Total Assertions** | 36 | ✅ Passed (100%) |
| **Failed Assertions** | 0 | ✅ Zero Failures |
| **Execution Duration** | 211 ms | ✅ < 5s SLA |
| **Average Response Time**| 2 ms | ✅ Fast & Reliable |

---

## 📚 Project Documentation

* 📖 [**API Endpoints Catalog**](docs/api-endpoints.md): Endpoints, methods, payloads, and status codes.
* 📋 [**Test Plan**](docs/test-plan.md): QA strategy, scope, tooling, and entry/exit criteria.
* 🧪 [**Test Cases Specification**](docs/test-cases.md): Detailed test scenarios matrix (positive & negative).
* 📈 [**Test Execution Results**](docs/test-results.md): Real run metrics and assertion results.
* 🎤 [**Internship Presentation Guide**](docs/presentation/section-1-demo.md): Presentation talking points & live demo flow.

---

## 🗺️ Project Roadmap

- [x] **Section 1 — API Testing Foundation** *(Current Milestone)*:
  - Working REST API backend with authentication and CRUD endpoints.
  - Postman collection & environment with dynamic variable chaining.
  - Comprehensive positive & negative test assertions.
  - Headless Newman test runner and documentation suite.
- [ ] **Section 2 — Advanced Validation + CI/CD** *(Upcoming)*:
  - GitHub Actions CI automated pipeline.
  - Newman HTML Extra visual dashboard reporting.
  - Contract testing and schema validation.
- [ ] **Section 3 — Production Polish + Handover** *(Final Milestone)*:
  - Docker containerization.
  - Stress / performance baseline testing.
  - Production readiness review and final handover.
