import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import FormattedNumber from '../../components/FormattedNumber/FormattedNumber.jsx'
import styles from './DataStatistics.module.css'

const DataStatisticsTable = ({ elements, label, description }) => (
    <Table suppressZebraStriping>
        <TableHead>
            <TableRowHead>
                <TableCellHead colSpan="2">
                    <>
                        <div>{label}</div>
                        {description && (
                            <div className={styles.dataStatisticsDescription}>
                                {description}
                            </div>
                        )}
                    </>
                </TableCellHead>
                <TableCellHead></TableCellHead>
            </TableRowHead>
        </TableHead>

        <TableBody>
            {elements.map((element) => (
                <TableRow key={element.label}>
                    <TableCell>{element.label}</TableCell>
                    <TableCell>
                        <FormattedNumber value={element.count} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

DataStatisticsTable.propTypes = {
    elements: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
}

export default DataStatisticsTable
