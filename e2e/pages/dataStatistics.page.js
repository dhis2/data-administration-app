const Page = require('./page');

class DataStatistics extends Page {
    constructor() {
        super();
    }

    /**
     * ACTIONS
     */
    open() {
        super.open('#/data-statistics');
    }

    isTableWithTitleVisible(title) {
        return !!this.getTableWithTitle(title);
    }

    getTableWithTitle(title) {
        browser.waitForVisible('.data-statistics-table', 60000);
        const tables = browser.elements('.data-statistics-table').value;
        for (let currentTable of tables) {
            if (currentTable.element('.data-statistics-table-header > tr > th').getText() === title) {
                return currentTable;
            }
        }
        return null;
    }

    getRowsCountForTableWithTitle(title) {
        const table = this.getTableWithTitle(title);
        if (table) {
            return table.elements('.data-statistics-table-row').value.length;
        }
        return 0;
    }
}

module.exports = new DataStatistics();