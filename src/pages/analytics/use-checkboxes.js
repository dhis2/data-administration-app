import { useState } from 'react'
import { analyticsCheckboxes } from './analytics.conf'

export const useCheckboxes = () => {
    const [checkboxes, setCheckboxes] = useState(() => {
        const checkboxes = {}
        analyticsCheckboxes.forEach((checkbox) => {
            checkboxes[checkbox.key] = {
                checked: false,
                label: checkbox.label,
            }
        })
        return checkboxes
    })
    const toggleCheckbox = (key) => {
        setCheckboxes({
            ...checkboxes,
            [key]: {
                ...checkboxes[key],
                checked: !checkboxes[key].checked,
            },
        })
    }

    return {
        checkboxes,
        toggleCheckbox,
    }
}
