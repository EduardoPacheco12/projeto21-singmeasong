import { createSong } from "../factories/createSong";

describe("Test insert a recommendation", () => {
  it("Tests if you can successfully enter a song recommendation", async () => {
    const song = await createSong();

    cy.intercept("GET", "/").as("getRecommendations");

    cy.visit("http://localhost:3000/");
    cy.wait("@getRecommendations");

    cy.get('[data-cy="name"]').type(song.name);
    cy.get('[data-cy="youtubeLink"]').type(song.youtubeLink);
    cy.get('[data-cy="submit"]').click();

    cy.url().should("equal", "http://localhost:3000/");
  });
});
