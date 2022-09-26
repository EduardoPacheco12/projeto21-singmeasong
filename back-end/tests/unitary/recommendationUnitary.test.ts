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
    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce({
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
    } else {
      expect(recommendationRepository.remove).not.toBeCalled();
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

describe("Test function 'getTop'", () => {
  it("It must return an array with the top x music recommendations that will have their amount defined by amount", async () => {
    const array = [];
    const amount = Math.floor(Math.random() * (50 - 0) + 0);
    for (let i = 1; i <= amount; i++) {
      const song = await createSong();
      const sortScore = Math.floor(Math.random() * (50 - 0) + 0);
      const recommendation = {
        id: i,
        ...song,
        score: sortScore,
      };
      array.push(recommendation);
    }
    array.sort((x, y) => {
      return y.score - x.score;
    });
    jest.spyOn(recommendationRepository, "getAmountByScore").mockResolvedValueOnce(array);

    const result = await recommendationService.getTop(amount);

    expect(result.length).toEqual(amount);
    expect(result).toEqual(array);
  });
});

describe("Test function 'getRandom'", () => {
  it("Test the case if you have both types of recommendation", async () => {
    const number = Math.random();
    const songGT = await createSong();
    const songLTE = await createSong();
    jest.spyOn(global.Math, "random").mockReturnValueOnce(number);
    if (number < 0.7) {
      jest.spyOn(recommendationService, "getScoreFilter").mockReturnValueOnce("gt");
      jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([
        {
          id: 1,
          name: songGT.name,
          youtubeLink: songGT.youtubeLink,
          score: 15,
        },
      ]);
    } else {
      jest.spyOn(recommendationService, "getScoreFilter").mockReturnValueOnce("lte");
      jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);
    }
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([
      {
        id: 1,
        name: songLTE.name,
        youtubeLink: songLTE.youtubeLink,
        score: 5,
      },
    ]);

    const result = await recommendationService.getRandom();

    if (number < 0.7) {
      expect(result).toEqual({
        id: 1,
        name: songGT.name,
        youtubeLink: songGT.youtubeLink,
        score: 15,
      });
    } else {
      expect(result).toEqual({
        id: 1,
        name: songLTE.name,
        youtubeLink: songLTE.youtubeLink,
        score: 5,
      });
    }
  });

  it("There is expected to be a not found error", async () => {
    jest.spyOn(global.Math, "random").mockReturnValueOnce(0.8);
    jest.spyOn(recommendationService, "getScoreFilter").mockReturnValueOnce("lte");
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValueOnce([]);

    const result = recommendationService.getRandom();
    console.log(result);

    await expect(result).rejects.toEqual({
      message: "",
      type: "not_found",
    });
  });
});
