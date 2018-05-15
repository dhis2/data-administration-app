const Page = require('./page');

class DataIntegrity extends Page {
    constructor() {
        super();
    }

    /**
     * ACTIONS
     */
    open() {
        super.open('#/data-integrity');
    }

    getRunIntegrityCheckBtn() {
        browser.waitForVisible('#runDataIntegrityChecksBtnId', 5000);
        const runIntegrityChecksBtn = browser.element('#runDataIntegrityChecksBtnId');
        return runIntegrityChecksBtn;
    }

    getErrorElements() {
        return browser.elements('div[id^=errorElement]').value;
    }

    validateErrorColor() {
        const errorCards = this.getErrorElements();
        if (errorCards) {
            for (const card of errorCards) {
                const errorSpan = card.elements('<span>').value[0];
                if(errorSpan.getCssProperty('color').parsed.hex !== '#ff5722') {
                    return false;
                }
            }
        }
        return true;
    }

    validateErrorExpandIcon() {
        const errorCards = this.getErrorElements();
        if (errorCards) {
            for (const card of errorCards) {
                const expandIcon = card.element('.material-icons=keyboard_arrow_down').value;
                if(!expandIcon) {
                    return false;
                }
            }
        }
        return true;
    }

    getNoErrorElements() {
        return browser.elements('div[id^=noErrorElement]').value;
    }

    validateValidColor() {
        const noErrorCards = this.getNoErrorElements();
        if (noErrorCards) {
            for (const card of noErrorCards) {
                const noErrorSpan = card.elements('<span>').value[0];
                if(noErrorSpan.getCssProperty('color').parsed.hex !== '#1c9d17') {
                    return false;
                }
            }
        }
        return true;
    }

    validateValidIcon() {
        const noErrorCards = this.getNoErrorElements()
        if (noErrorCards) {
            for (const card of noErrorCards) {
                const validIcon = card.element('.material-icons=done').value;
                if(!validIcon) {
                    return false;
                }
            }
        }
        return true;
    }

    validateErrorsFirst() {
        const elements = browser.elements('div[id*=rrorElement]').value;
        const existingErrors = this.getErrorElements();
        let valid = true;
        if (existingErrors) {
            elements.forEach(
                (element, index) => {
                    if (index < existingErrors.length - 1 && element.getAttribute('id').indexOf('errorElement') < 0) {
                        valid = false;
                    } else if (element.getAttribute('id').indexOf('noErrorElement') < 0) {
                        valid = false;
                    }
                },
            );
        }
        return valid;
    }

    getAnElementDescription() {
        const description = browser.element('div[id=elementDescription]');
        return description;
    }
}

module.exports = new DataIntegrity();
