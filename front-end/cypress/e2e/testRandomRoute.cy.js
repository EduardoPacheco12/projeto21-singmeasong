import { createSong } from "../factories/createSong";

beforeEach(async () => {
  await cy.cleanDb();
});

describe("Test enter in Random Route", () => {
  it("Tests if returns 10 songs or less", async () => {
    const song = await createSong();
    cy.intercept("GET", "/").as("getRecommendations");

    cy.visit("http://localhost:3000/");
    cy.wait("@getRecommendations", 3000);

    cy.get('[data-cy="name"]').type(song.name);
    cy.get('[data-cy="youtubeLink"]')
      .type(song.youtubeLink)
      .then(() => {
        cy.get('[data-cy="submit"]')
          .click()
          .then(() => {
            cy.get('[data-cy="top"]')
              .click()
              .then(() => {
                cy.get('[data-cy="score"]').should("have.length.lessThan", 11);
                cy.url().should("equal", "http://localhost:3000/top");
              });
          });
      });
  });
});
