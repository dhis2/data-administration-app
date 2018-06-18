/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import RaisedButton from 'material-ui/RaisedButton';

import ResourceTables from './ResourceTables';
import {RESOURCE_TABLES_SECTION_KEY, sections} from '../sections.conf';

let resourceTablesPageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === RESOURCE_TABLES_SECTION_KEY) {
        resourceTablesPageInfo = section.info;
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
        <ResourceTables
            sectionKey={RESOURCE_TABLES_SECTION_KEY}
            pageInfo={resourceTablesPageInfo}
        />,
        {
            context: {
                updateAppState: jest.fn(),
            },
            disableLifecycleMethods: true,
        },
    );
};

it('ResourceTables renders without crashing.', () => {
    ownShallow();
});

it('ResourceTables renders a RaisedButton', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(RaisedButton)).toHaveLength(1);
});

it('ResourceTables calls initResourceTablesGeneration method when button is clicked', () => {
    const spy = spyOn(ResourceTables.prototype, 'initResourceTablesGeneration');
    const wrapper = ownShallow();
    wrapper.find(RaisedButton).simulate('click');
    expect(spy).toHaveBeenCalled();
});