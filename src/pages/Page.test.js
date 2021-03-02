import { shallow } from 'enzyme'
import React from 'react'
import DataStatistics from './data-statistics/DataStatistics'
import Home from './home/Home'
import Page from './Page'
import { DATA_STATISTICS_SECTION_KEY } from './sections.conf'

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

jest.mock('./Page') // Page is now a mock constructor

const notPageComponentShallow = () => {
    return shallow(<Home t={jest.fn()} />)
}

const pageComponentShallow = () => {
    return shallow(
        <DataStatistics sectionKey={DATA_STATISTICS_SECTION_KEY} />,
        {
            context: {
                updateAppState: jest.fn(),
                d2: {
                    Api: {
                        getApi: jest.fn(),
                    },
                },
            },
        }
    )
}

beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    Page.mockClear()
})

it('Page constructor is called', () => {
    new Page()
    expect(Page).toHaveBeenCalled()
})

it('Not Page component does not call page constructor', () => {
    notPageComponentShallow()
    expect(Page).toHaveBeenCalledTimes(0)
})

it('Page component calls page constructor', () => {
    pageComponentShallow()
    expect(Page).toHaveBeenCalledTimes(1)
})

it('componentWillMount was called after render', () => {
    // eslint-disable-next-line no-undef
    const spy = spyOn(Page.prototype, 'componentWillMount')
    pageComponentShallow()
    expect(spy).toHaveBeenCalled()
})

it('componentWillUnmount was called after unmount', () => {
    // eslint-disable-next-line no-undef
    const spy = spyOn(Page.prototype, 'componentWillUnmount')
    const wrapper = pageComponentShallow()
    wrapper.unmount()
    expect(spy).toHaveBeenCalled()
})
