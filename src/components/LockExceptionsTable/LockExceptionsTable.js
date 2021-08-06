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
    IconDelete16,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const columnLabels = {
    dataSet: i18n.t('Data set'),
    period: i18n.t('Period'),
    organisationUnit: i18n.t('Organisation unit'),
}

const LockExceptionsTable = ({
    columns,
    rows,
    atBatchDeletionPage,
    onRemoveLockException,
}) => (
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
                        <Button
                            small
                            secondary
                            onClick={() => onRemoveLockException(row)}
                        >
                            <span
                                title={
                                    atBatchDeletionPage
                                        ? i18n.t('Batch delete lock exceptions')
                                        : i18n.t('Remove lock exception')
                                }
                            >
                                <IconDelete16 />
                            </span>
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

LockExceptionsTable.propTypes = {
    atBatchDeletionPage: PropTypes.bool.isRequired,
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    onRemoveLockException: PropTypes.func.isRequired,
}

export default LockExceptionsTable
