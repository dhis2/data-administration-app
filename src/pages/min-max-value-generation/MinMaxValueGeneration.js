import i18n from '@dhis2/d2-i18n'
import {
    CenteredContent,
    CircularLoader,
    NoticeBox,
    OrganisationUnitTree,
    ButtonStrip,
    Button,
    Card,
} from '@dhis2/ui'
import { getInstance as getD2Instance } from 'd2'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import { i18nKeys } from '../../i18n-keys'
import { withAlerts } from '../../with-alerts'
import styles from './MinMaxValueGeneration.module.css'

const MIN_MAX_VALUE_ENDPOINT = '/minMaxValues'

const organisationIdFromPath = path => {
    const last = array => array[array.length - 1]

    return last(path.split('/'))
}

class MinMaxValueGeneration extends Component {
    static propTypes = {
        alert: PropTypes.object.isRequired,
        sectionKey: PropTypes.string.isRequired,
    }

    state = {
        loading: true,
        error: null,
        selectedOrganisationUnit: null,
        dataSets: null,
        roots: null,
        dataSetsSelectedCount: 0,
    }

    componentDidMount() {
        this.loadData()
    }

    isUserInteractionDisabled() {
        return (
            this.state.loading ||
            this.state.dataSets == null ||
            this.state.roots === null
        )
    }

    isFormValid = () => {
        return (
            this.state.dataSetsSelectedCount > 0 &&
            this.state.selectedOrganisationUnit !== null
        )
    }

    loadData = async () => {
        const d2 = await getD2Instance()

        try {
            const [rootsResponse, dataSetsResponse] = await Promise.all([
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
            this.setState({
                roots: rootsResponse.toArray(),
                dataSets: dataSetsResponse.toArray(),
            })
        } catch (error) {
            this.setState({
                error: i18n.t('Error loading data'),
            })
        }

        this.setState({
            loading: false,
        })
    }

    dataSetsSelectRef = ref => {
        this.dataSetsSelect = ref
    }

    dataSetsSelectClick = () => {
        this.setState({
            dataSetsSelectedCount: this.dataSetsSelect.selectedOptions.length,
        })
    }

    getDataSetIds = () =>
        Array.from(this.dataSetsSelect.selectedOptions).map(
            ({ value }) => value
        )

    handleOrganisationUnitChange = ({ path, checked }) => {
        if (checked) {
            this.setState({
                selectedOrganisationUnit: {
                    path,
                    id: organisationIdFromPath(path),
                },
            })
        } else {
            this.setState({ selectedOrganisationUnit: null })
        }
    }

    handleGenerateMinMaxValue = async () => {
        this.props.alert.show({
            message: i18n.t('Generating min-max values...'),
            success: true,
        })

        const d2 = await getD2Instance()
        const api = d2.Api.getApi()

        try {
            await api.post(MIN_MAX_VALUE_ENDPOINT, {
                organisationUnit: this.state.selectedOrganisationUnit.id,
                dataSets: this.getDataSetIds(),
            })
            this.props.alert.show({
                message: i18n.t('Min-max values generated'),
                success: true,
            })
        } catch (error) {
            this.props.alert.show({
                message: i18n.t('Error generating min-max values'),
                critical: true,
            })
        }
    }

    handleRemoveMinMaxValue = async () => {
        this.props.alert.show({
            message: i18n.t('Removing min-max values...'),
            success: true,
        })

        const dataSetIds = this.getDataSetIds()
        const d2 = await getD2Instance()
        const api = d2.Api.getApi()

        try {
            await api.delete(
                `${MIN_MAX_VALUE_ENDPOINT}/${this.state.selectedOrganisationUnit.id}?ds=${dataSetIds}`
            )
            this.props.alert.show({
                message: i18n.t('Min-max values removed'),
                success: true,
            })
        } catch (error) {
            this.props.alert.show({
                message: i18n.t('Error removing min-max values'),
                critical: true,
            })
        }
    }

    renderForm() {
        return (
            <Card className={styles.card}>
                <div className={styles.container}>
                    <div className={styles.left}>
                        <div className={styles.label}>{i18n.t('Data set')}</div>
                        <select
                            multiple
                            onClick={this.dataSetsSelectClick}
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
                    <div className={styles.right}>
                        <div className={styles.label}>
                            {i18n.t('Organisation unit')}
                        </div>
                        <div className={styles.tree}>
                            <OrganisationUnitTree
                                roots={this.state.roots.map(r => r.id)}
                                singleSelection
                                selected={
                                    this.state.selectedOrganisationUnit
                                        ? [
                                              this.state
                                                  .selectedOrganisationUnit
                                                  .path,
                                          ]
                                        : []
                                }
                                onChange={this.handleOrganisationUnitChange}
                            />
                        </div>
                    </div>
                </div>
                <ButtonStrip>
                    <Button
                        primary
                        onClick={this.handleGenerateMinMaxValue}
                        disabled={!this.isFormValid()}
                    >
                        {i18n.t('Generate min-max values')}
                    </Button>
                    <Button
                        destructive
                        onClick={this.handleRemoveMinMaxValue}
                        disabled={!this.isFormValid()}
                    >
                        {i18n.t('Remove min-max values')}
                    </Button>
                </ButtonStrip>
            </Card>
        )
    }

    render() {
        return (
            <div>
                <PageHeader
                    sectionKey={this.props.sectionKey}
                    title={i18nKeys.minMaxValueGeneration.title}
                />
                {this.state.error ? (
                    <NoticeBox error>{this.state.error}</NoticeBox>
                ) : this.state.loading ? (
                    <CenteredContent>
                        <CircularLoader />
                    </CenteredContent>
                ) : (
                    this.renderForm()
                )}
            </div>
        )
    }
}

export default withAlerts(MinMaxValueGeneration)
