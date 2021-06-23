import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import {
    addToSelection,
    removeFromSelection,
    handleChangeSelection,
} from './common'
import Dropdown from './Dropdown/Dropdown'

class OrgUnitSelectByGroup extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            selection: undefined,
        }
        this.groupCache = new Map()

        this.addToSelection = addToSelection.bind(this)
        this.removeFromSelection = removeFromSelection.bind(this)
        this.handleChangeSelection = handleChangeSelection.bind(this)

        this.getOrgUnitsForGroup = this.getOrgUnitsForGroup.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleDeselect = this.handleDeselect.bind(this)
    }

    getOrgUnitsForGroup(groupId) {
        const d2 = this.props.d2
        return new Promise(resolve => {
            if (this.props.currentRoot) {
                this.setState({ loading: true })

                d2.models.organisationUnits
                    .list({
                        root: this.props.currentRoot.id,
                        paging: false,
                        includeDescendants: true,
                        fields: 'id,path',
                        filter: `organisationUnitGroups.id:eq:${groupId}`,
                    })
                    .then(orgUnits => orgUnits.toArray())
                    .then(orgUnits => {
                        this.setState({ loading: false })

                        resolve(orgUnits.slice())
                    })
            } else if (this.groupCache.has(groupId)) {
                resolve(this.groupCache.get(groupId).slice())
            } else {
                this.setState({ loading: true })

                const d2 = this.props.d2
                d2.models.organisationUnitGroups
                    .get(groupId, { fields: 'organisationUnits[id,path]' })
                    .then(orgUnitGroups =>
                        orgUnitGroups.organisationUnits.toArray()
                    )
                    .then(orgUnits => {
                        this.setState({ loading: false })
                        this.groupCache.set(groupId, orgUnits)

                        // Make a copy of the returned array to ensure that the cache won't be modified from elsewhere
                        resolve(orgUnits.slice())
                    })
                    .catch(err => {
                        this.setState({ loading: false })
                        console.error(
                            `Failed to load org units in group ${groupId}:`,
                            err
                        )
                    })
            }
        })
    }

    handleSelect() {
        this.getOrgUnitsForGroup(this.state.selection).then(this.addToSelection)
    }

    handleDeselect() {
        this.getOrgUnitsForGroup(this.state.selection).then(
            this.removeFromSelection
        )
    }

    render() {
        const menuItems = Array.isArray(this.props.groups)
            ? this.props.groups
            : this.props.groups.toArray()
        const label = i18n.t('Organisation unit group')

        return (
            <Dropdown
                menuItems={menuItems}
                value={this.state.selection}
                label={label}
                loading={this.state.loading}
                onChange={this.handleChangeSelection}
                onSelect={this.handleSelect}
                onDeselect={this.handleDeselect}
            />
        )
    }
}

OrgUnitSelectByGroup.propTypes = {
    d2: PropTypes.object.isRequired,

    // groups is an array of either ModelCollection objects or plain objects,
    // where each object should contain `id` and `displayName` properties
    groups: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,

    // This prop is used, but in the functions defined in `common.js`
    /* eslint-disable react/no-unused-prop-types */
    // selected is an array of selected organisation unit IDs
    selected: PropTypes.array.isRequired,
    /* eslint-enable react/no-unused-prop-types */

    // This prop is used, but in the functions defined in `common.js`
    /* eslint-disable react/no-unused-prop-types */
    // Whenever the selection changes, onUpdateSelection will be called with
    // one argument: The new array of selected organisation unit paths
    onUpdateSelection: PropTypes.func.isRequired,
    /* eslint-enable react/no-unused-prop-types */

    // If currentRoot is set, only org units that are descendants of the
    // current root org unit will be added to or removed from the selection
    currentRoot: PropTypes.object,
}

export default OrgUnitSelectByGroup
