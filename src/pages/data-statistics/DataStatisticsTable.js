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
import FormattedNumber from '../../components/FormattedNumber/FormattedNumber'

const DataStatisticsTable = ({ elements, label }) => (
    <Table suppressZebraStriping>
        <TableHead>
            <TableRowHead>
                <TableCellHead>{label}</TableCellHead>
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
}

export default DataStatisticsTable
