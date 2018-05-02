const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const lockExceptions = require('../pages/lockExceptions.page');

defineSupportCode(({ Given, When, Then }) => {
    let exceptionBefore;
    // *********************************************************
    // Background:
    // *********************************************************
    // Shared: that I am logged in to the Sierra Leone DHIS2
    When(/^I open lock exceptions page$/, () => {
        lockExceptions.open();
    });

    // *********************************************************
    // Commons:
    // *********************************************************
    Then(/^I click one of the remove lock exception icons$/, () => {
        exceptionBefore = lockExceptions.getTotalExceptions();
        lockExceptions.removeLockExceptionIcon().click();
    });

    Then(/^I click in add lock exception button in list screen$/, () => {
        exceptionBefore = lockExceptions.getTotalExceptions();
        lockExceptions.addLockExceptionButton().click();
    });

    Then(/^I click batch deletion button$/, () => {

    });

    // *********************************************************
    // Scenario: I want to see all Lock Exceptions in the page
    // *********************************************************
    Then(/^A list of exceptions is displayed$/, () => {
        browser.waitForVisible('.data-table', 5000);
    });

    Then(/^Pagination and number of rows are displayed$/, () => {
        browser.waitForVisible('.data-table-pager', 5000);
    });

    Then(/^I can see a button to add lock a exception$/, () => {
        browser.waitForVisible('#addExceptionButtonId', 5000);
    });

    Then(/^For each lock exception there is a remove icon$/, () => {
        expect(lockExceptions.getTableRows()).to.equal(lockExceptions.getTableRemoveIcons());
    });

    // *********************************************************
    // Scenario: I want to remove the lock exception
    // *********************************************************
    // Commons: I click one of the remove lock exception icons
    Then(/^I confirm lock exception removal$/, () => {
        lockExceptions.confirmRemoveLockExceptionButton().click();
    });

    Then(/^The exception is removed$/, () => {
        expect(lockExceptions.getTotalExceptions()).to.equal(exceptionBefore - 1);
    });

    // *********************************************************
    // Scenario: I do not want to remove lock exception
    // *********************************************************
    // Commons: I click remove lock exception icon
    Then(/^I do not confirm lock exception removal$/, () => {
        lockExceptions.notConfirmRemoveLockException();
    });

    Then(/^The exception is not removed$/, () => {
        expect(lockExceptions.getTotalExceptions()).to.equal(exceptionBefore);
    });

    // *********************************************************
    // Scenario: I want to see the screen to add lock exception
    // *********************************************************
    // Commons: I click in add lock exception button in list screen
    Then(/^Add lock exception form is displayed$/, () => {
        browser.waitForVisible('#addLockExceptionFormId', 5000);
    });

    Then(/^A select a data set for new lock exception is displayed$/, () => {
        browser.waitForVisible('.d2-ui-selectfield', 5000);
    });

    Then(/^I select a data set for new lock exception$/, () => {
        expect(lockExceptions.selectADataSet()).to.equal(lockExceptions.getSelectedDataSet());
    });

    Then(/^Organization unit tree is displayed$/, () => {
        browser.waitForVisible('.tree-view', 5000);
    });

    Then(/^Period select is displayed$/, () => {
        browser.waitForVisible('#idPeriodPicker', 2000);
    });

    Then(/^Organization unit level select is displayed$/, () => {
        browser.waitForVisible('div[id*="Selectitem-OrganisationUnitLevel"]', 2000);
    });

    Then(/^Organization unit group select is displayed$/, () => {
        browser.waitForVisible('div[id*="Selectitem-OrganisationUnitGroup"]', 2000);
    });

    // *********************************************************
    // Scenario: I want to add lock exceptions
    // *********************************************************
    // Commons: I click in add lock exception button in list screen
    Then(/^I select organization set$/, () => {

    });

    Then(/^I select level and group$/, () => {

    });

    Then(/^I select a data set$/, () => {

    });

    Then(/^I select period$/, () => {

    });

    Then(/^Click add button in add new lock exception form/, () => {

    });

    Then(/^The exception is added to the list of exceptions$/, () => {

    });

    // *********************************************************
    // Scenario: I want to see Batch Deletion section
    // *********************************************************
    // Commons: I click batch deletion button
    Then(/^Title batch deletion is displayed$/, () => {

    });

    Then(/^A list of lock exceptions batch is displayed$/, () => {

    });

    Then(/^For each displayed lock exception batch there is a remove icon$/, () => {

    });

    Then(/^I can return to previous page$/, () => {

    });

    // *********************************************************
    // Scenario: I want to execute batch deletion
    // *********************************************************
    // Commons: I click batch deletion button
    Then(/^I click remove lock exception batch icon$/, () => {

    });

    Then(/^I confirm lock exception batch removal$/, () => {

    });

    Then(/^The exception batch is removed$/, () => {

    });
});
