const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const dhis2Page = require('../pages/dhis2.page.js');
const home = require('../pages/home.page');

defineSupportCode(({ Given, When, Then }) => {
    Given(/^that I am logged in to the Sierra Leone DHIS2$/, () => {
        dhis2Page.open();
        if (!dhis2Page.isLoggedIn()) {
            dhis2Page.submitLoginForm('admin', 'district');
        }
        expect(dhis2Page.isLoggedIn()).to.equal(true);
        dhis2Page.isFromLocation('Sierra Leone');
    });

    Given(/^I am on home$/, () => {
        home.open();
    });

    Then(/^the side menu "(.+)" is selected$/, (section) => {
        expect(home.isSectionActiveAtMenu(section)).to.equal(true);
    });

    Then(/^the new section is opened with "(.+)"$/, (header) => {
        expect(browser.element('h1').getText().includes(header)).to.equal(true);
    });

    Then(/^Loading should be displayed$/, () => {
        browser.waitForVisible('#circularLoadingId', 2000);
    });
});
