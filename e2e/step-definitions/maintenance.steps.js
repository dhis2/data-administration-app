const {expect} = require('chai');
const {defineSupportCode} = require('cucumber');

const maintenance = require('../pages/maintenance.page');

defineSupportCode(({Given, When, Then}) => {
    When(/^I open maintenance page$/, () => {
        maintenance.open();
    });

    Then(/^List of checkboxes and label is displayed$/, () => {

    });

    Then(/^Perform button is disabled$/, () => {

    });

    Then(/^No checkbox is checked$/, () => {

    });

    When(/^I select four items checkbox$/, () => {

    });

    Then(/^Only selected checkboxes are selected$/, () => {

    });

    Then(/^Perform button is enabled$/, () => {

    });

    When(/^I unselect the checkboxes$/, () => {

    });

    Then(/^No checkboxes are selected$/, () => {

    });

    When(/^I Click Perform button$/, () => {

    });

    Then(/^The Maintenance is executed$/, () => {

    });
});