import { Checkbox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { i18nKeys } from '../../i18n-keys'
import styles from './Checkboxes.module.css'

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

export default Checkboxes
