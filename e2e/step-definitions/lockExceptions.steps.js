const {expect} = require('chai');
const {defineSupportCode} = require('cucumber');

const lockExceptions = require('../pages/lockExceptions.page');

defineSupportCode(({Given, When, Then}) => {
    // *********************************************************
    // Background:
    // *********************************************************
    // Shared: that I am logged in to the Sierra Leone DHIS2
    When(/^I open lock exceptions page$/, () => {
        lockExceptions.open();
    });

    // *********************************************************
    // Scenario: I want to see all Lock Exceptions in the page
    // *********************************************************
    Then(/^A list of exceptions is displayed$/, () => {
        lockExceptions.isLockExceptionsListVisible();
    });

    Then(/^Pagination and number of rows are displayed$/, () => {
        lockExceptions.isPaginationVisible();
    });

    Then(/^I can see a button to add lock a exception$/, () => {

    });

    When(/^For each lock exception there is a remove icon$/, () => {

    });

    // *********************************************************
    // Scenario: I want to remove the lock exception
    // *********************************************************
    // Commons: I click remove lock exception icon
    Then(/^I confirm lock exception removal$/, () => {

    });

    Then(/^The exception is removed$/, () => {

    });

    // *********************************************************
    // Scenario: I do not want to remove lock exception
    // *********************************************************
    // Commons: I click remove lock exception icon
    Then(/^I do not confirm lock exception removal$/, () => {

    });

    Then(/^The exception is not removed$/, () => {

    });

    // *********************************************************
    // Scenario: I want to see the screen to add lock exception
    // *********************************************************
    // Commons: I click in add lock exception button in list screen
    Then(/^Add lock exception dialog is displayed$/, () => {

    });

    Then(/^A select a data set dropdown is displayed$/, () => {

    });

    Then(/^Organization tree is displayed$/, () => {

    });

    Then(/^Level and group is displayed$/, () => {

    });

    Then(/^Data set is displayed$/, () => {

    });

    Then(/^Period selection is displayed$/, () => {

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

    Then(/^Click add button in add new lock exception dialog$/, () => {

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
    // *********************************************************
    // Commons:
    // *********************************************************
    When(/^I click remove lock exception icon$/, () => {
        lockExceptions.isPaginationVisible();
    });

    When(/^I click in add lock exception button in list screen$/, () => {

    });

    When(/^I click batch deletion button$/, () => {

    });
});
