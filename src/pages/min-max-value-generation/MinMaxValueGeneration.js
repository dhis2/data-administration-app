import { useAlert, useDataMutation } from '@dhis2/app-runtime'
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
import PageHeader from '../../components/PageHeader/PageHeader'
import { i18nKeys } from '../../i18n-keys'
import styles from './MinMaxValueGeneration.module.css'
import { useQueries } from './use-queries'

const MIN_MAX_VALUE_ENDPOINT = '/minMaxValues'

const generateMinMaxValueMutation = {
    resource: MIN_MAX_VALUE_ENDPOINT,
    type: 'create',
    data: data => data,
}

const removeMinMaxValueMutation = {
    resource: MIN_MAX_VALUE_ENDPOINT,
    type: 'delete',
    id: ({ id }) => id,
    params: ({ ds }) => ({ ds }),
}

const MinMaxValueGeneration = ({ sectionKey }) => {
    const { loading, error, organisationUnits, dataSets } = useQueries()
    const successAlert = useAlert(({ message }) => message, { success: true })
    const errorAlert = useAlert(({ error }) => error.message, {
        critical: true,
    })
    const [
        generateMinMaxValue,
        { loading: generatingMinMaxValue },
    ] = useDataMutation(generateMinMaxValueMutation, {
        onComplete: () => {
            successAlert.show({ message: i18n.t('Min-max values generated') })
        },
        onError: error => {
            errorAlert.show({ error })
        },
    })
    const [
        removeMinMaxValue,
        { loading: removingMinMaxValue },
    ] = useDataMutation(removeMinMaxValueMutation, {
        onComplete: () => {
            successAlert.show({ message: i18n.t('Min-max values removed') })
        },
        onError: error => {
            errorAlert.show({ error })
        },
    })
    const [selectedOrganisationUnit, setSelectedOrganisationUnit] = useState(
        null
    )
    const [selectedDataSets, setSelectedDataSets] = useState([])

    const formValid =
        selectedDataSets.length > 0 && selectedOrganisationUnit !== null

    const handleOrganisationUnitChange = ({ id, path, checked }) => {
        if (checked) {
            setSelectedOrganisationUnit({
                id,
                path,
            })
        } else {
            setSelectedOrganisationUnit(null)
        }
    }
    const handleGenerateMinMaxValue = async () => {
        generateMinMaxValue({
            organisationUnit: selectedOrganisationUnit.id,
            dataSets: selectedDataSets,
        })
    }
    const handleRemoveMinMaxValue = async () => {
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
                            {dataSets.map(item => (
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
                                roots={organisationUnits.map(r => r.id)}
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
                        disabled={!formValid}
                        loading={generatingMinMaxValue}
                        onClick={handleGenerateMinMaxValue}
                    >
                        {i18n.t('Generate min-max values')}
                    </Button>
                    <Button
                        destructive
                        disabled={!formValid}
                        loading={removingMinMaxValue}
                        onClick={handleRemoveMinMaxValue}
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
