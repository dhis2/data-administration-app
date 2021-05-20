import { Before, Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Before(() => {
    cy.intercept({ pathname: /maintenance$/, method: 'POST' }, req => {
        const formData = new TextDecoder().decode(req.body)
        const expectFieldValue = (field, value) => {
            expect(formData.includes(`name="${field}"\r\n\r\n${value}`)).to.be
                .true
        }
        const trueFields = [
            'analyticsTableClear',
            'analyticsTableAnalyze',
            'zeroDataValueRemoval',
        ]
        const falseFields = [
            'softDeletedDataValueRemoval',
            'softDeletedEventRemoval',
            'softDeletedEnrollmentRemoval',
            'softDeletedTrackedEntityInstanceRemoval',
            'periodPruning',
            'expiredInvitationsClear',
            'sqlViewsDrop',
            'sqlViewsCreate',
            'categoryOptionComboUpdate',
            'ouPathsUpdate',
            'cacheClear',
            'appReload',
        ]
        trueFields.forEach(field => expectFieldValue(field, true))
        falseFields.forEach(field => expectFieldValue(field, false))

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
