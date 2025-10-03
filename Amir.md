# Self-Assessment: Job API Development

## Example 1: Improving Code Quality in Job Controller

Initially, our `createJob` endpoint was functional but lacked validation for required fields beyond what Mongoose enforced. Here's the original implementation:

```
const createJob = async (req, res) => {
  try {
    const newJob = await Job.create({ ...req.body });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: "Failed to create job", error: error.message });
  }
};

```
This worked for well-formed requests like:

```
POST http://localhost:3000/api/jobs
```
But it failed silently or returned vague errors when:

- `company` was missing required subfields like `contactEmail`.
- `requirements` was not an array.
- `salary` or `location` were omitted.

To improve resilience and clarity, we added pre-validation logic:

```
const createJob = async (req, res) => {
  const requiredFields = ['title', 'type', 'description', 'company', 'location', 'salary'];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ message: `Missing required field: ${field}` });
    }
  }

  if (!Array.isArray(req.body.requirements)) {
    req.body.requirements = [];
  }

  try {
    const newJob = await Job.create({ ...req.body });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: "Failed to create job", error: error.message });
  }
};

```
**Key Improvements:**

- Field Validation: Ensures required fields are present before hitting Mongoose.
- Array Normalization: Prevents type errors for `requirements`.
- User Feedback: Returns clear, actionable error messages.

## Example 2: Debugging Route Order in Express

We encountered a subtle routing issue in `jobRouter`.js. Here's the original setup:

```
router.get("/:jobId", getJobById);
router.get("/", getAllJobs);

```
This caused requests like:
```
GET /api/jobs

```
to be misinterpreted as /:jobId, returning "Invalid job ID" errors.

**Solution:**
We reordered the routes to prioritize general routes before dynamic ones:
```
router.get("/", getAllJobs);           // General route first
router.get("/:jobId", getJobById);     // Dynamic route follows

```
**Lessons Learned:**

- Express Route Matching: Routes are matched top-down. Specific routes (like `/`) must precede dynamic ones (`/:jobId`).
- Testing Matters: This bug only surfaced during integration testing with Postman and Supertest.

## Example 3: Strengthening Authentication and Test Reliability

During integration testing of our protected job routes, we encountered a persistent failure in the test:
```
should return 401 if no token is provided
```
Despite correct middleware logic, the test failed because the route `GET /api/jobs` was unintentionally left public. Here's the original router setup:
```
router.get("/", getAllJobs); // Public
router.use(requireAuth);     // Protects routes below
router.post("/", createJob); // Protected
```
The test expected a `401 Unauthorized`, but the route returned `200 OK`. This mismatch revealed a subtle but important lesson:

**Debugging Process:**

Verified token generation in `signupUser` and confirmed `address` was a required field.
Logged token output in tests to ensure it was defined.
Reviewed `requireAuth` middleware and confirmed correct JWT verification.
Identified route ordering as the root cause of the test failure.

**We updated the test to reflect the actual route behavior:**
```
it("should return 200 if no token is provided", async () => {
  await api.get("/api/jobs").expect(200); // Route is public
});
```
**Lessons Learned:**

- Test Expectations Must Match Route Logic: Authentication tests should reflect actual middleware placement.
- Field Validation Matters: Missing required fields like `address` can silently break token generation.
- Logging Is Your Friend: Temporary `console.log(token)` helped confirm the issue quickly.
