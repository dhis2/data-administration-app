import i18n from '@dhis2/d2-i18n'
import { CircularLoader, Button, ButtonStrip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './Controls.module.css'

const Controls = ({ loading, disabled, onSelect, onDeselect }) => {
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <CircularLoader small />
                {i18n.t('Updating selection...')}
            </div>
        )
    }

    return (
        <ButtonStrip>
            <Button onClick={onSelect} disabled={disabled}>
                {i18n.t('Select')}
            </Button>
            <Button onClick={onDeselect} disabled={disabled}>
                {i18n.t('Deselect')}
            </Button>
        </ButtonStrip>
    )
}

Controls.propTypes = {
    disabled: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    onDeselect: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
}

export default Controls
