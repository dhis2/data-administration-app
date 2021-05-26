import { Before, Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const JOB_ID = 'JOB_ID'

Before(() => {
    cy.clock()

    cy.intercept({ pathname: /resourceTables$/, method: 'POST' }, req => {
        req.reply(200, {
            response: {
                id: JOB_ID,
            },
        })
    }).as('startResourceTableGenerationTask')

    cy.intercept(
        { pathname: /system\/tasks\/RESOURCE_TABLE/, method: 'GET' },
        req => {
            expect(req.url.endsWith(JOB_ID)).to.be.true
            req.reply(200, [
                {
                    id: JOB_ID,
                    level: 'INFO',
                    message: 'Resource tables generated',
                    completed: true,
                },
            ])
        }
    ).as('pollResourceTableGeneration')
})

Given('the user navigated to the resource tables page', () => {
    cy.visit('/#/resourceTables')
    cy.findByRole('heading', { name: 'Resource Tables' }).should('exist')
})

When(`the user clicks on the 'Generate tables' button`, () => {
    cy.findByRole('button', { name: 'Generate tables' }).click()
})

Then('the resource tables are generated', () => {
    cy.wait('@startResourceTableGenerationTask')
    // Speed up clock due to timeout used for polling
    cy.tick(5000)
    cy.wait('@pollResourceTableGeneration')
})
