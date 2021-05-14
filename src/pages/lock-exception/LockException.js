import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CenteredContent,
    CircularLoader,
    NoticeBox,
    Button,
    Pagination,
    ButtonStrip,
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
        alert: PropTypes.object.isRequired,
        sectionKey: PropTypes.string.isRequired,
    }

    constructor() {
        super()

        this.state = {
            loading: false,
            loaded: false,
            error: null,
            pager: LockException.initialPager,
            atBatchDeletionPage: false,
            selectedOrgUnits: [],
            selectedDataSetId: null,
            selectedPeriodId: null,
            showAddDialogOpen: false,
            levels: null,
            groups: null,
            dataSets: [],
        }

        getD2Instance().then(d2 => {
            this.d2 = d2
        })
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
                if (!this.state.atBatchDeletionPage) {
                    row.organisationUnit = organisationUnit.displayName
                    row.organisationUnitId = organisationUnit.id
                }
                return row
            }
        )
    }

    dataTableColumns() {
        if (this.state.atBatchDeletionPage) {
            return ['dataSet', 'period']
        }
        return ['organisationUnit', 'dataSet', 'period']
    }

    renderHeader() {
        if (this.state.atBatchDeletionPage) {
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
                <ButtonStrip>
                    <Button
                        primary
                        onClick={this.showLockExceptionFormDialog}
                        disabled={this.areActionsDisabled()}
                    >
                        {i18n.t('Add lock exception')}
                    </Button>
                    <Button
                        onClick={this.goToBatchDeletionPage}
                        disabled={this.areActionsDisabled()}
                    >
                        {i18n.t('Batch deletion')}
                    </Button>
                </ButtonStrip>
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
        this.loadLockExceptionsForPager(LockException.initialPager, {
            userAction: false,
        })
    }

    loadLockExceptionsForPager = async (pager, { userAction }) => {
        if (!userAction && (this.state.loading || this.state.loaded)) {
            return
        }

        this.setState({
            atBatchDeletionPage: false,
            loaded: false,
            loading: true,
            error: null,
        })

        const d2 = await getD2Instance()
        const api = d2.Api.getApi()
        const url =
            `lockExceptions?page=${pager.page}&pageSize=${pager.pageSize}` +
            '&fields=name,' +
            'period[id,displayName],' +
            'organisationUnit[id,displayName],' +
            'dataSet[id,displayName]' +
            '&order=name:asc'

        try {
            const response = await api.get(url)

            this.setState({
                loaded: true,
                loading: false,
                lockExceptions: this.prepareLockExceptionsResponseToDataTable(
                    response.lockExceptions
                ),
                pager: response.pager,
            })
        } catch (error) {
            const messageError =
                error && error.message
                    ? error.message
                    : i18n.t('An unexpected error happened during operation')
            this.setState({
                loaded: true,
                loading: false,
                error: messageError,
            })
        }
    }

    // Get information for Batch Deletion Page
    loadLockExceptionCombinations = async () => {
        const d2 = await getD2Instance()
        const api = d2.Api.getApi()
        const url =
            'lockExceptions/combinations?fields=name,period[id,displayName],dataSet[id,displayName]'

        this.setState({
            atBatchDeletionPage: true,
            loaded: false,
            loading: true,
        })

        try {
            const response = await api.get(url)

            this.setState({
                loaded: true,
                loading: false,
                atBatchDeletionPage: true,
                lockExceptions: this.prepareLockExceptionsResponseToDataTable(
                    response.lockExceptions
                ),
            })
        } catch (error) {
            const messageError =
                error && error.message
                    ? error.message
                    : i18n.t('An unexpected error happened during operation')

            this.setState({
                loaded: true,
                loading: false,
                error: messageError,
            })
        }
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
            ...this.state.pager,
            page,
        }
        this.loadLockExceptionsForPager(pager, { userAction: true })
    }

    handlePageSizeChange = pageSize => {
        const pager = {
            ...this.state.pager,
            pageSize,
        }
        this.loadLockExceptionsForPager(pager, { userAction: true })
    }

    backToLockExceptions = () => {
        this.loadLockExceptionsForPager(this.state.pager, { userAction: true })
    }

    goToBatchDeletionPage = () => {
        this.loadLockExceptionCombinations()
    }

    removeLockException = lockException => {
        const handleActionClick = async () => {
            this.setState({
                loading: true,
            })

            let deleteUrl = `lockExceptions?pe=${lockException.periodId}&ds=${lockException.dataSetId}`
            if (lockException.organisationUnitId) {
                deleteUrl += `&ou=${lockException.organisationUnitId}`
            }

            const d2 = await getD2Instance()
            const api = d2.Api.getApi()

            try {
                await api.delete(deleteUrl)

                this.props.alert.show({
                    message: i18n.t('Lock exception removed'),
                    success: true,
                })

                if (this.state.atBatchDeletionPage) {
                    this.setState({
                        loading: false,
                        lockExceptions: this.state.lockExceptions.filter(
                            le =>
                                le.periodId !== lockException.periodId ||
                                le.dataSetId !== lockException.dataSetId
                        ),
                    })
                } else {
                    this.loadLockExceptionsForPager(
                        LockException.initialPager,
                        { userAction: true }
                    )
                }
            } catch (error) {
                const messageError =
                    error && error.message
                        ? error.message
                        : i18n.t(
                              'An unexpected error happened during operation'
                          )

                this.setState({
                    loading: false,
                    error: messageError,
                })
            }
        }

        // TODO: Replace with modal
        if (
            window.confirm(
                i18n.t('Are you sure you want to delete this lock exception?')
            )
        ) {
            handleActionClick()
        }
    }

    showLockExceptionFormDialog = async () => {
        if (
            this.state.levels &&
            this.state.groups &&
            this.state.dataSets.length > 0
        ) {
            this.setState({ showAddDialogOpen: true })
            return
        }

        const d2 = await getD2Instance()
        try {
            const [levels, groups, dataSets] = await Promise.all([
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

            this.setState({
                showAddDialogOpen: true,
                levels,
                groups,
                dataSets: dataSets.toArray(),
            })
        } catch (error) {
            const messageError =
                error && error.message
                    ? error.message
                    : i18n.t('An unexpected error happened during operation')

            this.setState({
                loading: false,
                error: messageError,
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
        const orgUnitIds = this.state.selectedOrgUnits.map(orgUnitPath => {
            const splitOrgUnitPath = orgUnitPath.split('/')
            return splitOrgUnitPath[splitOrgUnitPath.length - 1]
        })

        const formData = new FormData()
        formData.append('ou', `[${orgUnitIds.join(',')}]`)
        formData.append('pe', this.state.selectedPeriodId)
        formData.append('ds', this.state.selectedDataSetId)

        this.setState({
            loading: true,
        })

        const d2 = await getD2Instance()
        const api = d2.Api.getApi()

        try {
            await api.post('lockExceptions', formData)

            this.props.alert.show({
                message: i18n.t('Lock exception added'),
                success: true,
            })

            this.setState({
                loaded: false,
                loading: false,
            })
            this.loadLockExceptionsForPager(LockException.initialPager, {
                userAction: false,
            })
            this.closeLockExceptionFormDialog()
        } catch (error) {
            const messageError =
                error && error.message
                    ? error.message
                    : i18n.t(i18nKeys.messages.unexpectedError)

            this.setState({
                loading: false,
                error: messageError,
            })
        }
    }

    renderPagination() {
        if (this.areActionsDisabled() || this.state.atBatchDeletionPage) {
            return null
        }

        const paginationProps = {
            ...this.state.pager,
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
        return this.state.lockExceptions?.length > 0 ? (
            <div>
                {this.renderPagination()}
                <LockExceptionsTable
                    columns={this.dataTableColumns()}
                    rows={this.state.lockExceptions}
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
                    d2={this.d2}
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
                {this.state.error && (
                    <NoticeBox error>{this.state.error}</NoticeBox>
                )}
                {this.state.loading && (
                    <CenteredContent>
                        <CircularLoader />
                    </CenteredContent>
                )}
                {!this.state.loading && this.renderTable()}
                {this.state.levels &&
                    this.state.groups &&
                    this.state.dataSets.length > 0 &&
                    this.d2 &&
                    this.renderModal()}
            </div>
        )
    }
}

const withAlerts = Component => {
    return function ComponentWithAlerts(props) {
        const alert = useAlert(
            ({ message }) => message,
            options => options
        )
        return <Component {...props} alert={alert} />
    }
}

export default withAlerts(LockException)
