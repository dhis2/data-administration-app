import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Delete from 'material-ui/svg-icons/action/delete';
import Info from 'material-ui/svg-icons/action/info';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import Page from '../Page';
import AddLockExceptionForm from './AddLockExceptionForm';

import styles from './LockException.css';

class LockException extends Page {
    static propTypes = {
        pageInfo: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);

        this.state.lockExceptions = this.state.lockExceptions || [];
        this.state.showDetailsDialogOpen = false;
        this.state.showAddDialogOpen = false;
        this.state.selectedLockException = null;
        this.state.levels = null;
        this.state.groups = null;
        this.state.rootWithMembers = null;
        this.state.dataSets = [];

        this.state.selectedOrgUnits = [];
        this.state.selectedDataSetId = null;
        this.state.selectedPeriodId = null;

        this.updateSelectedOrgUnits = this.updateSelectedOrgUnits.bind(this);
        this.updateSeletedDataSetId = this.updateSeletedDataSetId.bind(this);
        this.updateSelectedPeriodId = this.updateSelectedPeriodId.bind(this);
    }

    componentDidMount() {
        this.loadLockExceptions();
    }

    componentDidUpdate() {
        this.loadLockExceptions();
    }

    loadLockExceptions() {
        const api = this.context.d2.Api.getApi();

        // request to GET statistics
        if (!this.context.loading && !this.state.loaded) {
            this.context.updateAppState({
                loading: true,
                currentSection: this.props.sectionKey,
                pageState: {
                    loaded: false,
                    lockExceptions: this.state.lockExceptions,
                },
            });

            api.get('lockExceptions?fields=name,period[id,name],organisationUnit[id,name],dataSet[id,name]')
                .then((response) => {
                    this.context.updateAppState({
                        loading: false,
                        pageState: {
                            loaded: true,
                            lockExceptions: response.lockExceptions,
                        },
                    });
                }).catch(() => {
                // TODO show error
                    this.context.updateAppState({
                        loading: false,
                        pageState: {
                            loaded: true,
                            lockExceptions: [],
                        },
                    });
                });
        }
    }

    updateSelectedOrgUnits(selectedOrgUnits) {
        this.setState({ selectedOrgUnits });
    }

    updateSeletedDataSetId(selectedDataSetId) {
        this.setState({ selectedDataSetId });
    }

    updateSelectedPeriodId(selectedPeriodId) {
        this.setState({ selectedPeriodId });
    }

    render() {
        const t = this.context.t;
        const rows = this.state.lockExceptions.map((le) => {
            const lockExceptionKey
                = `${le.organisationUnit.id}-${le.dataSet.id}-${le.period.id}`;
            const showDetailsHandler = () => {
                this.setState(
                    {
                        showDetailsDialogOpen: true,
                        selectedLockException: le,
                    },
                );
            };

            const removeHandler = () => {
                const api = this.context.d2.Api.getApi();
                const deleteUrl = `lockExceptions?ou=${le.organisationUnit.id}&pe=${le.period.id}&ds=${le.dataSet.id}`;
                this.context.updateAppState({
                    loading: true,
                });

                api.delete(deleteUrl).then(() => {
                    const lockExceptions = this.state.lockExceptions
                        .filter(lockException => lockException.organisationUnit.id !== le.organisationUnit.id
                            && lockException.period.id !== le.period.id
                            && lockException.dataSet.id !== le.dataSet.id);
                    this.context.updateAppState({
                        loading: false,
                        pageState: {
                            lockExceptions,
                        },
                    });
                }).catch(() => {
                    // TODO show error
                    this.context.updateAppState({
                        loading: false,
                    });
                });
            };
            return (
                <TableRow key={lockExceptionKey}>
                    <TableRowColumn>{le.name}</TableRowColumn>
                    <TableRowColumn>
                        <IconMenu
                            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                        >
                            <MenuItem
                                primaryText={t('Remove')}
                                leftIcon={<Delete />}
                                onClick={removeHandler}
                            />
                            <MenuItem
                                primaryText={t('Show Details')}
                                leftIcon={<Info />}
                                onClick={showDetailsHandler}
                            />
                        </IconMenu>
                    </TableRowColumn>
                </TableRow>
            );
        });

        const closeShowDetailsDialogHandler = () => {
            this.setState({ showDetailsDialogOpen: false });
        };

        const showDetailsDialogActions = [
            <FlatButton
                label={t('CLOSE')}
                onClick={closeShowDetailsDialogHandler}
            />,
        ];

        const showAddDialogHandler = () => {
            const d2 = this.context.d2;
            if (this.state.levels &&
                this.state.groups &&
                this.state.rootWithMembers &&
                this.state.dataSets.length > 0) {
                this.setState({ showAddDialogOpen: true });
            } else {
                // FIXME Hack in some translations
                Object.assign(d2.i18n.translations, {
                    organisation_unit_group: t('Organisation Unit Group'),
                    organisation_unit_level: t('Organisation Unit Level'),
                    select: t('Select'),
                    deselect: t('Deselect'),
                    select_all: t('Select All Org Units'),
                    deselect_all: t('Deselect All Org Units'),
                });

                Promise.all([
                    d2.models.organisationUnitLevel.list({
                        paging: false,
                        fields: 'id,level,displayName',
                        order: 'level:asc',
                    }),
                    d2.models.organisationUnitGroup.list({
                        paging: false,
                        fields: 'id,displayName',
                    }),
                    d2.models.organisationUnit.list({
                        paging: false,
                        level: 1,
                        fields: 'id,displayName,path,children::isNotEmpty,memberCount',
                    }),
                    d2.models.dataSet.list({
                        paging: false,
                        fields: 'id,displayName,periodType',
                    }),
                ]).then(([levels, groups, roots, dataSets]) => {
                    const rootWithMembers = roots.toArray()[0];
                    this.setState({
                        showAddDialogOpen: true,
                        levels,
                        groups,
                        rootWithMembers,
                        dataSets: dataSets.toArray(),
                    });
                });
            }
        };

        const closeAddDialogHandler = () => {
            this.setState({
                showAddDialogOpen: false,
                selectedOrgUnits: [],
                selectedDataSetId: null,
                selectedPeriodId: null,
            });
        };

        const addLockExceptionHandler = () => {
            if (this.state.selectedOrgUnits.length > 0 && this.state.selectedDataSetId && this.state.selectedPeriodId) {
                const orgUnitIds = this.state.selectedOrgUnits.map((orgUnitPath) => {
                    const orgUnitPathSplitted = orgUnitPath.split('/');
                    return orgUnitPathSplitted[orgUnitPathSplitted.length - 1];
                });
                const api = this.context.d2.Api.getApi();
                const apiRequests = orgUnitIds.map((ou) => {
                    const pe = this.state.selectedPeriodId;
                    const ds = this.state.selectedDataSetId;
                    const postUrl = `lockExceptions?ou=${ou}&pe=${pe}&ds=${ds}`;
                    return api.post(postUrl);
                });

                Promise.all(apiRequests).then(() => {
                    this.setState({
                        loaded: false,
                        showAddDialogOpen: false,
                        selectedOrgUnits: [],
                        selectedDataSetId: null,
                        selectedPeriodId: null,
                    });
                }).catch(() => {

                });
            } else {
                // TODO error
            }
        };

        const addDialogActions = [
            <FlatButton
                label={t('CANCEL')}
                onClick={closeAddDialogHandler}
            />,
            <FlatButton
                label={t('ADD')}
                onClick={addLockExceptionHandler}
            />,
        ];

        return (
            <div className={styles.lockExceptionsTable}>
                <h1>{this.context.t(this.props.pageInfo.label)}</h1>
                <Table selectable={false}>
                    <TableHeader
                        className={styles.lockExceptionsTableHeader}
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                    >
                        <TableRow>
                            <TableHeaderColumn>{t('Name')}</TableHeaderColumn>
                            <TableHeaderColumn>
                                <FlatButton
                                    label={t('ADD')}
                                    onClick={showAddDialogHandler}
                                />
                            </TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={false}
                        stripedRows={false}
                    >
                        {rows}
                    </TableBody>
                </Table>
                {this.state.selectedLockException != null &&
                    <Dialog
                        className={styles.lockExceptionDialog}
                        title={this.state.selectedLockException.name}
                        actions={showDetailsDialogActions}
                        modal={false}
                        open={this.state && this.state.showDetailsDialogOpen}
                        onRequestClose={closeShowDetailsDialogHandler}
                    >
                        <h3>{t('Organisation Unit')}</h3>
                        <span>{this.state.selectedLockException.organisationUnit.name}</span>
                        <h3>{t('Data Set')}</h3>
                        <span>{this.state.selectedLockException.dataSet.name}</span>
                        <h3>{t('Period')}</h3>
                        <span>{this.state.selectedLockException.period.name}</span>
                    </Dialog>
                }
                <Dialog
                    title={t('Add new lock exception')}
                    actions={addDialogActions}
                    modal={false}
                    open={this.state && this.state.showAddDialogOpen}
                    contentStyle={{ maxWidth: '1100px', overflowY: 'auto' }}
                    onRequestClose={closeAddDialogHandler}
                >
                    {this.state.levels &&
                     this.state.groups &&
                     this.state.rootWithMembers &&
                     this.state.dataSets.length > 0 &&
                     <AddLockExceptionForm
                         levels={this.state.levels}
                         groups={this.state.groups}
                         rootWithMembers={this.state.rootWithMembers}
                         dataSets={this.state.dataSets}
                         updateSelectedOrgUnits={this.updateSelectedOrgUnits}
                         updateSeletedDataSetId={this.updateSeletedDataSetId}
                         updateSelectedPeriodId={this.updateSelectedPeriodId}
                     />
                    }
                </Dialog>
            </div>
        );
    }
}

export default LockException;
