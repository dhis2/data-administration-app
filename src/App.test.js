import React from 'react'
import { shallow } from 'enzyme'
import { DumbApp } from './App'
import AppRouter from './components/app-router/AppRouter'
import SideBar from 'd2-ui/lib/sidebar/Sidebar.component'
import HeaderBar from 'd2-ui/lib/app-header/HeaderBar'

jest.mock('d2-ui/lib/sidebar/Sidebar.component', () => 'Sidebar')
jest.mock('d2-ui/lib/app-header/HeaderBar', () => 'HeaderBar')
jest.mock('d2-ui/lib/app-header/headerBar.store', () => ({}))
jest.mock('d2-ui/lib/component-helpers/withStateFrom', () => () => 'HeaderBar')
jest.mock(
    'd2-ui/lib/circular-progress/CircularProgress',
    () => 'CircularProgress'
)
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
jest.mock(
    'd2-ui/lib/feedback-snackbar/FeedbackSnackbar.component',
    () => 'FeedbackSnackbar'
)

const t = jest.fn()

const ownShallow = () => {
    return shallow(<DumbApp t={t} />, {
        disableLifecycleMethods: true,
    })
}

it('renders without crashing', () => {
    ownShallow()
})

it('App renders a HeaderBar Component', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(HeaderBar)).toHaveLength(1)
})

it('App renders a SideBar', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(SideBar)).toHaveLength(1)
})

it('App renders a AppRouter', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(AppRouter)).toHaveLength(1)
})
