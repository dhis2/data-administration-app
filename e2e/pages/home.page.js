const Page = require('./page');

class HomePage extends Page {
  constructor() {
    super();
  }

  /**
  * ACTIONS
  */
  open() {
    super.open();
  }

  get title() {
    browser.waitForExist('title', 5000);
    return browser.getTitle();
  }
}

module.exports = new HomePage();
