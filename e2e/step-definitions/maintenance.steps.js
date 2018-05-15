const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const maintenance = require('../pages/maintenance.page');

defineSupportCode(({ Given, When, Then }) => {
    const testSelectedMaintenances = [0, 2, 7, 9, 10, 11, 13];
    const testNotSelectedMaintenances = [1, 3, 4, 5, 6, 8, 12, 14];
    const maintenances = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    // *********************************************************
    // Background:
    // *********************************************************
    // Shared:
    // that I am logged in to the Sierra Leone DHIS2
    When(/^I open maintenance page$/, () => {
        maintenance.open();
        browser.pause(2000);
    });

    // *********************************************************
    // Commons:
    // *********************************************************
    When(/^I select some maintenances/, () => {
        testSelectedMaintenances.forEach((i) => { maintenance.clickMaintenance(i); });
    });

    Then(/^Perform maintenance action is disabled$/, () => {
        expect(browser.element('button[id=performMaintenanceBtnId]').isEnabled()).to.equal(false);
    });

    Then(/^No maintenances are selected$/, () => {
        expect(maintenance.checkIfNotSelected(maintenances)).to.equal(true);
    });

    // *********************************************************
    // Scenario: I want to see all items in the page
    // *********************************************************
    Then(/^Possible maintenances are displayed$/, () => {
        expect(maintenance.getMaintenancesElements().length).to.equal(maintenance.getMaintenancesCheckboxes().length);
        expect(maintenance.getMaintenancesElements().length).to.equal(maintenances.length);
    });
    // Commons:
    // Perform maintenance action is disabled
    // No maintenances are selected

    // *********************************************************
    // Scenario: I want to select a few maintanances one by one
    // *********************************************************
    // Commons: I select some maintenances
    Then(/^Selected maintenances are selected$/, () => {
        expect(maintenance.checkIfSelected(testSelectedMaintenances)).to.equal(true);
    });

    Then(/^Not selected maintenances are not selected$/, () => {
        expect(maintenance.checkIfNotSelected(testNotSelectedMaintenances)).to.equal(true);
    });

    Then(/^Perform maintenance action is enabled$/, () => {
        expect(browser.element('button[id=performMaintenanceBtnId]').isEnabled()).to.equal(true);
    });

    // *********************************************************
    // Scenario: I want to be able to unselect maintanances
    // *********************************************************
    // Commons:
    // I select some maintenances
    Then(/^I unselect the maintenances$/, () => {
        testSelectedMaintenances.forEach((i) => { maintenance.clickMaintenance(i); });
    });
    // No maintenances are selected
    // Perform maintenance action is disabled

    // *********************************************************
    // Scenario: I want to perform maintenance
    // *********************************************************
    // Commons:
    // I select some maintenances
    Then(/^I click perform maintenance action$/, () => {
        browser.element('button[id=performMaintenanceBtnId]').click();
    });

    Then(/^The maintenance is executed$/, () => {
        browser.waitForVisible('span[id=feedbackSnackbarId]');
    });
});
