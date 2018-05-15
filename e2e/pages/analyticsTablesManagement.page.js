const Page = require('./page');

class AnalyticsTablesManagement extends Page {
    /**
     * ACTIONS
     */
    open() {
        super.open('#/analytics');
    }

    getCheckboxesTexts() {
        return browser.elements('div[class*=Page__formControl] > div').getText();
    }

    getCheckboxesElements() {
        return browser.elements('input[type=checkbox]').value;
    }

    getLastYearsSelect() {
        return browser.element('div[id*=Numberoflastyearsofdatatoinclude]');
    }

    getLastYearsSelectButton() {
        return browser.element('div[id*=Numberoflastyearsofdatatoinclude] button');
    }

    getLastYearsOptions() {
        return browser.elements('span[role=menuitem]').value;
    }

    checkDisabledCheckboxes() {
        let areDisabled = true;
        for(const checkbox of this.getCheckboxesElements()) {
            if (checkbox.isEnabled()) {
                areDisabled = false;
                break;
            }
        }
        return areDisabled;
    }

    isChecked(checkboxDiv) {
        const checkedCheckbox = checkboxDiv.element('svg[style*="transform: scale(1)"]').value;
        if (checkedCheckbox) {
            return true;
        }
        return false;
    }

    areCheckboxesSelected() {
        let check = true;
        const checkboxes = browser.elements('div[class*=Page__formControl] > div').value;
        for(const element of checkboxes) {
            if (!this.isChecked(element)) {
                check = false;
                break;
            }
        }
        return check;
    }
}

module.exports = new AnalyticsTablesManagement();
