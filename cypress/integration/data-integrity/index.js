import { Before, Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const JOB_ID = 'JOB_ID'

Before(() => {
    cy.clock()

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
                dataElementsWithoutDataSet: [
                    'Element 1',
                    'Element 2',
                    'Element 3',
                ],
                indicatorsWithoutGroups: {
                    subheader: ['Value 1', 'Value 2'],
                },
                validationRulesWithoutGroups: {},
            })
        }
    ).as('pollDataIntegrityCheck')
})

Given('the user navigated to the data integrity page', () => {
    cy.visit('/#/data-integrity')
    cy.findByRole('heading', { name: 'Data Integrity' }).should('exist')
})

When(`the user clicks on the 'Run integrity checks' button`, () => {
    cy.findByRole('button', { name: 'Run integrity checks' }).click()
})

Then('a data integrity check is requested', () => {
    // Speed up clock due to timeout used for polling
    cy.tick(5000)
    cy.wait('@pollDataIntegrityCheck')
})

Then('the user is shown the results of the check', () => {
    const expectedCardTitles = [
        'Data elements without data set (3)',
        'Indicators without groups (2)',
        'Validation rules without groups',
    ]
    cy.getWithDataTest('{issue-card-title}').each(($ct, index) => {
        if (index < expectedCardTitles.length) {
            expect($ct.text()).to.equal(expectedCardTitles[index])
        }
    })
})
