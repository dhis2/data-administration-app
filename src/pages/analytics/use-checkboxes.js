import { useState } from 'react'
import { analyticsCheckboxes } from './analytics.conf.js'

export const useCheckboxes = () => {
    const [checkboxes, setCheckboxes] = useState(analyticsCheckboxes)

    const toggleCheckbox = (key) => {
        setCheckboxes(
            checkboxes.slice().map((c) =>
                c.key !== key
                    ? c
                    : {
                          ...c,
                          checked: !c.checked,
                      }
            )
        )
    }

    return {
        checkboxes,
        toggleCheckbox,
    }
}
