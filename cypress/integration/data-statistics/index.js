import { Before, Given, Then } from 'cypress-cucumber-preprocessor/steps'

Before(() => {
    cy.intercept({ pathname: /dataSummary$/, method: 'GET' }, req => {
        req.reply(200, {
            objectCounts: {},
            activeUsers: {},
            userInvitations: {},
            dataValueCount: {},
            eventCount: {},
        })
    }).as('fetchDataStatistics')
})

Given('the user navigated to the data statistics page', () => {
    cy.visit('/#/data-statistics')
    cy.findByRole('heading', { name: 'Data Statistics' }).should('exist')
})

Then('statistics for the data should be fetched', () => {
    cy.wait('@fetchDataStatistics')
})
