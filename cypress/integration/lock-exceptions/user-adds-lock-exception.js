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
        req => {
            req.reply({
                statusCode: 200,
            })
        }
    ).as('addLockException')
})

When(`the user clicks on the 'Add lock exception' button`, () => {
    cy.findByRole('button', { name: 'Add lock exception' }).click()
})

Then('a modal appears', () => {
    cy.getWithDataTest('{add-lock-exception-modal}').should('exist')
    cy.wait('@fetchDataSets')
})

When('the user selects a data set', () => {
    cy.getWithDataTest('{add-lock-exception-modal-select-data-set}')
        .find('.d2-ui-selectfield')
        .click()
    cy.findByRole('menuitem', { name: 'ART monthly summary' }).click()
})

Then('organisation units are fetched', () => {
    cy.wait('@fetchOrganisationUnitLevels')
    cy.wait('@fetchOrganisationUnitGroups')
})

When('the user selects an organisation unit', () => {
    cy.getWithDataTest('{add-lock-exception-modal-org-unit-tree}')
        .findByRole('button', { name: 'Bo' })
        .find('input[type="checkbox"]')
        .click()
})

When('the user selects a period', () => {
    cy.getWithDataTest('{period-picker-option-year}').click()
    cy.findByRole('menuitem', { name: '2014' }).click()

    cy.getWithDataTest('{period-picker-option-month}').click()
    cy.findByRole('menuitem', { name: 'jan' }).click()
})

When(`the user clicks the modal's 'Add lock exception' button`, () => {
    cy.getWithDataTest('{add-lock-exception-modal-actions}')
        .findByRole('button', { name: 'Add lock exception' })
        .click()
})

Then('the lock exception should be added', () => {
    cy.wait('@addLockException')
})
