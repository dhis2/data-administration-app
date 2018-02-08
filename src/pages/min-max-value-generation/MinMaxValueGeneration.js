import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import Paper from 'material-ui/Paper/Paper';
import { Card, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';

import Page from '../Page';
import { LOADING, SUCCESS, ERROR, WARNING } from '../../components/feedback-snackbar/SnackbarTypes';

import styles from './MinMaxValueGeneration.css';

const MIX_MAX_VALUE_ENDPOINT = '/minMaxValues';

const STATE_PROPERTIES_WHITE_LIST = [
    'selected',
    'dataSets',
    'rootWithMember',
];

class MinMaxValueGeneration extends Page {
    static propTypes = {
        pageInfo: PropTypes.object.isRequired,
    }

    constructor() {
        super();

        this.state = {
            selected: [],
            dataSets: null,
            rootWithMember: null,
        };

        this.handleOrgUnitClick = this.handleOrgUnitClick.bind(this);
        this.dataSetsSelectRef = this.dataSetsSelectRef.bind(this);
        this.generateMinMaxValueClick = this.generateMinMaxValueClick.bind(this);
        this.removeMinMaxValueClick = this.removeMinMaxValueClick.bind(this);
    }

    componentDidMount() {
        this.loadData();
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

    areActionsDisabled() {
        return this.context.loading || this.state.dataSets == null || this.state.rootWithMembers === null;
    }

    loadData() {
        const t = this.context.t;
        const d2 = this.context.d2;
        if (this.state.dataSets == null || this.state.rootWithMember == null) {
            Promise.all([
                d2.models.organisationUnits.list({
                    paging: false,
                    level: 1,
                    fields: 'id,displayName,path,children::isNotEmpty,memberCount',
                }),
                d2.models.dataSet.list({
                    paging: false,
                    fields: 'id,displayName',
                }),
            ]).then(([organisationUnitsResponse, dataSetsResponse]) => {
                if (this.isPageMounted()) {
                    const organisationUnits = organisationUnitsResponse.toArray();
                    const selected = organisationUnits.map(ou => ou.path);
                    this.setState({
                        rootWithMembers: organisationUnits[0],
                        dataSets: dataSetsResponse.toArray(),
                        selected,
                    });
                }
            }).catch(() => {
                if (this.isPageMounted()) {
                    this.context.updateAppState({
                        showSnackbar: true,
                        loading: false,
                        snackbarConf: {
                            type: ERROR,
                            message: t('It was not possible to load data'),
                        },
                        pageState: { ...this.state },
                    });
                }
            });
        }
    }

    dataSetsSelectRef(ref) {
        this.dataSetsSelect = ref;
    }

    handleOrgUnitClick(event, orgUnit) {
        if (!this.state.selected.includes(orgUnit.path)) {
            this.setState({ selected: [orgUnit.path] });
        }
    }

    generateMinMaxValueClick() {
        const t = this.context.t;
        if (this.dataSetsSelect.selectedOptions.length === 0 || this.state.selected.length === 0) {
            this.context.updateAppState({
                showSnackbar: true,
                loading: false,
                snackbarConf: {
                    type: WARNING,
                    message: t('Select Data set and Organisation Unit'),
                },
                pageState: { ...this.state },
            });
            return;
        }

        const api = this.context.d2.Api.getApi();
        const selectedOrganisationUnitSplitted = this.state.selected[0].split('/');
        const selectedOrgnisationUnit = selectedOrganisationUnitSplitted[selectedOrganisationUnitSplitted.length - 1];
        const dataSetIds = [];
        for (let i = 0; i < this.dataSetsSelect.selectedOptions.length; i++) {
            dataSetIds.push(this.dataSetsSelect.selectedOptions[i].value);
        }

        this.context.updateAppState({
            showSnackbar: true,
            loading: true,
            snackbarConf: {
                type: LOADING,
                message: t('Doing Min Max generation'),
            },
            pageState: { ...this.state },
        });

        api.post(MIX_MAX_VALUE_ENDPOINT, {
            organisationUnit: selectedOrgnisationUnit,
            dataSets: dataSetIds,
        }).then(() => {
            if (this.isPageMounted()) {
                this.context.updateAppState({
                    showSnackbar: true,
                    loading: false,
                    snackbarConf: {
                        type: SUCCESS,
                        message: t('Min Max generation done'),
                    },
                    pageState: { ...this.state },
                });
            }
        }).catch(() => {
            if (this.isPageMounted()) {
                this.context.updateAppState({
                    showSnackbar: true,
                    loading: false,
                    snackbarConf: {
                        type: ERROR,
                        message: t('It was not possible to do your request'),
                    },
                    pageState: { ...this.state },
                });
            }
        });
    }

    removeMinMaxValueClick() {
        const t = this.context.t;
        if (this.dataSetsSelect.selectedOptions.length === 0 || this.state.selected.length === 0) {
            this.context.updateAppState({
                showSnackbar: true,
                loading: false,
                snackbarConf: {
                    type: WARNING,
                    message: t('Select Data set and Organisation Unit'),
                },
                pageState: { ...this.state },
            });
            return;
        }

        const api = this.context.d2.Api.getApi();
        const selectedOrganisationUnitSplitted = this.state.selected[0].split('/');
        const selectedOrgnisationUnit = selectedOrganisationUnitSplitted[selectedOrganisationUnitSplitted.length - 1];
        const dataSetIds = [];
        for (let i = 0; i < this.dataSetsSelect.selectedOptions.length; i++) {
            dataSetIds.push(this.dataSetsSelect.selectedOptions[i].value);
        }

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.context.updateAppState({
            showSnackbar: true,
            loading: true,
            snackbarConf: {
                type: LOADING,
                message: t('Removing Min Max generation'),
            },
            pageState: { ...this.state },
        });

        api.post(`${MIX_MAX_VALUE_ENDPOINT}/remove`, {
            organisationUnit: selectedOrgnisationUnit,
            dataSets: dataSetIds,
        }).then(() => {
            if (this.isPageMounted()) {
                this.context.updateAppState({
                    showSnackbar: true,
                    loading: false,
                    snackbarConf: {
                        type: SUCCESS,
                        message: t('Min Max removal done'),
                    },
                    pageState: { ...this.state },
                });
            }
        }).catch(() => {
            if (this.isPageMounted()) {
                this.context.updateAppState({
                    showSnackbar: true,
                    loading: false,
                    snackbarConf: {
                        type: ERROR,
                        message: t('It was not possible to do your request'),
                    },
                    pageState: { ...this.state },
                });
            }
        });
    }

    render() {
        const t = this.context.t;
        return (
            <div className="page-wrapper">
                <h1>{this.context.t(this.props.pageInfo.label)}</h1>
                <Card>
                    <CardText>
                        <div className={styles.container}>
                            <div className={styles.left}>
                                <Paper className={styles.paper}>
                                    {this.state.dataSets ? (
                                        <select
                                            multiple
                                            disabled={this.areActionsDisabled()}
                                            className={styles.select}
                                            ref={this.dataSetsSelectRef}
                                        >
                                            {this.state.dataSets.map(item => (
                                                <option
                                                    key={item.id}
                                                    value={item.id}
                                                    className={styles.options}
                                                >{item.displayName}</option>
                                            ))}
                                        </select>) :
                                        (
                                            <span>{t('Loading data sets')}</span>
                                        )
                                    }
                                </Paper>
                            </div>
                            <div className={styles.right}>
                                {this.state.rootWithMembers ? (
                                    <OrgUnitTree
                                        hideMemberCount={Boolean(true)}
                                        root={this.state.rootWithMembers}
                                        selected={this.state.selected}
                                        initiallyExpanded={[`/${this.state.rootWithMembers.id}`]}
                                        onSelectClick={this.handleOrgUnitClick}
                                    />) :
                                    (
                                        <span>{t('Updating Organisation Units Tree...')}</span>
                                    )}
                            </div>
                        </div>
                        <RaisedButton
                            className={styles.actionButton}
                            primary={Boolean(true)}
                            label={t('GENERATE')}
                            onClick={this.generateMinMaxValueClick}
                            disabled={this.areActionsDisabled()}
                        />
                        <FlatButton
                            className={styles.actionButton}
                            secondary={Boolean(true)}
                            label={t('REMOVE')}
                            onClick={this.removeMinMaxValueClick}
                            disabled={this.areActionsDisabled()}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default MinMaxValueGeneration;
