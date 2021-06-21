import { useDataQuery, useDataMutation, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Card,
    CenteredContent,
    NoticeBox,
    Button,
    CircularLoader,
} from '@dhis2/ui'
import classnames from 'classnames'
import FontIcon from 'material-ui/FontIcon'
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import lockExceptionsStyles from '../lock-exceptions/LockExceptions.module.css'
import styles from './AddLockException.module.css'
import AddLockExceptionForm from './AddLockExceptionForm/AddLockExceptionForm'

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
    params: params => params,
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
                nsSeparator: null,
            }),
        { critical: true }
    )
    const [mutate, dataMutation] = useDataMutation(mutation, {
        onComplete: () => {
            successAlert.show()
            history.push('/lock-exception')
        },
        onError: error => {
            errorAlert.show({ error })
        },
    })
    const [selectedOrgUnits, setSelectedOrgUnits] = useState([])
    const [selectedDataSetId, setSelectedDataSetId] = useState(null)
    const [selectedPeriodId, setSelectedPeriodId] = useState(null)

    const handleAdd = () => {
        const orgUnitIds = selectedOrgUnits.map(orgUnitPath => {
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
            <div className={lockExceptionsStyles.headerContainer}>
                <Link to="/lock-exceptions">
                    <span title={i18n.t('Go back to all lock exceptions')}>
                        <FontIcon
                            className={classnames(
                                'material-icons',
                                lockExceptionsStyles.backArrowIcon
                            )}
                        >
                            arrow_back
                        </FontIcon>
                    </span>
                </Link>
                <h1 className={lockExceptionsStyles.header}>
                    <span>{i18n.t('Lock Exception')}</span>
                    <span className={lockExceptionsStyles.headerDivider}>
                        {' '}
                        |{' '}
                    </span>
                    <span className={lockExceptionsStyles.subHeader}>
                        {i18n.t('Add lock exception')}
                    </span>
                </h1>
            </div>
            <Card className={styles.card}>
                <AddLockExceptionForm
                    levels={organisationUnitLevels}
                    groups={organisationUnitGroups}
                    dataSets={dataSets}
                    updateSelectedOrgUnits={setSelectedOrgUnits}
                    updateSelectedDataSetId={setSelectedDataSetId}
                    updateSelectedPeriodId={setSelectedPeriodId}
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
