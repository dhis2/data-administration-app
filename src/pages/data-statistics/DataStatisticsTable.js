import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import FormattedNumber from '../../components/formatters/FormattedNumber'
import styles from './DataStatistics.module.css'

class DataStatisticsTable extends PureComponent {
    static propTypes = {
        elements: PropTypes.array.isRequired,
        label: PropTypes.string.isRequired,
    }

    render() {
        const rows = this.props.elements.map(element => (
            <TableRow
                key={element.label}
                className={'data-statistics-table-row'}
            >
                <TableRowColumn>{element.label}</TableRowColumn>
                <TableRowColumn>
                    <FormattedNumber value={element.count} />
                </TableRowColumn>
            </TableRow>
        ))

        return (
            <Table selectable={false} className={styles.statisticsTable}>
                <TableHeader
                    className={'data-statistics-table-header'}
                    displaySelectAll={false}
                    adjustForCheckbox={false}
                    enableSelectAll={false}
                >
                    <TableRow>
                        <TableHeaderColumn>
                            {this.props.label}
                        </TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} stripedRows={false}>
                    {rows}
                </TableBody>
            </Table>
        )
    }
}

export default DataStatisticsTable
