import React from 'react'
import PropTypes from 'prop-types'
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
    FontIcon,
} from 'material-ui'
import {
    notificationsTableStyles,
    notificationStylesInfo,
    formatDateFromServer,
} from './notifications-table.conf'

const NotificationsTable = ({ notifications }) => {
    const renderNotificationIcon = notification => {
        const notificationIconInfo = notificationStylesInfo[notification.level]
        if (
            notificationIconInfo &&
            notificationIconInfo.icon &&
            notification.completed
        ) {
            return (
                <FontIcon
                    className="material-icons"
                    style={notificationsTableStyles.iconStyle}
                    color={notificationIconInfo.iconColor}
                >
                    {notificationIconInfo.icon}
                </FontIcon>
            )
        }

        return null
    }

    const renderNotificationRow = (notification, index) => (
        <TableRow
            key={index}
            displayBorder={false}
            style={Object.assign(
                {},
                notificationStylesInfo[notification.level].row,
                (index + 1) % 2 === 0
                    ? notificationsTableStyles.evenRowStyle
                    : {}
            )}
        >
            <TableRowColumn style={notificationsTableStyles.timeColumnStyle}>
                {formatDateFromServer(notification.time)}
            </TableRowColumn>
            <TableRowColumn style={notificationsTableStyles.messageColumnStyle}>
                {notification.message} {renderNotificationIcon(notification)}
            </TableRowColumn>
        </TableRow>
    )

    if (notifications && notifications.length > 0) {
        return (
            <Table selectable={false}>
                <TableBody displayRowCheckbox={false}>
                    {notifications.map(renderNotificationRow)}
                </TableBody>
            </Table>
        )
    }

    return null
}

NotificationsTable.propTypes = {
    notifications: PropTypes.arrayOf(
        PropTypes.shape({
            uid: PropTypes.string,
            level: PropTypes.string,
            time: PropTypes.string,
            message: PropTypes.string,
            completed: PropTypes.bool,
        })
    ).isRequired,
}

export default NotificationsTable
