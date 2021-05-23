import { Given } from 'cypress-cucumber-preprocessor/steps'
import './user-generates-min-max-values'
import './user-deletes-min-max-values'

Given('the user navigated to the min-max values page', () => {
    cy.visit('/#/min-max-value-generation')
    cy.findByRole('heading', { name: 'Min-Max Value Generation' }).should(
        'exist'
    )
})
