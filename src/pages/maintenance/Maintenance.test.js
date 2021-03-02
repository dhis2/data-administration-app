import { shallow } from 'enzyme'
import Checkbox from 'material-ui/Checkbox'
import { GridTile } from 'material-ui/GridList'
import RaisedButton from 'material-ui/RaisedButton'
import React from 'react'
import { sections, MAINTENANCE_SECTION_KEY } from '../sections.conf'
import Maintenance from './Maintenance'
import { maintenanceCheckboxes } from './maintenance.conf'

let maintenancePageInfo = {}

for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    if (section.key === MAINTENANCE_SECTION_KEY) {
        maintenancePageInfo = section.info
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

const ownShallow = () => {
    return shallow(
        <Maintenance
            sectionKey={MAINTENANCE_SECTION_KEY}
            pageInfo={maintenancePageInfo}
        />,
        {
            context: {
                updateAppState: jest.fn(),
            },
            disableLifecycleMethods: true,
        }
    )
}

it('Maintenance renders without crashing', () => {
    ownShallow()
})

it('Maintenance renders a "Grid List Container"', () => {
    const wrapper = ownShallow()
    expect(wrapper.find('div.row')).toHaveLength(1)
})

it('Maintenance renders needed Checkboxes', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(Checkbox)).toHaveLength(maintenanceCheckboxes.length)
})

it('Maintenance renders a RaisedButton', () => {
    const wrapper = ownShallow()
    expect(wrapper.find(RaisedButton)).toHaveLength(1)
})

it('Maintenance calls performMaintenance method when button is clicked', () => {
    // eslint-disable-next-line no-undef
    const spy = spyOn(Maintenance.prototype, 'performMaintenance')
    const wrapper = ownShallow()
    wrapper.find(RaisedButton).simulate('click')
    expect(spy).toHaveBeenCalled()
})

it('Maintenance state changes Checkbox state when a Checkbox is checked', () => {
    const wrapper = ownShallow()
    const state = wrapper.state()
    const grid = wrapper.find('div.row').first()
    const maintenanceCheckbox = grid.find(GridTile).first()
    maintenanceCheckbox.find(Checkbox).first().simulate('check')

    // assert checkbox states
    const checkedCheckboxKey = maintenanceCheckbox.key()
    for (let i = 0; i < maintenanceCheckboxes.length; i++) {
        const checkboxKey = maintenanceCheckboxes[i].key
        const checkboxState = state.checkboxes[checkboxKey].checked
        expect(checkboxState).toBe(checkboxKey === checkedCheckboxKey)
    }
})
