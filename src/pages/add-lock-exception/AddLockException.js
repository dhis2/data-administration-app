import { useDataQuery, useDataMutation, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Card,
    CenteredContent,
    NoticeBox,
    Button,
    CircularLoader,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import LockExceptionsSubpageHeader from '../../components/LockExceptionsSubpageHeader/LockExceptionsSubpageHeader.js'
import styles from './AddLockException.module.css'
import AddLockExceptionForm from './AddLockExceptionForm/AddLockExceptionForm.js'

const query = {
    levels: {
        resource: 'organisationUnitLevels',
        params: {
            fields: 'id,level,displayName',
            paging: false,
            order: 'level:asc',
        },
    },
    groups: {
        resource: 'organisationUnitGroups',
        params: {
            fields: 'id,displayName',
            paging: false,
        },
    },
    dataSets: {
        resource: 'dataSets',
        params: {
            fields: 'id,displayName,periodType',
            paging: false,
        },
    },
}

const mutation = {
    resource: 'lockExceptions',
    type: 'create',
    params: (params) => params,
}

const AddLockException = () => {
    const history = useHistory()
    const dataQuery = useDataQuery(query)
    const successAlert = useAlert(i18n.t('Lock exception added'), {
        success: true,
    })
    const errorAlert = useAlert(
        ({ error }) =>
            i18n.t('Error adding lock exception: {{error}}', {
                error,
                nsSeparator: '-:-',
            }),
        { critical: true }
    )
    const [mutate, dataMutation] = useDataMutation(mutation, {
        onComplete: () => {
            successAlert.show()
            history.push('/lock-exceptions')
        },
        onError: (error) => {
            errorAlert.show({ error })
        },
    })
    const [selectedOrgUnits, setSelectedOrgUnits] = useState([])
    const [selectedDataSetId, setSelectedDataSetId] = useState(null)
    const [selectedPeriodId, setSelectedPeriodId] = useState(null)

    const handleAdd = () => {
        const orgUnitIds = selectedOrgUnits.map((orgUnitPath) => {
            const splitOrgUnitPath = orgUnitPath.split('/')
            return splitOrgUnitPath[splitOrgUnitPath.length - 1]
        })

        mutate({
            ou: `[${orgUnitIds.join(',')}]`,
            pe: selectedPeriodId,
            ds: selectedDataSetId,
        })
    }
    const isAddActionDisabled =
        dataMutation.loading ||
        !(selectedOrgUnits.length > 0 && selectedDataSetId && selectedPeriodId)

    if (dataQuery.loading) {
        return (
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        )
    }

    if (dataQuery.error) {
        return (
            <CenteredContent>
                <NoticeBox error>{dataQuery.error.message}</NoticeBox>
            </CenteredContent>
        )
    }

    const {
        levels: { organisationUnitLevels },
        groups: { organisationUnitGroups },
        dataSets: { dataSets },
    } = dataQuery.data

    return (
        <>
            <LockExceptionsSubpageHeader title={i18n.t('Add lock exception')} />
            <Card className={styles.card}>
                <AddLockExceptionForm
                    levels={organisationUnitLevels}
                    groups={organisationUnitGroups}
                    dataSets={dataSets}
                    selectedDataSetId={selectedDataSetId}
                    selectedOrgUnits={selectedOrgUnits}
                    onSelectedDataSetIdChange={setSelectedDataSetId}
                    onSelectedOrgUnitsChange={setSelectedOrgUnits}
                    onSelectedPeriodIdChange={setSelectedPeriodId}
                />
                <Button
                    className={styles.addLockExceptionButton}
                    primary
                    disabled={isAddActionDisabled}
                    onClick={handleAdd}
                >
                    {dataMutation.loading ? (
                        <>
                            {i18n.t('Adding lock exception...')}
                            <CircularLoader small />
                        </>
                    ) : (
                        i18n.t('Add lock exception')
                    )}
                </Button>
            </Card>
        </>
    )
}

export default AddLockException
