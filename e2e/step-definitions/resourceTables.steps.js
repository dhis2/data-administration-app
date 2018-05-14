const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const resourceTables = require('../pages/resourceTables.page');

defineSupportCode(({ Given, When, Then }) => {
    When(/^I open resource tables page$/, () => {
        resourceTables.open();
    });

    // *********************************************************
    // Scenario: I want to see if the items are displayed
    // *********************************************************
    Then(/^The resource item with name "(.+)" and "(.+)" tag is displayed$/, (name, tag) => {
        this.name = name;
        this.tag = tag;
        browser.waitForVisible('div[class^=ResourceTables__description]', 5000);
        expect(resourceTables.resourceItemIsDisplayed(name, tag)).to.equal(true);
    });

    Then(/^Generate tables action is enabled$/, () => {
        browser.waitForVisible('button[id=generateTablesBtnId]', 5000);
        expect(browser.element('button[id=generateTablesBtnId]').isEnabled()).to.equal(true);
    });

    // *********************************************************
    // Scenario: I want to generate the resource tables
    // *********************************************************
    Then(/^I click generate tables action$/, () => {
        browser.waitForVisible('button[id=generateTablesBtnId]', 5000);
        browser.element('button[id=generateTablesBtnId]').click();
    });

    Then(/^Generate tables action is disabled$/, () => {
        expect(browser.element('button[id=generateTablesBtnId]').isEnabled()).to.equal(false);
    });
});
