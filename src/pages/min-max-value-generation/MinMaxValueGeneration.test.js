/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';
import MinMaxValueGeneration from "./MinMaxValueGeneration";

import {
    sections,
    MIN_MAX_VALUE_GENERATION_SECTION_KEY,
} from '../sections.conf';

let pageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === MIN_MAX_VALUE_GENERATION_SECTION_KEY) {
        pageInfo = section.info;
        break;
    }
}

const fakeDatasets = [
    {id: '1', displayName: 'dataSet1'},
    {id: '2', displayName: 'dataSet2'},
];

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => ('OrgUnitTree'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectByLevel.component', () => ('OrgUnitSelectByLevel'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectByGroup.component', () => ('OrgUnitSelectByGroup'));
jest.mock('d2-ui/lib/org-unit-select/OrgUnitSelectAll.component', () => ('OrgUnitSelectAll'));
jest.mock('d2-ui/lib/select-field/SelectField', () => ('SelectField'));
jest.mock('d2-ui/lib/period-picker/PeriodPicker.component', () => ('PeriodPicker'));
jest.mock('d2-ui/lib/data-table/DataTable.component', () => ('DataTable'));
jest.mock('d2-ui/lib/pagination/Pagination.component', () => ('Pagination'));

const ownShallow = () => {
    return shallow(
        <MinMaxValueGeneration
            sectionKey={MIN_MAX_VALUE_GENERATION_SECTION_KEY}
            pageInfo={pageInfo}
        />,
        {
            context: {
                updateAppState: jest.fn(),
                t: (key) => key,
            },
            disableLifecycleMethods: true
        }
    );
};

it('Min Max Value Generation renders without crashing', () => {
    ownShallow();
});

it('Min Max Value Generation does not render select for dataSets', () => {
    const wrapper = ownShallow();
    expect(wrapper.find('select')).toHaveLength(0);
});

it('Min Max Value Generation renders a select when state contains dataSets', () => {
    const wrapper = ownShallow();
    wrapper.setState({dataSets: fakeDatasets});
    expect(wrapper.find('select')).toHaveLength(1);
});

it('Min Max Value Generation renders the correct number of dataset options', () => {
    const wrapper = ownShallow();
    wrapper.setState({dataSets: fakeDatasets});
    expect(wrapper.find('select')).toHaveLength(1);
    expect(wrapper.find('select').find('option')).toHaveLength(fakeDatasets.length);
});

it('Min Max Value Generation does not render OrgUnitTree', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(OrgUnitTree)).toHaveLength(0);
});

it('Min Max Value Generation does render OrgUnitTree', () => {
    const wrapper = ownShallow();
    wrapper.setState({rootWithMembers: {}});
    expect(wrapper.find(OrgUnitTree)).toHaveLength(1);
});

it('Min Max Value Generation renders a RaisedButton', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(RaisedButton)).toHaveLength(1);
});

it('Min Max Value Generation renders a FlatButton', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(RaisedButton)).toHaveLength(1);
});

it('Min Max Value Generation calls generateMinMaxValueClick method when RaisedButton is clicked', () => {
    const spy = spyOn(MinMaxValueGeneration.prototype, 'generateMinMaxValueClick');
    const wrapper = ownShallow();
    wrapper.find(RaisedButton).simulate('click');
    expect(spy).toHaveBeenCalled();
});

it('Min Max Value Generation calls removeMinMaxValueClick method when FlatButton is clicked', () => {
    const spy = spyOn(MinMaxValueGeneration.prototype, 'removeMinMaxValueClick');
    const wrapper = ownShallow();
    wrapper.find(FlatButton).simulate('click');
    expect(spy).toHaveBeenCalled();
});