import { useAlert, useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CenteredContent,
    CircularLoader,
    NoticeBox,
    OrganisationUnitTree,
    ButtonStrip,
    Button,
    Card,
    MultiSelectField,
    MultiSelectOption,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import { i18nKeys } from '../../i18n-keys.js'
import styles from './MinMaxValueGeneration.module.css'

const MIN_MAX_VALUE_ENDPOINT = '/minMaxValues'

const organisationIdFromPath = (path) => {
    const last = (array) => array[array.length - 1]

    return last(path.split('/'))
}

const query = {
    organisationUnits: {
        resource: 'organisationUnits',
        params: {
            fields: 'id',
            paging: false,
            level: 1,
        },
    },
    dataSets: {
        resource: 'dataSets',
        params: {
            fields: 'id,displayName',
            paging: false,
        },
    },
}

const generateMinMaxValueMutation = {
    resource: MIN_MAX_VALUE_ENDPOINT,
    type: 'create',
    data: (data) => data,
}

const removeMinMaxValueMutation = {
    resource: MIN_MAX_VALUE_ENDPOINT,
    type: 'delete',
    id: ({ id }) => id,
    params: ({ ds }) => ({ ds }),
}

const MinMaxValueGeneration = ({ sectionKey }) => {
    const successAlert = useAlert(({ message }) => message, { success: true })
    const errorAlert = useAlert(({ error }) => error.message, {
        critical: true,
    })
    const { loading, error, data } = useDataQuery(query)
    const [generateMinMaxValue] = useDataMutation(generateMinMaxValueMutation, {
        onComplete: () => {
            successAlert.show({ message: i18n.t('Min-max values generated') })
        },
        onError: (error) => {
            errorAlert.show({ error })
        },
    })
    const [removeMinMaxValue] = useDataMutation(removeMinMaxValueMutation, {
        onComplete: () => {
            successAlert.show({ message: i18n.t('Min-max values removed') })
        },
        onError: (error) => {
            errorAlert.show({ error })
        },
    })
    const [selectedOrganisationUnit, setSelectedOrganisationUnit] =
        useState(null)
    const [selectedDataSets, setSelectedDataSets] = useState([])

    const formValid =
        selectedDataSets.length > 0 && selectedOrganisationUnit !== null

    const handleOrganisationUnitChange = ({ path, checked }) => {
        if (checked) {
            setSelectedOrganisationUnit({
                path,
                id: organisationIdFromPath(path),
            })
        } else {
            setSelectedOrganisationUnit(null)
        }
    }
    const handleGenerateMinMaxValue = async () => {
        successAlert.show({ message: i18n.t('Generating min-max values...') })
        generateMinMaxValue({
            organisationUnit: selectedOrganisationUnit.id,
            dataSets: selectedDataSets,
        })
    }
    const handleRemoveMinMaxValue = async () => {
        successAlert.show({ message: i18n.t('Removing min-max values...') })
        removeMinMaxValue({
            id: selectedOrganisationUnit.id,
            ds: selectedDataSets,
        })
    }

    if (loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (error) {
        return (
            <CenteredContent>
                <NoticeBox error>{error.message}</NoticeBox>
            </CenteredContent>
        )
    }

    const {
        organisationUnits: { organisationUnits },
        dataSets: { dataSets },
    } = data

    return (
        <div>
            <PageHeader
                sectionKey={sectionKey}
                title={i18nKeys.minMaxValueGeneration.title}
            />
            <Card className={styles.card}>
                <div className={styles.container}>
                    <div className={styles.left}>
                        <MultiSelectField
                            label={i18n.t('Data set')}
                            onChange={({ selected }) =>
                                setSelectedDataSets(selected)
                            }
                            selected={selectedDataSets}
                            clearable
                            filterable
                        >
                            {dataSets.map((item) => (
                                <MultiSelectOption
                                    key={item.id}
                                    label={item.displayName}
                                    value={item.id}
                                />
                            ))}
                        </MultiSelectField>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.label}>
                            {i18n.t('Organisation unit')}
                        </div>
                        <div className={styles.tree}>
                            <OrganisationUnitTree
                                roots={organisationUnits.map((r) => r.id)}
                                singleSelection
                                selected={
                                    selectedOrganisationUnit
                                        ? [selectedOrganisationUnit.path]
                                        : []
                                }
                                onChange={handleOrganisationUnitChange}
                            />
                        </div>
                    </div>
                </div>
                <ButtonStrip>
                    <Button
                        primary
                        onClick={handleGenerateMinMaxValue}
                        disabled={!formValid}
                    >
                        {i18n.t('Generate min-max values')}
                    </Button>
                    <Button
                        destructive
                        onClick={handleRemoveMinMaxValue}
                        disabled={!formValid}
                    >
                        {i18n.t('Remove min-max values')}
                    </Button>
                </ButtonStrip>
            </Card>
        </div>
    )
}

MinMaxValueGeneration.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default MinMaxValueGeneration
