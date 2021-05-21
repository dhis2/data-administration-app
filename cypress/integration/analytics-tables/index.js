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
            expect(req.url.endsWith(JOB_ID)).to.be.true
            req.reply(200, [
                {
                    id: JOB_ID,
                    level: 'INFO',
                    message: 'Analytics tables updated',
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
    cy.tick(5000)
    cy.wait('@pollAnalyticsTablesExport')
})
