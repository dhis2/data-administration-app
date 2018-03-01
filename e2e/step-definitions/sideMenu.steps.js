const {expect} = require('chai');
const {defineSupportCode} = require('cucumber');

const home = require('../pages/home.page');

defineSupportCode(({Given, When, Then}) => {
    Given(/^I click in the "(.+)" in the sidemenu/, (section) => {
        home.getMenuItemForSection(section).click();
    });
});