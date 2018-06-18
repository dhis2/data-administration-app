/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import {
    Checkbox,
    RaisedButton,
    GridTile,
    SelectField,
} from 'material-ui';

import Analytics from './Analytics';
import NotificationsTable from './NotificationsTable';

import {
    sections,
    ANALYTICS_SECTION_KEY,
} from '../sections.conf';

import {
    SUCCESS_LEVEL,
    analyticsCheckboxes,
    DEFAULT_LAST_YEARS,
} from '../analytics/analytics.conf';

let analyticsPageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === ANALYTICS_SECTION_KEY) {
        analyticsPageInfo = section.info;
        break;
    }
}

const stateWithNotifications = [
    {
        uid: 'notification1',
        level: SUCCESS_LEVEL,
        message: 'notification 1',
        time: '18-04-2017 15:06:06',
    }
];

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectByLevel.component', () => ('OrgUnitSelectByLevel'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectByGroup.component', () => ('OrgUnitSelectByGroup'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectAll.component', () => ('OrgUnitSelectAll'));
jest.mock('d2-ui/lib/select-field/SelectField', () => ('SelectField'));
jest.mock('d2-ui/lib/period-picker/PeriodPicker.component', () => ('PeriodPicker'));
jest.mock('d2-ui/lib/data-table/DataTable.component', () => ('DataTable'));
jest.mock('d2-ui/lib/pagination/Pagination.component', () => ('Pagination'));
jest.mock('d2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes', () => ('FeedbackSnackbarTypes'));

const ownShallow = () => {
    return shallow(
        <Analytics
            sectionKey={ANALYTICS_SECTION_KEY}
            pageInfo={analyticsPageInfo}
        />,
        {
            context: {
                updateAppState: jest.fn(),
            },
            disableLifecycleMethods: true
        }
    );
};

it('Analytics renders without crashing', () => {
    ownShallow();
});

it('Analytics does not render NotificationsTable', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(NotificationsTable)).toHaveLength(0);
});

it('Analytics does not render NotificationsTable when it has notifications ', () => {
    const wrapper = ownShallow();
    wrapper.setState({notifications: stateWithNotifications});
    expect(wrapper.find(NotificationsTable)).toHaveLength(1);
});

it('Analytics renders a RaisedButton', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(RaisedButton)).toHaveLength(1);
});

it('Analytics calls initAnalyticsTablesGeneration method when button is clicked', () => {
    const spy = spyOn(Analytics.prototype, 'initAnalyticsTablesGeneration');
    const wrapper = ownShallow();
    wrapper.find(RaisedButton).simulate('click');
    expect(spy).toHaveBeenCalled();
});

it('Analytics renders needed Checkboxes', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(Checkbox)).toHaveLength(analyticsCheckboxes.length);
});

it('Analytics state changes Checkbox state when a Checkbox is checked', () => {
    const wrapper = ownShallow();
    const state = wrapper.state();
    const grid = wrapper.find('div.row').first();
    const analyticCheckbox = grid.find(GridTile).first();
    analyticCheckbox.find(Checkbox).first().simulate('check');

    // assert checkbox states
    const checkedCheckboxKey = analyticCheckbox.key();
    for (let i = 0; i < analyticsCheckboxes.length; i++) {
        const checkboxKey = analyticsCheckboxes[i].key;
        const checkboxState = state.checkboxes[checkboxKey].checked;
        expect(checkboxState).toBe(checkboxKey === checkedCheckboxKey);
    }
});

it('Analytics renders a SelectField for lastYears', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(SelectField)).toHaveLength(1);
});

it('Should call onChangeLastYears function when Last years SelectField changes.', () => {
    const spy = spyOn(Analytics.prototype, 'onChangeLastYears').and.callThrough();
    const wrapper = ownShallow();
    const testLastYears  = 2;
    wrapper.setState({
        lastYears: DEFAULT_LAST_YEARS,
    });
    wrapper.find(SelectField).at(0).simulate('change', null, null, testLastYears);
    expect(spy).toHaveBeenCalledWith(null, null, testLastYears);
    expect(wrapper.state('lastYears')).toBe(testLastYears);
});