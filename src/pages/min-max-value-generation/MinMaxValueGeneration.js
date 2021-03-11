import { OrganisationUnitTree, Button, Card } from '@dhis2/ui'
import {
    LOADING,
    SUCCESS,
    ERROR,
} from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes'
import React from 'react'
import PageHelper from '../../components/page-helper/PageHelper'
import { i18nKeys } from '../../i18n'
import i18n from '../../locales'
import Page from '../Page'
import { getDocsKeyForSection } from '../sections.conf'
import styles from './MinMaxValueGeneration.module.css'

const MIX_MAX_VALUE_ENDPOINT = '/minMaxValues'

const orgIdFromPath = path => {
    const last = array => array[array.length - 1]

    return last(path.split('/'))
}

class MinMaxValueGeneration extends Page {
    constructor() {
        super()

        this.state = {
            selected: [],
            dataSets: null,
            roots: null,
            dataSetsSelectedCount: 0,
        }
    }

    componentDidMount() {
        this.loadData()
    }

    isUserInteractionDisabled() {
        return (
            this.props.loading ||
            this.state.dataSets == null ||
            this.state.roots === null
        )
    }

    isFormValid = () => {
        return (
            this.state.dataSetsSelectedCount > 0 &&
            this.state.selected.length > 0
        )
    }

    loadData() {
        const d2 = this.context.d2
        if (this.state.dataSets == null || this.state.roots == null) {
            Promise.all([
                d2.models.organisationUnits.list({
                    paging: false,
                    level: 1,
                    fields: 'id',
                }),
                d2.models.dataSet.list({
                    paging: false,
                    fields: 'id,displayName',
                }),
            ])
                .then(([rootsResponse, dataSetsResponse]) => {
                    if (this.isPageMounted()) {
                        this.setState({
                            roots: rootsResponse.toArray(),
                            dataSets: dataSetsResponse.toArray(),
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
                                loading: false,
                            },
                        })
                    }
                })
        }
    }

    dataSetsSelectRef = ref => {
        this.dataSetsSelect = ref
    }

    dataSetsSelectClick = () => {
        this.setState({
            dataSetsSelectedCount: this.dataSetsSelect.selectedOptions.length,
        })
    }

    handleOrgUnitChange = ({ path, checked }) => {
        if (checked) {
            this.setState({ selected: [path] })
        } else {
            this.setState({ selected: [] })
        }
    }

    handleGenerateMinMaxValue = () => {
        const selectedOrganisationUnit = orgIdFromPath(this.state.selected[0])
        const dataSetIds = Array.from(this.dataSetsSelect.selectedOptions).map(
            ({ value }) => value
        )

        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: i18n.t(
                    i18nKeys.minMaxValueGeneration.performingMessage
                ),
            },
            pageState: {
                loading: true,
            },
        })

        const api = this.context.d2.Api.getApi()
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
                            loading: false,
                        },
                    })
                }
            })
    }

    handleRemoveMinMaxValue = () => {
        const selectedOrganisationUnit = orgIdFromPath(this.state.selected[0])
        const dataSetIds = Array.from(this.dataSetsSelect.selectedOptions).map(
            ({ value }) => value
        )

        this.context.updateAppState({
            showSnackbar: true,
            snackbarConf: {
                type: LOADING,
                message: i18n.t(i18nKeys.minMaxValueGeneration.removingMessage),
            },
            pageState: {
                loading: true,
            },
        })

        const api = this.context.d2.Api.getApi()
        api.delete(
            `${MIX_MAX_VALUE_ENDPOINT}/${selectedOrganisationUnit}?ds=${dataSetIds}`
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
                <Card className={styles.card}>
                    <div className={styles.container}>
                        {this.state.dataSets ? (
                            <div className={styles.left}>
                                <div className={styles.label}>
                                    {i18n.t(
                                        i18nKeys.minMaxValueGeneration.dataSet
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
                        {this.state.roots ? (
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
                                        roots={this.state.roots.map(r => r.id)}
                                        selected={this.state.selected}
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
                    <Button
                        primary
                        className={styles.actionButton}
                        onClick={this.handleGenerateMinMaxValue}
                        disabled={
                            this.isUserInteractionDisabled() ||
                            !this.isFormValid()
                        }
                    >
                        {i18n.t(i18nKeys.minMaxValueGeneration.actionButton)}
                    </Button>
                    <Button
                        secondary
                        onClick={this.handleRemoveMinMaxValue}
                        disabled={
                            this.isUserInteractionDisabled() ||
                            !this.isFormValid()
                        }
                    >
                        {i18n.t(i18nKeys.minMaxValueGeneration.removeButton)}
                    </Button>
                </Card>
            </div>
        )
    }
}

export default MinMaxValueGeneration
