import i18n from '@dhis2/d2-i18n'
import {
    CenteredContent,
    CircularLoader,
    Button,
    Pagination,
    Card,
} from '@dhis2/ui'
import classNames from 'classnames'
import { getInstance as getD2Instance } from 'd2'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import { i18nKeys } from '../../i18n-keys'
import AddLockExceptionForm from './AddLockExceptionForm'
import styles from './LockException.module.css'
import LockExceptionsTable from './LockExceptionsTable'

class LockException extends Component {
    static initialPager = {
        pageSize: 20,
        page: 1,
        total: 0,
        pageCount: 1,
    }

    static propTypes = {
        sectionKey: PropTypes.string.isRequired,
    }

    fixD2Translations = async () => {
        // FIXME Hack in some translations
        const d2 = await getD2Instance()
        Object.assign(d2.i18n.translations, {
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
            month: i18n.t('mont'),
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

    constructor() {
        super()

        this.state = {
            loading: true,
            loaded: false,
            error: null,
            pager: LockException.initialPager,
            selectedOrgUnits: [],
            selectedDataSetId: null,
            selectedPeriodId: null,
            showAddDialogOpen: false,
            levels: null,
            groups: null,
            dataSets: [],
        }

        this.fixD2Translations()
    }

    prepareLockExceptionsResponseToDataTable(lockExceptionResponse) {
        return lockExceptionResponse.map(
            ({ dataSet, period, organisationUnit }) => {
                const row = {
                    period: period.displayName,
                    periodId: period.id,
                    dataSet: dataSet.displayName,
                    dataSetId: dataSet.id,
                }
                if (!this.props.atBatchDeletionPage) {
                    row.organisationUnit = organisationUnit.displayName
                    row.organisationUnitId = organisationUnit.id
                }
                return row
            }
        )
    }

    dataTableColumns() {
        if (this.props.atBatchDeletionPage) {
            return ['dataSet', 'period']
        }
        return ['organisationUnit', 'dataSet', 'period']
    }

    renderHeader() {
        if (this.props.atBatchDeletionPage) {
            return (
                <div className={styles.headerContainer}>
                    <h1 className={styles.header}>
                        <IconButton onClick={this.backToLockExceptions}>
                            <FontIcon
                                className={classNames(
                                    'material-icons',
                                    styles.backArrowIcon
                                )}
                            >
                                arrow_back
                            </FontIcon>
                        </IconButton>
                        <span>{i18n.t('Lock Exception')}</span>
                        <span className={styles.headerDivider}> | </span>
                        <span className={styles.subHeader}>
                            {i18n.t('Batch Deletion')}
                        </span>
                    </h1>
                </div>
            )
        }

        return (
            <div className={styles.headerContainer}>
                <PageHeader
                    sectionKey={this.props.sectionKey}
                    title={i18nKeys.lockException.title}
                />
                <div>
                    <Button
                        primary
                        onClick={this.showLockExceptionFormDialog}
                        disabled={this.areActionsDisabled()}
                    >
                        {i18n.t('Add lock exception')}
                    </Button>
                    <Button
                        secondary
                        onClick={this.goToBatchDeletionPage}
                        disabled={this.areActionsDisabled()}
                    >
                        {i18n.t('Batch deletion')}
                    </Button>
                </div>
            </div>
        )
    }

    areActionsDisabled() {
        return this.state.loading
    }

    addLockExceptionEnabled() {
        return (
            this.state.selectedOrgUnits.length > 0 &&
                this.state.selectedDataSetId &&
                this.state.selectedPeriodId
        )
    }

    componentDidMount() {
        this.loadLockExceptionsForPager(LockException.initialPager, { userAction: false })
    }

    loadLockExceptionsForPager(pager, { userAction }) {
        const api = this.context.d2.Api.getApi()
        const url =
              `lockExceptions?page=${pager.page}&pageSize=${pager.pageSize}` +
              '&fields=name,' +
              'period[id,displayName],' +
              'organisationUnit[id,displayName],' +
              'dataSet[id,displayName]' +
              '&order=name:asc'

        // request to GET lock exceptions
        if (userAction || (!this.state.loading && !this.state.loaded)) {
            // Keep the previous message visible (p.e. deleting lock exception || add lock exception)
            this.context.updateAppState(
                this.deleteInProgress || this.addInProgress
                    ? {
                        atBatchDeletionPage: false,
                        loaded: false,
                        loading: true,
                    }
                : {
                    showSnackbar: true,
                    snackbarConf: {
                        type: LOADING,
                        message: i18n.t('Loading Lock Exceptions...'),
                    },
                    pageState: {
                        atBatchDeletionPage: false,
                        loaded: false,
                        loading: true,
                    },
                }
            )

            api.get(url)
                .then(response => {
                    if (this.isPageMounted()) {
                        let loadedState

                        // If deleting a lock exception, show a success message instead of hiding the loading
                        if (this.deleteInProgress) {
                            loadedState = {
                                showSnackbar: true,
                                snackbarConf: {
                                    type: SUCCESS,
                                    message: i18n.t('Lock Exception removed'),
                                },
                            }
                            this.deleteInProgress = false
                            // If adding a lock exception, show a success message instead of hiding the loading
                        } else if (this.addInProgress) {
                            loadedState = {
                                showSnackbar: true,
                                snackbarConf: {
                                    type: SUCCESS,
                                    message: i18n.t('Lock Exception Added'),
                                },
                            }
                            this.addInProgress = false
                        } else {
                            loadedState = {
                                showSnackbar: false,
                            }
                        }

                        this.context.updateAppState({
                            ...loadedState,
                            pageState: {
                                loaded: true,
                                lockExceptions: this.prepareLockExceptionsResponseToDataTable(
                                    response.lockExceptions
                                ),
                                pager: response.pager,
                                loading: false,
                            },
                        })
                    }
                })
                .catch(error => {
                    if (this.isPageMounted()) {
                        const messageError =
                              error && error.message
                              ? error.message
                              : i18n.t(
                                  'An unexpected error happened during operation'
                              )

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
                        })
                    }
                })
        }
    }

    // Get information for Batch Deletion Page
    loadLockExceptionCombinations() {
        const api = this.context.d2.Api.getApi()
        const url =
              'lockExceptions/combinations?fields=name, period[id,displayName], dataSet[id,displayName]'
        const pager = this.props.pager

        // request to GET lock exception combinations
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: i18n.t('Loading Lock Exceptions...'),
            },
            pageState: {
                atBatchDeletionPage: true,
                loaded: false,
                loading: true,
                pager,
            },
        })

        api.get(url)
            .then(response => {
                if (this.isPageMounted()) {
                    this.context.updateAppState({
                        showSnackbar: false,
                        pageState: {
                            loaded: true,
                            atBatchDeletionPage: true,
                            lockExceptions: this.prepareLockExceptionsResponseToDataTable(
                                response.lockExceptions
                            ),
                            loading: false,
                            pager,
                        },
                    })
                }
            })
            .catch(error => {
                if (this.isPageMounted()) {
                    const messageError =
                          error && error.message
                          ? error.message
                          : i18n.t(
                              'An unexpected error happened during operation'
                          )

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
                    })
                }
            })
    }

    updateSelectedOrgUnits = selectedOrgUnits => {
        this.setState({ selectedOrgUnits })
    }

    updateSeletedDataSetId = selectedDataSetId => {
        this.setState({ selectedDataSetId })
    }

    updateSelectedPeriodId = selectedPeriodId => {
        this.setState({ selectedPeriodId })
    }

    handlePageChange = page => {
        const pager = {
            ...this.props.pager,
            page,
        }
        this.loadLockExceptionsForPager(pager, { userAction: true })
    }

    handlePageSizeChange = pageSize => {
        const pager = {
            ...this.props.pager,
            pageSize,
        }
        this.loadLockExceptionsForPager(pager, { userAction: true })
    }

    backToLockExceptions = () => {
        this.loadLockExceptionsForPager(this.props.pager, { userAction: true })
    }

    goToBatchDeletionPage = () => {
        this.loadLockExceptionCombinations()
    }

    removeLockException = le => {
        const handleActionClick = () => {
            let deleteUrl = `lockExceptions?pe=${le.periodId}&ds=${le.dataSetId}`

            if (le.organisationUnitId) {
                deleteUrl += `&ou=${le.organisationUnitId}`
            }

            this.context.updateAppState({
                showSnackbar: true,
                snackbarConf: {
                    type: LOADING,
                    message: i18n.t('Loading Lock Exceptions...'),
                },
                pageState: {
                    ...this.props,
                    loading: true,
                },
            })

            const api = this.context.d2.Api.getApi()
            api.delete(deleteUrl)
                .then(() => {
                    if (this.isPageMounted()) {
                        const newPageState = {
                            ...this.props,
                            loading: false,
                        }

                        if (this.props.atBatchDeletionPage) {
                            newPageState.lockExceptions = this.props.lockExceptions.filter(
                                existingLockException =>
                                existingLockException.periodId !==
                                    le.periodId ||
                                    existingLockException.dataSetId !==
                                    le.dataSetId
                            )

                            this.context.updateAppState({
                                showSnackbar: true,
                                snackbarConf: {
                                    type: SUCCESS,
                                    message: i18n.t('Lock Exception removed'),
                                },
                                pageState: newPageState,
                            })
                        } else {
                            this.deleteInProgress = true
                            this.loadLockExceptionsForPager(
                                LockException.initialPager,
                                { userAction: true }
                            )
                        }
                    }
                })
                .catch(error => {
                    console.error(error)
                    if (this.isPageMounted()) {
                        const messageError =
                              error && error.message
                              ? error.message
                              : i18n.t(
                                  'An unexpected error happened during operation'
                              )

                        this.context.updateAppState({
                            showSnackbar: true,
                            snackbarConf: {
                                type: ERROR,
                                message: messageError,
                            },
                            pageState: {
                                ...this.props,
                                loading: false,
                            },
                        })
                    }
                })
        }

        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: ACTION_MESSAGE,
                message: i18n.t('Are you sure?'),
                action: i18n.t('Confirm'),
                onActionClick: handleActionClick,
            },
        })
    }

    showLockExceptionFormDialog = () => {
        const d2 = this.context.d2
        if (
            this.state.levels &&
                this.state.groups &&
                this.state.dataSets.length > 0
        ) {
            this.setState({ showAddDialogOpen: true })
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
            ])
                .then(([levels, groups, dataSets]) => {
                    if (this.isPageMounted()) {
                        this.setState({
                            showAddDialogOpen: true,
                            levels,
                            groups,
                            dataSets: dataSets.toArray(),
                        })
                    }
                })
                .catch(error => {
                    if (this.isPageMounted()) {
                        const messageError =
                              error && error.message
                              ? error.message
                              : i18n.t(
                                  'An unexpected error happened during operation'
                              )

                        this.context.updateAppState({
                            showSnackbar: true,
                            snackbarConf: {
                                type: ERROR,
                                message: messageError,
                            },
                            pageState: {
                                ...this.props,
                                loading: false,
                            },
                        })
                    }
                })
        }
    }

    closeLockExceptionFormDialog = () => {
        this.setState({
            showAddDialogOpen: false,
            selectedOrgUnits: [],
            selectedDataSetId: null,
            selectedPeriodId: null,
        })
    }

    addLockException = async () => {
        const d2 = await getD2Instance()
        const api = d2.Api.getApi()
        const orgUnitIds = this.state.selectedOrgUnits.map(orgUnitPath => {
            const orgUnitPathSplitted = orgUnitPath.split('/')
            return orgUnitPathSplitted[orgUnitPathSplitted.length - 1]
        })

        const formData = new FormData()
        formData.append('ou', `[${orgUnitIds.join(',')}]`)
        formData.append('pe', this.state.selectedPeriodId)
        formData.append('ds', this.state.selectedDataSetId)

        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: i18n.t('Adding Lock Exception...'),
            },
            pageState: {
                loading: true,
            },
        })

        api.post('lockExceptions', formData)
            .then(() => {
                if (this.isPageMounted()) {
                    this.context.updateAppState({
                        pageState: {
                            loaded: false,
                            loading: false,
                        },
                    })
                    this.addInProgress = true
                    this.loadLockExceptionsForPager(
                        LockException.initialPager,
                        { userAction: false }
                    )
                    this.closeLockExceptionFormDialog()
                }
            })
            .catch(error => {
                if (this.isPageMounted()) {
                    const messageError =
                          error && error.message
                          ? error.message
                          : i18n.t(i18nKeys.messages.unexpectedError)

                    this.context.updateAppState({
                        showSnackbar: true,
                        snackbarConf: {
                            type: ERROR,
                            message: messageError,
                        },
                        pageState: {
                            ...this.props,
                            loading: false,
                        },
                    })
                }
            })
    }

    renderPagination() {
        if (this.areActionsDisabled() || this.state.atBatchDeletionPage) {
            return null
        }

        const paginationProps = {
            ...this.props.pager,
            onPageSizeChange: this.handlePageSizeChange,
            onPageChange: this.handlePageChange,
        }
        return (
            <div className={styles.pagination}>
                <Pagination {...paginationProps} />
            </div>
        )
    }

    renderTable() {
        return this.props.lockExceptions && this.props.lockExceptions.length ? (
            <div>
                {this.renderPagination()}
                <LockExceptionsTable
                    columns={this.dataTableColumns()}
                    rows={this.props.lockExceptions}
                    onRemoveLockException={this.removeLockException}
                />
                {this.renderPagination()}
            </div>
        ) : (
            <em>{i18n.t('No lock exceptions to show.')}</em>
        )
    }

    renderModal() {
        const actions = [
            <FlatButton
                key="cancel-button"
                className={styles.actionButton}
                label={i18n.t('Cancel')}
                onClick={this.closeLockExceptionFormDialog}
            />,
            <RaisedButton
                key="add-button"
                className={styles.actionButton}
                primary={true}
                label={i18n.t('Add')}
                onClick={this.addLockException}
                disabled={!this.addLockExceptionEnabled()}
            />,
        ]

        return (
            <Dialog
                title={i18n.t('Add new lock exception')}
                actions={actions}
                modal={false}
                open={this.state.showAddDialogOpen}
                contentStyle={{ maxWidth: '80%' }}
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
        )
    }

    render() {
        return (
            <div className={styles.lockExceptionsTable}>
                {this.renderHeader()}
                {this.state.loading && (
                    <CenteredContent>
                        <CircularLoader />
                    </CenteredContent>
                )}
                {!this.state.loading && this.renderTable()}
                {this.state.levels &&
                 this.state.groups &&
                 this.state.dataSets.length > 0 &&
                 this.renderModal()}
            </div>
        )
    }
}

export default LockException
