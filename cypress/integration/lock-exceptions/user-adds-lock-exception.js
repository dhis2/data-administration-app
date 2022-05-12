import { Before, When, Then } from 'cypress-cucumber-preprocessor/steps'

Before(() => {
    cy.intercept({
        pathname: /dataSets$/,
        method: 'GET',
        fixture: 'data-sets.json',
    }).as('fetchDataSets')

    cy.intercept({
        pathname: /organisationUnitLevels$/,
        method: 'GET',
        fixture: 'organisation-unit-levels.json',
    }).as('fetchOrganisationUnitLevels')
    cy.intercept({
        pathname: /organisationUnitGroups$/,
        method: 'GET',
        fixture: 'organisation-unit-groups.json',
    }).as('fetchOrganisationUnitGroups')

    cy.intercept(
        {
            pathname: /lockExceptions$/,
            method: 'POST',
        },
        (req) => {
            req.reply({
                statusCode: 200,
            })
        }
    ).as('addLockException')
})

When(`the user clicks on the 'Add lock exception' button`, () => {
    cy.findByRole('button', { name: 'Add lock exception' }).click()
})

Then('the user is sent to the add lock exception page', () => {
    cy.url().should('contain', '/lock-exceptions/add')
    cy.wait('@fetchDataSets')
})

When('the user selects a data set', () => {
    cy.getWithDataTest('{add-lock-exception-select-data-set}').click()
    cy.getWithDataTest('{dhis2-uicore-singleselectoption}')
        .first()
        .click({ force: true })
})

Then('organisation units are fetched', () => {
    cy.wait('@fetchOrganisationUnitLevels')
    cy.wait('@fetchOrganisationUnitGroups')
})

When('the user selects an organisation unit', () => {
    cy.getWithDataTest('{add-lock-exception-org-unit-tree}')
        .findByRole('checkbox', { name: 'Bo' })
        .click({ force: true })
})

When('the user selects a period', () => {
    cy.getWithDataTest('{period-picker-option-year}').click()
    cy.contains('2014').click()

    cy.getWithDataTest('{period-picker-option-month}').click()
    cy.contains('jan').click()
})

When(`the user clicks on the 'Add lock exception' button`, () => {
    cy.findByRole('button', { name: 'Add lock exception' }).click()
})

Then('the lock exception should be added', () => {
    cy.wait('@addLockException')
})
