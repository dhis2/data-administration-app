import { Before, Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const JOB_ID = 'JOB_ID'

Before(() => {
    cy.clock()

    cy.intercept(
        { pathname: /resourceTables\/analytics$/, method: 'POST' },
        req => {
            req.reply(200, {
                response: {
                    id: JOB_ID,
                },
            })
        }
    ).as('startAnalyticsTablesExportTask')

    cy.intercept(
        { pathname: /system\/tasks\/ANALYTICS_TABLE/, method: 'GET' },
        req => {
            // Handle request for in-progress tasks
            if (req.url.endsWith('ANALYTICS_TABLE')) {
                req.reply(200, null)
                return
            }

            expect(req.url.endsWith(JOB_ID)).to.be.true
            req.reply(200, [
                {
                    id: JOB_ID,
                    level: 'INFO',
                    message: 'Analytics tables updated',
                    time: new Date(),
                    completed: true,
                },
            ])
        }
    ).as('pollAnalyticsTablesExport')
})

Given('the user navigated to the analytics tables page', () => {
    cy.visit('/#/analytics')
    cy.findByRole('heading', { name: 'Analytics tables management' }).should(
        'exist'
    )
})

When(`the user clicks on the 'Start export' button`, () => {
    cy.findByRole('button', { name: 'Start export' }).click()
})

Then('the tables are exported', () => {
    cy.wait('@startAnalyticsTablesExportTask')
    // Speed up clock due to timeout used for polling
    cy.tick(5000)
    cy.wait('@pollAnalyticsTablesExport')
    cy.getWithDataTest('{notifications-table}')
        .findByRole('cell', { name: /Analytics tables updated/ })
        .should('exist')
})
