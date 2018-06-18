/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import DataStatistics, { TableCard } from './DataStatistics';

import {
    OBJECT_COUNTS_KEY,
    ACTIVE_USERS_KEY,
    USER_INVITATIONS_KEY,
    DATA_VALUE_COUNT_KEY,
    EVENT_COUNT_KEY,
} from './DataStatistics';

import {
    sections,
    DATA_STATISTICS_SECTION_KEY
} from '../sections.conf';

let dataStatisticsPageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === DATA_STATISTICS_SECTION_KEY) {
        dataStatisticsPageInfo = section.info;
        break;
    }
}

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectByLevel.component', () => ('OrgUnitSelectByLevel'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectByGroup.component', () => ('OrgUnitSelectByGroup'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectAll.component', () => ('OrgUnitSelectAll'));
jest.mock('d2-ui/lib/select-field/SelectField', () => ('SelectField'));
jest.mock('d2-ui/lib/period-picker/PeriodPicker.component', () => ('PeriodPicker'));
jest.mock('d2-ui/lib/data-table/DataTable.component', () => ('DataTable'));
jest.mock('d2-ui/lib/pagination/Pagination.component', () => ('Pagination'));
jest.mock('d2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes', () => ('FeedbackSnackbarTypes'));

const tableProps = {
    label: 'Object type',
    elements: [
        { label: 'object1', count: 1 },
        { label: 'object2', count: 2 }
    ],
};
const stateWithTablesForDataStatistics = {};
stateWithTablesForDataStatistics[OBJECT_COUNTS_KEY] = tableProps;
stateWithTablesForDataStatistics[ACTIVE_USERS_KEY] = tableProps;
stateWithTablesForDataStatistics[USER_INVITATIONS_KEY] = tableProps;
stateWithTablesForDataStatistics[DATA_VALUE_COUNT_KEY] = tableProps;
stateWithTablesForDataStatistics[EVENT_COUNT_KEY] = tableProps;

const ownShallow = () => {
    return shallow(
        <DataStatistics
            sectionKey={DATA_STATISTICS_SECTION_KEY}
            pageInfo={dataStatisticsPageInfo}
        />,
        {
            disableLifecycleMethods: true,
            context: {
                updateAppState: jest.fn(),
            }
        }
    );
};

it('DataStatistics renders without crashing', () => {
    ownShallow();
});

it('DataStatistics renders no TableCard', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(TableCard)).toHaveLength(0);
});

it('DataStatistics renders TableCard define on state', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(TableCard)).toHaveLength(0);
    wrapper.setState({tables: stateWithTablesForDataStatistics});
    expect(wrapper.find(TableCard)).toHaveLength(Object.keys(stateWithTablesForDataStatistics).length);
});
