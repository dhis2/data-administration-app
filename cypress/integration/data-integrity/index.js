import { Before, Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const JOB_ID = 'JOB_ID'

Before(() => {
    cy.intercept({ pathname: /dataIntegrity$/, method: 'POST' }, req => {
        req.reply(200, {
            response: {
                id: JOB_ID,
            },
        })
    })

    cy.intercept(
        { pathname: /system\/taskSummaries\/DATA_INTEGRITY/, method: 'GET' },
        req => {
            expect(req.url.endsWith(JOB_ID)).to.be.true
            req.reply(200, {
                errors: ['Element 1', 'Element 2', 'Element 3'],
                errorsWithSubheaders: {
                    subheader: ['Value 1', 'Value 2'],
                },
                passed: {},
            })
        }
    ).as('pollDataIntegrityCheck')
})

Given('the user navigated to the data integrity page', () => {
    cy.clock()
    cy.visit('/#/data-integrity')
    cy.findByRole('heading', { name: 'Data Integrity' }).should('exist')
})

When(`the user clicks on the 'Run integrity checks' button`, () => {
    cy.findByRole('button', { name: 'Run integrity checks' }).click()
})

Then('a data integrity check is requested', () => {
    cy.tick(5000)
    cy.wait('@pollDataIntegrityCheck')
})

Then('the user is shown the results of the check', () => {
    // TODO
})
