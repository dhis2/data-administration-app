import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import {
    addToSelection,
    removeFromSelection,
    handleChangeSelection,
} from './common'
import Dropdown from './Dropdown/Dropdown'

class OrgUnitSelectByLevel extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            selection: undefined,
        }
        this.levelCache = new Map()

        this.addToSelection = addToSelection.bind(this)
        this.removeFromSelection = removeFromSelection.bind(this)
        this.handleChangeSelection = handleChangeSelection.bind(this)

        this.getOrgUnitsForLevel = this.getOrgUnitsForLevel.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.handleDeselect = this.handleDeselect.bind(this)
    }

    getOrgUnitsForLevel(level, ignoreCache = false) {
        const d2 = this.props.d2
        return new Promise(resolve => {
            if (this.props.currentRoot) {
                const rootLevel =
                    this.props.currentRoot.level || this.props.currentRoot.path
                        ? this.props.currentRoot.path.match(/\//g).length
                        : NaN
                const relativeLevel = level - rootLevel
                if (isNaN(relativeLevel) || relativeLevel < 0) {
                    return resolve([])
                }

                d2.models.organisationUnits
                    .list({
                        paging: false,
                        level: level - rootLevel,
                        fields: 'id,path',
                        root: this.props.currentRoot.id,
                    })
                    .then(orgUnits => orgUnits.toArray())
                    .then(orgUnitArray => {
                        this.setState({ loading: false })
                        resolve(orgUnitArray)
                    })
            } else if (!ignoreCache && this.levelCache.has(level)) {
                resolve(this.levelCache.get(level).slice())
            } else {
                this.setState({ loading: true })

                d2.models.organisationUnits
                    .list({ paging: false, level, fields: 'id,path' })
                    .then(orgUnits => orgUnits.toArray())
                    .then(orgUnitArray => {
                        this.setState({ loading: false })
                        this.levelCache.set(level, orgUnitArray)

                        // Make a copy of the returned array to ensure that the cache won't be modified from elsewhere
                        resolve(orgUnitArray.slice())
                    })
                    .catch(err => {
                        this.setState({ loading: false })
                        console.error(
                            `Failed to load org units in level ${level}:`,
                            err
                        )
                    })
            }
        })
    }

    handleSelect() {
        this.getOrgUnitsForLevel(this.state.selection).then(orgUnits => {
            this.addToSelection(orgUnits)
        })
    }

    handleDeselect() {
        this.getOrgUnitsForLevel(this.state.selection).then(orgUnits => {
            this.removeFromSelection(orgUnits)
        })
    }

    render() {
        const currentRoot = this.props.currentRoot
        const currentRootLevel = currentRoot
            ? currentRoot.level || currentRoot.path.match(/\//g).length
            : 1

        const menuItems = (Array.isArray(this.props.levels)
            ? this.props.levels
            : this.props.levels.toArray()
        )
            .filter(level => level.level >= currentRootLevel)
            .map(level => ({ id: level.level, displayName: level.displayName }))
        const label = i18n.t('Organisation unit level')

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

OrgUnitSelectByLevel.propTypes = {
    d2: PropTypes.object.isRequired,

    // levels is an array of either ModelCollection objects or plain objects,
    // where each object should contain `level` and `displayName` properties
    levels: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,

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
    currentRoot: (props, propName) => {
        if (props[propName]) {
            if (!Object.prototype.hasOwnProperty.call(props[propName], 'id')) {
                return new Error('currentRoot must have an `id` property')
            }

            if (
                !Object.prototype.hasOwnProperty.call(
                    props[propName],
                    'level'
                ) &&
                !Object.prototype.hasOwnProperty.call(props[propName], 'path')
            ) {
                return new Error(
                    'currentRoot must have either a `level` or a `path` property'
                )
            }
        }
    },
}

export default OrgUnitSelectByLevel