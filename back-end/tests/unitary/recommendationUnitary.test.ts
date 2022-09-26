import { recommendationService } from "../../src/services/recommendationsService";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { createSong } from "../factories/songFactory";

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

    expect(result).rejects.toEqual({
      type: "conflict",
      message: "Recommendations names must be unique",
    });
    expect(recommendationRepository.create).not.toBeCalled();
  });
});

describe("Test function 'upvote'", () => {
  it("The update function is expected to be called", async () => {
    const song = await createSong();
    const score = Math.floor(Math.random() * (50 - 0) + 0);
    jest.spyOn(recommendationService, "getById").mockResolvedValueOnce({
      id: 1,
      name: song.name,
      youtubeLink: song.youtubeLink,
      score: score,
    });
    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({
      id: 1,
      name: song.name,
      youtubeLink: song.youtubeLink,
      score: score + 1,
    });

    await recommendationService.upvote(1);

    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("There is expected to be a not found error", async () => {
    jest.spyOn(recommendationService, "getById").mockImplementationOnce((): any => {});
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {});

    const result = recommendationService.upvote(1);

    expect(result).rejects.toEqual({
      message: "",
      type: "not_found",
    });
    expect(recommendationRepository.updateScore).not.toBeCalled();
    expect(recommendationRepository.find).toBeCalled();
  });
});

describe("Test function 'downvote'", () => {
  it("The update function is expected to be called and if the score is below -5 the song is deleted", async () => {
    const song = await createSong();
    const score = Math.floor(Math.random() * (50 - 0) + 0);
    jest.spyOn(recommendationService, "getById").mockResolvedValueOnce({
      id: 1,
      name: song.name,
      youtubeLink: song.youtubeLink,
      score: score,
    });
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce({
      id: 1,
      name: song.name,
      youtubeLink: song.youtubeLink,
      score: score,
    });
    jest.spyOn(recommendationRepository, "remove").mockResolvedValueOnce();
    jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({
      id: 1,
      name: song.name,
      youtubeLink: song.youtubeLink,
      score: score - 1,
    });

    await recommendationService.downvote(1);

    expect(recommendationRepository.updateScore).toBeCalled();
    if (score === -5) {
      expect(recommendationRepository.remove).toBeCalled();
    }
  });

  it("There is expected to be a not found error", async () => {
    jest.spyOn(recommendationService, "getById").mockImplementationOnce((): any => {});
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
    jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {});
    jest.spyOn(recommendationRepository, "remove").mockResolvedValueOnce();

    const result = recommendationService.downvote(1);

    expect(result).rejects.toEqual({
      message: "",
      type: "not_found",
    });
    expect(recommendationRepository.remove).not.toBeCalled();
    expect(recommendationRepository.updateScore).not.toBeCalled();
    expect(recommendationRepository.find).toBeCalled();
  });
});

describe("Test function 'getById'", () => {
  it("Should return an object in db", async () => {
    const song = await createSong();
    const score = Math.floor(Math.random() * (50 - 0) + 0);
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce({
      id: 1,
      name: song.name,
      youtubeLink: song.youtubeLink,
      score: score,
    });

    const result = await recommendationRepository.find(1);

    expect(recommendationRepository.find).toBeCalled();
    expect(result).toEqual({
      id: 1,
      name: song.name,
      youtubeLink: song.youtubeLink,
      score: score,
    });
  });

  it("There is expected to return a not found error", async () => {
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

    const result = recommendationService.getByIdOrFail(1);
    console.log(result);

    expect(result).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });
});

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
