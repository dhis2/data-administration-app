const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const home = require('../pages/home.page');

defineSupportCode(({ Given, When, Then }) => {
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
});
