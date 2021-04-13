import { PropTypes } from '@dhis2/prop-types'
import {
    Button,
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
} from '@dhis2/ui'
import classNames from 'classnames'
import {
    LOADING,
    SUCCESS,
    ERROR,
    ACTION_MESSAGE,
} from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes'
import { Card, CardText } from 'material-ui/Card'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import RaisedButton from 'material-ui/RaisedButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import React from 'react'
import PageHelper from '../../components/page-helper/PageHelper'
import { i18nKeys } from '../../i18n'
import i18n from '../../locales'
import Page from '../Page'
import { getDocsKeyForSection } from '../sections.conf'
import AddLockExceptionForm from './AddLockExceptionForm'
import '../../custom-css/D2UIDataTableOverrides.css'
import styles from './LockException.module.css'

const jsStyles = {
    dialog: {
        maxWidth: '80%',
    },
    addButton: {
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
    },
}

const columnLabels = {
    dataSet: i18n.t('Data set'),
    period: i18n.t('Period'),
    organisationUnit: i18n.t('Organisation unit'),
}

const LockExceptionsTable = ({ columns, rows, onRemoveLockException }) => (
    <Table>
        <TableHead>
            <TableRowHead>
                {columns.map(column => (
                    <TableCellHead key={column}>
                        {columnLabels[column]}
                    </TableCellHead>
                ))}
                <TableCellHead>
                    {/* Column for 'remove lock exception' button */}
                </TableCellHead>
            </TableRowHead>
        </TableHead>
        <TableBody>
            {rows.map((row, index) => (
                <TableRow key={index}>
                    {columns.map(column => (
                        <TableCell key={column}>{row[column]}</TableCell>
                    ))}
                    <TableCell>
                        <Button
                            small
                            secondary
                            onClick={onRemoveLockException.bind(null, row)}
                        >
                            <FontIcon className="material-icons">
                                delete
                            </FontIcon>
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

LockExceptionsTable.propTypes = {
    onRemoveLockException: PropTypes.func.isRequired,
    columns: PropTypes.array,
    rows: PropTypes.array,
}

class LockException extends Page {
    static initialPager = {
        pageSize: 20,
        page: 1,
        total: 0,
        pageCount: 1,
    }

    constructor(props, context) {
        super(props, context)

        this.state = {
            selectedOrgUnits: [],
            selectedDataSetId: null,
            selectedPeriodId: null,
            showAddDialogOpen: false,
            levels: null,
            groups: null,
            dataSets: [],
        }

        this.updateSelectedOrgUnits = this.updateSelectedOrgUnits.bind(this)
        this.updateSeletedDataSetId = this.updateSeletedDataSetId.bind(this)
        this.updateSelectedPeriodId = this.updateSelectedPeriodId.bind(this)
        this.showLockExceptionFormDialog = this.showLockExceptionFormDialog.bind(
            this
        )
        this.closeLockExceptionFormDialog = this.closeLockExceptionFormDialog.bind(
            this
        )
        this.addLockException = this.addLockException.bind(this)
        this.backToLockExceptions = this.backToLockExceptions.bind(this)
        this.goToBatchDeletionPage = this.goToBatchDeletionPage.bind(this)

        // FIXME Hack in some translations
        const d2 = context.d2
        Object.assign(d2.i18n.translations, {
            period: i18n.t(i18nKeys.lockException.period),
            data_set: i18n.t(i18nKeys.lockException.dataSet),
            organisation_unit: i18n.t(i18nKeys.lockException.organisationUnit),
            organisation_unit_group: i18n.t(
                i18nKeys.lockException.organisationUnitGroup
            ),
            organisation_unit_level: i18n.t(
                i18nKeys.lockException.organisationUnitLevel
            ),
            select: i18n.t(i18nKeys.lockException.select),
            deselect: i18n.t(i18nKeys.lockException.deselect),
            select_all: i18n.t(i18nKeys.lockException.selectAll),
            deselect_all: i18n.t(i18nKeys.lockException.deselectAll),
            name: i18n.t(i18nKeys.lockException.name),
            show: i18n.t(i18nKeys.lockException.show),
            remove: i18n.t(i18nKeys.lockException.remove),
            actions: i18n.t(i18nKeys.lockException.actions),
            of_page: i18n.t(i18nKeys.lockException.ofPage),
            week: i18n.t(i18nKeys.lockException.week),
            month: i18n.t(i18nKeys.lockException.month),
            year: i18n.t(i18nKeys.lockException.year),
            biMonth: i18n.t(i18nKeys.lockException.biMonth),
            day: i18n.t(i18nKeys.lockException.day),
            jan: i18n.t(i18nKeys.lockException.jan),
            feb: i18n.t(i18nKeys.lockException.feb),
            mar: i18n.t(i18nKeys.lockException.mar),
            apr: i18n.t(i18nKeys.lockException.apr),
            may: i18n.t(i18nKeys.lockException.may),
            jun: i18n.t(i18nKeys.lockException.jun),
            jul: i18n.t(i18nKeys.lockException.jul),
            aug: i18n.t(i18nKeys.lockException.aug),
            sep: i18n.t(i18nKeys.lockException.sep),
            oct: i18n.t(i18nKeys.lockException.oct),
            nov: i18n.t(i18nKeys.lockException.nov),
            dec: i18n.t(i18nKeys.lockException.dec),
            'jan-feb': i18n.t(i18nKeys.lockException.janFeb),
            'mar-apr': i18n.t(i18nKeys.lockException.marApr),
            'may-jun': i18n.t(i18nKeys.lockException.mayJun),
            'jul-aug': i18n.t(i18nKeys.lockException.julAug),
            'sep-oct': i18n.t(i18nKeys.lockException.sepOct),
            'nov-dec': i18n.t(i18nKeys.lockException.novDec),
            quarter: i18n.t(i18nKeys.lockException.quarter),
            Q1: i18n.t(i18nKeys.lockException.Q1),
            Q2: i18n.t(i18nKeys.lockException.Q2),
            Q3: i18n.t(i18nKeys.lockException.Q3),
            Q4: i18n.t(i18nKeys.lockException.Q4),
            sixMonth: i18n.t(i18nKeys.lockException.sixMonth),
            'jan-jun': i18n.t(i18nKeys.lockException.janJun),
            'jul-dec': i18n.t(i18nKeys.lockException.julDec),
            'apr-sep': i18n.t(i18nKeys.lockException.aprSep),
            'oct-mar': i18n.t(i18nKeys.lockException.octMar),
        })
    }

    prepareLockExceptionsResponseToDataTable(lockExceptionResponse) {
        return lockExceptionResponse.map(le => {
            const row = {}
            if (!this.props.atBatchDeletionPage) {
                row.organisationUnit = le.organisationUnit.displayName
                row.organisationUnitId = le.organisationUnit.id
            }
            row.period = le.period.displayName
            row.periodId = le.period.id
            row.dataSet = le.dataSet.displayName
            row.dataSetId = le.dataSet.id
            return row
        })
    }

    dataTableColumns() {
        if (this.props.atBatchDeletionPage) {
            return ['dataSet', 'period']
        }
        return ['organisationUnit', 'dataSet', 'period']
    }

    header() {
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
                        <span>
                            {i18n.t(i18nKeys.lockException.batchDeletionHeader)}
                        </span>
                        <span className={styles.headerDivider}> | </span>
                        <span className={styles.subHeader}>
                            {i18n.t(
                                i18nKeys.lockException.batchDeletionSubHeader
                            )}
                        </span>
                    </h1>
                </div>
            )
        }

        return (
            <div className={styles.headerContainer}>
                <h1 className={styles.header}>
                    {i18n.t(i18nKeys.lockException.title)}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(
                            this.props.sectionKey
                        )}
                    />
                </h1>
                <div>
                    <Button
                        className={styles.actionButton}
                        onClick={this.goToBatchDeletionPage}
                        primary
                        disabled={this.areActionsDisabled()}
                    >
                        {i18n.t(i18nKeys.lockException.actionButton)}
                    </Button>
                </div>
            </div>
        )
    }

    areActionsDisabled() {
        return this.props.loading
    }

    addLockExceptionEnabled() {
        return (
            this.state.selectedOrgUnits.length > 0 &&
            this.state.selectedDataSetId &&
            this.state.selectedPeriodId
        )
    }

    componentDidMount() {
        this.loadLockExceptionsForPager(LockException.initialPager)
    }

    loadLockExceptionsForPager(pager, userAction) {
        const api = this.context.d2.Api.getApi()
        const url =
            `lockExceptions?page=${pager.page}&pageSize=${pager.pageSize}` +
            '&fields=name,' +
            'period[id,displayName],' +
            'organisationUnit[id,displayName],' +
            'dataSet[id,displayName]' +
            '&order=name:asc'

        // request to GET lock exceptions
        if (userAction || (!this.props.loading && !this.props.loaded)) {
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
                              message: i18n.t(i18nKeys.lockException.loading),
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
                                    message: i18n.t(
                                        i18nKeys.lockException.removedMessage
                                    ),
                                },
                            }
                            this.deleteInProgress = false
                            // If adding a lock exception, show a success message instead of hiding the loading
                        } else if (this.addInProgress) {
                            loadedState = {
                                showSnackbar: true,
                                snackbarConf: {
                                    type: SUCCESS,
                                    message: i18n.t(
                                        i18nKeys.lockException.addedMessage
                                    ),
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
                                : i18n.t(i18nKeys.messages.unexpectedError)

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

        // request to GET lock exception combinations
        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: i18n.t(i18nKeys.lockException.loadingMessage),
            },
            pageState: {
                atBatchDeletionPage: true,
                loaded: false,
                loading: true,
            },
        })

        api.get(url)
            .then(response => {
                if (this.isPageMounted()) {
                    this.context.updateAppState({
                        showSnackbar: false,
                        pageState: {
                            loaded: true,
                            lockExceptions: this.prepareLockExceptionsResponseToDataTable(
                                response.lockExceptions
                            ),
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
                            : i18n.t(i18nKeys.messages.unexpectedError)

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

    updateSelectedOrgUnits(selectedOrgUnits) {
        this.setState({ selectedOrgUnits })
    }

    updateSeletedDataSetId(selectedDataSetId) {
        this.setState({ selectedDataSetId })
    }

    updateSelectedPeriodId(selectedPeriodId) {
        this.setState({ selectedPeriodId })
    }

    handlePageChange = page => {
        const pager = {
            ...this.props.pager,
            page,
        }
        this.loadLockExceptionsForPager(pager, true)
    }

    handlePageSizeChange = pageSize => {
        const pager = {
            ...this.props.pager,
            pageSize,
        }
        this.loadLockExceptionsForPager(pager, true)
    }

    backToLockExceptions() {
        this.loadLockExceptionsForPager(this.props.pager, true)
    }

    goToBatchDeletionPage() {
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
                    message: i18n.t(i18nKeys.lockException.loadingMessage),
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
                                    message: i18n.t(
                                        i18nKeys.lockException.removedMessage
                                    ),
                                },
                                pageState: newPageState,
                            })
                        } else {
                            this.deleteInProgress = true
                            this.loadLockExceptionsForPager(
                                LockException.initialPager,
                                true
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

        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: ACTION_MESSAGE,
                message: i18n.t(i18nKeys.lockException.confirmDeleteMessage),
                action: i18n.t(i18nKeys.lockException.confirmButton),
                onActionClick: handleActionClick,
            },
        })
    }

    showLockExceptionFormDialog() {
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
    }

    closeLockExceptionFormDialog() {
        this.setState({
            showAddDialogOpen: false,
            selectedOrgUnits: [],
            selectedDataSetId: null,
            selectedPeriodId: null,
        })
    }

    addLockException() {
        if (this.addLockExceptionEnabled()) {
            const api = this.context.d2.Api.getApi()
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
                    message: i18n.t(i18nKeys.lockException.addingMessage),
                },
                pageState: {
                    showAddDialogOpen: false,
                    selectedOrgUnits: [],
                    selectedDataSetId: null,
                    selectedPeriodId: null,
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
                            false
                        )
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
    }

    render() {
        const paginationProps = {
            ...this.props.pager,
            onPageSizeChange: this.handlePageSizeChange,
            onPageChange: this.handlePageChange,
        }

        const addLockException = [
            <FlatButton
                key="cancel-button"
                className={styles.actionButton}
                label={i18n.t(i18nKeys.lockException.cancelButton)}
                onClick={this.closeLockExceptionFormDialog}
            />,
            <RaisedButton
                key="add-button"
                className={styles.actionButton}
                primary={true}
                label={i18n.t(i18nKeys.lockException.addButton)}
                onClick={this.addLockException}
                disabled={!this.addLockExceptionEnabled()}
            />,
        ]

        return (
            <div className={styles.lockExceptionsTable}>
                {this.header()}
                {this.props.lockExceptions &&
                this.props.lockExceptions.length ? (
                    <div>
                        {!this.areActionsDisabled() &&
                            !this.props.atBatchDeletionPage && (
                                <div className={styles.pagination}>
                                    <Pagination {...paginationProps} />
                                </div>
                            )}
                        <LockExceptionsTable
                            columns={this.dataTableColumns()}
                            rows={this.props.lockExceptions}
                            onRemoveLockException={this.removeLockException}
                        />
                        {!this.areActionsDisabled() &&
                            !this.props.atBatchDeletionPage && (
                                <div
                                    className={classNames(
                                        styles.pagination,
                                        styles.marginForAddButton
                                    )}
                                >
                                    <Pagination {...paginationProps} />
                                </div>
                            )}
                    </div>
                ) : (
                    <Card
                        style={{
                            display: !this.props.loading ? 'block' : 'none',
                        }}
                    >
                        <CardText>
                            {i18n.t(i18nKeys.lockException.noDataMessage)}
                        </CardText>
                    </Card>
                )}
                {this.state.levels &&
                    this.state.groups &&
                    this.state.dataSets.length > 0 && (
                        <Dialog
                            title={i18n.t(
                                i18nKeys.lockException.addLockExceptionFormTitle
                            )}
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
                                updateSelectedOrgUnits={
                                    this.updateSelectedOrgUnits
                                }
                                updateSeletedDataSetId={
                                    this.updateSeletedDataSetId
                                }
                                updateSelectedPeriodId={
                                    this.updateSelectedPeriodId
                                }
                            />
                        </Dialog>
                    )}
                {!this.props.atBatchDeletionPage && !this.areActionsDisabled() && (
                    <FloatingActionButton
                        id={'addExceptionButtonId'}
                        style={jsStyles.addButton}
                        onClick={this.showLockExceptionFormDialog}
                    >
                        <ContentAdd />
                    </FloatingActionButton>
                )}
            </div>
        )
    }
}

export default LockException
