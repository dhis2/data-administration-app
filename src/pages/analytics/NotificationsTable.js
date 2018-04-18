import React from 'react';
import PropTypes from 'prop-types';

/* Material UI */
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
    FontIcon,
} from 'material-ui';

import {
    analyticsStyles,
    notificationStylesInfo,
    formatDateFromServer,
} from '../analytics/analytics.conf';

const NotificationsTable = ({ notifications }) => {
    const renderNotificationIcon = (notification) => {
        const notificationIconInfo = notificationStylesInfo[notification.level];
        if (notificationIconInfo && notificationIconInfo.icon) {
            return (<FontIcon
                className="material-icons"
                style={analyticsStyles.iconStyle}
                color={notificationIconInfo.color}
            >
                {notificationIconInfo.icon}</FontIcon>
            );
        }

        return null;
    };

    const renderNotificationRow = (notification, index) => (
        <TableRow
            key={notification.uid}
            displayBorder={false}
            style={Object.assign(
                {},
                notificationStylesInfo[notification.level].row,
                (index + 1) % 2 === 0 ? analyticsStyles.evenRowStyle : {})
            }
        >
            <TableRowColumn style={analyticsStyles.timeColumnStyle}>
                {formatDateFromServer(notification.time)}
            </TableRowColumn>
            <TableRowColumn style={analyticsStyles.messageColumnStyle}>
                {notification.message} {renderNotificationIcon(notification)}
            </TableRowColumn>
        </TableRow>
    );

    if (notifications && notifications.length > 0) {
        return (
            <Table
                selectable={false}
            >
                <TableBody
                    displayRowCheckbox={false}
                >
                    {notifications.map(renderNotificationRow)}
                </TableBody>
            </Table>
        );
    }

    return null;
};

NotificationsTable.propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.shape({
        uid: PropTypes.string,
        level: PropTypes.string,
        time: PropTypes.string,
        message: PropTypes.string,
    })).isRequired,
};

export default NotificationsTable;
