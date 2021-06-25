import i18n from '@dhis2/d2-i18n'
import { ButtonStrip, Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { addToSelection, removeFromSelection } from './common'
import styles from './SelectAll.module.css'

class SelectAll extends React.Component {
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
            this.props.onSelectedChange(this.state.cache.slice())
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

                    this.props.onSelectedChange(ous.slice())
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
            this.props.onSelectedChange([])
        }
    }

    render() {
        return (
            <ButtonStrip className={styles.container}>
                <Button
                    onClick={this.handleSelectAll}
                    disabled={this.state.loading}
                >
                    {i18n.t('Select All Org Units')}
                </Button>
                <Button
                    onClick={this.handleDeselectAll}
                    disabled={this.state.loading}
                >
                    {i18n.t('Deselect All Org Units')}
                </Button>
            </ButtonStrip>
        )
    }
}

SelectAll.propTypes = {
    d2: PropTypes.object.isRequired,

    // selected is an array of selected organisation unit IDs
    selected: PropTypes.array.isRequired,

    // Whenever the selection changes, onSelectedChange will be called with
    // one argument: The new array of selected organisation unit paths
    // onSelectedChange: PropTypes.func.isRequired,

    // If currentRoot is set, only org units that are descendants of the
    // current root org unit will be added to or removed from the selection
    currentRoot: PropTypes.object,
}

export default SelectAll
