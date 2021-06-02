import { useState } from 'react'
import { i18nKeys } from '../../i18n-keys'

export const useCheckboxes = () => {
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
