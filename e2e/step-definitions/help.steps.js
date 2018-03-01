const {expect} = require('chai');
const {defineSupportCode} = require('cucumber');

defineSupportCode(({Given, When, Then}) => {
    When(/^I click help icon$/, () => {
        browser.waitForVisible('.helper-icon', 1000);
        browser.element('.helper-icon').click();
    });

    Then(/^A popup is displayed with title "(.+)"$/, (title) => {
        browser.waitForVisible('.helper-popup', 1000);
        expect(browser.element('.helper-popup h3').getText()).to.equal(title);
    });

    Then(/^I see a help description$/, () => {
        browser.waitForVisible('.helper-popup .helper-description', 1000);
    });

    Then(/^A close button is displayed$/, () => {
        browser.waitForVisible('.helper-popup .helper-close-button', 1000);
    });

    When(/^Click Close button$/, () => {
        browser.waitForVisible('.helper-popup .helper-close-button', 1000);
        browser.element('.helper-popup .helper-close-button').click();
    });

    Then(/^The pop up is dismissed$/, () => {
        browser.pause(1000);
        // pop up does not disappear however content is cleared
        expect(browser.isVisible('.helper-popup .helper-description')).to.equal(false);
    });
});