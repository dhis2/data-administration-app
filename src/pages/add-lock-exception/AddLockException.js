import {
    useConfig,
    useDataQuery,
    useDataMutation,
    useAlert,
} from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Card,
    CenteredContent,
    NoticeBox,
    Button,
    CircularLoader,
} from '@dhis2/ui'
import React, { useState } from 'react'
// import { useHistory } from 'react-router-dom'
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
    const { baseUrl, apiVersion } = useConfig()
    // const history = useHistory()
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
        onError: (error) => {
            errorAlert.show({ error })
        },
    })
    const [selectedOrgUnits, setSelectedOrgUnits] = useState([])
    const [selectedDataSetId, setSelectedDataSetId] = useState(null)
    const [selectedPeriodId, setSelectedPeriodId] = useState(null)

    const handleAdd = async () => {
        const orgUnitIds = selectedOrgUnits.map((orgUnitPath) => {
            const splitOrgUnitPath = orgUnitPath.split('/')
            return splitOrgUnitPath[splitOrgUnitPath.length - 1]
        })

        // concatenated list will be 11 characters per uid, + length-1 commas
        const orgUnitLength = orgUnitIds.length * 12 - 1
        // base url, api, + additional characters for rest of request (e.g. dataSetId, periodId)
        const baseLength =
            baseUrl.length +
            String(apiVersion).length +
            '/api//lockExceptions?ou=%5B%5D&pe=&ds='.length +
            11 * 2
        // set slightly below prevailing URL max length of 2048
        const MAX_URL_LENGTH = 2000

        const numberOfPosts = Math.ceil(
            orgUnitLength / (MAX_URL_LENGTH - baseLength)
        )
        const orgUnitsPerPost = Math.ceil(orgUnitIds.length / numberOfPosts)
        const orgUnitsByPost = []

        for (let i = 0; i < orgUnitIds.length; i += orgUnitsPerPost) {
            const orgUnitsInPost = orgUnitIds.slice(i, i + orgUnitsPerPost)
            orgUnitsByPost.push(orgUnitsInPost)
        }

        const lockExceptionsPosts = orgUnitsByPost.map(async (orgUnits) => {
            return await mutate({
                ou: `[${orgUnits.join()}]`,
                pe: selectedPeriodId,
                ds: selectedDataSetId,
            })
        })

        await Promise.all(lockExceptionsPosts)
        successAlert.show()
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
