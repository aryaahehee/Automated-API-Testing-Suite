const express = require('express');
const router = express.Router();

const startTime = new Date();

/**
 * @route GET /health
 * @desc  System health check endpoint
 */
router.get('/', (req, res) => {
  const uptimeSeconds = process.uptime();
  res.status(200).json({
    status: 'UP',
    service: 'Automated API Testing Suite - Demo Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptimeSeconds)}s`,
    startedAt: startTime.toISOString()
  });
});

module.exports = router;
