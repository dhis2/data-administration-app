import i18n from '@dhis2/d2-i18n'
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
        d2: PropTypes.object.isRequired,
        dataSets: PropTypes.array.isRequired,
        groups: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
            .isRequired,
        levels: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
            .isRequired,
        updateSelectedDataSetId: PropTypes.func.isRequired,
        updateSelectedOrgUnits: PropTypes.func.isRequired,
        updateSelectedPeriodId: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props)

        this.state = {
            selected: [],
            dataSet: null,
            orgUnitPaths: null,
        }

        this.fixD2Translations()
    }

    static childContextTypes = {
        d2: PropTypes.object,
    }

    getChildContext() {
        return {
            d2: this.props.d2,
        }
    }

    fixD2Translations() {
        Object.assign(this.props.d2.i18n.translations, {
            period: i18n.t('Period'),
            data_set: i18n.t('Data set'),
            organisation_unit: i18n.t('Organisation unit'),
            organisation_unit_group: i18n.t('Organisation unit group'),
            organisation_unit_level: i18n.t('Organisation unit level'),
            select: i18n.t('Select'),
            deselect: i18n.t('Deselect'),
            select_all: i18n.t('Select All Org Units'),
            deselect_all: i18n.t('Deselect All Org Units'),
            name: i18n.t('Name'),
            show: i18n.t('Show details'),
            remove: i18n.t('Remove'),
            actions: i18n.t('Actions'),
            week: i18n.t('week'),
            month: i18n.t('month'),
            year: i18n.t('year'),
            biMonth: i18n.t('bi monthly'),
            day: i18n.t('day'),
            jan: i18n.t('jan'),
            feb: i18n.t('feb'),
            mar: i18n.t('mar'),
            apr: i18n.t('apr'),
            may: i18n.t('may'),
            jun: i18n.t('jun'),
            jul: i18n.t('jul'),
            aug: i18n.t('aug'),
            sep: i18n.t('sep'),
            oct: i18n.t('oct'),
            nov: i18n.t('nov'),
            dec: i18n.t('dec'),
            'jan-feb': i18n.t('jan-feb'),
            'mar-apr': i18n.t('mar-apr'),
            'may-jun': i18n.t('may-jun'),
            'jul-aug': i18n.t('jul-aug'),
            'sep-oct': i18n.t('sep-oct'),
            'nov-dec': i18n.t('nov-dec'),
            quarter: i18n.t('quarter'),
            Q1: i18n.t('Q1'),
            Q2: i18n.t('Q2'),
            Q3: i18n.t('Q3'),
            Q4: i18n.t('Q4'),
            sixMonth: i18n.t('six monthly'),
            'jan-jun': i18n.t('jan-jun'),
            'jul-dec': i18n.t('jul-dec'),
            'apr-sep': i18n.t('apr-sep'),
            'oct-mar': i18n.t('oct-mar'),
        })
    }

    handleDataSetChange = async dataSet => {
        const dataSetId = dataSet.id
        if (
            this.state.dataSet !== null &&
            dataSetId === this.state.dataSet.id
        ) {
            return
        }

        this.props.updateSelectedDataSetId(dataSetId)
        this.setState({
            rootWithMembers: null,
            selected: [],
            dataSet,
        })

        const { d2 } = this.props
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
            periodType: dataSet.periodType?.name,
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
                                d2={this.props.d2}
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
