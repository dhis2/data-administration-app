/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

/* Material UI */
import {
    TableRow,
    TableRowColumn,
} from 'material-ui';

import NotificationsTable from './NotificationsTable';

import {
    SUCCESS_LEVEL,
    ERROR_LEVEL,
    INFO_LEVEL,
} from '../analytics/analytics.conf'

const NUMBER_OF_COLUMNS = 2;
const fakeNotifications = [
    {
        uid: 'notificationSuccess',
        level: SUCCESS_LEVEL,
        message: 'notification success',
        time: '18-04-2017 15:06:06',
    },
    {
        uid: 'notificationError',
        level: ERROR_LEVEL,
        message: 'notification error',
        time: '18-04-2017 15:16:06',
    },
    {
        uid: 'notification info',
        level: INFO_LEVEL,
        message: 'notification info',
        time: '18-04-2017 15:26:06',
    }
];

const ownShallow = () => {
    return shallow(<NotificationsTable notifications={fakeNotifications}/>);
};

it('NotificationsTable renders without crashing', () => {
    ownShallow();
});

it('NotificationsTable renders correct number of rows', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(TableRow)).toHaveLength(fakeNotifications.length);
});

it('NotificationsTable renders the correct number of columns per row', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(TableRowColumn)).toHaveLength(fakeNotifications.length * NUMBER_OF_COLUMNS);
});