const {expect} = require('chai');
const {defineSupportCode} = require('cucumber');

const minMaxValueGeneration = require('../pages/minMaxValueGeneration.page');

defineSupportCode(({Given, When, Then}) => {
    When(/^I open min max value generation page$/, () => {
        minMaxValueGeneration.open();
    });

    Then(/^A column with list of Data Set is displayed$/, () => {

    });

    Then(/^A column with Organization Unit Selection checkboxes$/, () => {

    });

    Then(/^Generate button$/, () => {

    });

    Then(/^Remove button$/, () => {

    });

    When(/^User selects Data Set$/, () => {

    });

    When(/^User expands Organization Unit Selection$/, () => {

    });

    Then(/^User can select several checkboxes$/, () => {

    });

    Then(/^User can click in Generate$/, () => {

    });

    Then(/^User can click in Remove$/, () => {

    });
});