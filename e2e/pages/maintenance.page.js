const Page = require('./page');

class Maintenance extends Page {
    constructor() {
        super();
    }

    /**
     * ACTIONS
     */
    open() {
        super.open('#/maintenance');
    }


    getMaintenancesElements() {
        const grid = browser.element('div[class^=Page__gridContainer');
        return grid.elements('div[class*=Page__formControl').value;
    }

    getMaintenancesCheckboxes() {
        return browser.elements('input[type=checkbox]').value;
    }

    clickMaintenance(index) {
        browser.elements('input[type=checkbox]').value[index].click();
    }

    isMaintenanceChecked(index) {
        const checkedCheckbox =  browser.elements('div[class*=Page__formControl')
            .value[index].element('svg[style*="transform: scale(1)"]').value;
        if (checkedCheckbox) {
            return true;
        }
        return false;
    }

    isMaintenanceNotChecked(index) {
        const checkedCheckbox =  browser.elements('div[class*=Page__formControl')
            .value[index].element('svg[style*="transform: scale(1)"]').value;
        if (checkedCheckbox) {
            return false;
        }
        return true;
    }

    checkIfSelected(maintenancesIndexs) {
        return maintenancesIndexs.every(this.isMaintenanceChecked);
    }

    checkIfNotSelected(maintenancesIndexs) {
        return maintenancesIndexs.every(this.isMaintenanceNotChecked);
    }
}

module.exports = new Maintenance();
