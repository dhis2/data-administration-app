import { OrganisationUnitTree } from '@dhis2/ui'
import {
    LOADING,
    SUCCESS,
    ERROR,
    WARNING,
} from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes'
import { Card, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import React from 'react'
import PageHelper from '../../components/page-helper/PageHelper'
import { i18nKeys } from '../../i18n'
import i18n from '../../locales'
import Page from '../Page'
import { getDocsKeyForSection } from '../sections.conf'
import styles from './MinMaxValueGeneration.module.css'

const MIX_MAX_VALUE_ENDPOINT = '/minMaxValues'

class MinMaxValueGeneration extends Page {
    static STATE_PROPERTIES = [
        'selected',
        'dataSets',
        'rootWithMember',
        'loading',
        'dataSetsSelectedCount',
    ]

    constructor() {
        super()

        this.state = {
            selected: [],
            dataSets: null,
            rootWithMember: null,
            loading: false,
            dataSetsSelectedCount: 1,
        }

        this.dataSetsSelectRef = this.dataSetsSelectRef.bind(this)
        this.dataSetsSelectClick = this.dataSetsSelectClick.bind(this)
        this.generateMinMaxValueClick = this.generateMinMaxValueClick.bind(this)
        this.removeMinMaxValueClick = this.removeMinMaxValueClick.bind(this)
    }

    componentDidMount() {
        this.loadData()
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const nextState = {}

        Object.keys(nextProps).forEach(property => {
            if (MinMaxValueGeneration.STATE_PROPERTIES.includes(property)) {
                nextState[property] = nextProps[property]
            }
        })

        this.setState(nextState)
    }

    isUserInteractionDisabled() {
        return (
            this.state.loading ||
            this.state.dataSets == null ||
            this.state.rootWithMembers === null
        )
    }

    isDataSetSelected() {
        return this.state.dataSetsSelectedCount === 0
    }

    loadData() {
        const d2 = this.context.d2
        if (this.state.dataSets == null || this.state.rootWithMember == null) {
            Promise.all([
                d2.models.organisationUnits.list({
                    paging: false,
                    level: 1,
                    fields:
                        'id,displayName,path,children::isNotEmpty,memberCount',
                }),
                d2.models.dataSet.list({
                    paging: false,
                    fields: 'id,displayName',
                }),
            ])
                .then(([organisationUnitsResponse, dataSetsResponse]) => {
                    if (this.isPageMounted()) {
                        const organisationUnits = organisationUnitsResponse.toArray()
                        const selected = organisationUnits.map(ou => ou.path)
                        this.setState({
                            rootWithMembers: organisationUnits[0],
                            dataSets: dataSetsResponse.toArray(),
                            selected,
                        })
                    }
                })
                .catch(() => {
                    if (this.isPageMounted()) {
                        this.context.updateAppState({
                            showSnackbar: true,
                            snackbarConf: {
                                type: ERROR,
                                message: i18n.t(
                                    i18nKeys.minMaxValueGeneration
                                        .notPossibleToLoadMessage
                                ),
                            },
                            pageState: {
                                ...this.state,
                                loading: false,
                            },
                        })
                    }
                })
        }
    }

    dataSetsSelectRef(ref) {
        this.dataSetsSelect = ref
    }

    dataSetsSelectClick() {
        this.setState({
            dataSetsSelectedCount: this.dataSetsSelect.selectedOptions.length,
        })
    }

    handleOrgUnitChange = ({ path }) => {
        if (!this.state.selected.includes(path)) {
            this.setState({ selected: [path] })
        }
    }

    generateMinMaxValueClick() {
        if (
            this.dataSetsSelect.selectedOptions.length === 0 ||
            this.state.selected.length === 0
        ) {
            this.context.updateAppState({
                showSnackbar: true,
                snackbarConf: {
                    type: WARNING,
                    message: i18n.t(
                        i18nKeys.minMaxValueGeneration.warningMessage
                    ),
                },
                pageState: {
                    ...this.state,
                    loading: false,
                },
            })
            return
        }

        const api = this.context.d2.Api.getApi()
        const selectedOrganisationUnitSplitted = this.state.selected[0].split(
            '/'
        )
        const selectedOrganisationUnit =
            selectedOrganisationUnitSplitted[
                selectedOrganisationUnitSplitted.length - 1
            ]
        const dataSetIds = []
        for (let i = 0; i < this.dataSetsSelect.selectedOptions.length; i++) {
            dataSetIds.push(this.dataSetsSelect.selectedOptions[i].value)
        }

        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: i18n.t(
                    i18nKeys.minMaxValueGeneration.performingMessage
                ),
            },
            pageState: {
                ...this.state,
                loading: true,
            },
        })

        api.post(MIX_MAX_VALUE_ENDPOINT, {
            organisationUnit: selectedOrganisationUnit,
            dataSets: dataSetIds,
        })
            .then(() => {
                if (this.isPageMounted()) {
                    this.context.updateAppState({
                        showSnackbar: true,
                        snackbarConf: {
                            type: SUCCESS,
                            message: i18n.t(
                                i18nKeys.minMaxValueGeneration
                                    .minMaxGenerationDone
                            ),
                        },
                        pageState: {
                            ...this.state,
                            loading: false,
                        },
                    })
                }
            })
            .catch(() => {
                if (this.isPageMounted()) {
                    this.context.updateAppState({
                        showSnackbar: true,
                        snackbarConf: {
                            type: ERROR,
                            message: i18n.t(i18nKeys.messages.unexpectedError),
                        },
                        pageState: {
                            ...this.state,
                            loading: false,
                        },
                    })
                }
            })
    }

    removeMinMaxValueClick() {
        if (
            this.dataSetsSelect.selectedOptions.length === 0 ||
            this.state.selected.length === 0
        ) {
            this.context.updateAppState({
                showSnackbar: true,
                snackbarConf: {
                    type: WARNING,
                    message: i18n.t(
                        i18nKeys.minMaxValueGeneration.warningMessage
                    ),
                },
                pageState: {
                    ...this.state,
                    loading: false,
                },
            })
            return
        }

        const api = this.context.d2.Api.getApi()
        const selectedOrganisationUnitSplitted = this.state.selected[0].split(
            '/'
        )
        const selectedOrgnisationUnit =
            selectedOrganisationUnitSplitted[
                selectedOrganisationUnitSplitted.length - 1
            ]
        const dataSetIds = []
        for (let i = 0; i < this.dataSetsSelect.selectedOptions.length; i++) {
            dataSetIds.push(this.dataSetsSelect.selectedOptions[i].value)
        }

        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: i18n.t(i18nKeys.minMaxValueGeneration.removingMessage),
            },
            pageState: {
                ...this.state,
                loading: true,
            },
        })

        api.delete(
            `${MIX_MAX_VALUE_ENDPOINT}/${selectedOrgnisationUnit}?ds=${dataSetIds}`
        )
            .then(() => {
                if (this.isPageMounted()) {
                    this.context.updateAppState({
                        showSnackbar: true,
                        snackbarConf: {
                            type: SUCCESS,
                            message: i18n.t(
                                i18nKeys.minMaxValueGeneration.minMaxRemovalDone
                            ),
                        },
                        pageState: {
                            ...this.state,
                            loading: false,
                        },
                    })
                }
            })
            .catch(() => {
                if (this.isPageMounted()) {
                    this.context.updateAppState({
                        showSnackbar: true,
                        snackbarConf: {
                            type: ERROR,
                            message: i18n.t(i18nKeys.messages.unexpectedError),
                        },
                        pageState: {
                            ...this.state,
                            loading: false,
                        },
                    })
                }
            })
    }

    render() {
        return (
            <div>
                <h1 className={styles.header}>
                    {i18n.t(i18nKeys.minMaxValueGeneration.title)}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(
                            this.props.sectionKey
                        )}
                    />
                </h1>
                <Card>
                    <CardText>
                        <div className={styles.container}>
                            {this.state.dataSets ? (
                                <div className={styles.left}>
                                    <div className={styles.label}>
                                        {i18n.t(
                                            i18nKeys.minMaxValueGeneration
                                                .dataSet
                                        )}
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
                                            >
                                                {item.displayName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className={styles.left}>
                                    <span>
                                        {i18n.t(
                                            i18nKeys.minMaxValueGeneration
                                                .loadingDataSetsMessage
                                        )}
                                    </span>
                                </div>
                            )}
                            {this.state.rootWithMembers ? (
                                <div className={styles.right}>
                                    <div className={styles.label}>
                                        {i18n.t(
                                            i18nKeys.minMaxValueGeneration
                                                .organisationUnitSelect
                                        )}
                                    </div>
                                    <div className={styles.tree}>
                                        <OrganisationUnitTree
                                            className={styles.tree}
                                            roots={[this.state.rootWithMembers]}
                                            selected={this.state.selected}
                                            initiallyExpanded={[
                                                `/${this.state.rootWithMembers.id}`,
                                            ]}
                                            onChange={this.handleOrgUnitChange}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.right}>
                                    <span>
                                        {i18n.t(
                                            i18nKeys.minMaxValueGeneration
                                                .updatingTree
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                        <RaisedButton
                            id={'generateMinMaxBtnId'}
                            className={styles.actionButton}
                            primary
                            label={i18n.t(
                                i18nKeys.minMaxValueGeneration.actionButton
                            )}
                            onClick={this.generateMinMaxValueClick}
                            disabled={
                                this.isUserInteractionDisabled() ||
                                this.isDataSetSelected()
                            }
                        />
                        <FlatButton
                            id={'removeMinMaxBtnId'}
                            className={styles.actionButton}
                            secondary
                            label={i18n.t(
                                i18nKeys.minMaxValueGeneration.removeButton
                            )}
                            onClick={this.removeMinMaxValueClick}
                            disabled={
                                this.isUserInteractionDisabled() ||
                                this.isDataSetSelected()
                            }
                        />
                    </CardText>
                </Card>
            </div>
        )
    }
}

export default MinMaxValueGeneration
