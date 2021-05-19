import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Given('the user navigated to the data integrity page', () => {
    cy.visit('/#/data-integrity')
    cy.findByRole('heading', { name: 'Data Integrity' }).should('exist')
})

When(`the user clicks on the 'Run integrity checks' button`, () => {
    // TODO
})

Then('a data integrity check is requested', () => {
    // TODO
})

Then('the user is shown the results of the check', () => {
    // TODO
})
