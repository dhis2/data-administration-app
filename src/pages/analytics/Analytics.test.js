/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import Analytics from './Analytics';

import {
    sections,
    ANALYTICS_SECTION_KEY,
} from '../sections.conf';

let analyticsPageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === ANALYTICS_SECTION_KEY) {
        analyticsPageInfo = section.info;
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

const ownShallow = () => {
    return shallow(
        <Analytics
            sectionKey={ANALYTICS_SECTION_KEY}
            pageInfo={analyticsPageInfo}
        />,
        {
            context: {
                updateAppState: jest.fn(),
                translator: (key) => key,
            },
            disableLifecycleMethods: true
        }
    );
};

it('Analytics renders without crashing', () => {
    ownShallow();
});