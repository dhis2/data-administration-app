const { expect } = require('chai');
const { defineSupportCode } = require('cucumber');

const homePage = require('../pages/home.page');

defineSupportCode(({ Given, When, Then }) => {
  Given(/^I am on homepage$/, () => {
    homePage.open();
  });

  Then(/^I should see the correct title$/, () => {
    expect(homePage.title).to.equal('Data Administration');
  });
});
