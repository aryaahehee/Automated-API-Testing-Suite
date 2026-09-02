const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`==============================================`);
  console.log(` Automated API Testing Suite - Demo Backend  `);
  console.log(` Server running at: http://localhost:${PORT} `);
  console.log(` Health check at:   http://localhost:${PORT}/health `);
  console.log(`==============================================`);
});

module.exports = server;
