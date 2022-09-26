import { createSong } from "../factories/createSong";

beforeEach(async () => {
  await cy.cleanDb();
});

describe("Test give a upvote in home", () => {
  it("Test if you can upvote a song recommendation", async () => {
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
            cy.get('[data-cy="ArrowUp"]')
              .click()
              .then(() => {
                cy.get('[data-cy="score"]').should("contain.text", "1");
                cy.url().should("equal", "http://localhost:3000/");
              });
          });
      });
  });
});

describe("Test give a upvote in top", () => {
  it("Test if you can upvote a song recommendation", async () => {
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
            cy.get('[data-cy="ArrowUp"]')
              .click()
              .then(() => {
                cy.get('[data-cy="top"]')
                  .click()
                  .then(() => {
                    cy.get('[data-cy="score"]').should("contain.text", "1");
                    cy.url().should("equal", "http://localhost:3000/top");
                  });
              });
          });
      });
  });
});
