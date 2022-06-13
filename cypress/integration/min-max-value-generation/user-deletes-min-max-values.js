import { Before, When, Then } from 'cypress-cucumber-preprocessor/steps'

Before(() => {
    cy.intercept(
        {
            pathname: /minMaxValues/,
            method: 'DELETE',
        },
        (req) => {
            req.reply({
                statusCode: 200,
            })
        }
    ).as('deleteMinMaxValues')
})

When(`the user clicks the 'Remove min-max values' button`, () => {
    cy.findByRole('button', { name: 'Remove min-max values' }).click()
})

Then('the min-max values of that organisation unit are deleted', () => {
    cy.wait('@deleteMinMaxValues')
})
