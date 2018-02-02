/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import  AppRouter from './AppRouter';
import { Route, Switch } from 'react-router-dom';

import {sections} from "../../pages/sections.conf";

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectByLevel.component', () => ('OrgUnitSelectByLevel'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectByGroup.component', () => ('OrgUnitSelectByGroup'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectAll.component', () => ('OrgUnitSelectAll'));
jest.mock('d2-ui/lib/select-field/SelectField', () => ('SelectField'));
jest.mock('d2-ui/lib/period-picker/PeriodPicker.component', () => ('PeriodPicker'));
jest.mock('d2-ui/lib/data-table/DataTable.component', () => ('DataTable'));

const notifySidebar = jest.fn();
const toggleLoading = jest.fn();
const pageState = {}

const ownShallow = () => {
    return shallow(
        <AppRouter
            notifySidebar={notifySidebar}
            updateAppState={toggleLoading}
            appState={pageState}
        />,
        {
            disableLifecycleMethods: true
        }
    );
};

it('AppRouter renders without crashing', () => {
    ownShallow();
});

it('AppRouter renders a Switch', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(Switch)).toHaveLength(1);
});

it('AppRouter renders the correct number of Route', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(Route)).toHaveLength(sections.length + 2);    // Pages plus home and no match route
});

