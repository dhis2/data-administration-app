import { When, Then } from 'cypress-cucumber-preprocessor/steps'

When(`the user clicks the 'Batch deletion' button`, () => {
    cy.findByRole('button', { name: 'Batch deletion' }).click()
})

Then('the user is taken to the batch deletion page', () => {
    cy.findByRole('heading', {
        name: 'Lock Exception | Batch Deletion',
    }).should('exist')
})

When('the user clicks on the batch delete button for a batch', () => {
    cy.getWithDataTest('{dhis2-uicore-tablerow}')
        .findByRole('button', { name: 'Batch delete lock exceptions' })
        .click()
})

Then('a confirmation modal appears', () => {
    cy.getWithDataTest('{dhis2-uicore-modal}').should('exist')
})

When(`the user clicks the modal's 'Yes, remove lock exception' button`, () => {
    cy.findByRole('button', { name: 'Yes, remove lock exception' }).click()
})

Then('the lock exceptions are batch deleted', () => {
    cy.wait('@deleteLockException')
})
