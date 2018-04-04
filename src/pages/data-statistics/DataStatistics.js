import React from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';

import { LOADING, ERROR } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes';

import classNames from 'classnames';

import Page from '../Page';
import DataStatisticsTable from './DataStatisticsTable';

/* constants */
import PageHelper from '../../components/page-helper/PageHelper';
import { getDocsKeyForSection } from '../sections.conf';

// i18n
import { i18nKeys } from '../../i18n';

import styles from './DataStatistics.css';

const OBJECT_COUNTS_KEY = 'objectCounts';
const ACTIVE_USERS_KEY = 'activeUsers';
const USER_INVITATIONS_KEY = 'userInvitations';
const DATA_VALUE_COUNT_KEY = 'dataValueCount';
const EVENT_COUNT_KEY = 'eventCount';

const PENDING_INVITATION_ALL_KEY = 'all';
const EXPIRED_INVITATION_KEY = 'expired';

class DataStatistics extends Page {
    static STATE_PROPERTIES = [
        'tables',
        'loaded',
        'loading',
    ];

    constructor() {
        super();

        // state defaults
        this.state = {
            tables: [],
            loaded: false,
            loading: false,
        };
    }

    // auxiliar functions
    static objectCountsTableObjectToShowFromServerResponse = (objectCountsResponse, translator) => {
        if (objectCountsResponse) {
            const objectCountsKeys = Object.keys(objectCountsResponse);
            const objectCountsTable = {
                label: translator(i18nKeys.dataStatistics.objectType),
                elements: [],
            };

            for (let i = 0; i < objectCountsKeys.length; i++) {
                const key = objectCountsKeys[i];
                objectCountsTable.elements.push({
                    label: translator(i18nKeys.dataStatistics.objects[key]),
                    count: objectCountsResponse[key],
                });
            }

            return objectCountsTable;
        }

        return {};
    };

    static translatedTimeLabelFromIntProperty = (intProperty, translator) => {
        let label = translator(i18nKeys.dataStatistics.lastHour);
        if (intProperty === 1) {
            label = translator(i18nKeys.dataStatistics.today);
        } else if (intProperty > 0) {
            const lastLabel = translator(i18nKeys.dataStatistics.last);
            const daysLabel = translator(i18nKeys.dataStatistics.days);
            label = `${lastLabel} ${intProperty} ${daysLabel}`;
        }

        return label;
    };

    static activeUsersTableObjectToShowFromServerResponse = (activeUsersResponse, translator) => {
        if (activeUsersResponse) {
            const activeUsersKeys = Object.keys(activeUsersResponse);
            const activeUsersTable = {
                label: translator(i18nKeys.dataStatistics.usersLoggedIn),
                elements: [],
            };

            for (let i = 0; i < activeUsersKeys.length; i++) {
                const key = activeUsersKeys[i];
                activeUsersTable.elements.push({
                    label: DataStatistics.translatedTimeLabelFromIntProperty(parseInt(key, 10), translator),
                    count: activeUsersResponse[key],
                });
            }

            return activeUsersTable;
        }

        return {};
    };

    static userInvitationsTableObjectToShowFromServerResponse = (userInvitationsResponse, translator) => {
        if (userInvitationsResponse) {
            const userInvitationsTable = {
                label: translator(i18nKeys.dataStatistics.userAccountInvitations),
                elements: [],
            };

            if (userInvitationsResponse.hasOwnProperty(PENDING_INVITATION_ALL_KEY)) {
                userInvitationsTable.elements.push({
                    label: translator(i18nKeys.dataStatistics.pedingInvitations),
                    count: userInvitationsResponse[PENDING_INVITATION_ALL_KEY],
                });
            }

            if (userInvitationsResponse.hasOwnProperty(EXPIRED_INVITATION_KEY)) {
                userInvitationsTable.elements.push({
                    label: translator(i18nKeys.dataStatistics.expiredInvitations),
                    count: userInvitationsResponse[EXPIRED_INVITATION_KEY],
                });
            }

            return userInvitationsTable;
        }

        return {};
    };

    static dataValueCountsTableObjectToShowFromServerResponse = (dataValueCountsResponse, translator) => {
        if (dataValueCountsResponse) {
            const dataValueCountsKeys = Object.keys(dataValueCountsResponse);
            const dataValueCountsTable = {
                label: translator(i18nKeys.dataStatistics.dataValues),
                elements: [],
            };

            for (let i = 0; i < dataValueCountsKeys.length; i++) {
                const key = dataValueCountsKeys[i];
                dataValueCountsTable.elements.push({
                    label: DataStatistics.translatedTimeLabelFromIntProperty(parseInt(key, 10), translator),
                    count: dataValueCountsResponse[key],
                });
            }

            return dataValueCountsTable;
        }

        return {};
    };

    static eventCountsTableObjectToShowFromServerResponse = (eventCountsResponse, translator) => {
        if (eventCountsResponse) {
            const eventCountsKeys = Object.keys(eventCountsResponse);
            const eventCountsTable = {
                label: translator(i18nKeys.dataStatistics.events),
                elements: [],
            };

            for (let i = 0; i < eventCountsKeys.length; i++) {
                const key = eventCountsKeys[i];
                eventCountsTable.elements.push({
                    label: DataStatistics.translatedTimeLabelFromIntProperty(parseInt(key, 10), translator),
                    count: eventCountsResponse[key],
                });
            }

            return eventCountsTable;
        }

        return {};
    };

    componentDidMount() {
        const translator = this.context.translator;
        const api = this.context.d2.Api.getApi();

        // request to GET statistics
        if (!this.state.loading && !this.state.loaded) {
            this.context.updateAppState({
                showSnackbar: true,
                snackbarConf: {
                    type: LOADING,
                    message: translator(i18nKeys.dataStatistics.loadingMessage),
                },
                pageState: {
                    loaded: false,
                    tables: [],
                    loading: true,
                },
            });

            if (api) {
                api.get('dataSummary').then((response) => {
                    if (this.isPageMounted()) {
                        const tables = [
                            DataStatistics.objectCountsTableObjectToShowFromServerResponse(
                                response[OBJECT_COUNTS_KEY], translator),
                            DataStatistics.activeUsersTableObjectToShowFromServerResponse(
                                response[ACTIVE_USERS_KEY], translator),
                            DataStatistics.userInvitationsTableObjectToShowFromServerResponse(
                                response[USER_INVITATIONS_KEY], translator),
                            DataStatistics.dataValueCountsTableObjectToShowFromServerResponse(
                                response[DATA_VALUE_COUNT_KEY], translator),
                            DataStatistics.eventCountsTableObjectToShowFromServerResponse(
                                response[EVENT_COUNT_KEY], translator),
                        ];
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
                                message: translator(i18nKeys.dataStatistics.errorMessage),
                            },
                            pageState: {
                                loaded: true,
                                tables: [],
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

    render() {
        const translator = this.context.translator;
        const noContent = (
            <Card style={{ display: !this.state.loading ? 'block' : 'none' }}>
                <CardText>{translator(i18nKeys.dataStatistics.noDataMessage)}</CardText>
            </Card>
        );

        const tables = this.state.tables.map((table) => {
            if (table && table.label && table.elements.length > 0) {
                return (
                    <Card className={classNames(styles.card, 'data-statistics-table')} key={table.label}>
                        <DataStatisticsTable
                            label={table.label}
                            elements={table.elements}
                        />
                    </Card>
                );
            }
            return null;
        }).filter(table => table && !table.empty);

        const content = tables && tables.length > 0 ? tables : noContent;
        return (
            <div className={styles.maxWith}>
                <h1 className={styles.header}>
                    {translator(i18nKeys.dataStatistics.title)}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
                    />
                </h1>
                {content}
            </div>
        );
    }
}

export default DataStatistics;
