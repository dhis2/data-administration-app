const {expect} = require('chai');
const {defineSupportCode} = require('cucumber');

const maintenance = require('../pages/maintenance.page');

defineSupportCode(({Given, When, Then}) => {
    When(/^I open maintenance page$/, () => {
        maintenance.open();
    });

    Then(/^List of checkboxes and label is displayed$/, () => {

    });

    Then(/^The Select All checkbox is "not checked"$/, () => {

    });

    Then(/^Perform button is disabled$/, () => {

    });

    Then(/^No checkbox is checked$/, () => {

    });

    Then(/^First line only contains Select All checkbox$/, () => {

    });

    When(/^I click "Select all" checkbox$/, () => {

    });

    Then(/^All checkboxes are selected$/, () => {

    });

    Then(/^Perform button is enabled$/, () => {

    });

    Then(/^The Select All checkbox is checked$/, () => {

    });

    When(/^I select four items checkbox$/, () => {

    });

    When(/^I unselect the checkboxes$/, () => {

    });

    Then(/^Only selected checkboxes are selected$/, () => {

    });

    When(/^I unselect last item checkbox$/, () => {

    });

    Then(/^No checkboxes are selected$/, () => {

    });

    When(/^I Click Perform button$/, () => {

    });

    Then(/^The Maintenance is executed$/, () => {

    });
});