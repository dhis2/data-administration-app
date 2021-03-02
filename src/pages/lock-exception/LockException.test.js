import DataTable from 'd2-ui/lib/data-table/DataTable.component'
import Pagination from 'd2-ui/lib/pagination/Pagination.component'
import { shallow } from 'enzyme'
import Dialog from 'material-ui/Dialog'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import RaisedButton from 'material-ui/RaisedButton'
import React from 'react'
import { sections, LOCK_EXCEPTION_SECTION_KEY } from '../sections.conf'
import AddLockExceptionForm from './AddLockExceptionForm'
import LockException from './LockException'

let lockExceptionPageInfo = {}

for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    if (section.key === LOCK_EXCEPTION_SECTION_KEY) {
        lockExceptionPageInfo = section.info
        break
    }
}

jest.mock('d2-ui/lib/org-unit-tree/OrgUnitTree.component', () => 'OrgUnitTree')
jest.mock(
    'd2-ui/lib/org-unit-select/OrgUnitSelectByLevel.component',
    () => 'OrgUnitSelectByLevel'
)
jest.mock(
    'd2-ui/lib/org-unit-select/OrgUnitSelectByGroup.component',
    () => 'OrgUnitSelectByGroup'
)
jest.mock(
    'd2-ui/lib/org-unit-select/OrgUnitSelectAll.component',
    () => 'OrgUnitSelectAll'
)
jest.mock('d2-ui/lib/select-field/SelectField', () => 'SelectField')
jest.mock(
    'd2-ui/lib/period-picker/PeriodPicker.component',
    () => 'PeriodPicker'
)
jest.mock('d2-ui/lib/data-table/DataTable.component', () => 'DataTable')
jest.mock('d2-ui/lib/pagination/Pagination.component', () => 'Pagination')
jest.mock(
    'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes',
    () => 'FeedbackSnackbarTypes'
)

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
            id: 'DataSet',
        },
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
            id: 'DataSet2',
        },
    },
]

const ownShallow = () => {
    return shallow(
        <LockException
            sectionKey={LOCK_EXCEPTION_SECTION_KEY}
            pageInfo={lockExceptionPageInfo}
        />,
        {
            context: {
                updateAppState: jest.fn(),
                d2: {
                    i18n: {
                        translations: {},
                    },
                },
            },
            disableLifecycleMethods: true,
        }
    )
}

it('Lock Exception Component renders without crashing', () => {
    ownShallow()
})

it('Lock Exception Component does not render DataTable', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(DataTable)).toHaveLength(0)
})

it('Lock Exception Component does not render Pagination', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(Pagination)).toHaveLength(0)
})

it('Lock Exception Component does not render Dialog', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(Dialog)).toHaveLength(0)
})

it('Lock Exception Component renders DataTable', () => {
    const wrapper = ownShallow()
    wrapper.setState({ lockExceptions: fakeLockExceptionsForDataTable })
    expect(wrapper.find(DataTable)).toHaveLength(1)
})

it('Lock Exception Component renders Pagination on top and bottom of DataTable', () => {
    const wrapper = ownShallow()
    wrapper.setState({ lockExceptions: fakeLockExceptionsForDataTable })
    expect(wrapper.find(Pagination)).toHaveLength(2)
})

it('Lock Exception Component renders BATCH DELETION Button at h1', () => {
    const wrapper = ownShallow()
    const buttons = wrapper.find(RaisedButton)
    expect(buttons).toHaveLength(1)
    expect(buttons.at(0).props().label === 'BATCH DELETION').toBe(true)
})

it('Lock Exception Component renders Floating add button', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(FloatingActionButton)).toHaveLength(1)
})

it('Lock Exception Component calls showLockExceptionFormDialog when ADD button is clicked', () => {
    // eslint-disable-next-line no-undef
    const spy = spyOn(LockException.prototype, 'showLockExceptionFormDialog')
    const wrapper = ownShallow()
    wrapper.find(FloatingActionButton).simulate('click')
    expect(spy).toHaveBeenCalled()
})

it('Lock Exception Component renders Add new lock exception dialog in close state', () => {
    const wrapper = ownShallow()
    wrapper.setState({
        levels: [],
        groups: [],
        dataSets: ['dataSet'],
    })
    const dialog = wrapper.find(Dialog)
    expect(dialog).toHaveLength(1)
    expect(dialog.find(AddLockExceptionForm)).toHaveLength(1)
    expect(dialog.props().title).toBe('Add new lock exception')
    expect(dialog.props().open).toBe(false)
})

it('Lock Exception Component calls goToBatchDeletionPage when BATCH DELETION button is clicked', () => {
    // eslint-disable-next-line no-undef
    const spy = spyOn(LockException.prototype, 'goToBatchDeletionPage')
    const wrapper = ownShallow()
    const buttons = wrapper.find(RaisedButton)
    buttons.forEach(button => {
        if (button.props().label === 'BATCH DELETION') {
            button.simulate('click')
        }
    })
    expect(spy).toHaveBeenCalled()
})

it('Lock Exception Component updates showAddDialogOpen at state to true when ADD button is clicked', () => {
    const wrapper = ownShallow()
    wrapper.setState({
        levels: [],
        groups: [],
        dataSets: ['dataSet'],
    })
    wrapper.find(FloatingActionButton).simulate('click')
    wrapper.update()
    expect(wrapper.state('showAddDialogOpen')).toBe(true)
})

it('Lock Exception Component open Add new lock exception dialog', () => {
    const wrapper = ownShallow()
    wrapper.setState({
        levels: [],
        groups: [],
        dataSets: ['dataSet'],
    })
    wrapper.find(FloatingActionButton).simulate('click')
    const dialog = wrapper.find(Dialog)
    expect(dialog.props().open).toBe(true)
})
