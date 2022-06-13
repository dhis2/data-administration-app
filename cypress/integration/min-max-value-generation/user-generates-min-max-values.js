import { Before, When, Then } from 'cypress-cucumber-preprocessor/steps'

Before(() => {
    cy.intercept(
        {
            pathname: /minMaxValues$/,
            method: 'POST',
        },
        (req) => {
            req.reply({
                statusCode: 200,
            })
        }
    ).as('generateMinMaxValues')
})

When(`the user clicks the 'Generate min-max values' button`, () => {
    cy.findByRole('button', { name: 'Generate min-max values' }).click()
})

Then('min-max values are generated for that organisation unit', () => {
    cy.wait('@generateMinMaxValues')
})
