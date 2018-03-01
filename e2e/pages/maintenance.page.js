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
}

module.exports = new Maintenance();