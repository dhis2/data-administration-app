const Page = require('./page');

class LockExceptions extends Page {
    constructor() {
        super();
    }

    /**
     * ACTIONS
     */
    open() {
        super.open('#/lock-exception');
    }

    isLockExceptionsListVisible() {
        browser.waitForVisible('.data-table', 8000);
    }

    isPaginationVisible() {
        browser.waitForVisible('.data-table-pager', 8000);
    }
}

module.exports = new LockExceptions();
