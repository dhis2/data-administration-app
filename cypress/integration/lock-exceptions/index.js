import { Given } from 'cypress-cucumber-preprocessor/steps'
import './user-views-lock-exceptions'
import './user-adds-lock-exception'

Given('the user navigated to the lock exceptions page', () => {
    cy.visit('/#/lock-exceptions')
    cy.findByRole('heading', { name: 'Lock Exception Management' }).should(
        'exist'
    )
})
