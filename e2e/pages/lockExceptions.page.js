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

    getTableRows() {
        browser.waitForVisible('.data-table', 5000);
        const table = browser.element('.data-table');
        return table.elements('.data-table__rows > *').value.length;
    }

    getTableRemoveIcons() {
        browser.waitForVisible('.data-table', 5000);
        const table = browser.element('.data-table');
        return table.elements('.material-icons=delete').value.length;
    }

    getTotalExceptions() {
        browser.waitForVisible('.data-table-pager', 5000);
        const pageInfo =  browser.element('.data-table-pager').getText('span');
        const totalExceptions = pageInfo.trim().split(' ').splice(-1)[0];
        return parseInt(totalExceptions, 10);
    }

    removeLockExceptionIcon() {
        browser.waitForVisible('.data-table', 5000);
        const table = browser.element('.data-table');
        const removeIcon = table.elements('.material-icons=delete').value[0];
        return removeIcon;
    }

    confirmRemoveLockExceptionButton() {
        browser.waitForVisible('#feedbackSnackbarId', 5000);
        const snackbar = browser.element('#feedbackSnackbarId');
        const confirmBtn = snackbar.elements('<button>').value[0];
        return confirmBtn;
    }

    notConfirmRemoveLockException() {
        browser.waitForVisible('#feedbackSnackbarId', 5000);
        browser.click('<body>');
    }
}

module.exports = new LockExceptions();
