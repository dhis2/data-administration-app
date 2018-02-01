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
        rootWithMembers: PropTypes.object.isRequired,
        updateSelectedOrgUnits: PropTypes.func.isRequired,
        updateSeletedDataSetId: PropTypes.func.isRequired,
        updateSelectedPeriodId: PropTypes.func.isRequired,
    }

    static contextTypes = {
        t: PropTypes.func,
    }

    constructor(props) {
        super(props);

        this.state = {
            selected: [],
            rootWithMembers: props.rootWithMembers,
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
            this.setState({
                dataSet: item,
            });
            this.props.updateSeletedDataSetId(item.id);
        };

        const onPickPeriod = (value) => {
            this.props.updateSelectedPeriodId(value);
        };

        return (
            <div>
                <Card>
                    <CardText>
                        <div className={styles.left}>
                            <OrgUnitTree
                                root={this.props.rootWithMembers}
                                selected={this.state.selected}
                                currentRoot={this.state.currentRoot}
                                initiallyExpanded={[`/${this.props.rootWithMembers.id}`]}
                                onSelectClick={this.handleOrgUnitClick}
                                onChangeCurrentRoot={changeRoot}
                            />
                        </div>
                        <div className={styles.right}>
                            <div>
                                {this.state.currentRoot ? (
                                    <div>{ t('For organisation units within') } <span className={styles.ouLabel}>{
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
                </Card>
                <div>
                    <SelectField
                        style={{ float: 'left', width: 360, marginRight: 20 }}
                        label={this.state.dataSet ? this.state.dataSet.name : t('Select dataset')}
                        items={dataSetItems}
                        onChange={dataSetChange}
                    />
                    {this.state.dataSet &&
                        <PeriodPicker
                            style={{ float: 'left' }}
                            className={styles.dropdown}
                            periodType={this.state.dataSet.periodType}
                            onPickPeriod={onPickPeriod}
                        />
                    }
                </div>
            </div>
        );
    }
}

export default AddLockExceptionForm;
