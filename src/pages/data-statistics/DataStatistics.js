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

class DataStatistics extends PureComponent {
    static propTypes = {
        t: PropTypes.func.isRequired,
    }

    constructor() {
        super();

        this.state = {
            tables: [],
        };
    }

    componentWillMount() {
        // TODO request statistics to backend
        const tables = [
            {
                label: 'Object type',
                elements: [
                    { label: 'Data elements', count: 894 },
                    { label: 'Data element groups', count: 83 },
                ],
            },
            {
                label: 'Users logged in',
                elements: [
                    { label: 'Last hour', count: 0 },
                    { label: 'Today', count: 1 },
                    { label: 'Last 2 days', count: 3 },
                    { label: 'Last 7 days', count: 1 },
                    { label: 'Last 30 days', count: 5 },
                ],
            },
        ];

        this.setState({ tables });
    }

    render() {
        let t = this.props.t;
        if (!t) {
            t = (key => key);
        }
        const tables = this.state.tables.map((table) => {
            const rows = table.elements.map(element => (
                <TableRow key={element.label}>
                    <TableRowColumn>{element.label}</TableRowColumn>
                    <TableRowColumn>{element.count}</TableRowColumn>
                </TableRow>
            ));
            return (
                <div key={table.label} className={styles.statisticsTable}>
                    <Table selectable={false}>
                        <TableHeader
                            displaySelectAll={false}
                            adjustForCheckbox={false}
                            enableSelectAll={false}
                        >
                            <TableRow>
                                <TableHeaderColumn>{table.label}</TableHeaderColumn>
                                <TableHeaderColumn>{t('Number')}</TableHeaderColumn>
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
        });

        return (
            <div>
                <h1>{ t('Data Statistics') }</h1>
                {tables}
            </div>
        );
    }
}

export default DataStatistics;
