const newman = require('newman');
const path = require('path');
const fs = require('fs');
const http = require('http');

const PORT = process.env.PORT || 3000;
const COLLECTION_PATH = path.join(__dirname, '../postman/collections/Automated_API_Testing_Suite.postman_collection.json');
const ENVIRONMENT_PATH = path.join(__dirname, '../postman/environments/Local.postman_environment.json');
const REPORTS_DIR = path.join(__dirname, '../reports');
const REPORT_OUTPUT = path.join(REPORTS_DIR, 'newman-run-summary.json');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

/**
 * Check if the server is running on the target port
 */
function isServerRunning(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/health`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.abort();
      resolve(false);
    });
  });
}

/**
 * Main test execution logic
 */
async function runTestSuite() {
  let serverInstance = null;

  const running = await isServerRunning(PORT);
  if (!running) {
    console.log(`[QA Runner] Starting local API server on port ${PORT}...`);
    const app = require('../src/app');
    serverInstance = app.listen(PORT);
    // Allow brief moment for server to bind
    await new Promise((r) => setTimeout(r, 500));
  } else {
    console.log(`[QA Runner] Detected already running API server on port ${PORT}.`);
  }

  console.log('[QA Runner] Launching Newman Test Execution...');

  newman.run(
    {
      collection: require(COLLECTION_PATH),
      environment: require(ENVIRONMENT_PATH),
      reporters: ['cli', 'json'],
      reporter: {
        json: {
          export: REPORT_OUTPUT
        }
      },
      color: 'on'
    },
    (err, summary) => {
      if (serverInstance) {
        console.log('[QA Runner] Closing local API server instance...');
        serverInstance.close();
      }

      if (err) {
        console.error('[QA Runner] Newman execution encountered a critical error:', err);
        process.exit(1);
      }

      const totalRequests = summary.run.stats.requests.total;
      const totalAssertions = summary.run.stats.assertions.total;
      const failedAssertions = summary.run.stats.assertions.failed;
      const passedAssertions = totalAssertions - failedAssertions;

      console.log('\n==============================================');
      console.log('         TEST EXECUTION SUMMARY               ');
      console.log('==============================================');
      console.log(`Total Requests:   ${totalRequests}`);
      console.log(`Total Assertions: ${totalAssertions}`);
      console.log(`Passed:           ${passedAssertions}`);
      console.log(`Failed:           ${failedAssertions}`);
      console.log(`Report JSON:      ${REPORT_OUTPUT}`);
      console.log('==============================================\n');

      if (failedAssertions > 0) {
        console.error(`[QA Runner] ${failedAssertions} assertion(s) failed.`);
        process.exit(1);
      } else {
        console.log('[QA Runner] All tests passed successfully!');
        process.exit(0);
      }
    }
  );
}

runTestSuite().catch((err) => {
  console.error('[QA Runner] Fatal runner error:', err);
  process.exit(1);
});
