const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const analyticsTablesManagement = require('../pages/analyticsTablesManagement.page');

defineSupportCode(({ Given, When, Then }) => {
    When(/^I open analytics tables management page$/, () => {
        analyticsTablesManagement.open();
        browser.pause(5000);
    });

    // *********************************************************
    // Scenario: I want to see if the items are displayed
    // *********************************************************
    Then(/^A section with subtitle ANALYTICS TABLES UPDATE$/, () => {
        expect(browser.element('h4').getText().includes('ANALYTICS TABLES UPDATE')).to.equal(true);
    });

    Then(/^Checkboxes to skip generation$/, () => {
        expect(analyticsTablesManagement.getCheckboxesElements().length).to.equal(4);
        expect(analyticsTablesManagement.checkDisabledCheckboxes()).to.equal(false);
        expect(analyticsTablesManagement.getCheckboxesTexts().length).to.equal(4);
        expect(analyticsTablesManagement.getCheckboxesTexts()[0]).to.equal('Skip generation of aggregate data and' +
            ' completeness data');
        expect(analyticsTablesManagement.getCheckboxesTexts()[1]).to.equal('Skip generation of resource tables');
        expect(analyticsTablesManagement.getCheckboxesTexts()[2]).to.equal('Skip generation of event data');
        expect(analyticsTablesManagement.getCheckboxesTexts()[3]).to.equal('Skip generation of enrollment data');
    });

    Then(/^Dropdown for number of last years to include is displayed with eleven elements$/, () => {
        analyticsTablesManagement.getLastYearsSelect().click();
        browser.waitForVisible('div[role="presentation"]', 2000);
        expect(analyticsTablesManagement.getLastYearsOptions()[0].getText()).to.equal('[ All ]');
        expect(analyticsTablesManagement.getLastYearsOptions().length).to.equal(11);
    });

    Then(/^Start export action is enable$/, () => {
        expect(browser.element('button[id=startExportBtnId]').isEnabled()).to.equal(true);
    });

    // *********************************************************
    // Scenario: I want to generate the analytics tables
    // *********************************************************
    Then(/^I change number of last years of data to include$/, () => {
        analyticsTablesManagement.getLastYearsSelect().click();
        browser.waitForVisible('div[role="presentation"]', 2000);
        analyticsTablesManagement.getLastYearsOptions()[3].click();
    });

    Then(/^I execute start export action$/, () => {
        browser.pause(5000);
        browser.element('button[id=startExportBtnId]').click();
    });

    Then(/^Start export action is disabled$/, () => {
        expect(browser.element('button[id=startExportBtnId]').isEnabled()).to.equal(false);
    });

    Then(/^Two columns result table is displayed$/, () => {
        browser.waitForVisible('div[class^=Page__cardContainer] table', 10000);
    });

    Then(/^Checkboxes to skip generation are disabled$/, () => {
        expect(analyticsTablesManagement.checkDisabledCheckboxes()).to.equal(true);
    });

    Then(/^Dropdown for number of last years to include is disabled$/, () => {
        expect(analyticsTablesManagement.getLastYearsSelectButton().isEnabled()).to.equal(false);
    });

    // *********************************************************
    // Scenario: I want to check skip checkboxes
    // *********************************************************
    Then(/^I click checkboxes to skip generation$/, () => {
        analyticsTablesManagement.getCheckboxesElements()[0].click();
        analyticsTablesManagement.getCheckboxesElements()[1].click();
        analyticsTablesManagement.getCheckboxesElements()[2].click();
        analyticsTablesManagement.getCheckboxesElements()[3].click();
    });

    Then(/^The checkboxes to skip generation are checked$/, () => {
        expect(analyticsTablesManagement.areCheckboxesSelected()).to.equal(true);
    });

    Then(/^I am able to uncheck the checkboxes$/, () => {
        analyticsTablesManagement.getCheckboxesElements()[0].click();
        analyticsTablesManagement.getCheckboxesElements()[1].click();
        analyticsTablesManagement.getCheckboxesElements()[2].click();
        analyticsTablesManagement.getCheckboxesElements()[3].click();
        expect(analyticsTablesManagement.areCheckboxesSelected()).to.equal(false);
    });
});
