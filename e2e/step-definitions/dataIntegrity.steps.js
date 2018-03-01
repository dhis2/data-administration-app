const {expect} = require('chai');
const {defineSupportCode} = require('cucumber');

const dataIntegrity = require('../pages/dataIntegrity.page');

defineSupportCode(({Given, When, Then}) => {
    Given(/^I open data integrity page$/, () => {
        dataIntegrity.open();
    });

    Then(/^Loading should be displayed$/, () => {

    });

    Then(/^The error items text are red and contain expand button$/, () => {

    });

    Then(/^The valid items text are green and contains a green check icon$/, () => {

    });

    Then(/^The errors are displayed first$/, () => {

    });

    Then(/^I click to expand in "error" item$/, () => {

    });

    Then(/^I can see the error description$/, () => {

    });

    Then(/^The icon changes to collapse$/, () => {

    });

    Then(/^I click collapse item$/, () => {

    });

    Then(/^The item is collapsed$/, () => {

    });

    Then(/^The description is not displayed$/, () => {

    });

    Then(/^The icon changes to expand$/, () => {

    });

    Then(/^I click to expand in "OK" item$/, () => {

    });

    Then(/^Nothing happens$/, () => {

    });
});