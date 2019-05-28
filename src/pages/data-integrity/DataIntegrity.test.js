import React from 'react'
import { shallow } from 'enzyme'
import { DATA_INTEGRITY_SECTION_KEY, sections } from '../sections.conf'
import DataIntegrity from './DataIntegrity'
import DataIntegrityCard from './data-integrity-card/DataIntegrityCard'

let dataIntegrityPageInfo = {}

for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    if (section.key === DATA_INTEGRITY_SECTION_KEY) {
        dataIntegrityPageInfo = section.info
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

const stateWithCardsForDataIntegrityChecks = {
    dataElementsWithoutDataSet: ['Element1', 'Element2', 'Element3'],
    dataElementsWithoutGroups: ['Element1', 'Element2', 'Element3'],
    dataElementsAssignedToDataSetsWithDifferentPeriodTypes: {
        'IDSR Measles': ['Element1', 'Element2', 'Element3'],
        'IDSR Malaria': ['Element1', 'Element2', 'Element3'],
        'IDSR Yellow fever': ['Element1', 'Element2', 'Element3'],
        'IDSR Cholera': ['Element1', 'Element2', 'Element3'],
        'IDSR Plague': ['Element1', 'Element2', 'Element3'],
    },
}

const ownShallow = () => {
    return shallow(
        <DataIntegrity
            sectionKey={DATA_INTEGRITY_SECTION_KEY}
            pageInfo={dataIntegrityPageInfo}
        />,
        {
            context: {
                updateAppState: jest.fn(),
            },
            disableLifecycleMethods: true,
        }
    )
}

it('DataIntegrity renders without crashing.', () => {
    ownShallow()
})

it('DataIntegrity should show correct title.', () => {
    const wrapper = ownShallow()
    expect(wrapper.find('h1')).toHaveLength(1)
    expect(wrapper.find('h1').text()).toBe('Data Integrity<PageHelper />')
})

it('DataIntegrity renders no DataIntegrityCards when no data available.', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(DataIntegrityCard)).toHaveLength(0)
})

it('DataIntegrity renders received Error DataIntegrityCards.', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(DataIntegrityCard)).toHaveLength(0)
    wrapper.setState({ cards: stateWithCardsForDataIntegrityChecks })
    expect(wrapper.find(DataIntegrityCard)).toHaveLength(3)
})
