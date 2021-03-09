import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
    FontIcon,
} from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    notificationsTableStyles,
    notificationStylesInfo,
    formatDateFromServer,
} from './notifications-table.conf'
import './style.css'

const NotificationsTable = ({ notifications, animateIncomplete }) => {
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
        } else if (animateIncomplete && !notification.completed) {
            return <span className="notification-icon-busy">...</span>
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
            completed: PropTypes.bool,
            level: PropTypes.string,
            message: PropTypes.string,
            time: PropTypes.string,
            uid: PropTypes.string,
        })
    ).isRequired,
    animateIncomplete: PropTypes.bool,
}

export default NotificationsTable
