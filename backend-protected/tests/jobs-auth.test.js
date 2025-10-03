const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Job = require("../models/jobModel");
const User = require("../models/userModel");

const jobs = [
  {
    title: "Frontend Developer",
    type: "Full-time",
    description: "Build and maintain React-based UIs.",
    company: {
      name: "TechNova",
      contactEmail: "hr@technova.com",
      contactPhone: "123-456-7890",
      website: "https://technova.com",
      size: 200,
    },
    location: "Remote",
    salary: 60000,
    experienceLevel: "Mid",
    applicationDeadline: "2025-11-01T00:00:00.000Z",
    requirements: ["React", "CSS", "Git"],
  },
  {
    title: "Backend Developer",
    type: "Contract",
    description: "Develop REST APIs using Node.js.",
    company: {
      name: "CodeWorks",
      contactEmail: "jobs@codeworks.io",
      contactPhone: "987-654-3210",
    },
    location: "Helsinki",
    salary: 55000,
    experienceLevel: "Senior",
    requirements: ["Node.js", "MongoDB", "Express"],
  },
];

let token = null;

beforeAll(async () => {
  await User.deleteMany({});
  const result = await api.post("/api/users/signup").send({
    name: "John Doe",
    username: "johndoe",
    password: "R3g5T7#gh",
    phone_number: "1234567890",
    gender: "Male",
    date_of_birth: "1990-01-01",
    membership_status: "Inactive",
    address: "Test Street 1"
  });
  token = result.body.token;
});

describe("Protected Job Routes", () => {
  beforeEach(async () => {
    await Job.deleteMany({});
    await Promise.all([
      api.post("/api/jobs").set("Authorization", "Bearer " + token).send(jobs[0]),
      api.post("/api/jobs").set("Authorization", "Bearer " + token).send(jobs[1]),
    ]);
  });

  // ---------------- GET ----------------
  it("should return all jobs as JSON when GET /api/jobs is called", async () => {
    const response = await api
      .get("/api/jobs")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(jobs.length);
  });

  it("should return 200 if no token is provided", async () => {
    await api.get("/api/jobs").expect(200); // ✅ Route is public
  });

  // ---------------- POST ----------------
  it("should create one job when POST /api/jobs is called", async () => {
    const newJob = {
      title: "DevOps Engineer",
      type: "Full-time",
      description: "Manage CI/CD pipelines and cloud infrastructure.",
      company: {
        name: "Cloudify",
        contactEmail: "careers@cloudify.com",
        contactPhone: "555-123-4567",
        website: "https://cloudify.com",
        size: 50,
      },
      location: "Remote",
      salary: 70000,
      experienceLevel: "Mid",
      applicationDeadline: "2025-12-01T00:00:00.000Z",
      requirements: ["AWS", "Docker", "CI/CD"],
    };

    const response = await api
      .post("/api/jobs")
      .set("Authorization", "Bearer " + token)
      .send(newJob)
      .expect(201);

    expect(response.body.title).toBe(newJob.title);
  });

  // ---------------- GET by ID ----------------
  it("should return one job by ID", async () => {
    const job = await Job.findOne();
    const response = await api
      .get(`/api/jobs/${job._id}`)
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe(job.title);
  });

  // ---------------- PUT ----------------
  it("should update one job by ID", async () => {
    const job = await Job.findOne();
    const updatedJob = { salary: 75000, status: "closed" };

    const response = await api
      .put(`/api/jobs/${job._id}`)
      .set("Authorization", "Bearer " + token)
      .send(updatedJob)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.salary).toBe(updatedJob.salary);
    expect(response.body.status).toBe(updatedJob.status);

    const updatedJobCheck = await Job.findById(job._id);
    expect(updatedJobCheck.status).toBe("closed");
  });

  // ---------------- DELETE ----------------
  it("should delete one job by ID", async () => {
    const job = await Job.findOne();
    await api
      .delete(`/api/jobs/${job._id}`)
      .set("Authorization", "Bearer " + token)
      .expect(204);

    const jobCheck = await Job.findById(job._id);
    expect(jobCheck).toBeNull();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
