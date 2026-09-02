# Test Execution Results — Section 1 Foundation

This report documents the actual execution metrics and validation results of the **Automated API Testing Suite** (Section 1) running against the local target API.

---

## 1. Execution Overview

* **Execution Date**: 2026-08-31
* **Execution Environment**: Local Development (`http://localhost:3000`)
* **Test Runner**: Newman v6.2.1 / Node.js v22.11.0
* **Collection**: `Automated API Testing Suite`
* **Environment File**: `postman/environments/Local.postman_environment.json`
* **Report Artifact**: [`reports/newman-run-summary.json`](../reports/newman-run-summary.json)
* **Overall Status**: **PASSED (100%)**

---

## 2. High-Level Metrics

| Metric | Result | Target / SLA | Status |
| :--- | :--- | :--- | :--- |
| **Total Test Requests** | 14 | 14 | PASS |
| **Total Test Assertions** | 36 | 36 | PASS |
| **Passed Assertions** | 36 | 36 (100%) | PASS |
| **Failed Assertions** | 0 | 0 (0%) | PASS |
| **Skipped Tests** | 0 | 0 | PASS |
| **Total Execution Duration** | 211 ms | < 5000 ms | PASS |
| **Average Response Time** | 2 ms | < 300 ms | PASS |
| **Min Response Time** | 1 ms | - | PASS |
| **Max Response Time** | 12 ms | < 500 ms | PASS |
| **Total Data Received** | 2.34 kB | - | PASS |

---

## 3. Results by Folder / Component

### 3.1 Health & Discovery (`01_Health_and_Discovery`)
| Request | Method | Status | Time | Assertions | Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Health Check - Service Status | `GET /health` | 200 OK | 12 ms | 4 / 4 passed | **PASS** |

### 3.2 Authentication (`02_Authentication`)
| Request | Method | Status | Time | Assertions | Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Login - Valid Admin Credentials | `POST /api/auth/login` | 200 OK | 9 ms | 3 / 3 passed | **PASS** |

### 3.3 Users Positive CRUD (`03_Users_Positive_CRUD`)
| Request | Method | Status | Time | Assertions | Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Get All Users | `GET /api/users` | 200 OK | 1 ms | 3 / 3 passed | **PASS** |
| Create User - Positive | `POST /api/users` | 201 Created | 2 ms | 3 / 3 passed | **PASS** |
| Get User By ID - Positive | `GET /api/users/:id` | 200 OK | 2 ms | 3 / 3 passed | **PASS** |
| Update User - Positive | `PUT /api/users/:id` | 200 OK | 2 ms | 3 / 3 passed | **PASS** |
| Delete User By ID - Positive | `DELETE /api/users/:id` | 204 No Content | 2 ms | 3 / 3 passed | **PASS** |
| Verify User Deleted - 404 Check | `GET /api/users/:id` | 404 Not Found | 2 ms | 2 / 2 passed | **PASS** |

### 3.4 Negative Scenarios (`04_Negative_Scenarios`)
| Request | Method | Status | Time | Assertions | Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Login - Invalid Credentials | `POST /api/auth/login` | 401 Unauthorized | 3 ms | 2 / 2 passed | **PASS** |
| Create User - Missing Required Fields | `POST /api/users` | 400 Bad Request | 1 ms | 2 / 2 passed | **PASS** |
| Create User - Invalid Email Format | `POST /api/users` | 400 Bad Request | 1 ms | 2 / 2 passed | **PASS** |
| Get User - Non-existent ID (999999) | `GET /api/users/999999` | 404 Not Found | 1 ms | 2 / 2 passed | **PASS** |
| Get User - Invalid ID Format | `GET /api/users/invalid-id-xyz` | 400 Bad Request | 1 ms | 2 / 2 passed | **PASS** |
| Delete User - Unauthorized without Token | `DELETE /api/users/1` | 401 Unauthorized | 1 ms | 2 / 2 passed | **PASS** |

---

## 4. Assertion Analysis

### Categories of Assertions Tested:
1. **HTTP Status Codes**: Exact status validation across `200`, `201`, `204`, `400`, `401`, `404`.
2. **Response Times (SLA)**: Verified responses completed well under configured SLAs (max observed: 12ms vs SLA limit 500ms).
3. **Response Headers**: Verified `Content-Type: application/json; charset=utf-8`.
4. **JSON Schema & Types**: Verified presence of required properties and explicit data types (`typeof`, string, number, array, object).
5. **Business Logic & Error Payloads**: Verified accurate error structures (`error`, `message`, `statusCode`) and dynamic variable chaining (`token`, `userId`, `createdEmail`).

---

## 5. Conclusion & Verification Verdict

The Section 1 test execution completed with a **100% pass rate** across all positive and negative test cases with zero defects, demonstrating readiness for presentation and providing the baseline for Section 2 CI/CD automation.
