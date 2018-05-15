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

    removeIcon() {
        browser.waitForVisible('.data-table', 5000);
        const table = browser.element('.data-table');
        const removeIcon = table.elements('.material-icons=delete').value[0];
        return removeIcon;
    }

    confirmRemoveSnackbar() {
        browser.waitForVisible('#feedbackSnackbarId', 5000);
        const snackbar = browser.element('#feedbackSnackbarId');
        const confirmBtn = snackbar.elements('<button>').value[0];
        return confirmBtn;
    }

    notConfirmRemoveLockException() {
        browser.waitForVisible('#feedbackSnackbarId', 5000);
        browser.click('<body>');
    }

    addLockExceptionButton() {
        browser.waitForVisible('#addExceptionButtonId', 5000);
        const addLockExceptionButton = browser.element('#addExceptionButtonId');
        return addLockExceptionButton;
    }

    selectADataSet() {
        const selectFieldBtn = browser.element('.d2-ui-selectfield').elements('<button>').value[0];
        selectFieldBtn.click();
        browser.waitForVisible('div[role=menu]', 5000);
        const dropDownMenuOptionOne = browser.element('div[role=menu]').elements('span[role=menuitem]').value[1];
        const dropDownMenuOptionOneText = browser.element('div[role=menu]').elements('span[role=menuitem]')
            .value[1].getText();
        dropDownMenuOptionOne.click();
        return dropDownMenuOptionOneText;
    }

    getSelectedDataSet() {
        return browser.element('.d2-ui-selectfield').elements('div').value[0].getText();
    }

    getOneOrgUnitTreeFromTree() {
        return browser.element('.tree-view').elements('div[role=button]').value[1].element('<input>');
    }

    selectAnYear() {
        const selectYear = browser.element('div[id*=year]');
        selectYear.click();
        browser.waitForVisible('div[role=menu]', 5000);
        const firstYearOption = browser.elements('span[role=menuitem]').value[1];
        firstYearOption.click();
    }

    selectAMonth() {
        const selectMonth = browser.element('div[id*=month]');
        selectMonth.click();
        browser.waitForVisible('div[role=menu]', 5000);
        const firstMonthOption = browser.elements('span[role=menuitem]').value[1];
        firstMonthOption.click();
    }

    getFormAddLockExceptionBtn() {
        const addNewLockExceptionBtn = browser.elements('div[class^=LockException__actionButton]').value[1];
        return addNewLockExceptionBtn;
    }

    getBatchDeletionBtn() {
        browser.waitForVisible('div[class^=LockException__actionButton]', 5000);
        const batchDeletionBtn = browser.elements('div[class^=LockException__actionButton]').value[0];
        return batchDeletionBtn;
    }

    getSubTitle() {
        browser.waitForVisible('span[class^=LockException__subHeader]', 5000);
        const subTitle = browser.elements('span[class^=LockException__subHeader]').value[0];
        return subTitle.getText();
    }
}

module.exports = new LockExceptions();
