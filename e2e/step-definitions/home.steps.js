const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const home = require('../pages/home.page');
const dhis2Page = require('../pages/dhis2.page.js');

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

  Then(/^I can see the "(.+)" in the page$/, (section) => {
    this.section = section;
    home.isSectionOptionVisible(section);
  });

  Then(/^I can see a description$/, () => {
    expect(home.isSectionDescriptionVisible(this.section)).to.equal(true);
  });

  Then(/^the "(.+)" to the selected section$/, (textLink) => {
    expect(home.getTextLinkFromSection(this.section)).to.equal(textLink);
  });

  Given(/^I click in the "(.+)" in the page$/, (section) => {
    home.getCardForSection(section).click();
  });

  Then(/^the side menu "(.+)" is selected$/, (section) => {
    expect(home.isSectionActiveAtMenu(section)).to.equal(true);
  });

  Then(/^the new section is opened with "(.+)"$/, (header) => {
    expect(browser.element('h1').getText().includes(header)).to.equal(true);
  });
});
