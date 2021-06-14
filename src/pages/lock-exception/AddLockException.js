import { useDataQuery, useDataMutation, useAlert } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
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
import AddLockExceptionForm from './AddLockExceptionForm'
import styles from './LockException.module.css'

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
    const { d2 } = useD2()

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
        <div className={styles.lockExceptions}>
            <div className={styles.headerContainer}>
                <Link to="/lock-exception">
                    <span title={i18n.t('Go back to all lock exceptions')}>
                        <FontIcon
                            className={classnames(
                                'material-icons',
                                styles.backArrowIcon
                            )}
                        >
                            arrow_back
                        </FontIcon>
                    </span>
                </Link>
                <h1 className={styles.header}>
                    <span>{i18n.t('Lock Exception')}</span>
                    <span className={styles.headerDivider}> | </span>
                    <span className={styles.subHeader}>
                        {i18n.t('Add lock exception')}
                    </span>
                </h1>
            </div>
            <Card className={styles.card}>
                <AddLockExceptionForm
                    d2={d2}
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
        </div>
    )
}

export default AddLockException
