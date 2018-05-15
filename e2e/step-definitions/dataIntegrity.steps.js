const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const dataIntegrity = require('../pages/dataIntegrity.page');

defineSupportCode(({ Given, When, Then }) => {
    // *********************************************************
    // Background:
    // *********************************************************
    // Shared:
    // that I am logged in to the Sierra Leone DHIS2
    When(/^I open data integrity page$/, () => {
        dataIntegrity.open();
    });

    Then(/^I click run integrity checks$/, () => {
        dataIntegrity.getRunIntegrityCheckBtn().click();
    });


    // *********************************************************
    // Scenario: I want to see if items are displayed
    // *********************************************************
    Then(/^The error items text is red and contain expand arrow/, () => {
        browser.waitForVisible('#circularLoadingId', 60000, true);
        browser.pause(2000);
        expect(dataIntegrity.validateErrorColor()).to.equal(true);
        expect(dataIntegrity.validateErrorExpandIcon()).to.equal(true);
    });

    Then(/^The valid items text is green and contains a green check icon$/, () => {
        expect(dataIntegrity.validateValidColor()).to.equal(true);
        expect(dataIntegrity.validateValidIcon()).to.equal(true);
    });

    Then(/^The errors are displayed first$/, () => {
        dataIntegrity.validateErrorsFirst();
    });

    // *********************************************************
    // Scenario: I want to expand error items
    // *********************************************************
    Then(/^I click to expand in "error" item$/, () => {
        browser.waitForVisible('#circularLoadingId', 60000, true);
        browser.pause(2000);
        if (dataIntegrity.getErrorElements()) {
            expect(dataIntegrity.getErrorElements()[0].element('<button>').getText()).to.equal('keyboard_arrow_down');
            dataIntegrity.getErrorElements()[0].click();
        }
    });

    Then(/^I can see the error description$/, () => {
        expect(dataIntegrity.getAnElementDescription().isVisible()).to.equal(true);
    });

    Then(/^The icon changes to collapse$/, () => {
        expect(dataIntegrity.getErrorElements()[0].element('<button>').getText()).to.equal('keyboard_arrow_up');
    });

    // *********************************************************
    // Scenario: I want to collapse error items
    // *********************************************************
    Then(/^I click collapse item$/, () => {
        browser.pause(2000);
        if (dataIntegrity.getErrorElements()) {
            dataIntegrity.getErrorElements()[0].element('<button>').click();
        }
    });

    Then(/^The description is not displayed$/, () => {
        expect(dataIntegrity.getAnElementDescription().isVisible()).to.equal(false);
    });

    Then(/^The icon changes to expand$/, () => {
        browser.pause(2000);
        expect(dataIntegrity.getErrorElements()[0].element('<button>').getText()).to.equal('keyboard_arrow_down');
    });

    // *********************************************************
    // Scenario: I do not want the correct items to be expanded
    // *********************************************************
    Then(/^I click to expand in "OK" item$/, () => {
        browser.waitForVisible('#circularLoadingId', 60000, true);
        browser.pause(2000);
        if (dataIntegrity.getNoErrorElements()) {
            dataIntegrity.getNoErrorElements()[0].click();
        }
    });

    Then(/^Nothing happens$/, () => {
        expect(dataIntegrity.getAnElementDescription().isVisible()).to.equal(false);
        expect(dataIntegrity.getNoErrorElements()[0].element('<button>').getText()).to.equal('done');
    });
});
