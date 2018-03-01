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
}

module.exports = new DataIntegrity();