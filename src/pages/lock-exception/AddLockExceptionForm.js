import i18n from '@dhis2/d2-i18n'
import { getInstance as getD2Instance } from 'd2'
import OrgUnitSelectAll from 'd2-ui/lib/org-unit-select/OrgUnitSelectAll.component'
import OrgUnitSelectByGroup from 'd2-ui/lib/org-unit-select/OrgUnitSelectByGroup.component'
import OrgUnitSelectByLevel from 'd2-ui/lib/org-unit-select/OrgUnitSelectByLevel.component'
import SelectField from 'd2-ui/lib/select-field/SelectField'
import Card from 'material-ui/Card/Card'
import CardText from 'material-ui/Card/CardText'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './AddLockExceptionForm.module.css'
import OrgUnitTree from './OrgUnitTree'
import PeriodPicker from './PeriodPicker'

const d2UiSelectStyleOverride = {
    minWidth: 360,
    marginRight: 20,
}

class AddLockExceptionForm extends Component {
    static propTypes = {
        dataSets: PropTypes.array.isRequired,
        groups: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
            .isRequired,
        levels: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
            .isRequired,
        updateSelectedOrgUnits: PropTypes.func.isRequired,
        updateSelectedPeriodId: PropTypes.func.isRequired,
        updateSeletedDataSetId: PropTypes.func.isRequired,
    }

    constructor() {
        super()

        this.state = {
            selected: [],
            dataSet: null,
            orgUnitPaths: null,
        }
    }

    handleDataSetChange = async dataSet => {
        const dataSetId = dataSet.id
        if (
            this.state.dataset !== null &&
            dataSetId === this.state.dataSet.id
        ) {
            return
        }

        this.props.updateSeletedDataSetId(dataSetId)
        this.setState({
            rootWithMembers: null,
            selected: [],
            dataSet,
        })

        const d2 = await getD2Instance()
        try {
            const [rootWithDataSetMembers, dataSetMembers] = await Promise.all([
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

            const rootWithMembers = rootWithDataSetMembers.toArray()[0]
            this.setState({
                rootWithMembers,
                selected: [],
                orgUnitPaths: dataSetMembers.organisationUnits
                    .toArray()
                    .map(ou => ou.path),
            })
        } catch (error) {
            // TODO: Show error to user
            console.error(error)
        }
    }

    handlePeriodChange = periodId => {
        this.props.updateSelectedPeriodId(periodId)
    }

    handleSelectionUpdate = newSelection => {
        this.setState({ selected: newSelection })
        this.props.updateSelectedOrgUnits(this.state.selected)
    }

    handleOrgUnitClick = (event, orgUnit) => {
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

    handleChangeRoot = currentRoot => {
        this.setState({ currentRoot })
    }

    render() {
        const dataSetItems = this.props.dataSets.map(dataSet => ({
            id: dataSet.id,
            name: dataSet.displayName,
            periodType: dataSet.periodType,
        }))

        let dataSetSelectLabel = i18n.t('Select a data set')
        let dataSetSelectValue = null
        if (this.state.dataSet) {
            dataSetSelectLabel = i18n.t('Data set')
            dataSetSelectValue = this.state.dataSet.id
        }

        return (
            <div>
                <div className={styles.selectsContainer}>
                    <SelectField
                        style={d2UiSelectStyleOverride}
                        label={dataSetSelectLabel}
                        items={dataSetItems}
                        onChange={this.handleDataSetChange}
                        value={dataSetSelectValue}
                    />
                    {this.state.dataSet && (
                        <span>
                            <PeriodPicker
                                periodType={this.state.dataSet.periodType}
                                onPickPeriod={this.handlePeriodChange}
                            />
                        </span>
                    )}
                </div>
                {this.state.dataSet && (
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
                                        onChangeCurrentRoot={
                                            this.handleChangeRoot
                                        }
                                        orgUnitsPathsToInclude={
                                            this.state.orgUnitPaths
                                        }
                                    />
                                ) : (
                                    <span>
                                        {i18n.t(
                                            'Updating organisation units tree...'
                                        )}
                                    </span>
                                )}
                            </div>
                            <div className={styles.right}>
                                <div>
                                    {this.state.currentRoot ? (
                                        <div>
                                            {i18n.t(
                                                'For organisation units within {{organisationUnitName}}:',
                                                {
                                                    organisationUnitName: this
                                                        .state.currentRoot
                                                        .displayName,
                                                }
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            {i18n.t(
                                                'For all organisation units:'
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
                )}
            </div>
        )
    }
}

export default AddLockExceptionForm
