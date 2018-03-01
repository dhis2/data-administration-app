const {expect} = require('chai');
const {defineSupportCode} = require('cucumber');

const lockExceptions = require('../pages/lockExceptions.page');

defineSupportCode(({Given, When, Then}) => {
    When(/^I open lock exceptions page$/, () => {
        lockExceptions.open();
    });

    Then(/^A list of Lock Exceptions is displayed$/, () => {

    });

    Then(/^Pagination is displayed$/, () => {

    });

    Then(/^Number of rows are displayed$/, () => {

    });

    Then(/^User can see a Button to add Exception$/, () => {

    });

    When(/^I Select one item in the list$/, () => {

    });

    When(/^I can see Remove button$/, () => {

    });

    When(/^I click remove$/, () => {

    });

    Then(/^The exception is removed$/, () => {

    });

    When(/^I Click in Add button$/, () => {

    });

    Then(/^Add lock exception option is displayed$/, () => {

    });

    Then(/^Organization list is displayed$/, () => {

    });

    Then(/^Level and group is displayed$/, () => {

    });

    Then(/^Data set is displayed$/, () => {

    });

    Then(/^Period selection is displayed$/, () => {

    });

    When(/^I Select Organization$/, () => {

    });

    When(/^I select level and Group$/, () => {

    });

    When(/^I select Data Set$/, () => {

    });

    When(/^I select period$/, () => {

    });

    When(/^Click Add$/, () => {

    });

    Then(/^The exception is added to the list of exceptions$/, () => {

    });
});