const express = require('express');
const store = require('../data/store');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Simple email regex for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @route GET /api/users
 * @desc  Get list of all users with optional filtering
 */
router.get('/', (req, res) => {
  const users = store.getAllUsers(req.query);
  res.status(200).json({
    total: users.length,
    users
  });
});

/**
 * @route POST /api/users/reset
 * @desc  Reset datastore to seed state (useful for test isolation)
 */
router.post('/reset', (req, res) => {
  store.reset();
  res.status(200).json({
    message: 'User store reset to default seed data successfully.',
    total: store.getAllUsers().length
  });
});

/**
 * @route GET /api/users/:id
 * @desc  Get single user by ID
 */
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'User ID must be a positive integer.',
      statusCode: 400
    });
  }

  const user = store.getUserById(id);
  if (!user) {
    return res.status(404).json({
      error: 'Not Found',
      message: `User with ID ${id} was not found.`,
      statusCode: 404
    });
  }

  res.status(200).json(user);
});

/**
 * @route POST /api/users
 * @desc  Create a new user
 */
router.post('/', (req, res) => {
  const { name, email, role, status } = req.body;

  // Validation: Required fields
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Field "name" is required and must be a non-empty string.',
      statusCode: 400
    });
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Field "email" is required and must be a valid email format.',
      statusCode: 400
    });
  }

  // Check email uniqueness
  const existing = store.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `User with email "${email}" already exists.`,
      statusCode: 400
    });
  }

  // Allowed roles validation
  const allowedRoles = ['admin', 'developer', 'qa_engineer', 'user', 'manager'];
  if (role && !allowedRoles.includes(role.toLowerCase())) {
    return res.status(400).json({
      error: 'Bad Request',
      message: `Field "role" must be one of: ${allowedRoles.join(', ')}.`,
      statusCode: 400
    });
  }

  const newUser = store.createUser({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: role ? role.toLowerCase() : 'user',
    status: status || 'active'
  });

  res.status(201).json(newUser);
});

/**
 * @route PUT /api/users/:id
 * @desc  Update user details by ID
 */
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'User ID must be a positive integer.',
      statusCode: 400
    });
  }

  const existing = store.getUserById(id);
  if (!existing) {
    return res.status(404).json({
      error: 'Not Found',
      message: `User with ID ${id} was not found.`,
      statusCode: 404
    });
  }

  const { name, email, role, status } = req.body;

  if (email && !EMAIL_REGEX.test(email)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Field "email" must be a valid email format.',
      statusCode: 400
    });
  }

  if (email && email.toLowerCase() !== existing.email.toLowerCase()) {
    const duplicate = store.getUserByEmail(email);
    if (duplicate) {
      return res.status(400).json({
        error: 'Bad Request',
        message: `User with email "${email}" already exists.`,
        statusCode: 400
      });
    }
  }

  const updatedUser = store.updateUser(id, {
    ...(name && { name: name.trim() }),
    ...(email && { email: email.trim().toLowerCase() }),
    ...(role && { role: role.toLowerCase() }),
    ...(status && { status })
  });

  res.status(200).json(updatedUser);
});

/**
 * @route DELETE /api/users/:id
 * @desc  Delete user by ID (Protected by Bearer token)
 */
router.delete('/:id', authenticateToken, (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'User ID must be a positive integer.',
      statusCode: 400
    });
  }

  const user = store.getUserById(id);
  if (!user) {
    return res.status(404).json({
      error: 'Not Found',
      message: `User with ID ${id} was not found.`,
      statusCode: 404
    });
  }

  store.deleteUser(id);
  res.status(204).send();
});

module.exports = router;
