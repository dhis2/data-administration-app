import { shallow } from 'enzyme'
import React from 'react'
import { sections } from '../sections.conf'
import GridSection from './grid-section/GridSection'
import Homepage from './Home'

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

const ownShallow = () => {
    return shallow(<Homepage sectionKey="home" />, {
        disableLifecycleMethods: true,
        context: {
            updateAppState: jest.fn(),
        },
    })
}

it('Homepage renders without crashing', () => {
    ownShallow()
})

it('Homepage renders a GridList', () => {
    const wrapper = ownShallow()
    expect(wrapper.find('#grid-list-id')).toHaveLength(1)
})

it('Home renders the correct number of GridSection', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(GridSection)).toHaveLength(sections.length)
})
