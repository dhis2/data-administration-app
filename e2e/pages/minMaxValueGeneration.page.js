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

    getDataSetOption() {
        return browser.element('select[class^=MinMaxValueGeneration__select]').elements('<option>').value[3];
    }

    getOrgUnitTreeExpandArrowFromTree() {
        return browser.element('.tree-view').elements('.arrow').value[1];
    }

    getOneOrgUnitTreeFromTree(index) {
        return browser.element('.tree-view').elements('div[role=button]').value[index].element('<input>');
    }

    countSelectedOrgUnit() {
        return browser.element('.tree-view').elements('div[style*="color: orange"]').value.length;
    }
}

module.exports = new MinMaxValueGeneration();
