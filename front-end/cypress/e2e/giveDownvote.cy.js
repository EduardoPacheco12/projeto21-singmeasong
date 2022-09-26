import { createSong } from "../factories/createSong";

beforeEach(async () => {
  await cy.cleanDb();
});

describe("Test give a downvote", () => {
  it("Test if you can downvote a song recommendation and if the song recommendation below -5, it will be deleted", async () => {
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
            cy.get('[data-cy="ArrowDown"]').click();
            cy.get('[data-cy="ArrowDown"]').click();
            cy.get('[data-cy="ArrowDown"]').click();
            cy.get('[data-cy="ArrowDown"]').click();
            cy.get('[data-cy="ArrowDown"]').click();
            cy.get('[data-cy="ArrowDown"]')
              .click()
              .then(() => {
                cy.get('[data-cy="score"]').should("not.exist");
                cy.url().should("equal", "http://localhost:3000/");
              });
          });
      });
  });
});
