import React from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import { LOADING, SUCCESS, ERROR, WARNING } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes';

import OrgUnitTree from 'd2-ui/lib/org-unit-tree/OrgUnitTree.component';

import Page from '../Page';

import styles from './MinMaxValueGeneration.css';

import PageHelper from '../../components/page-helper/PageHelper';
import { getDocsKeyForSection } from '../sections.conf';

// i18n
import { i18nKeys } from '../../i18n';

const MIX_MAX_VALUE_ENDPOINT = '/minMaxValues';

class MinMaxValueGeneration extends Page {
    static STATE_PROPERTIES = [
        'selected',
        'dataSets',
        'rootWithMember',
        'loading',
        'dataSetsSelectedCount',
    ]

    constructor() {
        super();

        this.state = {
            selected: [],
            dataSets: null,
            rootWithMember: null,
            loading: false,
            dataSetsSelectedCount: 1,
        };

        this.handleOrgUnitClick = this.handleOrgUnitClick.bind(this);
        this.dataSetsSelectRef = this.dataSetsSelectRef.bind(this);
        this.dataSetsSelectClick = this.dataSetsSelectClick.bind(this);
        this.generateMinMaxValueClick = this.generateMinMaxValueClick.bind(this);
        this.removeMinMaxValueClick = this.removeMinMaxValueClick.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    componentWillReceiveProps(nextProps) {
        const nextState = {};

        Object.keys(nextProps).forEach((property) => {
            if (nextProps.hasOwnProperty(property) && MinMaxValueGeneration.STATE_PROPERTIES.includes(property)) {
                nextState[property] = nextProps[property];
            }
        });

        if (nextState !== {}) {
            this.setState(nextState);
        }
    }

    isUserInteractionDisabled() {
        return this.state.loading || this.state.dataSets == null || this.state.rootWithMembers === null;
    }

    isDataSetSelected() {
        return this.state.dataSetsSelectedCount === 0;
    }

    loadData() {
        const translator = this.context.translator;
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
                        snackbarConf: {
                            type: ERROR,
                            message: translator(i18nKeys.minMaxValueGeneration.notPossibleToLoadMessage),
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

    dataSetsSelectRef(ref) {
        this.dataSetsSelect = ref;
    }

    dataSetsSelectClick() {
        this.setState({
            dataSetsSelectedCount: this.dataSetsSelect.selectedOptions.length,
        });
    }

    handleOrgUnitClick(event, orgUnit) {
        if (!this.state.selected.includes(orgUnit.path)) {
            this.setState({ selected: [orgUnit.path] });
        }
    }

    generateMinMaxValueClick() {
        const translator = this.context.translator;
        if (this.dataSetsSelect.selectedOptions.length === 0 || this.state.selected.length === 0) {
            this.context.updateAppState({
                showSnackbar: true,
                snackbarConf: {
                    type: WARNING,
                    message: translator(i18nKeys.minMaxValueGeneration.warningMessage),
                },
                pageState: {
                    ...this.state,
                    loading: false,
                },
            });
            return;
        }

        const api = this.context.d2.Api.getApi();
        const selectedOrganisationUnitSplitted = this.state.selected[0].split('/');
        const selectedOrganisationUnit = selectedOrganisationUnitSplitted[selectedOrganisationUnitSplitted.length - 1];
        const dataSetIds = [];
        for (let i = 0; i < this.dataSetsSelect.selectedOptions.length; i++) {
            dataSetIds.push(this.dataSetsSelect.selectedOptions[i].value);
        }

        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: translator(i18nKeys.minMaxValueGeneration.performingMessage),
            },
            pageState: {
                ...this.state,
                loading: true,
            },
        });

        api.post(MIX_MAX_VALUE_ENDPOINT, {
            organisationUnit: selectedOrganisationUnit,
            dataSets: dataSetIds,
        }).then(() => {
            if (this.isPageMounted()) {
                this.context.updateAppState({
                    showSnackbar: true,
                    snackbarConf: {
                        type: SUCCESS,
                        message: translator(i18nKeys.minMaxValueGeneration.minMaxGenerationDone),
                    },
                    pageState: {
                        ...this.state,
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
                        message: translator(i18nKeys.messages.unexpectedError),
                    },
                    pageState: {
                        ...this.state,
                        loading: false,
                    },
                });
            }
        });
    }

    removeMinMaxValueClick() {
        const translator = this.context.translator;
        if (this.dataSetsSelect.selectedOptions.length === 0 || this.state.selected.length === 0) {
            this.context.updateAppState({
                showSnackbar: true,
                snackbarConf: {
                    type: WARNING,
                    message: translator(i18nKeys.minMaxValueGeneration.warningMessage),
                },
                pageState: {
                    ...this.state,
                    loading: false,
                },
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
            snackbarConf: {
                type: LOADING,
                message: translator(i18nKeys.minMaxValueGeneration.removingMessage),
            },
            pageState: {
                ...this.state,
                loading: true,
            },
        });

        api.delete(`${MIX_MAX_VALUE_ENDPOINT}/${selectedOrgnisationUnit}?ds=${dataSetIds}`).then(() => {
            if (this.isPageMounted()) {
                this.context.updateAppState({
                    showSnackbar: true,
                    snackbarConf: {
                        type: SUCCESS,
                        message: translator(i18nKeys.minMaxValueGeneration.minMaxRemovalDone),
                    },
                    pageState: {
                        ...this.state,
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
                        message: translator(i18nKeys.messages.unexpectedError),
                    },
                    pageState: {
                        ...this.state,
                        loading: false,
                    },
                });
            }
        });
    }

    render() {
        const translator = this.context.translator;
        return (
            <div>
                <h1 className={styles.header}>
                    {translator(i18nKeys.minMaxValueGeneration.title)}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
                    />
                </h1>
                <Card>
                    <CardText>
                        <div className={styles.container}>
                            {this.state.dataSets ? (
                                <div className={styles.left}>
                                    <div className={styles.label}>
                                        {translator(i18nKeys.minMaxValueGeneration.dataSet)}
                                    </div>
                                    <select
                                        multiple
                                        onClick={this.dataSetsSelectClick}
                                        disabled={this.isUserInteractionDisabled()}
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
                                    </select>
                                </div>) :
                                (
                                    <div className={styles.left}>
                                        <span>{translator(i18nKeys.minMaxValueGeneration.loadingDataSetsMessage)}</span>
                                    </div>
                                )
                            }
                            {this.state.rootWithMembers ? (
                                <div className={styles.right}>
                                    <div className={styles.label}>
                                        {translator(i18nKeys.minMaxValueGeneration.organisationUnitSelect)}
                                    </div>
                                    <div className={styles.tree}>
                                        <OrgUnitTree
                                            className={styles.tree}
                                            hideMemberCount
                                            root={this.state.rootWithMembers}
                                            selected={this.state.selected}
                                            initiallyExpanded={[`/${this.state.rootWithMembers.id}`]}
                                            onSelectClick={this.handleOrgUnitClick}
                                        />
                                    </div>
                                </div>) :
                                (
                                    <div className={styles.right}>
                                        <span>{translator(i18nKeys.minMaxValueGeneration.updatingTree)}</span>
                                    </div>
                                )}
                        </div>
                        <RaisedButton
                            id={'generateMinMaxBtnId'}
                            className={styles.actionButton}
                            primary
                            label={translator(i18nKeys.minMaxValueGeneration.actionButton)}
                            onClick={this.generateMinMaxValueClick}
                            disabled={this.isUserInteractionDisabled() || this.isDataSetSelected()}
                        />
                        <FlatButton
                            id={'removeMinMaxBtnId'}
                            className={styles.actionButton}
                            secondary
                            label={translator(i18nKeys.minMaxValueGeneration.removeButton)}
                            onClick={this.removeMinMaxValueClick}
                            disabled={this.isUserInteractionDisabled() || this.isDataSetSelected()}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default MinMaxValueGeneration;
