import i18n from '@dhis2/d2-i18n'
import { Card, Button, CircularLoader, Checkbox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import { i18nKeys } from '../../i18n-keys'
import { maintenanceCheckboxes } from './maintenance.conf'
import styles from './Maintenance.module.css'

const Maintenance = ({ sectionKey }) => {
    const loading = false
    const [checkboxes, setCheckboxes] = useState(() => {
        const checkboxes = {}
        for (const checkbox of Object.values(maintenanceCheckboxes)) {
            checkboxes[checkbox.key] = false
        }
        return checkboxes
    })
    const handlePerformMaintenance = () => {
        // TODO
    }

    return (
        <div>
            <PageHeader
                sectionKey={sectionKey}
                title={i18n.t(i18nKeys.maintenance.title)}
            />
            <Card className={styles.card}>
                <div className={styles.checkboxes}>
                    {maintenanceCheckboxes.map(checkbox => {
                        const checkboxState = checkboxes[checkbox.key]
                        const toggleCheckbox = () => {
                            setCheckboxes({
                                ...checkboxes,
                                [checkbox.key]: !checkboxState,
                            })
                        }
                        return (
                            <Checkbox
                                key={checkbox.key}
                                className={styles.checkbox}
                                label={i18n.t(checkbox.label)}
                                checked={checkboxState}
                                onChange={toggleCheckbox}
                                disabled={loading}
                            />
                        )
                    })}
                </div>
                <Button
                    primary
                    disabled={
                        loading ||
                        !Object.values(checkboxes).some(checked => checked)
                    }
                    onClick={handlePerformMaintenance}
                >
                    {loading ? (
                        <>
                            {i18n.t('Performing maintenance...')}
                            <CircularLoader small />
                        </>
                    ) : (
                        i18n.t(i18nKeys.maintenance.actionButton)
                    )}
                </Button>
            </Card>
        </div>
    )
}

/*class MaintenanceX {
    constructor() {
        const checkboxes = {}
        for (const checkbox of Object.values(maintenanceCheckboxes)) {
            checkboxes[checkbox.key] = { checked: false }
        }

        this.state = {
            checkboxes,
        }
    }

    setLoadingPageState() {
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: i18n.t(i18nKeys.maintenance.performing),
            },
            pageState: {
                loading: true,
            },
        })
    }

    setLoadedPageWithErrorState(error) {
        const messageError =
            error && error.message
                ? error.message
                : i18n.t(i18nKeys.maintenance.unexpectedError)
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: ERROR,
                message: messageError,
            },
            pageState: {
                loading: false,
            },
        })
    }

    selectedCheckboxesCount() {
        let selectedCheckboxes = 0
        const checkboxKeys = Object.keys(this.state.checkboxes)
        for (let i = 0; i < checkboxKeys.length; i++) {
            const key = checkboxKeys[i]
            const checked = this.state.checkboxes[key].checked
            if (checked) {
                selectedCheckboxes += 1
            }
        }
        return selectedCheckboxes
    }

    areActionsDisabled() {
        return this.props.loading
    }

    buildFormData() {
        let formData = null
        const checkboxKeys = Object.keys(this.state.checkboxes)
        for (let i = 0; i < checkboxKeys.length; i++) {
            const key = checkboxKeys[i]
            const checked = this.state.checkboxes[key].checked
            formData = formData || new FormData()
            formData.append(key, checked)
        }

        return formData
    }

    performMaintenance = () => {
        const api = this.context.d2.Api.getApi()
        const formData = this.buildFormData()

        if (formData) {
            this.setLoadingPageState()
            api.post(MAINTENANCE_ENDPOINT, formData)
                .then(() => {
                    if (this.isPageMounted()) {
                        this.context.updateAppState({
                            showSnackbar: true,
                            snackbarConf: {
                                type: SUCCESS,
                                message: i18n.t(
                                    i18nKeys.maintenance.actionPerformed
                                ),
                            },
                            pageState: {
                                loading: false,
                            },
                        })
                    }
                })
                .catch(error => {
                    if (this.isPageMounted()) {
                        this.setLoadedPageWithErrorState(error)
                    }
                })
        }
    }

    render() {
        const checkboxes = Object.assign({}, this.state.checkboxes)
        const gridElements = maintenanceCheckboxes.map(checkbox => {
            const checkboxState = checkboxes[checkbox.key].checked
            const toggleCheckbox = () => {
                checkboxes[checkbox.key].checked = !checkboxState
                this.setState({ checkboxes })
            }
            return (
                <GridTile
                    key={checkbox.key}
                    className={'col-xs-12 col-md-6 col-lg-4'}
                >
                    <Checkbox
                        label={i18n.t(checkbox.label)}
                        checked={checkboxState}
                        onCheck={toggleCheckbox}
                        labelStyle={{ color: '#000000' }}
                        iconStyle={{ fill: '#000000' }}
                    />
                </GridTile>
            )
        })

        return (
            <div>
                <h1>
                    {i18n.t(PAGE_TITLE)}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(
                            this.props.sectionKey
                        )}
                    />
                </h1>
                <Card id={'maintenanceContentContainerId'}>
                    <CardText>
                        <div className={'row'}>{gridElements}</div>
                        <RaisedButton
                            id={'performMaintenanceBtnId'}
                            label={i18n.t(i18nKeys.maintenance.actionButton)}
                            onClick={this.performMaintenance}
                            primary
                            disabled={
                                this.areActionsDisabled() ||
                                this.selectedCheckboxesCount() === 0
                            }
                        />
                    </CardText>
                </Card>
            </div>
        )
    }
}*/

Maintenance.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default Maintenance
