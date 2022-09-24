import { prisma } from "../../src/database";
import { createYoutubeLink } from "./youtubeLinkFactory";
import { faker } from "@faker-js/faker";

export async function createSongInDatabase() {
  const song = {
    name: faker.music.songName(),
    youtubeLink: await createYoutubeLink(),
  };

  await prisma.recommendation.create({
    data: song,
  });
}
