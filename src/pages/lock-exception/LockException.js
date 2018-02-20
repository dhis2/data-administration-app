import React from 'react';

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
import { PAGE_SUMMARY, PAGE_TITLE } from './lock.exception.conf';
import PageHelper from '../../components/page-helper/PageHelper';

const jsStyles = {
    dialog: {
        maxWidth: '80%',
    },
};

class LockException extends Page {
    static STATE_PROPERTIES = [
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
        'loading',
        'atBatchDeletionPage',
    ]

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
            loading: false,
            atBatchDeletionPage: false,
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

        this.backToLockExceptions = this.backToLockExceptions.bind(this);
        this.goToBatchDeletionPage = this.goToBatchDeletionPage.bind(this);

        this.onNextPageClick = this.onNextPageClick.bind(this);
        this.onPreviousPageClick = this.onPreviousPageClick.bind(this);

        // FIXME Hack in some translations
        const translator = context.translator;
        const d2 = context.d2;
        Object.assign(d2.i18n.translations, {
            organisation_unit_group: translator('Organisation Unit Group'),
            organisation_unit_level: translator('Organisation Unit Level'),
            select: translator('Select'),
            deselect: translator('Deselect'),
            select_all: translator('Select All Org Units'),
            deselect_all: translator('Deselect All Org Units'),
            name: translator('Name'),
            show: translator('Show Details'),
            remove: translator('Remove'),
            actions: translator('Actions'),
            of_page: translator('of'),
            week: translator('week'),
            month: translator('month'),
            year: translator('year'),
            biMonth: translator('biMonth'),
            day: translator('day'),
            jan: translator('jan'),
            feb: translator('feb'),
            mar: translator('mar'),
            apr: translator('apr'),
            may: translator('may'),
            jun: translator('jun'),
            jul: translator('jul'),
            aug: translator('aug'),
            sep: translator('sep'),
            oct: translator('oct'),
            nov: translator('nov'),
            dec: translator('dec'),
            'jan-feb': translator('jan-feb'),
            'mar-apr': translator('mar-apr'),
            'may-jun': translator('jan-feb'),
            'jul-aug': translator('jan-feb'),
            'sep-oct': translator('jan-feb'),
            'nov-dec': translator('jan-feb'),
            quarter: translator('quarter'),
            Q1: translator('Q1'),
            Q2: translator('Q2'),
            Q3: translator('Q3'),
            Q4: translator('Q4'),
            sixMonth: translator('sixMonth'),
            'jan-jun': translator('jan-jun'),
            'jul-dec': translator('jul-dec'),
            'apr-sep': translator('apr-sep'),
            'oct-mar': translator('oct-mar'),
        });
    }

    areActionsDisabled() {
        return this.state.loading;
    }

    componentDidMount() {
        this.loadLockExceptionsForPager(this.state.pager);
    }

    componentWillReceiveProps(nextProps) {
        const nextState = {};

        Object.keys(nextProps).forEach((property) => {
            if (nextProps.hasOwnProperty(property) && LockException.STATE_PROPERTIES.includes(property)) {
                nextState[property] = nextProps[property];
            }
        });

        if (nextState !== {}) {
            this.setState(nextState);
        }
    }

    contextMenuActions() {
        const contextMenuActions = {};

        if (!this.state.atBatchDeletionPage) {
            contextMenuActions.show = this.showLockExceptionDetails;
        }

        contextMenuActions.remove = this.removeLockException;

        return contextMenuActions;
    }

    loadLockExceptionsForPager(pager, userIteration) {
        const translator = this.context.translator;
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
                snackbarConf: {
                    type: LOADING,
                    message: translator('Loading...'),
                },
                pageState: {
                    atBatchDeletionPage: false,
                    loaded: false,
                    lockExceptions: this.state.lockExceptions,
                    pager,
                    loading: true,
                },
            });

            api.get(url)
                .then((response) => {
                    if (this.isPageMounted()) {
                        this.context.updateAppState({
                            showSnackbar: false,
                            pageState: {
                                loaded: true,
                                lockExceptions: response.lockExceptions,
                                pager: response.pager,
                                loading: false,
                            },
                        });
                    }
                }).catch((error) => {
                    if (this.isPageMounted()) {
                        const messageError = error && error.message ?
                            error.message :
                            translator('An unexpected error happened');

                        this.context.updateAppState({
                            showSnackbar: true,
                            snackbarConf: {
                                type: ERROR,
                                message: messageError,
                            },
                            pageState: {
                                loaded: true,
                                lockExceptions: [],
                                pager,
                                loading: false,
                            },
                        });
                    }
                });
        }
    }

    loadLockExceptionCombinations() {
        const translator = this.context.translator;
        const api = this.context.d2.Api.getApi();
        const url = 'lockExceptions/combinations';

        // request to GET lock exception combinations
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: translator('Loading...'),
            },
            pageState: {
                atBatchDeletionPage: true,
                loaded: false,
                loading: true,
            },
        });

        api.get(url)
            .then((response) => {
                if (this.isPageMounted()) {
                    this.context.updateAppState({
                        showSnackbar: false,
                        pageState: {
                            loaded: true,
                            lockExceptions: response.lockExceptions,
                            loading: false,
                        },
                    });
                }
            }).catch((error) => {
                if (this.isPageMounted()) {
                    const messageError = error && error.message ?
                        error.message :
                        translator('An unexpected error happened');

                    this.context.updateAppState({
                        showSnackbar: true,
                        snackbarConf: {
                            type: ERROR,
                            message: messageError,
                        },
                        pageState: {
                            loaded: true,
                            lockExceptions: [],
                            loading: false,
                        },
                    });
                }
            });
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

    backToLockExceptions() {
        this.loadLockExceptionsForPager(this.state.pager, true);
    }

    goToBatchDeletionPage() {
        this.loadLockExceptionCombinations();
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
        const translator = this.context.translator;
        const api = this.context.d2.Api.getApi();
        let deleteUrl = `lockExceptions?pe=${le.period.id}&ds=${le.dataSet.id}`;

        if (le.organisationUnit) {
            deleteUrl += `&ou=${le.organisationUnit.id}`;
        }

        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: translator('Removing Lock Exception'),
            },
            pageState: {
                ...this.state,
                loading: true,
            },
        });

        api.delete(deleteUrl).then(() => {
            if (this.isPageMounted()) {
                const newPageState = {
                    ...this.state,
                    loading: false,
                };

                if (this.state.atBatchDeletionPage) {
                    newPageState.lockExceptions = this.state.lockExceptions.filter(
                        existingLockException => existingLockException.period.id !== le.period.id
                                                   && existingLockException.dataSet.id !== le.dataSet.id);
                }

                this.context.updateAppState({
                    showSnackbar: true,
                    snackbarConf: {
                        type: SUCCESS,
                        message: translator('Lock Exception removed'),
                    },
                    pageState: newPageState,
                });

                if (!this.state.atBatchDeletionPage) {
                    this.loadLockExceptionsForPager(LockException.initialPager, false);
                }
            }
        }).catch((error) => {
            if (this.isPageMounted()) {
                const messageError = error && error.message ?
                    error.message :
                    translator('An unexpected error happend during maintenance');

                this.context.updateAppState({
                    showSnackbar: true,
                    snackbarConf: {
                        type: ERROR,
                        message: messageError,
                    },
                    pageState: {
                        ...this.state,
                        loading: false,
                    },
                });
            }
        });
    }

    closeLockExceptionDetailsDialog() {
        this.setState({ showDetailsDialogOpen: false });
    }

    showLockExceptionFormDialog() {
        const translator = this.context.translator;
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
                        translator('An unexpected error happened while loading data');

                    this.context.updateAppState({
                        showSnackbar: true,
                        snackbarConf: {
                            type: ERROR,
                            message: messageError,
                        },
                        pageState: {
                            ...this.state,
                            loading: false,
                        },
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
        const translator = this.context.translator;
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

            this.context.updateAppState({
                showSnackbar: true,
                snackbarConf: {
                    type: LOADING,
                    message: translator('Adding Lock Exception'),
                },
                pageState: {
                    showAddDialogOpen: false,
                    selectedOrgUnits: [],
                    selectedDataSetId: null,
                    selectedPeriodId: null,
                    loading: true,
                },
            });

            api.post('lockExceptions', formData).then(() => {
                if (this.isPageMounted()) {
                    this.context.updateAppState({
                        showSnackbar: true,
                        snackbarConf: {
                            type: SUCCESS,
                            message: translator('Lock Exception Added'),
                        },
                        pageState: {
                            loaded: false,
                            loading: false,
                        },
                    });
                    this.loadLockExceptionsForPager(LockException.initialPager, false);
                }
            }).catch((error) => {
                if (this.isPageMounted()) {
                    const messageError = error && error.message ?
                        error.message :
                        translator('An unexpected error happened during operation');

                    this.context.updateAppState({
                        showSnackbar: true,
                        snackbarConf: {
                            type: ERROR,
                            message: messageError,
                        },
                        pageState: {
                            ...this.state,
                            loading: false,
                        },
                    });
                }
            });
        } else {
            this.context.updateAppState({
                showSnackbar: true,
                snackbarConf: {
                    type: WARNING,
                    message: translator('Select Data set, Period and Organisation Unit'),
                },
                pageState: {
                    ...this.state,
                    loading: false,
                },
            });
        }
    }

    render() {
        const translator = this.context.translator;
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
                label={translator('CLOSE')}
                onClick={this.closeLockExceptionDetailsDialog}
            />,
        ];

        const addLockException = [
            <FlatButton
                className={styles.actionButton}
                label={translator('CANCEL')}
                onClick={this.closeLockExceptionFormDialog}
            />,
            <RaisedButton
                className={styles.actionButton}
                primary={Boolean(true)}
                label={translator('ADD')}
                onClick={this.addLockException}
            />,
        ];

        return (
            <div className={styles.lockExceptionsTable}>
                <div className={styles.headerContainer}>
                    <h1 className={styles.header}>
                        {translator(PAGE_TITLE)}
                        <PageHelper pageTitle={PAGE_TITLE} pageSummary={PAGE_SUMMARY} />
                    </h1>
                    <div>
                        {!this.state.atBatchDeletionPage &&
                            <RaisedButton
                                className={styles.actionButton}
                                label={translator('BATCH DELETION')}
                                onClick={this.goToBatchDeletionPage}
                                primary={Boolean(true)}
                                disabled={this.areActionsDisabled()}
                            />
                        }
                        {!this.state.atBatchDeletionPage &&
                            <RaisedButton
                                className={styles.actionButton}
                                label={translator('ADD')}
                                onClick={this.showLockExceptionFormDialog}
                                primary={Boolean(true)}
                                disabled={this.areActionsDisabled()}
                            />
                        }
                        {this.state.atBatchDeletionPage &&
                            <RaisedButton
                                className={styles.actionButton}
                                label={translator('BACK')}
                                onClick={this.backToLockExceptions}
                                primary={Boolean(true)}
                                disabled={this.areActionsDisabled()}
                            />
                        }
                    </div>
                </div>
                {this.state.lockExceptions && this.state.lockExceptions.length ? (
                    <div>
                        <DataTable
                            columns={['name']}
                            rows={this.state.lockExceptions}
                            contextMenuActions={this.contextMenuActions()}
                            contextMenuIcons={{
                                show: 'info',
                                remove: 'delete',
                            }}
                            primaryAction={this.showLockExceptionDetails}
                        />
                        {!this.areActionsDisabled() && !this.state.atBatchDeletionPage &&
                            <div className={styles.pagination}>
                                <Pagination {...paginationProps} />
                            </div>
                        }
                    </div>) :
                    (
                        <Card>
                            <CardText>
                                { translator(this.state.loading ? 'Loading...' : 'No data to show.') }
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
                    title={translator('Add new lock exception')}
                    actions={addLockException}
                    modal={false}
                    open={this.state.showAddDialogOpen}
                    contentStyle={jsStyles.dialog}
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
