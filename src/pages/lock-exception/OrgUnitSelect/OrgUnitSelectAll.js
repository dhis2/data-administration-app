import i18n from '@dhis2/d2-i18n'
import RaisedButton from 'material-ui/RaisedButton/RaisedButton'
import PropTypes from 'prop-types'
import React from 'react'
import { addToSelection, removeFromSelection } from './common'
import style from './style'

class OrgUnitSelectAll extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            cache: null,
        }

        this.addToSelection = addToSelection.bind(this)
        this.removeFromSelection = removeFromSelection.bind(this)
    }

    handleSelectAll = () => {
        if (this.props.currentRoot) {
            this.setState({ loading: true })
            this.getDescendantOrgUnits().then(orgUnits => {
                this.setState({ loading: false })
                this.addToSelection(orgUnits)
            })
        } else if (Array.isArray(this.state.cache)) {
            this.props.onUpdateSelection(this.state.cache.slice())
        } else {
            this.setState({ loading: true })

            this.props.d2.models.organisationUnits
                .list({ fields: 'id,path', paging: false })
                .then(orgUnits => {
                    const ous = orgUnits.toArray().map(ou => ou.path)
                    this.setState({
                        cache: ous,
                        loading: false,
                    })

                    this.props.onUpdateSelection(ous.slice())
                })
                .catch(err => {
                    this.setState({ loading: false })
                    console.error('Failed to load all org units:', err)
                })
        }
    }

    getDescendantOrgUnits() {
        return this.props.d2.models.organisationUnits.list({
            root: this.props.currentRoot.id,
            paging: false,
            includeDescendants: true,
            fields: 'id,path',
        })
    }

    handleDeselectAll = () => {
        if (this.props.currentRoot) {
            this.setState({ loading: true })
            this.getDescendantOrgUnits().then(orgUnits => {
                this.setState({ loading: false })
                this.removeFromSelection(orgUnits)
            })
        } else {
            this.props.onUpdateSelection([])
        }
    }

    render() {
        return (
            <div>
                <RaisedButton
                    style={style.button1}
                    label={i18n.t('Select All Org Units')}
                    onClick={this.handleSelectAll}
                    disabled={this.state.loading}
                />
                <RaisedButton
                    style={style.button}
                    label={i18n.t('Deselect All Org Units')}
                    onClick={this.handleDeselectAll}
                    disabled={this.state.loading}
                />
            </div>
        )
    }
}

OrgUnitSelectAll.propTypes = {
    d2: PropTypes.object.isRequired,

    // This prop is used, but in the functions defined in `common.js`
    /* eslint-disable react/no-unused-prop-types */
    // selected is an array of selected organisation unit IDs
    selected: PropTypes.array.isRequired,
    /* eslint-enable react/no-unused-prop-types */

    // Whenever the selection changes, onUpdateSelection will be called with
    // one argument: The new array of selected organisation unit paths
    onUpdateSelection: PropTypes.func.isRequired,

    // If currentRoot is set, only org units that are descendants of the
    // current root org unit will be added to or removed from the selection
    currentRoot: PropTypes.object,
}

export default OrgUnitSelectAll
