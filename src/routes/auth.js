const express = require('express');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Mock registered credentials for API testing
const DEMO_USER = {
  id: 1,
  email: 'admin@example.com',
  password: 'password123',
  name: 'Arya Patil',
  role: 'admin'
};

/**
 * @route POST /api/auth/login
 * @desc  Authenticate user and return JWT Bearer token
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Email and password are required.',
      statusCode: 400
    });
  }

  if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid email or password.',
      statusCode: 401
    });
  }

  // Generate JWT token (expires in 24 hours)
  const token = jwt.sign(
    { id: DEMO_USER.id, email: DEMO_USER.email, role: DEMO_USER.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(200).json({
    token,
    tokenType: 'Bearer',
    expiresIn: '24h',
    user: {
      id: DEMO_USER.id,
      name: DEMO_USER.name,
      email: DEMO_USER.email,
      role: DEMO_USER.role
    }
  });
});

module.exports = router;
