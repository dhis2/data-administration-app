import React from 'react'
import { shallow } from 'enzyme'
import { TableRow, TableRowColumn, FontIcon } from 'material-ui'
import NotificationsTable from './NotificationsTable'
import {
    SUCCESS_LEVEL,
    ERROR_LEVEL,
    INFO_LEVEL,
    INFO_COLOR,
    SUCCESS_COLOR,
    ERROR_COLOR,
    ERROR_NOTIFICATION_ICON,
    SUCCESS_NOTIFICATION_ICON,
} from './notifications-table.conf'

const NUMBER_OF_COLUMNS = 2
const fakeNotifications = [
    {
        uid: 'notificationSuccess',
        level: SUCCESS_LEVEL,
        message: 'notification success',
        time: '18-04-2017 15:06:06',
        completed: true,
    },
    {
        uid: 'notificationError',
        level: ERROR_LEVEL,
        message: 'notification error',
        time: '18-04-2017 15:16:06',
        completed: true,
    },
    {
        uid: 'notification info',
        level: INFO_LEVEL,
        message: 'notification info',
        time: '18-04-2017 15:26:06',
    },
]

const ownShallow = () => {
    return shallow(<NotificationsTable notifications={fakeNotifications} />)
}

it('NotificationsTable renders without crashing', () => {
    ownShallow()
})

it('NotificationsTable renders correct number of rows', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(TableRow)).toHaveLength(fakeNotifications.length)
})

it('NotificationsTable renders the correct number of columns per row', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(TableRowColumn)).toHaveLength(
        fakeNotifications.length * NUMBER_OF_COLUMNS
    )
})

it('NotificationsTable renders the correct number of FontIcons', () => {
    const wrapper = ownShallow()
    let iconsCount = 0
    fakeNotifications.forEach(notification => {
        if (
            (notification.level === SUCCESS_LEVEL ||
                notification.level === ERROR_LEVEL) &&
            notification.completed
        ) {
            iconsCount++
        }
    })

    expect(wrapper.find(FontIcon)).toHaveLength(iconsCount)
})

it('Notifications Table Rows to have the correct style color', () => {
    const wrapper = ownShallow()
    const rows = wrapper.find(TableRow)
    for (let i = 0; i < fakeNotifications.length; i++) {
        const notification = fakeNotifications[i]
        const row = rows.at(i)
        const rowStyleColor = row.props().style.color
        if (notification.level === SUCCESS_LEVEL) {
            expect(rowStyleColor).toBe(SUCCESS_COLOR)
        } else if (notification.level === ERROR_LEVEL) {
            expect(rowStyleColor).toBe(ERROR_COLOR)
        } else {
            expect(rowStyleColor).toBe(INFO_COLOR)
        }
    }
})

it('Notifications Table Rows to have the correct icon', () => {
    const wrapper = ownShallow()
    const rows = wrapper.find(TableRow)
    for (let i = 0; i < fakeNotifications.length; i++) {
        const notification = fakeNotifications[i]
        const rowIcon = rows.at(i).find(FontIcon)
        if (notification.level === SUCCESS_LEVEL) {
            expect(rowIcon.at(0).props().children).toBe(
                SUCCESS_NOTIFICATION_ICON
            )
        } else if (notification.level === ERROR_LEVEL) {
            expect(rowIcon.at(0).props().children).toBe(ERROR_NOTIFICATION_ICON)
        }
    }
})
