import i18n from '@dhis2/d2-i18n'
import { CircularLoader, Button, ButtonStrip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const Controls = ({ loading, disabled, onSelect, onDeselect }) => (
    <div
        style={{
            position: 'absolute',
            display: 'inline-block',
            top: 24,
            marginLeft: 16,
        }}
    >
        {loading && <CircularLoader small />}
        <ButtonStrip>
            <Button onClick={onSelect} disabled={disabled}>
                {i18n.t('Select')}
            </Button>
            <Button onClick={onDeselect} disabled={disabled}>
                {i18n.t('Deselect')}
            </Button>
        </ButtonStrip>
    </div>
)

Controls.propTypes = {
    disabled: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    onDeselect: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
}

export default Controls
