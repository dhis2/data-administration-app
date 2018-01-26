import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Material UI
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import styles from './DataStatistics.css';

class DataStatisticsTable extends PureComponent {
    static propTypes = {
        label: PropTypes.string.isRequired,
        elements: PropTypes.array.isRequired,
    }

    static contextTypes = {
        t: PropTypes.func.isRequired,
    }

    render() {
        const t = this.context.t;
        const rows = this.props.elements.map(element => (
            <TableRow key={element.label}>
                <TableRowColumn>{t(element.label)}</TableRowColumn>
                <TableRowColumn>{element.count}</TableRowColumn>
            </TableRow>
        ));
        return (
            <div className={styles.statisticsTable}>
                <Table selectable={false}>
                    <TableHeader
                        className={styles.statisticsTableHeader}
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                    >
                        <TableRow>
                            <TableHeaderColumn>{t(this.props.label)}</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        stripedRows={false}
                    >
                        {rows}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default DataStatisticsTable;
