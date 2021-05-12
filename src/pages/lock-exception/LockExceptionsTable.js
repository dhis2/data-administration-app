import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
} from '@dhis2/ui'
import FontIcon from 'material-ui/FontIcon'
import PropTypes from 'prop-types'
import React from 'react'

const columnLabels = {
    dataSet: i18n.t('Data set'),
    period: i18n.t('Period'),
    organisationUnit: i18n.t('Organisation unit'),
}

const LockExceptionsTable = ({ columns, rows, onRemoveLockException }) => (
    <Table>
        <TableHead>
            <TableRowHead>
                {columns.map(column => (
                    <TableCellHead key={column}>
                        {columnLabels[column]}
                    </TableCellHead>
                ))}
                <TableCellHead>
                    {/* Column for 'remove lock exception' button */}
                </TableCellHead>
            </TableRowHead>
        </TableHead>
        <TableBody>
            {rows.map((row, index) => (
                <TableRow key={index}>
                    {columns.map(column => (
                        <TableCell key={column}>{row[column]}</TableCell>
                    ))}
                    <TableCell>
                        {/* TODO: Add accessible label to button */}
                        <Button
                            small
                            secondary
                            onClick={onRemoveLockException.bind(null, row)}
                        >
                            <FontIcon className="material-icons">
                                delete
                            </FontIcon>
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

LockExceptionsTable.propTypes = {
    onRemoveLockException: PropTypes.func.isRequired,
    columns: PropTypes.array,
    rows: PropTypes.array,
}

export default LockExceptionsTable
