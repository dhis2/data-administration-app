/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import { Link } from "react-router-dom";
import { GridTile } from "material-ui/GridList/index";

import GridSection from './GridSection';

import { sections } from "../../sections.conf";

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectByLevel.component', () => ('OrgUnitSelectByLevel'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectByGroup.component', () => ('OrgUnitSelectByGroup'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectAll.component', () => ('OrgUnitSelectAll'));
jest.mock('d2-ui/lib/select-field/SelectField', () => ('SelectField'));
jest.mock('d2-ui/lib/period-picker/PeriodPicker.component', () => ('PeriodPicker'));
jest.mock('d2-ui/lib/org-unit-tree/utils', () => ({}));
jest.mock('d2-ui/lib/data-table/DataTable.component', () => ('DataTable'));
jest.mock('d2-ui/lib/pagination/Pagination.component', () => ('Pagination'));
jest.mock('d2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes', () => ('FeedbackSnackbarTypes'));

const section = sections[0];
const ownShallow = () => {
    return shallow(
        <GridSection
            section={section}
        />,
        {
            disableLifecycleMethods: true
        }
    );
};

it('GridSection renders without crashing', () => {
    ownShallow();
});

it('GridSection renders a Link', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(Link)).toHaveLength(1);
});

it('GridSection renders a GridTile', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(GridTile)).toHaveLength(1);
});
