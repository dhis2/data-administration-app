import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    colors,
    IconError16,
    IconCheckmark16,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './NotificationsTable.module.css'

/* FIXME think of using an third party library for that, converting for a standard time format defined by design team */
const formatDateFromServer = dateFromServer => {
    if (dateFromServer) {
        return `${dateFromServer.slice(0, 10)} ${dateFromServer.slice(11, 19)}`
    }

    return ''
}

const renderNotificationIcon = notification => {
    if (notification.completed) {
        if (notification.level === 'ERROR') {
            return <IconError16 color={colors.red500} />
        } else {
            return <IconCheckmark16 color={colors.green500} />
        }
    } else if (!notification.completed) {
        return <span className={styles.notificationIconBusy}>...</span>
    }

    return null
}

const NotificationsTable = ({ notifications }) => {
    if (notifications && notifications.length > 0) {
        return (
            <Table className={styles.table} dataTest="notifications-table">
                <TableBody>
                    {notifications.map((notification, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {formatDateFromServer(notification.time)}
                            </TableCell>
                            <TableCell>
                                {notification.message}{' '}
                                {renderNotificationIcon(notification)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    return null
}

NotificationsTable.propTypes = {
    notifications: PropTypes.arrayOf(
        PropTypes.shape({
            completed: PropTypes.bool,
            level: PropTypes.string,
            message: PropTypes.string,
            time: PropTypes.string,
            uid: PropTypes.string,
        })
    ).isRequired,
}

export default NotificationsTable
