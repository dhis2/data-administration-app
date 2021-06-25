import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    SingleSelectField,
    SingleSelectOption,
    ButtonStrip,
    Button,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './Controls.module.css'

const Controls = ({
    items,
    selectedItem,
    onSelectedItemChange,
    label,
    placeholder,
    loading,
    onSelect,
    onDeselect,
}) => (
    <div className={styles.container}>
        <SingleSelectField
            label={label}
            placeholder={placeholder}
            selected={selectedItem}
            disabled={loading}
            filterable
            onChange={({ selected }) => onSelectedItemChange(selected)}
        >
            {items.map(({ label, value }) => (
                <SingleSelectOption key={label} label={label} value={value} />
            ))}
        </SingleSelectField>
        {loading ? (
            <div className={styles.updatingSelection}>
                <CircularLoader small />
                {i18n.t('Updating selection...')}
            </div>
        ) : (
            <ButtonStrip>
                <Button onClick={onSelect} disabled={loading || !selectedItem}>
                    {i18n.t('Select')}
                </Button>
                <Button
                    onClick={onDeselect}
                    disabled={loading || !selectedItem}
                >
                    {i18n.t('Deselect')}
                </Button>
            </ButtonStrip>
        )}
    </div>
)

Controls.propTypes = {
    items: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    onDeselect: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onSelectedItemChange: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    selectedItem: PropTypes.any,
}

export default Controls
