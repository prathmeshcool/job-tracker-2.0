const request = require("supertest");
const app = require("../server");

// These are integration tests — run against a real test DB
// Set TEST_MONGO_URI in your .env for isolated testing

describe("Auth Routes", () => {
  const testUser = {
    name: "Test User",
    email: `test_${Date.now()}@example.com`,
    password: "password123",
  };

  let token;

  it("POST /auth/register — should register a new user", async () => {
    const res = await request(app).post("/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(testUser.email);
    token = res.body.token;
  });

  it("POST /auth/register — should reject duplicate email", async () => {
    const res = await request(app).post("/auth/register").send(testUser);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/already registered/i);
  });

  it("POST /auth/login — should login successfully", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("POST /auth/login — should reject wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(401);
  });
});

describe("Jobs Routes", () => {
  let token;
  let jobId;

  beforeAll(async () => {
    const res = await request(app).post("/auth/register").send({
      name: "Jobs Tester",
      email: `jobs_${Date.now()}@example.com`,
      password: "password123",
    });
    token = res.body.token;
  });

  it("GET /jobs — should return empty list for new user", async () => {
    const res = await request(app)
      .get("/jobs")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.jobs).toHaveLength(0);
  });

  it("POST /jobs — should create a job", async () => {
    const res = await request(app)
      .post("/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send({ company: "Google", role: "SWE", status: "Applied" });
    expect(res.statusCode).toBe(201);
    expect(res.body.company).toBe("Google");
    jobId = res.body._id;
  });

  it("GET /jobs/stats — should return correct counts", async () => {
    const res = await request(app)
      .get("/jobs/stats")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.Applied).toBe(1);
  });

  it("DELETE /jobs/:id — should delete the job", async () => {
    const res = await request(app)
      .delete(`/jobs/${jobId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it("GET /jobs — should return 401 without token", async () => {
    const res = await request(app).get("/jobs");
    expect(res.statusCode).toBe(401);
  });
});
