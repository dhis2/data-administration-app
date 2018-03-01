const {expect} = require('chai');
const {defineSupportCode} = require('cucumber');

const dataStatistics = require('../pages/dataStatistics.page');

defineSupportCode(({Given, When, Then}) => {
    Given(/^I am on data statistics page$/, () => {
        dataStatistics.open();
    });

    Then(/^I Should see table with title "(.+)"$/, (title) => {
        this.title = title;
        expect(dataStatistics.isTableWithTitleVisible(title)).to.equal(true);
    });

    Then(/^"(\d+)" lines with text on left and number on right$/, (count) => {
        expect(dataStatistics.getRowsCountForTableWithTitle(this.title)).to.equal(count);
    });
});