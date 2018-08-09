/* Notification Table Styles */
export const INFO_LEVEL = 'INFO';
export const ERROR_LEVEL = 'ERROR';
export const SUCCESS_LEVEL = 'SUCCESS';

export const SUCCESS_COLOR = '#8ac542';
export const INFO_COLOR = '#000000';
export const ERROR_COLOR = '#ff0000';

export const ERROR_NOTIFICATION_ICON = 'error';
export const SUCCESS_NOTIFICATION_ICON = 'check';

const FONT_SIZE = 14;

export const notificationsTableStyles = {
    iconStyle: {
        fontSize: FONT_SIZE,
    },
    rowStyle: {
        fontSize: FONT_SIZE,
        height: 48,
    },
    evenRowStyle: {
        backgroundColor: '#fafafa',
    },
    timeColumnStyle: {
        width: '20%',
    },
    messageColumnStyle: {
        width: '80%',
    },
    successStyle: {
        color: SUCCESS_COLOR,
        iconColor: SUCCESS_COLOR,
        fontWeight: 'bold',
    },
    errorStyle: {
        color: ERROR_COLOR,
        iconColor: ERROR_COLOR,
        fontWeight: 'bold',
    },
    infoStyle: {
        color: INFO_COLOR,
        iconColor: SUCCESS_COLOR,
    },
};

const notificationStyles = {};

notificationStyles[SUCCESS_LEVEL] = {
    color: SUCCESS_COLOR,
    icon: SUCCESS_NOTIFICATION_ICON,
    row: Object.assign({}, notificationsTableStyles.rowStyle, notificationsTableStyles.successStyle),
};

notificationStyles[ERROR_LEVEL] = {
    color: ERROR_COLOR,
    icon: ERROR_NOTIFICATION_ICON,
    row: Object.assign({}, notificationsTableStyles.rowStyle, notificationsTableStyles.errorStyle),
};

notificationStyles[INFO_LEVEL] = {
    color: INFO_COLOR,
    icon: SUCCESS_NOTIFICATION_ICON,
    iconColor: SUCCESS_COLOR,
    row: Object.assign({}, notificationsTableStyles.rowStyle, notificationsTableStyles.infoStyle),
};

export const notificationStylesInfo = notificationStyles;

/* helper methods */

/* FIXME think of using an third party library for that, converting for a standard time format defined by design team */
export const formatDateFromServer = (dateFromServer) => {
    if (dateFromServer) {
        return `${dateFromServer.slice(0, 10)} ${dateFromServer.slice(11, 19)}`;
    }

    return '';
};
