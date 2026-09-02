/**
 * In-memory datastore for the API Testing Suite.
 * Provides clean CRUD helpers and deterministic seeding for reliable testing.
 */

const initialUsers = [
  {
    id: 1,
    name: "Arya Patil",
    email: "arya.patil@example.com",
    role: "admin",
    status: "active",
    createdAt: "2026-01-15T08:30:00.000Z",
    updatedAt: "2026-01-15T08:30:00.000Z"
  },
  {
    id: 2,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "developer",
    status: "active",
    createdAt: "2026-01-16T09:15:00.000Z",
    updatedAt: "2026-01-16T09:15:00.000Z"
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "qa_engineer",
    status: "inactive",
    createdAt: "2026-01-17T11:45:00.000Z",
    updatedAt: "2026-01-17T11:45:00.000Z"
  }
];

class DataStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.users = JSON.parse(JSON.stringify(initialUsers));
    this.nextUserId = 4;
  }

  getAllUsers(query = {}) {
    let result = [...this.users];

    if (query.role) {
      result = result.filter(u => u.role.toLowerCase() === query.role.toLowerCase());
    }

    if (query.status) {
      result = result.filter(u => u.status.toLowerCase() === query.status.toLowerCase());
    }

    if (query.search) {
      const term = query.search.toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
    }

    return result;
  }

  getUserById(id) {
    const numId = Number(id);
    return this.users.find(u => u.id === numId) || null;
  }

  getUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  createUser(userData) {
    const now = new Date().toISOString();
    const newUser = {
      id: this.nextUserId++,
      name: userData.name,
      email: userData.email,
      role: userData.role || "user",
      status: userData.status || "active",
      createdAt: now,
      updatedAt: now
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id, userData) {
    const numId = Number(id);
    const index = this.users.findIndex(u => u.id === numId);
    if (index === -1) return null;

    const existing = this.users[index];
    const updated = {
      ...existing,
      ...userData,
      id: existing.id, // Immutable ID
      createdAt: existing.createdAt, // Preserve creation timestamp
      updatedAt: new Date().toISOString()
    };

    this.users[index] = updated;
    return updated;
  }

  deleteUser(id) {
    const numId = Number(id);
    const index = this.users.findIndex(u => u.id === numId);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }
}

const store = new DataStore();
module.exports = store;
