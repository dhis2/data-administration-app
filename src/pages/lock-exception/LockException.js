import React from 'react';
import PropTypes from 'prop-types';

/* Material UI */
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Card, CardText } from 'material-ui/Card';

import DataTable from 'd2-ui/lib/data-table/DataTable.component';
import Pagination from 'd2-ui/lib/pagination/Pagination.component';

import 'd2-ui/lib/css/DataTable.css';
import 'd2-ui/lib/css/Pagination.css';

import Page from '../Page';
import AddLockExceptionForm from './AddLockExceptionForm';

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
        this.state.rootWithMembers = null;
        this.state.dataSets = [];

        this.state.selectedOrgUnits = [];
        this.state.selectedDataSetId = null;
        this.state.selectedPeriodId = null;

        this.state.pager = this.state.pager || {
            pageSize: 5,
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

    componentDidMount() {
        this.loadLockExceptions();
    }

    componentDidUpdate() {
        this.loadLockExceptions();
    }

    loadLockExceptions() {
        const api = this.context.d2.Api.getApi();
        const url = `lockExceptions?page=${this.state.pager.page}&pageSize=${this.state.pager.pageSize}` +
            '&fields=name,' +
            'period[id,displayName],' +
            'organisationUnit[id,displayName],' +
            'dataSet[id,displayName]';

        // request to GET lock exceptions
        if (!this.state.loading && !this.state.loaded) {
            this.context.updateAppState({
                loading: true,
                currentSection: this.props.sectionKey,
                pageState: {
                    loaded: false,
                    lockExceptions: this.state.lockExceptions,
                },
            });

            api.get(url)
                .then((response) => {
                    this.context.updateAppState({
                        loading: false,
                        pageState: {
                            loaded: true,
                            lockExceptions: response.lockExceptions,
                            pager: response.pager,
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
                <FloatingActionButton
                    style={{ position: 'fixed', marginTop: '1rem', bottom: '1.5rem', right: '1.5rem', zIndex: 10 }}
                    onClick={showAddDialogHandler}
                >
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        );
    }
}

export default LockException;
