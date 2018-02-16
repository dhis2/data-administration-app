/* eslint-disable */
import React from 'react';
import { shallow } from 'enzyme';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import Pagination from 'd2-ui/lib/pagination/Pagination.component';

import LockException from './LockException';
import AddLockExceptionForm from './AddLockExceptionForm';
import LockExceptionDetails from './LockExceptionDetails';

import {
    sections,
    LOCK_EXCEPTION_SECTION_KEY,
} from '../sections.conf';

let lockExceptionPageInfo = {};
for(let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (section.key === LOCK_EXCEPTION_SECTION_KEY) {
        lockExceptionPageInfo = section.info;
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

const fakeLockExceptionsForDataTable = [
    {
        name: 'LockException1',
        period: {
            displayName: '201802',
            id: '201802',
        },
        organisationUnit: {
            displayName: 'Organisation Unit',
            id: 'OrganisationUnit',
        },
        dataSet: {
            displayName: 'DataSet',
            id: 'DataSet'
        }
    },
    {
        name: 'LockException2',
        period: {
            displayName: '201802',
            id: '201802',
        },
        organisationUnit: {
            displayName: 'Organisation Unit2',
            id: 'OrganisationUnit2',
        },
        dataSet: {
            displayName: 'DataSet2',
            id: 'DataSet2'
        }
    },
];

const fakeSelectedLockException = {
    name: 'Lock Exception',
    organisationUnit: {
        displayName: 'OrganisationUnit',
    },
    dataSet: {
        displayName: 'Dataset',
    },
    period: {
        displayName: '201802',
    },
};

const ownShallow = () => {
    return shallow(
        <LockException
            sectionKey={LOCK_EXCEPTION_SECTION_KEY}
            pageInfo={lockExceptionPageInfo}
        />,
        {
            context: {
                updateAppState: jest.fn(),
                translator: (key) => key,
                d2: {
                    i18n: {
                        translations: {},
                    }
                }
            },
            disableLifecycleMethods: true
        }
    );
};

it('Lock Exception Component renders without crashing', () => {
    ownShallow();
});

it('Lock Exception Component does not render DataTable', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(DataTable)).toHaveLength(0);
});

it('Lock Exception Component does not render Pagination', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(Pagination)).toHaveLength(0);
});

it('Lock Exception Component does not render Dialog', () => {
    const wrapper = ownShallow();
    expect(wrapper.find(Dialog)).toHaveLength(0);
});

it('Lock Exception Component renders DataTable', () => {
    const wrapper = ownShallow();
    wrapper.setState({lockExceptions: fakeLockExceptionsForDataTable});
    expect(wrapper.find(DataTable)).toHaveLength(1);
});

it('Lock Exception Component renders Pagination', () => {
    const wrapper = ownShallow();
    wrapper.setState({lockExceptions: fakeLockExceptionsForDataTable});
    expect(wrapper.find(Pagination)).toHaveLength(1);
});

it('Lock Exception Component renders ADD button at h1', () => {
    const wrapper = ownShallow();
    const addButton = wrapper.find(RaisedButton);
    expect(addButton).toHaveLength(1);
    expect(addButton.props().label).toBe('ADD');
});

it('Lock Exception Component calls showLockExceptionFormDialog when ADD button is clicked', () => {
    const spy = spyOn(LockException.prototype, 'showLockExceptionFormDialog');
    const wrapper = ownShallow();
    wrapper.find(RaisedButton).simulate('click');
    expect(spy).toHaveBeenCalled();
});

it('Lock Exception Component renders Add new lock exception dialog in close state', () => {
    const wrapper = ownShallow();
    wrapper.setState({
        levels: [],
        groups: [],
        dataSets: ['dataSet'],
    });
    const dialog = wrapper.find(Dialog);
    expect(dialog).toHaveLength(1);
    expect(dialog.find(AddLockExceptionForm)).toHaveLength(1);
    expect(dialog.props().title).toBe('Add new lock exception');
    expect(dialog.props().open).toBe(false);
});

it('Lock Exception Component updates showAddDialogOpen at state to true when ADD button is clicked', () => {
    const wrapper = ownShallow();
    wrapper.setState({
        levels: [],
        groups: [],
        dataSets: ['dataSet'],
    });
    wrapper.find(RaisedButton).simulate('click');
    expect(wrapper.state('showAddDialogOpen')).toBe(true);
});

it('Lock Exception Component open Add new lock exception dialog', () => {
    const wrapper = ownShallow();
    wrapper.setState({
        levels: [],
        groups: [],
        dataSets: ['dataSet'],
    });
    wrapper.find(RaisedButton).simulate('click');
    const dialog = wrapper.find(Dialog);
    expect(dialog.props().open).toBe(true);
});

it('Lock Exception Component renders Lock Exception Details Dialog in close state', () => {
    const wrapper = ownShallow();
    wrapper.setState({
        selectedLockException: fakeSelectedLockException,
    });
    const dialog = wrapper.find(Dialog);
    expect(dialog).toHaveLength(1);
    expect(dialog.find(LockExceptionDetails)).toHaveLength(1);
    expect(dialog.props().title).toBe(fakeSelectedLockException.name);
    expect(dialog.props().open).toBe(false);
});
