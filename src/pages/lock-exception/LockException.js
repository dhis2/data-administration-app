import React from 'react';
import PropTypes from 'prop-types';

/* Material UI */
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardText } from 'material-ui/Card';

import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import Pagination from 'd2-ui/lib/pagination/Pagination.component';

import 'd2-ui/lib/css/DataTable.css';
import 'd2-ui/lib/css/Pagination.css';

import Page from '../Page';
import AddLockExceptionForm from './AddLockExceptionForm';

import { LOADING, SUCCESS, ERROR, WARNING } from '../../components/feedback-snackbar/SnackbarTypes';

import { calculatePageValue } from '../../helpers/pagination';

import styles from './LockException.css';
import LockExceptionDetails from './LockExceptionDetails';

const STATE_PROPERTIES_WHITE_LIST = [
    'lockExceptions',
    'showDetailsDialogOpen',
    'showAddDialogOpen',
    'selectedLockException',
    'levels',
    'groups',
    'dataSets',
    'selectedOrgUnits',
    'selectedDataSetId',
    'selectedPeriodId',
    'pager',
];

class LockException extends Page {
    static propTypes = {
        pageInfo: PropTypes.object.isRequired,
    }

    static initialPager = {
        pageSize: 20,
        page: 1,
        total: 0,
        pageCount: 1,
    }

    constructor(props, context) {
        super(props, context);

        this.state = {
            lockExceptions: [],
            showDetailsDialogOpen: false,
            showAddDialogOpen: false,
            selectedLockException: null,
            levels: null,
            groups: null,
            dataSets: [],
            selectedOrgUnits: [],
            selectedDataSetId: null,
            selectedPeriodId: null,
            pager: LockException.initialPager,
        };

        this.updateSelectedOrgUnits = this.updateSelectedOrgUnits.bind(this);
        this.updateSeletedDataSetId = this.updateSeletedDataSetId.bind(this);
        this.updateSelectedPeriodId = this.updateSelectedPeriodId.bind(this);

        this.showLockExceptionDetails = this.showLockExceptionDetails.bind(this);
        this.closeLockExceptionDetailsDialog = this.closeLockExceptionDetailsDialog.bind(this);
        this.removeLockException = this.removeLockException.bind(this);

        this.showLockExceptionFormDialog = this.showLockExceptionFormDialog.bind(this);
        this.closeLockExceptionFormDialog = this.closeLockExceptionFormDialog.bind(this);

        this.addLockException = this.addLockException.bind(this);

        this.onNextPageClick = this.onNextPageClick.bind(this);
        this.onPreviousPageClick = this.onPreviousPageClick.bind(this);

        // FIXME Hack in some translations
        const t = context.t;
        const d2 = context.d2;
        Object.assign(d2.i18n.translations, {
            organisation_unit_group: t('Organisation Unit Group'),
            organisation_unit_level: t('Organisation Unit Level'),
            select: t('Select'),
            deselect: t('Deselect'),
            select_all: t('Select All Org Units'),
            deselect_all: t('Deselect All Org Units'),
            name: t('Name'),
            show: t('Show Details'),
            remove: t('Remove'),
            actions: t('Actions'),
            of_page: t('of'),
        });
    }

    areActionsDisabled() {
        return this.context.loading;
    }

    componentDidMount() {
        this.loadLockExceptionsForPager(this.state.pager);
    }

    componentWillReceiveProps(nextProps) {
        const nextState = {};

        Object.keys(nextProps).forEach((property) => {
            if (nextProps.hasOwnProperty(property) && STATE_PROPERTIES_WHITE_LIST.includes(property)) {
                nextState[property] = nextProps[property];
            }
        });

        if (nextState !== {}) {
            this.setState(nextState);
        }
    }

    loadLockExceptionsForPager(pager, userIteration) {
        const t = this.context.t;
        const api = this.context.d2.Api.getApi();
        const url = `lockExceptions?page=${pager.page}&pageSize=${pager.pageSize}` +
            '&fields=name,' +
            'period[id,displayName],' +
            'organisationUnit[id,displayName],' +
            'dataSet[id,displayName]';

        // request to GET lock exceptions
        if (userIteration || (!this.state.loading && !this.state.loaded)) {
            this.context.updateAppState({
                showSnackbar: true,
                loading: true,
                snackbarConf: {
                    type: LOADING,
                    message: t('Loading...'),
                },
                pageState: {
                    loaded: false,
                    lockExceptions: this.state.lockExceptions,
                    pager,
                },
            });

            api.get(url)
                .then((response) => {
                    if (this.isPageMounted()) {
                        this.context.updateAppState({
                            showSnackbar: !userIteration,    // do not show load end when user iteration: e.g. pagination
                            loading: false,
                            snackbarConf: {
                                type: SUCCESS,
                                message: t('Lock Exceptions Loaded'),
                            },
                            pageState: {
                                loaded: true,
                                lockExceptions: response.lockExceptions,
                                pager: response.pager,
                            },
                        });
                    }
                }).catch((error) => {
                    if (this.isPageMounted()) {
                        const messageError = error && error.message ?
                            error.message :
                            t('An unexpected error happened');

                        this.context.updateAppState({
                            showSnackbar: true,
                            loading: false,
                            snackbarConf: {
                                type: ERROR,
                                message: messageError,
                            },
                            pageState: {
                                loaded: true,
                                lockExceptions: [],
                                pager,
                            },
                        });
                    }
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

    onNextPageClick() {
        const pager = Object.assign({}, this.state.pager);
        pager.page += 1;
        this.loadLockExceptionsForPager(pager, true);
    }

    onPreviousPageClick() {
        const pager = Object.assign({}, this.state.pager);
        pager.page -= 1;
        this.loadLockExceptionsForPager(pager, true);
    }

    showLockExceptionDetails(le) {
        this.setState(
            {
                showDetailsDialogOpen: true,
                selectedLockException: le,
            },
        );
    }

    removeLockException(le) {
        const t = this.context.t;
        const api = this.context.d2.Api.getApi();
        const deleteUrl = `lockExceptions?ou=${le.organisationUnit.id}&pe=${le.period.id}&ds=${le.dataSet.id}`;
        this.context.updateAppState({
            showSnackbar: true,
            loading: true,
            snackbarConf: {
                type: LOADING,
                message: t('Removing Lock Exception'),
            },
            pageState: { ...this.state },
        });

        api.delete(deleteUrl).then(() => {
            if (this.isPageMounted()) {
                this.context.updateAppState({
                    showSnackbar: true,
                    loading: false,
                    snackbarConf: {
                        type: SUCCESS,
                        message: t('Lock Exception removed'),
                    },
                });
                this.loadLockExceptionsForPager(LockException.initialPager, true);
            }
        }).catch((error) => {
            if (this.isPageMounted()) {
                const messageError = error && error.message ?
                    error.message :
                    t('An unexpected error happend during maintenance');

                this.context.updateAppState({
                    showSnackbar: true,
                    loading: false,
                    snackbarConf: {
                        type: ERROR,
                        message: messageError,
                    },
                    pageState: { ...this.state },
                });
            }
        });
    }

    closeLockExceptionDetailsDialog() {
        this.setState({ showDetailsDialogOpen: false });
    }

    showLockExceptionFormDialog() {
        const t = this.context.t;
        const d2 = this.context.d2;
        if (this.state.levels &&
            this.state.groups &&
            this.state.dataSets.length > 0) {
            this.setState({ showAddDialogOpen: true });
        } else {
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
                d2.models.dataSet.list({
                    paging: false,
                    fields: 'id,displayName,periodType',
                }),
            ]).then(([levels, groups, dataSets]) => {
                if (this.isPageMounted()) {
                    this.setState({
                        showAddDialogOpen: true,
                        levels,
                        groups,
                        dataSets: dataSets.toArray(),
                    });
                }
            }).catch((error) => {
                if (this.isPageMounted()) {
                    const messageError = error && error.message ?
                        error.message :
                        t('An unexpected error happened while loading data');

                    this.context.updateAppState({
                        showSnackbar: true,
                        loading: false,
                        snackbarConf: {
                            type: ERROR,
                            message: messageError,
                        },
                        pageState: { ...this.state },
                    });
                }
            });
        }
    }

    closeLockExceptionFormDialog() {
        this.setState({
            showAddDialogOpen: false,
            selectedOrgUnits: [],
            selectedDataSetId: null,
            selectedPeriodId: null,
        });
    }

    addLockException() {
        const t = this.context.t;
        if (this.state.selectedOrgUnits.length > 0 && this.state.selectedDataSetId && this.state.selectedPeriodId) {
            const api = this.context.d2.Api.getApi();
            const orgUnitIds = this.state.selectedOrgUnits.map((orgUnitPath) => {
                const orgUnitPathSplitted = orgUnitPath.split('/');
                return orgUnitPathSplitted[orgUnitPathSplitted.length - 1];
            });

            const formData = new FormData();
            formData.append('ou', `[${orgUnitIds.join(',')}]`);
            formData.append('pe', this.state.selectedPeriodId);
            formData.append('ds', this.state.selectedDataSetId);

            api.post('lockExceptions', formData).then(() => {
                if (this.isPageMounted()) {
                    this.setState({
                        loaded: false,
                        showAddDialogOpen: false,
                        selectedOrgUnits: [],
                        selectedDataSetId: null,
                        selectedPeriodId: null,
                    });
                }
            }).catch((error) => {
                if (this.isPageMounted()) {
                    const messageError = error && error.message ?
                        error.message :
                        t('An unexpected error happend during maintenance');

                    this.context.updateAppState({
                        showSnackbar: true,
                        loading: false,
                        snackbarConf: {
                            type: ERROR,
                            message: messageError,
                        },
                        pageState: { ...this.state },
                    });
                }
            });
        } else {
            this.context.updateAppState({
                showSnackbar: true,
                loading: false,
                snackbarConf: {
                    type: WARNING,
                    message: t('Select Data set, Period and Organisation Unit'),
                },
                pageState: { ...this.state },
            });
        }
    }

    render() {
        const t = this.context.t;
        const currentlyShown = calculatePageValue(this.state.pager);
        const paginationProps = {
            hasNextPage: () => this.state.pager.page < this.state.pager.pageCount,
            hasPreviousPage: () => this.state.pager.page > 1,
            onNextPageClick: this.onNextPageClick,
            onPreviousPageClick: this.onPreviousPageClick,
            total: this.state.pager.total,
            currentlyShown,
        };

        const showDetailsDialogActions = [
            <FlatButton
                className={styles.actionButtons}
                label={t('CLOSE')}
                onClick={this.closeLockExceptionDetailsDialog}
            />,
        ];

        const addLockException = [
            <FlatButton
                className={styles.actionButtons}
                label={t('CANCEL')}
                onClick={this.closeLockExceptionFormDialog}
            />,
            <RaisedButton
                className={styles.actionButtons}
                primary={Boolean(true)}
                label={t('ADD')}
                onClick={this.addLockException}
            />,
        ];

        return (
            <div className={styles.lockExceptionsTable}>
                <h1>
                    <span>{this.context.t(this.props.pageInfo.label)}</span>
                    <RaisedButton
                        label={t('ADD')}
                        onClick={this.showLockExceptionFormDialog}
                        primary={Boolean(true)}
                        disabled={this.areActionsDisabled()}
                    />
                </h1>
                {this.state.lockExceptions && this.state.lockExceptions.length ? (
                    <div>
                        <DataTable
                            columns={['name']}
                            rows={this.state.lockExceptions}
                            contextMenuActions={{
                                show: this.showLockExceptionDetails,
                                remove: this.removeLockException,
                            }}
                            contextMenuIcons={{
                                show: 'info',
                                remove: 'delete',
                            }}
                        />
                        <div className={styles.pagination}>
                            <Pagination {...paginationProps} />
                        </div>
                    </div>) :
                    (
                        <Card>
                            <CardText>
                                { this.context.t(this.state.loading ? 'Loading...' : 'No data to show.') }
                            </CardText>
                        </Card>
                    )
                }
                {this.state.selectedLockException != null &&
                    <Dialog
                        className={styles.lockExceptionDialog}
                        title={this.state.selectedLockException.name}
                        actions={showDetailsDialogActions}
                        modal={false}
                        open={this.state.showDetailsDialogOpen}
                        onRequestClose={this.closeLockExceptionDetailsDialog}
                    >
                        <LockExceptionDetails
                            organisationUnitName={this.state.selectedLockException.organisationUnit.displayName}
                            dataSetName={this.state.selectedLockException.dataSet.displayName}
                            periodName={this.state.selectedLockException.period.displayName}
                        />
                    </Dialog>
                }
                {this.state.levels &&
                this.state.groups &&
                this.state.dataSets.length > 0 &&
                    <Dialog
                        title={t('Add new lock exception')}
                        actions={addLockException}
                        modal={false}
                        open={this.state.showAddDialogOpen}
                        contentStyle={{ maxWidth: '1100px' }}
                        onRequestClose={this.closeLockExceptionFormDialog}
                    >

                        <AddLockExceptionForm
                            levels={this.state.levels}
                            groups={this.state.groups}
                            dataSets={this.state.dataSets}
                            updateSelectedOrgUnits={this.updateSelectedOrgUnits}
                            updateSeletedDataSetId={this.updateSeletedDataSetId}
                            updateSelectedPeriodId={this.updateSelectedPeriodId}
                        />
                    </Dialog>
                }
            </div>
        );
    }
}

export default LockException;
