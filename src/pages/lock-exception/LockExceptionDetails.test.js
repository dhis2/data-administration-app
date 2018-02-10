/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme'

import LockExceptionDetails from './LockExceptionDetails';

const fakeLockException = {
    organisationUnitName: 'OrganisationUnit',
    dataSetName: 'DataSet',
    periodName: 'Period',
};

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
        <LockExceptionDetails {...fakeLockException} />,
        {
            context: {
                t: (key) => key,
            },
            disableLifecycleMethods: true
        }
    );
};

it('LockExceptionDetails Component renders without crashing', () => {
    ownShallow();
});

it('LockExceptionDetails Component renders the correct html elements', () => {
    const wrapper = ownShallow();
    expect(wrapper.find('h3')).toHaveLength(3);
    expect(wrapper.find('span')).toHaveLength(3);
});

it('LockExceptionDetails Component renders the correct headers', () => {
    const wrapper = ownShallow();
    const headersContent = [];
    wrapper.find('h3').forEach((header) => {
        headersContent.push(header.text());
    });
    expect(headersContent[0]).toBe('Organisation Unit');
    expect(headersContent[1]).toBe('Data Set');
    expect(headersContent[2]).toBe('Period');

});

it('LockExceptionDetails Component renders the correct content', () => {
    const wrapper = ownShallow();
    const spansContent = [];
    wrapper.find('span').forEach((span) => {
        spansContent.push(span.text());
    });
    expect(spansContent[0]).toBe(fakeLockException.organisationUnitName);
    expect(spansContent[1]).toBe(fakeLockException.dataSetName);
    expect(spansContent[2]).toBe(fakeLockException.periodName);

});