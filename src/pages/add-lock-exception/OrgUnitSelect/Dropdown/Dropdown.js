import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import Controls from './Controls'
import styles from './Dropdown.module.css'

const Dropdown = ({
    menuItems,
    value,
    label,
    placeholder,
    loading,
    onChange,
    onSelect,
    onDeselect,
}) => (
    <div className={styles.container}>
        <SingleSelectField
            label={label}
            placeholder={placeholder}
            selected={value}
            disabled={loading}
            filterable
            onChange={onChange}
        >
            {menuItems.map(({ id, displayName }) => (
                <SingleSelectOption key={id} label={displayName} value={id} />
            ))}
        </SingleSelectField>
        <Controls
            loading={loading}
            disabled={loading || !value}
            onSelect={onSelect}
            onDeselect={onDeselect}
        />
    </div>
)

Dropdown.propTypes = {
    label: PropTypes.string.isRequired,
    menuItems: PropTypes.array.isRequired,
    placeholder: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onDeselect: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    value: PropTypes.any,
}

export default Dropdown
