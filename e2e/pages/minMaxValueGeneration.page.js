const Page = require('./page');

class MinMaxValueGeneration extends Page {
    constructor() {
        super();
    }

    /**
     * ACTIONS
     */
    open() {
        super.open('#/min-max-value-generation');
    }
}

module.exports = new MinMaxValueGeneration();