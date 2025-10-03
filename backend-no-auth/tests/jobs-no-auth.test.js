const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app"); // Express app (already connects to DB)
const api = supertest(app);
const Job = require("../models/jobModel");

// Seed data for tests
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

// Reset the jobs collection before each test
beforeEach(async () => {
  await Job.deleteMany({});
  await Job.insertMany(jobs);
});

// ---------------- GET ----------------
describe("GET /api/jobs", () => {
  it("should return all jobs as JSON", async () => {
    const response = await api
      .get("/api/jobs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(jobs.length);
    expect(response.body[0].title).toBe(jobs[0].title);
  });
});

describe("GET /api/jobs/:id", () => {
  it("should return one job by ID", async () => {
    const job = await Job.findOne();
    const response = await api
      .get(`/api/jobs/${job._id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe(job.title);
  });

  it("should return 404 for a non-existing job ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    await api.get(`/api/jobs/${nonExistentId}`).expect(404);
  });
});

// ---------------- POST ----------------
describe("POST /api/jobs", () => {
  it("should create a new job", async () => {
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
      .send(newJob)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    expect(response.body.title).toBe(newJob.title);

    const jobsAfterPost = await Job.find({});
    expect(jobsAfterPost).toHaveLength(jobs.length + 1);
  });
});

// ---------------- PUT ----------------
describe("PUT /api/jobs/:id", () => {
  it("should update a job with partial data", async () => {
    const job = await Job.findOne();
    const updatedJob = { salary: 75000, status: "closed" };

    const response = await api
      .put(`/api/jobs/${job._id}`)
      .send(updatedJob)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.salary).toBe(updatedJob.salary);
    expect(response.body.status).toBe(updatedJob.status);

    const updatedJobCheck = await Job.findById(job._id);
    expect(updatedJobCheck.status).toBe("closed");
  });

  it("should return 400 for invalid job ID", async () => {
    const invalidId = "12345";
    await api.put(`/api/jobs/${invalidId}`).send({}).expect(400);
  });
});

// ---------------- DELETE ----------------
describe("DELETE /api/jobs/:id", () => {
  it("should delete a job by ID", async () => {
    const job = await Job.findOne();
    await api.delete(`/api/jobs/${job._id}`).expect(204);

    const deletedJobCheck = await Job.findById(job._id);
    expect(deletedJobCheck).toBeNull();
  });

  it("should return 400 for invalid job ID", async () => {
    const invalidId = "12345";
    await api.delete(`/api/jobs/${invalidId}`).expect(400);
  });
});

// Close DB connection once after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
