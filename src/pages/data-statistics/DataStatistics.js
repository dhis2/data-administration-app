import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardText } from 'material-ui/Card';
import { LOADING, ERROR } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes';
import classNames from 'classnames';
import Page from '../Page';
import DataStatisticsTable from './DataStatisticsTable';
import PageHelper from '../../components/page-helper/PageHelper';
import { getDocsKeyForSection } from '../sections.conf';
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';
import styles from './DataStatistics.module.css';

export const OBJECT_COUNTS_KEY = 'objectCounts';
export const ACTIVE_USERS_KEY = 'activeUsers';
export const USER_INVITATIONS_KEY = 'userInvitations';
export const DATA_VALUE_COUNT_KEY = 'dataValueCount';
export const EVENT_COUNT_KEY = 'eventCount';

const PENDING_INVITATION_ALL_KEY = 'all';
const EXPIRED_INVITATION_KEY = 'expired';

export const TableCard = ({ label, elements }) => (
    <Card className={classNames(styles.card, 'data-statistics-table')}>
        <DataStatisticsTable
            label={label}
            elements={elements}
        />
    </Card>
);

TableCard.propTypes = {
    label: PropTypes.string.isRequired,
    elements: PropTypes.array.isRequired,
};

class DataStatistics extends Page {
    static STATE_PROPERTIES = [
        'tables',
        'loaded',
        'loading',
    ];

    constructor() {
        super();

        this.state = {
            tables: {},
            loaded: false,
            loading: false,
        };
    }

    // auxiliar functions
    static objectCountsTableObjectToShowFromServerResponse = (objectCountsResponse) => {
        if (objectCountsResponse) {
            const objectCountsKeys = Object.keys(objectCountsResponse);
            const objectCountsTable = {
                label: i18n.t(i18nKeys.dataStatistics.objectType),
                elements: [],
            };

            for (let i = 0; i < objectCountsKeys.length; i++) {
                const key = objectCountsKeys[i];
                objectCountsTable.elements.push({
                    label: i18n.t(i18nKeys.dataStatistics.objects[key]),
                    count: objectCountsResponse[key],
                });
            }

            return objectCountsTable;
        }

        return {};
    };

    static translatedTimeLabelFromIntProperty = (intProperty) => {
        let label = i18n.t(i18nKeys.dataStatistics.lastHour);
        if (intProperty === 1) {
            label = i18n.t(i18nKeys.dataStatistics.today);
        } else if (intProperty > 0) {
            const lastLabel = i18n.t(i18nKeys.dataStatistics.last);
            const daysLabel = i18n.t(i18nKeys.dataStatistics.days);
            label = `${lastLabel} ${intProperty} ${daysLabel}`;
        }

        return label;
    };

    static activeUsersTableObjectToShowFromServerResponse = (activeUsersResponse) => {
        if (activeUsersResponse) {
            const activeUsersKeys = Object.keys(activeUsersResponse);
            const activeUsersTable = {
                label: i18n.t(i18nKeys.dataStatistics.usersLoggedIn),
                elements: [],
            };

            for (let i = 0; i < activeUsersKeys.length; i++) {
                const key = activeUsersKeys[i];
                activeUsersTable.elements.push({
                    label: DataStatistics.translatedTimeLabelFromIntProperty(parseInt(key, 10)),
                    count: activeUsersResponse[key],
                });
            }

            return activeUsersTable;
        }

        return {};
    };

    static userInvitationsTableObjectToShowFromServerResponse = (userInvitationsResponse) => {
        if (userInvitationsResponse) {
            const userInvitationsTable = {
                label: i18n.t(i18nKeys.dataStatistics.userAccountInvitations),
                elements: [],
            };

            if (userInvitationsResponse.hasOwnProperty(PENDING_INVITATION_ALL_KEY)) {
                userInvitationsTable.elements.push({
                    label: i18n.t(i18nKeys.dataStatistics.pedingInvitations),
                    count: userInvitationsResponse[PENDING_INVITATION_ALL_KEY],
                });
            }

            if (userInvitationsResponse.hasOwnProperty(EXPIRED_INVITATION_KEY)) {
                userInvitationsTable.elements.push({
                    label: i18n.t(i18nKeys.dataStatistics.expiredInvitations),
                    count: userInvitationsResponse[EXPIRED_INVITATION_KEY],
                });
            }

            return userInvitationsTable;
        }

        return {};
    };

    static dataValueCountsTableObjectToShowFromServerResponse = (dataValueCountsResponse) => {
        if (dataValueCountsResponse) {
            const dataValueCountsKeys = Object.keys(dataValueCountsResponse);
            const dataValueCountsTable = {
                label: i18n.t(i18nKeys.dataStatistics.dataValues),
                elements: [],
            };

            for (let i = 0; i < dataValueCountsKeys.length; i++) {
                const key = dataValueCountsKeys[i];
                dataValueCountsTable.elements.push({
                    label: DataStatistics.translatedTimeLabelFromIntProperty(parseInt(key, 10)),
                    count: dataValueCountsResponse[key],
                });
            }

            return dataValueCountsTable;
        }

        return {};
    };

    static eventCountsTableObjectToShowFromServerResponse = (eventCountsResponse) => {
        if (eventCountsResponse) {
            const eventCountsKeys = Object.keys(eventCountsResponse);
            const eventCountsTable = {
                label: i18n.t(i18nKeys.dataStatistics.events),
                elements: [],
            };

            for (let i = 0; i < eventCountsKeys.length; i++) {
                const key = eventCountsKeys[i];
                eventCountsTable.elements.push({
                    label: DataStatistics.translatedTimeLabelFromIntProperty(parseInt(key, 10)),
                    count: eventCountsResponse[key],
                });
            }

            return eventCountsTable;
        }

        return {};
    };

    componentDidMount() {
        const api = this.context.d2.Api.getApi();

        // request to GET statistics
        if (!this.state.loading && !this.state.loaded) {
            this.context.updateAppState({
                showSnackbar: true,
                snackbarConf: {
                    type: LOADING,
                    message: i18n.t(i18nKeys.dataStatistics.loadingMessage),
                },
                pageState: {
                    loaded: false,
                    tables: {},
                    loading: true,
                },
            });

            if (api) {
                api.get('dataSummary').then((response) => {
                    if (this.isPageMounted()) {
                        const tables = {};
                        tables[OBJECT_COUNTS_KEY] = DataStatistics.objectCountsTableObjectToShowFromServerResponse(
                            response[OBJECT_COUNTS_KEY]);
                        tables[ACTIVE_USERS_KEY] = DataStatistics.activeUsersTableObjectToShowFromServerResponse(
                            response[ACTIVE_USERS_KEY]);
                        tables[USER_INVITATIONS_KEY] =
                            DataStatistics.userInvitationsTableObjectToShowFromServerResponse(
                                response[USER_INVITATIONS_KEY]);
                        tables[DATA_VALUE_COUNT_KEY] =
                            DataStatistics.dataValueCountsTableObjectToShowFromServerResponse(
                                response[DATA_VALUE_COUNT_KEY]);
                        tables[EVENT_COUNT_KEY] = DataStatistics.eventCountsTableObjectToShowFromServerResponse(
                            response[EVENT_COUNT_KEY]);

                        this.context.updateAppState({
                            showSnackbar: false,
                            pageState: {
                                loaded: true,
                                tables,
                                loading: false,
                            },
                        });
                    }
                }).catch(() => {
                    if (this.isPageMounted()) {
                        this.context.updateAppState({
                            showSnackbar: true,
                            snackbarConf: {
                                type: ERROR,
                                message: i18n.t(i18nKeys.dataStatistics.errorMessage),
                            },
                            pageState: {
                                loaded: true,
                                tables: {},
                                loading: false,
                            },
                        });
                    }
                });
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const nextState = {};

        Object.keys(nextProps).forEach((property) => {
            if (nextProps.hasOwnProperty(property) && DataStatistics.STATE_PROPERTIES.includes(property)) {
                nextState[property] = nextProps[property];
            }
        });

        if (nextState !== {}) {
            this.setState(nextState);
        }
    }

    hasTables = () =>
        this.state.tables && this.state.tables.constructor === Object && Object.keys(this.state.tables).length > 0;

    render() {
        const noContent = (
            <Card style={{ display: !this.state.loading ? 'block' : 'none' }}>
                <CardText>{i18n.t(i18nKeys.dataStatistics.noDataMessage)}</CardText>
            </Card>
        );

        return (
            <div>
                <h1 className={styles.header}>
                    {i18n.t(i18nKeys.dataStatistics.title)}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
                    />
                </h1>
                { this.hasTables() ?
                    (
                        <div className="row">
                            <div className="col-md-6">
                                { this.state.tables[OBJECT_COUNTS_KEY] &&
                                    <TableCard
                                        label={this.state.tables[OBJECT_COUNTS_KEY].label}
                                        elements={this.state.tables[OBJECT_COUNTS_KEY].elements}
                                    />
                                }
                                {this.state.tables[ACTIVE_USERS_KEY] &&
                                    <TableCard
                                        label={this.state.tables[ACTIVE_USERS_KEY].label}
                                        elements={this.state.tables[ACTIVE_USERS_KEY].elements}
                                    />
                                }
                            </div>
                            <div className="col-md-6">
                                {this.state.tables[USER_INVITATIONS_KEY] &&
                                    <TableCard
                                        label={this.state.tables[USER_INVITATIONS_KEY].label}
                                        elements={this.state.tables[USER_INVITATIONS_KEY].elements}
                                    />
                                }
                                {this.state.tables[DATA_VALUE_COUNT_KEY] &&
                                    <TableCard
                                        label={this.state.tables[DATA_VALUE_COUNT_KEY].label}
                                        elements={this.state.tables[DATA_VALUE_COUNT_KEY].elements}
                                    />
                                }
                                {this.state.tables[EVENT_COUNT_KEY] &&
                                    <TableCard
                                        label={this.state.tables[EVENT_COUNT_KEY].label}
                                        elements={this.state.tables[EVENT_COUNT_KEY].elements}
                                    />
                                }
                            </div>
                        </div>
                    ) : noContent
                }
            </div>
        );
    }
}

export default DataStatistics;
