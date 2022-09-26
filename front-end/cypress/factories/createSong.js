import { faker } from "@faker-js/faker";
import { createYoutubeLink } from "./youtubeLinkFactory";

export async function createSong() {
  const song = {
    name: faker.music.songName(),
    youtubeLink: await createYoutubeLink(),
  };

  return song;
}
