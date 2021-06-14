import { useDataQuery, useDataMutation, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { ButtonStrip, Button, CircularLoader } from '@dhis2/ui'
import Dialog from 'material-ui/Dialog'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import AddLockExceptionForm from './AddLockExceptionForm'
import styles from './LockException.module.css'

const query = {
    levels: {
        resource: 'organisationUnitLevels',
        fields: 'id,level,displayName',
        paging: false,
        order: 'level:asc',
    },
    groups: {
        resource: 'organisationUnitGroups',
        fields: 'id,displayName',
        paging: false,
    },
    dataSets: {
        resource: 'dataSets',
        fields: 'id,displayName,periodType',
        paging: false,
    },
}

// XXX
const handleAddLockException = async ({
    selectedOrgUnits,
    selectedDataSetId,
    selectedPeriodId,
}) => {
    const orgUnitIds = selectedOrgUnits.map(orgUnitPath => {
        const splitOrgUnitPath = orgUnitPath.split('/')
        return splitOrgUnitPath[splitOrgUnitPath.length - 1]
    })

    const formData = new FormData()
    formData.append('ou', `[${orgUnitIds.join(',')}]`)
    formData.append('pe', selectedPeriodId)
    formData.append('ds', selectedDataSetId)

    const d2 = await getD2Instance()
    const api = d2.Api.getApi()
    await api.post('lockExceptions', formData)

    this.loadLockExceptionsForPager(LockException.initialPager, {
        userAction: false,
    })
}

const AddLockException = () => {
    const { loading, error, data } = useDataQuery(query)
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
    const [selectedOrgUnits, setSelectedOrgUnits] = useState([])
    const [selectedDataSetId, setSelectedDataSetId] = useState(null)
    const [selectedPeriodId, setSelectedPeriodId] = useState(null)
    const { d2 } = useD2()
    const handleAdd = async () => {
        try {
            await onAdd({
                selectedOrgUnits,
                selectedDataSetId,
                selectedPeriodId,
            })
            successAlert.show()
            onClose()
        } catch (error) {
            errorAlert.show({ error })
        }
    }
    const isAddActionDisabled =
        isLoading ||
        !(selectedOrgUnits.length > 0 && selectedDataSetId && selectedPeriodId)

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
            <AddLockExceptionForm
                levels={levels}
                groups={groups}
                dataSets={dataSets}
                updateSelectedOrgUnits={setSelectedOrgUnits}
                updateSelectedDataSetId={setSelectedDataSetId}
                updateSelectedPeriodId={setSelectedPeriodId}
            />
            <Button primary disabled={isAddActionDisabled} onClick={handleAdd}>
                {isLoading ? (
                    <>
                        {i18n.t('Adding lock exception...')}
                        <CircularLoader small />
                    </>
                ) : (
                    i18n.t('Add lock exception')
                )}
            </Button>
        </div>
    )
}

export default AddLockException
