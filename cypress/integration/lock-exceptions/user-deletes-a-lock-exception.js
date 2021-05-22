import { Before, When, Then } from 'cypress-cucumber-preprocessor/steps'

Before(() => {
    cy.intercept(
        {
            pathname: /lockExceptions$/,
            method: 'DELETE',
        },
        req => {
            req.reply({
                statusCode: 200,
            })
        }
    ).as('deleteLockException')
})

When(
    'the user clicks on the delete lock exception button for a lock exception',
    () => {
        cy.getWithDataTest('{dhis2-uicore-tablerow}')
            .findByRole('button', { name: 'Remove lock exception' })
            .click()
    }
)

Then('a confirmation modal appears', () => {
    cy.getWithDataTest('{dhis2-uicore-modal}').should('exist')
})

When(`the user clicks the modal's 'Yes, remove lock exception' button`, () => {
    cy.findByRole('button', { name: 'Yes, remove lock exception' }).click()
})

Then('that lock exception is deleted', () => {
    cy.wait('@deleteLockException')
})
