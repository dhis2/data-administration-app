import { useAlert } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import { Card, Button, CircularLoader, Checkbox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader'
import { i18nKeys } from '../../i18n-keys'
import styles from './Maintenance.module.css'

const useCheckboxes = () => {
    const [checkboxes, setCheckboxes] = useState(() => {
        const checkboxes = {}
        for (const key of Object.keys(i18nKeys.maintenance.checkboxes)) {
            checkboxes[key] = false
        }
        return checkboxes
    })
    const toggleCheckbox = key => {
        setCheckboxes({
            ...checkboxes,
            [key]: !checkboxes[key],
        })
    }
    const toFormData = () => {
        const formData = new FormData()
        Object.entries(checkboxes).forEach(([key, checked]) => {
            formData.append(key, checked)
        })
        return formData
    }

    return {
        checkboxes,
        toggleCheckbox,
        toFormData,
    }
}

const Checkboxes = ({ checkboxes, toggleCheckbox, disabled }) => (
    <div className={styles.checkboxes}>
        {Object.entries(checkboxes).map(([key, checked]) => (
            <Checkbox
                key={key}
                className={styles.checkbox}
                label={i18nKeys.maintenance.checkboxes[key]}
                checked={checked}
                onChange={() => toggleCheckbox(key)}
                disabled={disabled}
            />
        ))}
    </div>
)

Checkboxes.propTypes = {
    checkboxes: PropTypes.object.isRequired,
    disabled: PropTypes.bool.isRequired,
    toggleCheckbox: PropTypes.func.isRequired,
}

const Maintenance = ({ sectionKey }) => {
    const {
        checkboxes,
        toggleCheckbox,
        toFormData: checkboxesToFormData,
    } = useCheckboxes()
    const successAlert = useAlert(i18n.t('Maintenance done'), { success: true })
    const errorAlert = useAlert(({ message }) => message, { critical: true })
    const { d2 } = useD2()
    const [isLoading, setIsLoading] = useState(false)
    const handlePerformMaintenance = async () => {
        const api = d2.Api.getApi()
        const formData = checkboxesToFormData()
        setIsLoading(true)
        try {
            await api.post('maintenance', formData)
            successAlert.show()
        } catch (error) {
            errorAlert.show({
                message:
                    error.message ||
                    i18n.t('An unexpected error happened during maintenance'),
            })
        }
        setIsLoading(false)
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
                    disabled={isLoading}
                />
                <Button
                    primary
                    disabled={
                        isLoading ||
                        !Object.values(checkboxes).some(checked => checked)
                    }
                    onClick={handlePerformMaintenance}
                >
                    {isLoading ? (
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
