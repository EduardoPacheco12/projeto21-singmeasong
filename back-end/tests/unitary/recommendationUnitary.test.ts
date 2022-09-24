import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { createSong } from "../factories/songFactory";
import { conflictError } from "../../src/utils/errorUtils";

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("Test function 'insert'", () => {
  it("The create function is expected to be called", async () => {
    const song = await createSong();
    jest.spyOn(recommendationRepository, "findByName").mockResolvedValueOnce(null);
    jest.spyOn(recommendationRepository, "create").mockResolvedValueOnce();

    await recommendationService.insert(song);

    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });

  it("There is expected to be a conflict error", async () => {
    const song = await createSong();
    jest.spyOn(recommendationRepository, "findByName").mockResolvedValueOnce({
      id: 1,
      name: song.name,
      youtubeLink: song.youtubeLink,
      score: 0,
    });
    jest.spyOn(recommendationRepository, "create").mockResolvedValueOnce();

    const result = recommendationService.insert(song);
    console.log(result);

    expect(result).rejects.toEqual({
      type: "conflict",
      message: "Recommendations names must be unique",
    });
    expect(recommendationRepository.create).not.toBeCalled();
  });
});

/* describe("Test function 'upvote'", () => {}); */

/* describe("Test function 'downvote'", () => {}); */

/* describe("Test function 'getById'", () => {}); */

describe("Test function 'get'", () => {
  it("Should return an array with the objects in db", async () => {
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);

    const result = await recommendationService.get();

    expect(recommendationRepository.findAll).toBeCalled();
    expect(result).toBeInstanceOf(Array);
  });
  /*  */
});

/* describe("Test function 'getTop'", () => {}); */

/* describe("Test function 'getRandom'", () => {});  */
