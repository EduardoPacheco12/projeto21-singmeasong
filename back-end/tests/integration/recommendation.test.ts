import supertest from "supertest";
import app from "../../src/app.js";
import { createSong } from "./factories/songFactory.js";
import { prisma } from "../../src/database.js";
import { createSongInDatabase } from "./factories/createSongFactory.js";

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
    await createSongInDatabase();

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
    await createSongInDatabase();

    const response = await agent.post("/recommendations/1/downvote").send();

    expect(response.status).toBe(200);
  });

  it("Should return 404 if the song id doesn't exist", async () => {
    const response = await agent.post("/recommendations/1/downvote").send();

    expect(response.status).toBe(404);
  });
});

describe("Test GET /recommendations", () => {
  it("If the db has more than 10 songs registered, it should return an array with only the last 10 recommendations", async () => {
    for (let i = 0; i < 11; i++) {
      await createSongInDatabase();
    }

    const response = await agent.get("/recommendations").send();

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toEqual(10);
  });

  it("If the database has less than 10 songs registered, it must return an array with all the songs", async () => {
    for (let i = 0; i < 5; i++) {
      await createSongInDatabase();
    }

    const response = await agent.get("/recommendations").send();

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toEqual(5);
  });
});

describe("Test GET /recommendations/:id", () => {
  it("Should return an object if a song id exists", async () => {
    await createSongInDatabase();

    const response = await agent.get("/recommendations/1").send();

    expect(response.body).toBeInstanceOf(Object);
  });

  it("Should return 404 if the song id doesn't exist", async () => {
    const response = await agent.get("/recommendations/1").send();

    expect(response.status).toBe(404);
  });
});

describe("Test GET /recommendations/random", () => {
  it("Should return an object if the db has a song registered", async () => {
    for (let i = 0; i < 3; i++) {
      await createSongInDatabase();
    }

    const response = await agent.get("/recommendations/random").send();

    expect(response.body).toBeInstanceOf(Object);
  });

  it("Should return 404 if the db doesn't have a registered song", async () => {
    const response = await agent.get("/recommendations/random").send();

    expect(response.status).toEqual(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
