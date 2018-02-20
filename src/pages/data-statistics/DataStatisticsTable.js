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

import FormattedNumber from '../../components/formatters/FormattedNumber';
import styles from './DataStatistics.css';

class DataStatisticsTable extends PureComponent {
    static propTypes = {
        label: PropTypes.string.isRequired,
        elements: PropTypes.array.isRequired,
    }

    static contextTypes = {
        translator: PropTypes.func,
    }

    render() {
        const translator = this.context.translator;
        const rows = this.props.elements.map(element => (
            <TableRow key={element.label}>
                <TableRowColumn>{translator(element.label)}</TableRowColumn>
                <TableRowColumn>
                    <FormattedNumber value={element.count} />
                </TableRowColumn>
                <TableRowColumn />
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
                            <TableHeaderColumn>{translator(this.props.label)}</TableHeaderColumn>
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
