const Page = require('./page');

class DHIS2Page extends Page {
    constructor() {
        super();
    }

    /**
     * ACTIONS
     */
    open() {
        browser.url(process.env.DHIS2_BASE_URL || 'http://localhost:8080/');
    }

    submitLoginForm(username, password) {
        browser.setValue('#j_username', username);
        browser.setValue('#j_password', password);
        browser.click('#submit');
    }

    isLoggedIn() {
        return !browser.isVisible('#loginForm');
    }

    isFromLocation(location) {
        browser.waitForVisible('a.title-link', 5000);
        return browser.getText('a.title-link').includes(location);
    }
}

module.exports = new DHIS2Page();