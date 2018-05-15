const Page = require('./page');

class ResourceTables extends Page {
    /**
     * ACTIONS
     */
    open() {
        super.open('#/resourceTables');
    }

    resourceItemIsDisplayed(name, tag) {
        const resourceName = browser.element('div[class^=ResourceTables__description]').getText(`div*=${name}`);
        const resourceTag = browser.element('div[class^=ResourceTables__description]').getText(`span=${tag}`);
        return !!(resourceName && resourceTag);
    }
}

module.exports = new ResourceTables();
