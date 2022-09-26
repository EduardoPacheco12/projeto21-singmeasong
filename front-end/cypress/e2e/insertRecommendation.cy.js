import { createSong } from "../factories/createSong";

beforeEach(async () => {
  await cy.cleanDb();
});

describe("Test insert a recommendation", () => {
  it("Tests if you can successfully enter a song recommendation", async () => {
    const song = await createSong();

    cy.intercept("GET", "/").as("getRecommendations");

    cy.visit("http://localhost:3000/");
    cy.wait("@getRecommendations");

    cy.get('[data-cy="name"]').type(song.name);
    cy.wait(100);
    cy.get('[data-cy="youtubeLink"]').type(song.youtubeLink);
    cy.wait(100);
    cy.get('[data-cy="submit"]').click();

    cy.contains(song.name).should("be.visible");
    cy.url().should("equal", "http://localhost:3000/");
  });
});
