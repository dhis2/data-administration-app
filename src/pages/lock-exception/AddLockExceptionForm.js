import React, { Component } from 'react';
import PropTypes from 'prop-types';

/* Material UI */
import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';

import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';
import OrgUnitSelectByLevel from 'd2-ui/lib/org-unit-select/OrgUnitSelectByLevel.component';
import OrgUnitSelectByGroup from 'd2-ui/lib/org-unit-select/OrgUnitSelectByGroup.component';
import OrgUnitSelectAll from 'd2-ui/lib/org-unit-select/OrgUnitSelectAll.component';
import SelectField from 'd2-ui/lib/select-field/SelectField';
import PeriodPicker from 'd2-ui/lib/period-picker/PeriodPicker.component';

import styles from './AddLockExceptionForm.css';

class AddLockExceptionForm extends Component {
    static propTypes = {
        levels: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array,
        ]).isRequired,
        groups: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array,
        ]).isRequired,
        dataSets: PropTypes.array.isRequired,
        updateSelectedOrgUnits: PropTypes.func.isRequired,
        updateSeletedDataSetId: PropTypes.func.isRequired,
        updateSelectedPeriodId: PropTypes.func.isRequired,
    }

    static contextTypes = {
        t: PropTypes.func,
        d2: PropTypes.object,
    }

    constructor(props) {
        super(props);

        this.state = {
            selected: [],
            dataSet: null,
        };

        this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this);
        this.handleOrgUnitClick = this.handleOrgUnitClick.bind(this);
    }

    handleSelectionUpdate(newSelection) {
        this.setState({ selected: newSelection });
        this.props.updateSelectedOrgUnits(this.state.selected);
    }

    handleOrgUnitClick(event, orgUnit) {
        if (this.state.selected.includes(orgUnit.path)) {
            const selected = this.state.selected;
            selected.splice(selected.indexOf(orgUnit.path), 1);
            this.setState({ selected });
        } else {
            const selected = this.state.selected;
            selected.push(orgUnit.path);
            this.setState({ selected });
        }
        this.props.updateSelectedOrgUnits(this.state.selected);
    }

    render() {
        const t = this.context.t;
        const changeRoot = (currentRoot) => {
            this.setState({ currentRoot });
        };

        const dataSetItems = this.props.dataSets.map(dataSet => (
            { id: dataSet.id, name: dataSet.displayName, periodType: dataSet.periodType }),
        );

        const dataSetChange = (item) => {
            const d2 = this.context.d2;
            const dataSetId = item.id;

            if (this.state.dataSet === null || dataSetId !== this.state.dataSet.id) {
                this.props.updateSeletedDataSetId(dataSetId);

                this.setState({
                    rootWithMembers: null,
                    selected: [],
                    dataSet: item,
                });

                Promise.all([
                    d2.models.organisationUnits.list({
                        paging: false,
                        level: 1,
                        fields: 'id,displayName,path,children::isNotEmpty,memberCount',
                        memberCollection: 'dataSets',
                        memberObject: dataSetId,
                    }),
                    d2.models.dataSets.get(dataSetId, {
                        paging: false,
                        fields: 'organisationUnits[id,path]',
                    }),
                ]).then(([rootWithDataSetMembers, dataSetMembers]) => {
                    const rootWithMembers = rootWithDataSetMembers.toArray()[0];
                    const selected = dataSetMembers.organisationUnits.toArray().map(ou => ou.path);
                    this.setState({
                        rootWithMembers,
                        selected,
                    });
                }).catch(() => {
                    // TODO
                });
            }
        };

        const onPickPeriod = (value) => {
            this.props.updateSelectedPeriodId(value);
        };

        return (
            <div>
                <div>
                    <SelectField
                        style={
                            {
                                display: 'inline-block',
                                float: 'left',
                                width: 360,
                                marginRight: 20,
                            }
                        }
                        label={this.state.dataSet ? this.state.dataSet.name : t('Select dataset')}
                        items={dataSetItems}
                        onChange={dataSetChange}
                    />
                    {this.state.dataSet &&
                    <PeriodPicker
                        style={{ display: 'inline-block' }}
                        className={styles.dropdown}
                        periodType={this.state.dataSet.periodType}
                        onPickPeriod={onPickPeriod}
                    />
                    }
                </div>
                {this.state.dataSet ? (
                    <Card className={styles.organisationUnitTreeCard}>
                        <CardText>
                            <div className={styles.left}>
                                {this.state.rootWithMembers ? (
                                    <OrgUnitTree
                                        root={this.state.rootWithMembers}
                                        selected={this.state.selected}
                                        currentRoot={this.state.currentRoot}
                                        initiallyExpanded={[`/${this.state.rootWithMembers.id}`]}
                                        memberCollection="dataSets"
                                        memberObject={this.state.dataSet.id}
                                        onSelectClick={this.handleOrgUnitClick}
                                        onChangeCurrentRoot={changeRoot}
                                    />) :
                                    (
                                        <span>{t('Updating Tree...')}</span>
                                    )}
                            </div>
                            <div className={styles.right}>
                                <div>
                                    {this.state.currentRoot ? (
                                        <div>{t('For organisation units within')} <span className={styles.ouLabel}>{
                                            this.state.currentRoot.displayName
                                        }</span>:</div>
                                    ) : <div>For all organisation units:</div>}
                                    <OrgUnitSelectByLevel
                                        levels={this.props.levels}
                                        selected={this.state.selected}
                                        currentRoot={this.state.currentRoot}
                                        onUpdateSelection={this.handleSelectionUpdate}
                                    />
                                    <OrgUnitSelectByGroup
                                        groups={this.props.groups}
                                        selected={this.state.selected}
                                        currentRoot={this.state.currentRoot}
                                        onUpdateSelection={this.handleSelectionUpdate}
                                    />
                                    <div style={{ marginTop: 16 }}>
                                        <OrgUnitSelectAll
                                            selected={this.state.selected}
                                            currentRoot={this.state.currentRoot}
                                            onUpdateSelection={this.handleSelectionUpdate}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardText>
                    </Card>) : null
                }
            </div>
        );
    }
}

export default AddLockExceptionForm;
