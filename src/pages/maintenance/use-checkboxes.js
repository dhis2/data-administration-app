import { useState } from 'react'
import { i18nKeys } from '../../i18n-keys.js'

export const useCheckboxes = () => {
    const [checkboxes, setCheckboxes] = useState(() => {
        const checkboxes = {}
        for (const key of Object.keys(i18nKeys.maintenance.checkboxes)) {
            checkboxes[key] = false
        }
        return checkboxes
    })
    const toggleCheckbox = (key) => {
        setCheckboxes({
            ...checkboxes,
            [key]: !checkboxes[key],
        })
    }

    return {
        checkboxes,
        toggleCheckbox,
    }
}
