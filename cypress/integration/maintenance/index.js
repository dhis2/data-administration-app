import { Before, Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Before(() => {
    cy.intercept({ pathname: /maintenance$/, method: 'POST' }, (req) => {
        const url = new URL(req.url)
        const expectFieldValue = (field, value) => {
            expect(url.searchParams.has(field))
            expect(url.searchParams.get(field)).to.eq(value)
        }
        const checkedFields = [
            'analyticsTableClear',
            'analyticsTableAnalyze',
            'zeroDataValueRemoval',
        ]
        const uncheckedFields = [
            'softDeletedDataValueRemoval',
            'softDeletedEventRemoval',
            'softDeletedEnrollmentRemoval',
            'softDeletedTrackedEntityRemoval',
            'periodPruning',
            'expiredInvitationsClear',
            'sqlViewsDrop',
            'sqlViewsCreate',
            'categoryOptionComboUpdate',
            'ouPathsUpdate',
            'cacheClear',
            'appReload',
        ]
        checkedFields.forEach((field) => expectFieldValue(field, 'true'))
        uncheckedFields.forEach((field) => expectFieldValue(field, null))

        req.reply({
            statusCode: 200,
        })
    }).as('performMaintenance')
})

Given('the user navigated to the maintenance page', () => {
    cy.visit('/#/maintenance')
    cy.findByRole('heading', { name: 'Maintenance' }).should('exist')
})

When('the user selects the functions they would like to run', () => {
    cy.findByRole('checkbox', { name: 'Clear analytics tables' }).click({
        force: true,
    })
    cy.findByRole('checkbox', { name: 'Analyze analytics tables' }).click({
        force: true,
    })
    cy.findByRole('checkbox', { name: 'Remove zero data values' }).click({
        force: true,
    })
})

When(`the user clicks on the 'Perform maintenance' button`, () => {
    cy.findByRole('button', { name: 'Perform maintenance' }).click()
})

Then('the selected functions are run', () => {
    cy.wait('@performMaintenance')
})
