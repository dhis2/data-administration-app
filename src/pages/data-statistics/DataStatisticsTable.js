import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table'
import PropTypes from 'prop-types'
import React from 'react'
import FormattedNumber from '../../components/FormattedNumber/FormattedNumber'
import styles from './DataStatistics.module.css'

const DataStatisticsTable = ({ elements, label }) => (
    <Table selectable={false} className={styles.statisticsTable}>
        <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
        >
            <TableRow>
                <TableHeaderColumn>{label}</TableHeaderColumn>
            </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} stripedRows={false}>
            {elements.map(element => (
                <TableRow key={element.label}>
                    <TableRowColumn>{element.label}</TableRowColumn>
                    <TableRowColumn>
                        <FormattedNumber value={element.count} />
                    </TableRowColumn>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

DataStatisticsTable.propTypes = {
    elements: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
}

export default DataStatisticsTable
