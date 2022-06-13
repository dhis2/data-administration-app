import { useDataMutation, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Card, Button, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import PageHeader from '../../components/PageHeader/PageHeader.js'
import { i18nKeys } from '../../i18n-keys.js'
import Checkboxes from './Checkboxes.js'
import styles from './Maintenance.module.css'
import { useCheckboxes } from './use-checkboxes.js'

const mutation = {
    resource: 'maintenance',
    type: 'create',
    params: (params) => params,
}

const Maintenance = ({ sectionKey }) => {
    const { checkboxes, toggleCheckbox } = useCheckboxes()
    const successAlert = useAlert(i18n.t('Maintenance done'), { success: true })
    const errorAlert = useAlert(({ error }) => error.message, {
        critical: true,
    })
    const [mutate, { loading }] = useDataMutation(mutation, {
        onComplete: () => successAlert.show(),
        onError: (error) => errorAlert.show({ error }),
    })
    const handlePerformMaintenance = async () => {
        const params = {}
        for (const [key, checked] of Object.entries(checkboxes)) {
            if (checked) {
                params[key] = true
            }
        }
        mutate(params)
    }

    return (
        <div>
            <PageHeader
                sectionKey={sectionKey}
                title={i18nKeys.maintenance.title}
            />
            <Card className={styles.card}>
                <Checkboxes
                    checkboxes={checkboxes}
                    toggleCheckbox={toggleCheckbox}
                    disabled={loading}
                />
                <Button
                    primary
                    disabled={
                        loading ||
                        !Object.values(checkboxes).some((checked) => checked)
                    }
                    onClick={handlePerformMaintenance}
                >
                    {loading ? (
                        <>
                            {i18n.t('Performing maintenance...')}
                            <CircularLoader small />
                        </>
                    ) : (
                        i18n.t('Perform maintenance')
                    )}
                </Button>
            </Card>
        </div>
    )
}

Maintenance.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default Maintenance
