import { useState } from 'react'
import { analyticsCheckboxes } from './analytics.conf.js'

export const useCheckboxes = () => {
    const [checkboxes, setCheckboxes] = useState(analyticsCheckboxes)

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
