import { ERROR } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes'
import OrgUnitSelectAll from 'd2-ui/lib/org-unit-select/OrgUnitSelectAll.component'
import OrgUnitSelectByGroup from 'd2-ui/lib/org-unit-select/OrgUnitSelectByGroup.component'
import OrgUnitSelectByLevel from 'd2-ui/lib/org-unit-select/OrgUnitSelectByLevel.component'
import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component'
import PeriodPicker from 'd2-ui/lib/period-picker/PeriodPicker.component'
import SelectField from 'd2-ui/lib/select-field/SelectField'
import Card from 'material-ui/Card/Card'
import CardText from 'material-ui/Card/CardText'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { i18nKeys } from '../../i18n'
import i18n from '../../locales'
import styles from './AddLockExceptionForm.module.css'

const d2UiSelectStyleOverride = {
    minWidth: 360,
    marginRight: 20,
}

class AddLockExceptionForm extends Component {
    static propTypes = {
        levels: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
            .isRequired,
        groups: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
            .isRequired,
        dataSets: PropTypes.array.isRequired,
        updateSelectedOrgUnits: PropTypes.func.isRequired,
        updateSeletedDataSetId: PropTypes.func.isRequired,
        updateSelectedPeriodId: PropTypes.func.isRequired,
    }

    static contextTypes = {
        d2: PropTypes.object,
    }

    constructor() {
        super()

        this.state = {
            selected: [],
            dataSet: null,
            orgUnitPaths: null,
        }

        this.onDataSetChange = this.onDataSetChange.bind(this)

        this.onPeriodChange = this.onPeriodChange.bind(this)

        this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this)
        this.handleOrgUnitClick = this.handleOrgUnitClick.bind(this)
        this.changeRoot = this.changeRoot.bind(this)
    }

    onDataSetChange(dataSet) {
        const d2 = this.context.d2
        const dataSetId = dataSet.id

        if (
            this.state.dataSet === null ||
            dataSetId !== this.state.dataSet.id
        ) {
            this.props.updateSeletedDataSetId(dataSetId)

            this.setState({
                rootWithMembers: null,
                selected: [],
                dataSet,
            })

            Promise.all([
                d2.models.organisationUnits.list({
                    paging: false,
                    level: 1,
                    fields:
                        'id,displayName,path,children::isNotEmpty,memberCount',
                    memberCollection: 'dataSets',
                    memberObject: dataSetId,
                }),
                d2.models.dataSets.get(dataSetId, {
                    paging: false,
                    fields: 'organisationUnits[id,path]',
                }),
            ])
                .then(([rootWithDataSetMembers, dataSetMembers]) => {
                    const rootWithMembers = rootWithDataSetMembers.toArray()[0]
                    this.setState({
                        rootWithMembers,
                        selected: [],
                        orgUnitPaths: dataSetMembers.organisationUnits
                            .toArray()
                            .map(ou => ou.path),
                    })
                })
                .catch(error => {
                    if (this.isPageMounted()) {
                        const messageError =
                            error && error.message
                                ? error.message
                                : i18n.t(i18nKeys.messages.unexpectedError)

                        this.context.updateAppState({
                            showSnackbar: true,
                            loading: false,
                            snackbarConf: {
                                type: ERROR,
                                message: messageError,
                            },
                            pageState: { ...this.state },
                        })
                    }
                })
        }
    }

    onPeriodChange(periodId) {
        this.props.updateSelectedPeriodId(periodId)
    }

    handleSelectionUpdate(newSelection) {
        this.setState({ selected: newSelection })
        this.props.updateSelectedOrgUnits(this.state.selected)
    }

    handleOrgUnitClick(event, orgUnit) {
        if (this.state.selected.includes(orgUnit.path)) {
            const selected = this.state.selected
            selected.splice(selected.indexOf(orgUnit.path), 1)
            this.setState({ selected })
        } else {
            const selected = this.state.selected
            selected.push(orgUnit.path)
            this.setState({ selected })
        }
        this.props.updateSelectedOrgUnits(this.state.selected)
    }

    changeRoot(currentRoot) {
        this.setState({ currentRoot })
    }

    render() {
        const dataSetItems = this.props.dataSets.map(dataSet => ({
            id: dataSet.id,
            name: dataSet.displayName,
            periodType: dataSet.periodType,
        }))

        let dataSetSelectLabel = i18n.t(i18nKeys.lockException.selectADataSet)
        let dataSetSelectValue = null
        if (this.state.dataSet) {
            dataSetSelectLabel = i18n.t(i18nKeys.lockException.dataSet)
            dataSetSelectValue = this.state.dataSet.id
        }

        return (
            <div id={'addLockExceptionFormId'}>
                <div className={styles.selectsContainer}>
                    <SelectField
                        style={d2UiSelectStyleOverride}
                        label={dataSetSelectLabel}
                        items={dataSetItems}
                        onChange={this.onDataSetChange}
                        value={dataSetSelectValue}
                    />
                    {this.state.dataSet && (
                        <span id={'idPeriodPicker'}>
                            <PeriodPicker
                                periodType={this.state.dataSet.periodType}
                                onPickPeriod={this.onPeriodChange}
                            />
                        </span>
                    )}
                </div>
                {this.state.dataSet ? (
                    <Card className={styles.organisationUnitTreeCard}>
                        <CardText
                            className={styles.organisationUnitTreeContainer}
                        >
                            <div className={styles.left}>
                                {this.state.rootWithMembers ? (
                                    <OrgUnitTree
                                        root={this.state.rootWithMembers}
                                        selected={this.state.selected}
                                        currentRoot={this.state.currentRoot}
                                        initiallyExpanded={[
                                            `/${this.state.rootWithMembers.id}`,
                                        ]}
                                        memberCollection="dataSets"
                                        memberObject={this.state.dataSet.id}
                                        onSelectClick={this.handleOrgUnitClick}
                                        onChangeCurrentRoot={this.changeRoot}
                                        orgUnitsPathsToInclude={
                                            this.state.orgUnitPaths
                                        }
                                    />
                                ) : (
                                    <span>
                                        {i18n.t(
                                            i18nKeys.lockException.updatingTree
                                        )}
                                    </span>
                                )}
                            </div>
                            <div className={styles.right}>
                                <div>
                                    {this.state.currentRoot ? (
                                        <div>
                                            {i18n.t(
                                                i18nKeys.lockException
                                                    .organisationUnitsWithin
                                            )}{' '}
                                            <span className={styles.ouLabel}>
                                                {
                                                    this.state.currentRoot
                                                        .displayName
                                                }
                                            </span>
                                            :
                                        </div>
                                    ) : (
                                        <div>
                                            {i18n.t(
                                                i18nKeys.lockException
                                                    .selectOrganisationUnits
                                            )}
                                        </div>
                                    )}
                                    <OrgUnitSelectByLevel
                                        levels={this.props.levels}
                                        selected={this.state.selected}
                                        currentRoot={this.state.currentRoot}
                                        onUpdateSelection={
                                            this.handleSelectionUpdate
                                        }
                                    />
                                    <OrgUnitSelectByGroup
                                        groups={this.props.groups}
                                        selected={this.state.selected}
                                        currentRoot={this.state.currentRoot}
                                        onUpdateSelection={
                                            this.handleSelectionUpdate
                                        }
                                    />
                                    <OrgUnitSelectAll
                                        selected={this.state.selected}
                                        currentRoot={this.state.currentRoot}
                                        onUpdateSelection={
                                            this.handleSelectionUpdate
                                        }
                                    />
                                </div>
                            </div>
                        </CardText>
                    </Card>
                ) : null}
            </div>
        )
    }
}

export default AddLockExceptionForm
