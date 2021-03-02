import OrgUnitSelectAll from 'd2-ui/lib/org-unit-select/OrgUnitSelectAll.component'
import OrgUnitSelectByGroup from 'd2-ui/lib/org-unit-select/OrgUnitSelectByGroup.component'
import OrgUnitSelectByLevel from 'd2-ui/lib/org-unit-select/OrgUnitSelectByLevel.component'
import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component'
import PeriodPicker from 'd2-ui/lib/period-picker/PeriodPicker.component'
import SelectField from 'd2-ui/lib/select-field/SelectField'
import { shallow } from 'enzyme'
import React from 'react'
import AddLockExceptionForm from './AddLockExceptionForm'

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

const fakeDataSets = [
    {
        id: 'monthlyDataSet',
        name: 'monthlyDataSet',
        periodType: 'monthly',
    },
    {
        id: 'weeklyDataSet',
        name: 'weeklyDataSet',
        periodType: 'weekly',
    },
]

const updateSelectedOrgUnits = jest.fn()
const updateSeletedDataSetId = jest.fn()
const updateSelectedPeriodId = jest.fn()

const ownShallow = () => {
    return shallow(
        <AddLockExceptionForm
            levels={[]}
            groups={[]}
            dataSets={fakeDataSets}
            updateSelectedOrgUnits={updateSelectedOrgUnits}
            updateSeletedDataSetId={updateSeletedDataSetId}
            updateSelectedPeriodId={updateSelectedPeriodId}
        />,
        {
            disableLifecycleMethods: true,
        }
    )
}

it('Add Lock Exception Form Component renders without crashing', () => {
    ownShallow()
})

it('Add Lock Exception Form Component renders a SelectField', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(SelectField)).toHaveLength(1)
})

it('Add Lock Exception Form Component renders no PeriodPicker', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(PeriodPicker)).toHaveLength(0)
})

it('Add Lock Exception Form Component renders PeriodPicker', () => {
    const wrapper = ownShallow()
    wrapper.setState({ dataSet: fakeDataSets[0] })
    expect(wrapper.find(PeriodPicker)).toHaveLength(1)
})

it('Add Lock Exception Form Component renders OrgUnitTree', () => {
    const wrapper = ownShallow()
    wrapper.setState({
        dataSet: fakeDataSets[0],
        rootWithMembers: {},
    })
    expect(wrapper.find(OrgUnitTree)).toHaveLength(1)
})

it('Add Lock Exception Form Component renders OrgUnitSelectByLevel', () => {
    const wrapper = ownShallow()
    wrapper.setState({ dataSet: fakeDataSets[0] })
    expect(wrapper.find(OrgUnitSelectByLevel)).toHaveLength(1)
})

it('Add Lock Exception Form Component renders OrgUnitSelectByGroup', () => {
    const wrapper = ownShallow()
    wrapper.setState({ dataSet: fakeDataSets[0] })
    expect(wrapper.find(OrgUnitSelectByGroup)).toHaveLength(1)
})

it('Add Lock Exception Form Component renders OrgUnitSelectAll', () => {
    const wrapper = ownShallow()
    wrapper.setState({ dataSet: fakeDataSets[0] })
    expect(wrapper.find(OrgUnitSelectAll)).toHaveLength(1)
})
