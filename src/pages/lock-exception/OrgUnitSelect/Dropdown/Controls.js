import i18n from '@dhis2/d2-i18n'
import LinearProgress from 'material-ui/LinearProgress/LinearProgress'
import RaisedButton from 'material-ui/RaisedButton/RaisedButton'
import PropTypes from 'prop-types'
import React from 'react'
import sharedStyles from '../style'

const Controls = ({ loading, disabled, onSelect, onDeselect }) => (
    <div
        style={{
            position: 'absolute',
            display: 'inline-block',
            top: 24,
            marginLeft: 16,
        }}
    >
        {loading && <LinearProgress size={0.5} style={sharedStyles.progress} />}
        <RaisedButton
            label={i18n.t('Select')}
            style={sharedStyles.button1}
            onClick={onSelect}
            disabled={disabled}
        />
        <RaisedButton
            label={i18n.t('Deselect')}
            style={sharedStyles.button}
            onClick={onDeselect}
            disabled={disabled}
        />
    </div>
)

Controls.propTypes = {
    disabled: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    onDeselect: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
}

export default Controls
