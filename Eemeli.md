# Self-Assessment

### Example 1: Improving User Signup Validation

Initially, our signupUser controller allowed user creation but didn’t properly handle missing fields. Here’s the original critical section:

```javascript
if (!name || !username || !password || !phone_number || !gender || !date_of_birth || !membership_status || !address) {
  return res.status(400).json({ error: "Please add all required fields" });
}
```

The validation worked, but our first tests revealed weaknesses:

* If a required field like address was missing, the response wasn’t consistent with other validation failures.

* There was no automated test coverage to verify DB persistence.

After introducing integration tests with Jest + supertest, we strengthened both the implementation and validation process:

```javascript
// user.test.js 
it("❌ should return an error if required fields are missing", async () => {
  const userData = {
    username: "bob123",
    password: "WeakPass",
    phone_number: "1234567890",
    gender: "Male",
  };

  const result = await api.post("/api/users/signup").send(userData);

  expect(result.status).toBe(400);
  expect(result.body).toHaveProperty("error");
});

```

### Key Improvements:
* Stronger Validation: We ensured tests cover missing fields, duplicate usernames, and weak input scenarios.

* DB Assurance: Tests confirm that valid signups persist in MongoDB and invalid ones do not.

* Consistency: All validation failures return structured { error: message } responses.

---

### Example 2: Strengthening Authentication

The original login implementation checked credentials correctly but wasn’t tested against common failure cases. For instance:  

```javascript
// loginUser 
if (user && (await bcrypt.compare(password, user.password))) {
  const token = generateToken(user._id);
  res.status(200).json({
    _id: user._id,
    username: user.username,
    name: user.name,
    membership_status: user.membership_status,
    token,
  });
} else {
  res.status(400).json({ error: "Invalid credentials" });
}

```

Without proper tests, potential problems included:

* Logging in with a wrong password returned generic errors but wasn’t validated in practice.

* Nonexistent usernames weren’t confirmed through integration testing.

### Solution:
We added integration tests to verify these flows:  

```javascript
// user.test.js 
it("✅ should login a user with valid credentials", async () => {
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

  const result = await api.post("/api/users/login").send({
    username: "alice123",
    password: "StrongP@ss123",
  });

  expect(result.status).toBe(200);
  expect(result.body).toHaveProperty("token");
});

```

### Key Improvements:
* Confidence in Auth Flow: Tests now confirm successful login, wrong password, and nonexistent users all behave as expected.

* Error Handling: Consistent JSON error responses improve client-side reliability.

* Security Validation: Ensures bcrypt password comparison is used correctly with real hashed passwords in DB.

**Lessons Learned:**

1. Automated Testing is Essential: Integration tests catch regressions early. 
2. API Reliability: Full coverage for /signup, /login, and /me improves confidence in production readiness. 

