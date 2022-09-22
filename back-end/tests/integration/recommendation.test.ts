import supertest from "supertest";
import app from "../../src/app.js";
import { createSong } from "./factories/songFactory.js";
import { prisma } from "../../src/database.js";

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
});

describe("Test POST /recommendations", () => {
  it("Should return 201 if registered a song in the correct format", async () => {
    const song = await createSong();

    const response = await agent.post("/recommendations").send(song);

    expect(response.status).toBe(201);
  });

  it("Should return 409 if the song has already been registered", async () => {
    const song = await createSong();

    await prisma.recommendation.create({
      data: song,
    });

    const response = await agent.post("/recommendations").send(song);

    expect(response.status).toBe(409);
  });

  it("Should return 422 if the song name isn't a string or is empty", async () => {
    const song = await createSong();

    song.name = "";

    const response = await agent.post("/recommendations").send(song);

    expect(response.status).toBe(422);
  });

  it("Should return 422 if the Youtube's link isn't a YouTube's url", async () => {
    const song = await createSong();

    song.youtubeLink = "aojgftajfpjkdka";

    const response = await agent.post("/recommendations").send(song);

    expect(response.status).toBe(422);
  });
});

describe("Test POST /recommendations/:id/upvote", () => {
  it("Should return 200 if the song id is valid", async () => {
    const song = await createSong();

    await prisma.recommendation.create({
      data: song,
    });

    const response = await agent.post("/recommendations/1/upvote").send();

    expect(response.status).toBe(200);
  });

  it("Should return 404 if the song id doesn't exist", async () => {
    const response = await agent.post("/recommendations/1/upvote").send();

    expect(response.status).toBe(404);
  });
});

describe("Test POST /recommendations/:id/downvote", () => {
  it("Should return 200 if the song id is valid", async () => {
    const song = await createSong();

    await prisma.recommendation.create({
      data: song,
    });

    const response = await agent.post("/recommendations/1/downvote").send();

    expect(response.status).toBe(200);
  });

  it("Should return 404 if the song id doesn't exist", async () => {
    const response = await agent.post("/recommendations/1/downvote").send();

    expect(response.status).toBe(404);
  });
});

describe("Test GET /recommendations", () => {});

describe("Test GET /recommendations/:id", () => {});

describe("Test GET /recommendations/random", () => {});

describe("Test GET /recommendations/top/:amount", () => {});

afterAll(async () => {
  await prisma.$disconnect();
});
