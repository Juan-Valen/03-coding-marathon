const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Your Express app with DB connection
const api = supertest(app);
const User = require("../models/userModel");

// Clean the users collection before each test
beforeEach(async () => {
  await User.deleteMany({});
});

describe("User Routes", () => {
  describe("POST /api/users/signup", () => {
    it("✅ should signup a new user with valid credentials", async () => {
      const userData = {
        name: "Alice Smith",
        username: "alice123",
        password: "StrongP@ss123",
        phone_number: "1234567890",
        gender: "Female",
        date_of_birth: "1995-05-10",
        membership_status: "active",
        bio: "I love coding",
        address: "123 Main Street",
        profile_picture: "https://example.com/avatar.png",
      };

      const result = await api.post("/api/users/signup").send(userData);

      expect(result.status).toBe(201);
      expect(result.body).toHaveProperty("token");
      expect(result.body.username).toBe(userData.username);

      // Extra check: user is actually saved in DB
      const savedUser = await User.findOne({ username: userData.username });
      expect(savedUser).not.toBeNull();
    });

    it("❌ should return an error if required fields are missing", async () => {
      const userData = {
        username: "bob123",
        password: "WeakPass",
        phone_number: "1234567890",
        gender: "Male",
      }; // missing name, date_of_birth, membership_status, address

      const result = await api.post("/api/users/signup").send(userData);

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("error");
    });

    it("❌ should return an error if username already exists", async () => {
      const userData = {
        name: "Alice Smith",
        username: "alice123",
        password: "StrongP@ss123",
        phone_number: "1234567890",
        gender: "Female",
        date_of_birth: "1995-05-10",
        membership_status: "active",
        bio: "I love coding",
        address: "123 Main Street",
        profile_picture: "https://example.com/avatar.png",
      };

      // Signup first time
      await api.post("/api/users/signup").send(userData);

      // Try signup again with same username
      const result = await api.post("/api/users/signup").send(userData);

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("error", "Username already taken");
    });
  });

  describe("POST /api/users/login", () => {
    it("✅ should login a user with valid credentials", async () => {
      // First signup
      await api.post("/api/users/signup").send({
        name: "Alice Smith",
        username: "alice123",
        password: "StrongP@ss123",
        phone_number: "1234567890",
        gender: "Female",
        date_of_birth: "1995-05-10",
        membership_status: "active",
        address: "123 Main Street",
      });

      // Then login
      const result = await api.post("/api/users/login").send({
        username: "alice123",
        password: "StrongP@ss123",
      });

      expect(result.status).toBe(200);
      expect(result.body).toHaveProperty("token");
      expect(result.body.username).toBe("alice123");
    });

    it("❌ should return an error with wrong password", async () => {
      const result = await api.post("/api/users/login").send({
        username: "alice123",
        password: "WrongPass",
      });

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("error", "Invalid credentials");
    });

    it("❌ should return an error if user does not exist", async () => {
      const result = await api.post("/api/users/login").send({
        username: "nonexistent",
        password: "SomePass123",
      });

      expect(result.status).toBe(400);
      expect(result.body).toHaveProperty("error", "Invalid credentials");
    });
  });
});

// Close DB connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
