import PropTypes from 'prop-types'
import React from 'react'
import Controls from './Controls'
import D2UiDropdown from './D2UiDropdown'

const Dropdown = ({
    menuItems,
    value,
    label,
    loading,
    onChange,
    onSelect,
    onDeselect,
}) => (
    // The minHeight on the wrapping div below is there to compensate for the fact that a
    // Material-UI SelectField will change height depending on whether or not it has a value
    <div style={{ position: 'relative', minHeight: 89 }}>
        <D2UiDropdown
            menuItems={menuItems}
            value={value}
            floatingLabelText={label}
            disabled={loading}
            onChange={onChange}
        />
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
    onChange: PropTypes.func.isRequired,
    onDeselect: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    value: PropTypes.any,
}

export default Dropdown
