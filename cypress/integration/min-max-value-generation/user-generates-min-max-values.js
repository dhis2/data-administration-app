import { Before, When, Then } from 'cypress-cucumber-preprocessor/steps'

Before(() => {
    cy.intercept(
        {
            pathname: /minMaxValues$/,
            method: 'POST',
        },
        req => {
            req.reply({
                statusCode: 200,
            })
        }
    ).as('generateMinMaxValues')
})

When('the user selects a dataset', () => {
    // Both lines are needed in order for the <select multiple> element to
    // register the selection
    cy.get('select').select('ART monthly summary')
    cy.findByRole('option', { name: 'ART monthly summary' }).click()
})

When('the user selects an organisation unit', () => {
    cy.getWithDataTest('{dhis2-uiwidgets-orgunittree-node-label}').click()
})

When(`the user clicks the 'Generate min-max values' button`, () => {
    cy.findByRole('button', { name: 'Generate min-max values' }).click()
})

Then('min-max values are generated for that organisation unit', () => {
    cy.wait('@generateMinMaxValues')
})
