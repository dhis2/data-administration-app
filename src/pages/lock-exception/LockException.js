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

import { LOADING, SUCCESS, ERROR } from '../../components/feedback-snackbar/SnackbarTypes';

import styles from './LockException.css';

const calculatePageValue = (pager) => {
    const pageSize = pager.pageSize;
    const { total, pageCount, page } = pager;
    const pageCalculationValue = total - (total - ((pageCount - (pageCount - page)) * pageSize));
    const startItem = (pageCalculationValue - pageSize) + 1;
    const endItem = pageCalculationValue;

    return `${startItem} - ${endItem > total ? total : endItem}`;
};

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
        this.state.dataSets = [];

        this.state.selectedOrgUnits = [];
        this.state.selectedDataSetId = null;
        this.state.selectedPeriodId = null;

        this.state.pager = this.state.pager || {
            pageSize: 20,
            page: 1,
            total: 0,
            pageCount: 1,
        };

        this.updateSelectedOrgUnits = this.updateSelectedOrgUnits.bind(this);
        this.updateSeletedDataSetId = this.updateSeletedDataSetId.bind(this);
        this.updateSelectedPeriodId = this.updateSelectedPeriodId.bind(this);
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
        this.loadLockExceptions();
    }

    componentDidUpdate() {
        this.loadLockExceptions();
    }

    loadLockExceptions() {
        const t = this.context.t;
        const api = this.context.d2.Api.getApi();
        const url = `lockExceptions?page=${this.state.pager.page}&pageSize=${this.state.pager.pageSize}` +
            '&fields=name,' +
            'period[id,displayName],' +
            'organisationUnit[id,displayName],' +
            'dataSet[id,displayName]';

        // request to GET lock exceptions
        if (!this.state.loading && !this.state.loaded) {
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
                },
            });

            api.get(url)
                .then((response) => {
                    this.context.updateAppState({
                        showSnackbar: true,
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
                }).catch((error) => {
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

    onNextPageClick() {
        const pager = Object.assign({}, this.state.pager);
        pager.page += 1;

        this.setState({
            loaded: false,
            pager,
        });
    }

    onPreviousPageClick() {
        const pager = Object.assign({}, this.state.pager);
        pager.page -= 1;
        this.setState({
            loaded: false,
            pager,
        });
    }

    render() {
        const currentlyShown = calculatePageValue(this.state.pager);
        const paginationProps = {
            hasNextPage: () => this.state.pager.page < this.state.pager.pageCount,
            hasPreviousPage: () => this.state.pager.page > 1,
            onNextPageClick: this.onNextPageClick,
            onPreviousPageClick: this.onPreviousPageClick,
            total: this.state.pager.total,
            currentlyShown,
        };

        const t = this.context.t;
        const showDetailsHandler = (le) => {
            this.setState(
                {
                    showDetailsDialogOpen: true,
                    selectedLockException: le,
                },
            );
        };

        const removeHandler = (le) => {
            const api = this.context.d2.Api.getApi();
            const deleteUrl = `lockExceptions?ou=${le.organisationUnit.id}&pe=${le.period.id}&ds=${le.dataSet.id}`;
            this.context.updateAppState({
                showSnackbar: true,
                loading: true,
                snackbarConf: {
                    type: LOADING,
                    message: t('Removing Lock Exception'),
                },
                pageState: {
                    ...this.state,
                },
            });

            api.delete(deleteUrl).then(() => {
                const lockExceptions = this.state.lockExceptions
                    .filter(lockException => lockException.organisationUnit.id !== le.organisationUnit.id
                        && lockException.period.id !== le.period.id
                        && lockException.dataSet.id !== le.dataSet.id);
                const pager = this.state.pager;
                pager.total -= 1;
                this.context.updateAppState({
                    showSnackbar: true,
                    loading: false,
                    snackbarConf: {
                        type: SUCCESS,
                        message: t('Lock Exception removed'),
                    },
                    pageState: {
                        lockExceptions,
                        loaded: true,
                        pager,
                    },
                });
            }).catch((error) => {
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
                    pageState: {
                        ...this.state,
                    },
                });
            });
        };

        const closeShowDetailsDialogHandler = () => {
            this.setState({ showDetailsDialogOpen: false });
        };

        const showDetailsDialogActions = [
            <FlatButton
                className={styles.actionButtons}
                label={t('CLOSE')}
                onClick={closeShowDetailsDialogHandler}
                disabled={this.areActionsDisabled()}
            />,
        ];

        const showAddDialogHandler = () => {
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
                    this.setState({
                        showAddDialogOpen: true,
                        levels,
                        groups,
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
                className={styles.actionButtons}
                label={t('CANCEL')}
                onClick={closeAddDialogHandler}
            />,
            <RaisedButton
                className={styles.actionButtons}
                primary={Boolean(true)}
                label={t('ADD')}
                onClick={addLockExceptionHandler}
            />,
        ];

        return (
            <div className={styles.lockExceptionsTable}>
                <h1>
                    <span style={{ display: 'inline-block' }}>{this.context.t(this.props.pageInfo.label)}</span>
                    <RaisedButton
                        className={styles.actionButtons}
                        style={{ display: 'inline-block', float: 'right' }}
                        label={t('ADD')}
                        onClick={showAddDialogHandler}
                        primary={Boolean(true)}
                        disabled={this.areActionsDisabled()}
                    />
                </h1>
                {this.state.lockExceptions && this.state.lockExceptions.length ? (
                    <div>
                        <div className={styles.listDetailsWrap}>
                            <div className={styles.dataTableWrap}>
                                <DataTable
                                    columns={['name']}
                                    rows={this.state.lockExceptions}
                                    contextMenuActions={{
                                        show: showDetailsHandler,
                                        remove: removeHandler,
                                    }}
                                    contextMenuIcons={{
                                        show: 'info',
                                        remove: 'delete',
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: '-2rem', paddingBottom: '0.5rem' }}>
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
                        open={this.state && this.state.showDetailsDialogOpen}
                        onRequestClose={closeShowDetailsDialogHandler}
                    >
                        <h3>{t('Organisation Unit')}</h3>
                        <span>{this.state.selectedLockException.organisationUnit.displayName}</span>
                        <h3>{t('Data Set')}</h3>
                        <span>{this.state.selectedLockException.dataSet.displayName}</span>
                        <h3>{t('Period')}</h3>
                        <span>{this.state.selectedLockException.period.displayName}</span>
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
                     this.state.dataSets.length > 0 &&
                     <AddLockExceptionForm
                         levels={this.state.levels}
                         groups={this.state.groups}
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
