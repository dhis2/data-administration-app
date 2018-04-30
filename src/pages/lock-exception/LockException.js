import React from 'react';

/* Material UI */
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { Card, CardText } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import Pagination from 'd2-ui/lib/pagination/Pagination.component';

import 'd2-ui/lib/css/DataTable.css';
import 'd2-ui/lib/css/Pagination.css';
import { LOADING, SUCCESS, ERROR, ACTION_MESSAGE } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes';

import classNames from 'classnames';

import Page from '../Page';
import AddLockExceptionForm from './AddLockExceptionForm';

import { calculatePageValue } from '../../helpers/pagination';

import { getDocsKeyForSection } from '../sections.conf';
import PageHelper from '../../components/page-helper/PageHelper';

// i18n
import { i18nKeys } from '../../i18n';

import styles from './LockException.css';
import '../../custom-css/D2UIDataTableOverrides.css';

const jsStyles = {
    dialog: {
        maxWidth: '80%',
    },
    addButton: {
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
    },
};

class LockException extends Page {
    static STATE_PROPERTIES = [
        'lockExceptions',
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
    ];

    static initialPager = {
        pageSize: 20,
        page: 1,
        total: 0,
        pageCount: 1,
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            lockExceptions: [],
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
            loaded: false,
            atBatchDeletionPage: false,
        };

        this.updateSelectedOrgUnits = this.updateSelectedOrgUnits.bind(this);
        this.updateSeletedDataSetId = this.updateSeletedDataSetId.bind(this);
        this.updateSelectedPeriodId = this.updateSelectedPeriodId.bind(this);

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
            period: translator(i18nKeys.lockException.period),
            dataSet: translator(i18nKeys.lockException.dataSet),
            organisationUnit: translator(i18nKeys.lockException.organisationUnit),
            organisation_unit_group: translator(i18nKeys.lockException.organisationUnitGroup),
            organisation_unit_level: translator(i18nKeys.lockException.organisationUnitLevel),
            select: translator(i18nKeys.lockException.select),
            deselect: translator(i18nKeys.lockException.deselect),
            select_all: translator(i18nKeys.lockException.selectAll),
            deselect_all: translator(i18nKeys.lockException.deselectAll),
            name: translator(i18nKeys.lockException.name),
            show: translator(i18nKeys.lockException.show),
            remove: translator(i18nKeys.lockException.remove),
            actions: translator(i18nKeys.lockException.actions),
            of_page: translator(i18nKeys.lockException.ofPage),
            week: translator(i18nKeys.lockException.week),
            month: translator(i18nKeys.lockException.month),
            year: translator(i18nKeys.lockException.year),
            biMonth: translator(i18nKeys.lockException.biMonth),
            day: translator(i18nKeys.lockException.day),
            jan: translator(i18nKeys.lockException.jan),
            feb: translator(i18nKeys.lockException.feb),
            mar: translator(i18nKeys.lockException.mar),
            apr: translator(i18nKeys.lockException.apr),
            may: translator(i18nKeys.lockException.may),
            jun: translator(i18nKeys.lockException.jun),
            jul: translator(i18nKeys.lockException.jul),
            aug: translator(i18nKeys.lockException.aug),
            sep: translator(i18nKeys.lockException.sep),
            oct: translator(i18nKeys.lockException.oct),
            nov: translator(i18nKeys.lockException.nov),
            dec: translator(i18nKeys.lockException.dec),
            'jan-feb': translator(i18nKeys.lockException.janFeb),
            'mar-apr': translator(i18nKeys.lockException.marApr),
            'may-jun': translator(i18nKeys.lockException.mayJun),
            'jul-aug': translator(i18nKeys.lockException.julAug),
            'sep-oct': translator(i18nKeys.lockException.sepOct),
            'nov-dec': translator(i18nKeys.lockException.novDec),
            quarter: translator(i18nKeys.lockException.quarter),
            Q1: translator(i18nKeys.lockException.Q1),
            Q2: translator(i18nKeys.lockException.Q2),
            Q3: translator(i18nKeys.lockException.Q3),
            Q4: translator(i18nKeys.lockException.Q4),
            sixMonth: translator(i18nKeys.lockException.sixMonth),
            'jan-jun': translator(i18nKeys.lockException.janJun),
            'jul-dec': translator(i18nKeys.lockException.julDec),
            'apr-sep': translator(i18nKeys.lockException.aprSep),
            'oct-mar': translator(i18nKeys.lockException.octMar),
        });
    }

    prepareLockExceptionsResponseToDataTable(lockExceptionResponse) {
        return lockExceptionResponse.map((le) => {
            const row = {};
            if (!this.state.atBatchDeletionPage) {
                row.organisationUnit = le.organisationUnit.displayName;
                row.organisationUnitId = le.organisationUnit.id;
            }
            row.period = le.period.displayName;
            row.periodId = le.period.id;
            row.dataSet = le.dataSet.displayName;
            row.dataSetId = le.dataSet.id;
            return row;
        });
    }

    dataTableColumns() {
        if (this.state.atBatchDeletionPage) {
            return ['dataSet', 'period'];
        }
        return ['organisationUnit', 'dataSet', 'period'];
    }

    header() {
        const translator = this.context.translator;
        if (this.state.atBatchDeletionPage) {
            return (
                <div className={styles.headerContainer}>
                    <h1 className={styles.header}>
                        <IconButton onClick={this.backToLockExceptions}>
                            <FontIcon
                                className={classNames('material-icons', styles.backArrowIcon)}
                            >
                                arrow_back
                            </FontIcon>
                        </IconButton>
                        <span>{translator(i18nKeys.lockException.batchDeletionHeader)}</span>
                        <span className={styles.headerDivider}> | </span>
                        <span
                            className={styles.subHeader}
                        >
                            {translator(i18nKeys.lockException.batchDeletionSubHeader)}
                        </span>
                    </h1>
                </div>
            );
        }

        return (
            <div className={styles.headerContainer}>
                <h1 className={styles.header}>
                    {translator(i18nKeys.lockException.title)}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
                    />
                </h1>
                <div>
                    <RaisedButton
                        className={styles.actionButton}
                        label={translator(i18nKeys.lockException.actionButton)}
                        onClick={this.goToBatchDeletionPage}
                        primary
                        disabled={this.areActionsDisabled()}
                    />
                </div>
            </div>
        );
    }

    areActionsDisabled() {
        return this.state.loading;
    }

    addLockExceptionEnabled() {
        return this.state.selectedOrgUnits.length > 0 && this.state.selectedDataSetId && this.state.selectedPeriodId;
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

    loadLockExceptionsForPager(pager, userAction) {
        const translator = this.context.translator;
        const api = this.context.d2.Api.getApi();
        const url = `lockExceptions?page=${pager.page}&pageSize=${pager.pageSize}` +
            '&fields=name,' +
            'period[id,displayName],' +
            'organisationUnit[id,displayName],' +
            'dataSet[id,displayName]' +
            '&order=name:asc';

        // request to GET lock exceptions
        if (userAction || (!this.state.loading && !this.state.loaded)) {
            // Keep the previous message visible (p.e. deleting lock exception || add lock exception)
            this.context.updateAppState((this.state.deleteInProgress || this.state.addInProgress) ? {
                atBatchDeletionPage: false,
                loaded: false,
                loading: true,
            } : {
                showSnackbar: true,
                snackbarConf: {
                    type: LOADING,
                    message: translator(i18nKeys.lockException.loading),
                },
                pageState: {
                    atBatchDeletionPage: false,
                    loaded: false,
                    loading: true,
                },
            });

            api.get(url)
                .then((response) => {
                    if (this.isPageMounted()) {
                        let loadedState;

                        // If deleting a lock exception, show a success message instead of hiding the loading
                        if (this.state.deleteInProgress) {
                            loadedState = {
                                showSnackbar: true,
                                snackbarConf: {
                                    type: SUCCESS,
                                    message: translator(i18nKeys.lockException.removedMessage),
                                },
                            };
                            this.state.deleteInProgress = false;
                        // If adding a lock exception, show a success message instead of hiding the loading
                        } else if (this.state.addInProgress) {
                            loadedState = {
                                showSnackbar: true,
                                snackbarConf: {
                                    type: SUCCESS,
                                    message: translator(i18nKeys.lockException.addedMessage),
                                },
                            };
                            this.state.addInProgress = false;
                        } else {
                            loadedState = {
                                showSnackbar: false,
                            };
                        }

                        this.context.updateAppState({
                            ...loadedState,
                            pageState: {
                                loaded: true,
                                lockExceptions: this.prepareLockExceptionsResponseToDataTable(
                                    response.lockExceptions,
                                ),
                                pager: response.pager,
                                loading: false,
                            },
                        });
                    }
                }).catch((error) => {
                    if (this.isPageMounted()) {
                        const messageError = error && error.message ?
                            error.message :
                            translator(i18nKeys.messages.unexpectedError);

                        this.context.updateAppState({
                            showSnackbar: true,
                            snackbarConf: {
                                type: ERROR,
                                message: messageError,
                            },
                            pageState: {
                                loaded: true,
                                loading: false,
                            },
                        });
                    }
                });
        }
    }

    // Get information for Batch Deletion Page
    loadLockExceptionCombinations() {
        const translator = this.context.translator;
        const api = this.context.d2.Api.getApi();
        const url = 'lockExceptions/combinations?fields=name, period[id,displayName], dataSet[id,displayName]';

        // request to GET lock exception combinations
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: translator(i18nKeys.lockException.loadingMessage),
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
                            lockExceptions: this.prepareLockExceptionsResponseToDataTable(
                                response.lockExceptions,
                            ),
                            loading: false,
                        },
                    });
                }
            }).catch((error) => {
                if (this.isPageMounted()) {
                    const messageError = error && error.message ?
                        error.message :
                        translator(i18nKeys.messages.unexpectedError);

                    this.context.updateAppState({
                        showSnackbar: true,
                        snackbarConf: {
                            type: ERROR,
                            message: messageError,
                        },
                        pageState: {
                            loaded: true,
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

    removeLockException(le) {
        const translator = this.context.translator;
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: ACTION_MESSAGE,
                message: translator(i18nKeys.lockException.confirmDeleteMessage),
                action: translator(i18nKeys.lockException.confirmButton),
                onActionClick: () => {
                    const api = this.context.d2.Api.getApi();
                    let deleteUrl = `lockExceptions?pe=${le.periodId}&ds=${le.dataSetId}`;

                    if (le.organisationUnitId) {
                        deleteUrl += `&ou=${le.organisationUnitId}`;
                    }

                    this.context.updateAppState({
                        showSnackbar: true,
                        snackbarConf: {
                            type: LOADING,
                            message: translator(i18nKeys.lockException.loadingMessage),
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
                                    existingLockException => existingLockException.periodId !== le.periodId
                                        || existingLockException.dataSetId !== le.dataSetId);

                                this.context.updateAppState({
                                    showSnackbar: true,
                                    snackbarConf: {
                                        type: SUCCESS,
                                        message: translator(i18nKeys.lockException.removedMessage),
                                    },
                                    pageState: newPageState,
                                });
                            } else {
                                this.state.deleteInProgress = true;
                                this.context.updateAppState({
                                    pageState: newPageState,
                                });
                                this.loadLockExceptionsForPager(LockException.initialPager, false);
                            }
                        }
                    }).catch((error) => {
                        if (this.isPageMounted()) {
                            const messageError = error && error.message ?
                                error.message :
                                translator(i18nKeys.messages.unexpectedError);

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
                },
            },
        });
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
                        translator(i18nKeys.messages.unexpectedError);

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
        if (this.addLockExceptionEnabled()) {
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
                    message: translator(i18nKeys.lockException.addingMessage),
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
                        pageState: {
                            loaded: false,
                            loading: false,
                        },
                    });
                    this.state.addInProgress = true;
                    this.loadLockExceptionsForPager(LockException.initialPager, false);
                }
            }).catch((error) => {
                if (this.isPageMounted()) {
                    const messageError = error && error.message ?
                        error.message :
                        translator(i18nKeys.messages.unexpectedError);

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

        const addLockException = [
            <FlatButton
                className={styles.actionButton}
                label={translator(i18nKeys.lockException.cancelButton)}
                onClick={this.closeLockExceptionFormDialog}
            />,
            <RaisedButton
                className={styles.actionButton}
                primary={Boolean(true)}
                label={translator(i18nKeys.lockException.addButton)}
                onClick={this.addLockException}
                disabled={!this.addLockExceptionEnabled()}
            />,
        ];

        return (
            <div className={styles.lockExceptionsTable}>
                {this.header()}
                {this.state.lockExceptions && this.state.lockExceptions.length ? (
                    <div>
                        {!this.areActionsDisabled() && !this.state.atBatchDeletionPage &&
                            <div className={styles.pagination}>
                                <Pagination {...paginationProps} />
                            </div>
                        }
                        <DataTable
                            columns={this.dataTableColumns()}
                            rows={this.state.lockExceptions}
                            contextMenuActions={{ remove: this.removeLockException }}
                            contextMenuIcons={{ remove: 'delete' }}
                        />
                        {!this.areActionsDisabled() && !this.state.atBatchDeletionPage &&
                            <div className={classNames(styles.pagination, styles.marginForAddButton)}>
                                <Pagination {...paginationProps} />
                            </div>
                        }
                    </div>) :
                    (
                        <Card style={{ display: !this.state.loading ? 'block' : 'none' }}>
                            <CardText>{translator(i18nKeys.lockException.noDataMessage)}</CardText>
                        </Card>
                    )
                }
                {this.state.levels &&
                this.state.groups &&
                this.state.dataSets.length > 0 &&
                <Dialog
                    title={translator(i18nKeys.lockException.addLockExceptionFormTitle)}
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
                {!this.state.atBatchDeletionPage && !this.areActionsDisabled() &&
                    <FloatingActionButton
                        id={'addExceptionButtonId'}
                        style={jsStyles.addButton}
                        onClick={this.showLockExceptionFormDialog}
                    >
                        <ContentAdd />
                    </FloatingActionButton>
                }
            </div>
        );
    }
}

export default LockException;
