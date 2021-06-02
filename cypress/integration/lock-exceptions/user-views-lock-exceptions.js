import { Before, Then } from 'cypress-cucumber-preprocessor/steps'

Before(() => {
    cy.intercept({
        pathname: /lockExceptions$/,
        method: 'GET',
        fixture: 'lock-exceptions.json',
    }).as('fetchLockExceptions')
})

Then('lock exceptions should be fetched', () => {
    cy.wait('@fetchLockExceptions')
})
