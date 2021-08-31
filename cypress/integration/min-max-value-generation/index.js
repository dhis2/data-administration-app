import { Given, When } from 'cypress-cucumber-preprocessor/steps'
import './user-generates-min-max-values'
import './user-deletes-min-max-values'

Given('the user navigated to the min-max values page', () => {
    cy.visit('/#/min-max-value-generation')
    cy.findByRole('heading', { name: 'Min-Max Value Generation' }).should(
        'exist'
    )
})

When('the user selects a dataset', () => {
    cy.getWithDataTest('{dhis2-uicore-select-input}').click()
    cy.findByRole('checkbox', { name: 'ART monthly summary' }).click({
        force: true,
    })
    // Close multiselect
    cy.get('body').click(0, 0)
})

When('the user selects an organisation unit', () => {
    cy.getWithDataTest('{dhis2-uiwidgets-orgunittree-node-label}').click()
})
