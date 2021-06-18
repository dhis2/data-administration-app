import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import PropTypes from 'prop-types'
import React from 'react'

function renderMenuItem(id, displayName) {
    return <MenuItem key={id} value={id} primaryText={displayName} />
}

function renderMenuItems(menuItems) {
    const renderedMenuItems = menuItems.map(({ id, displayName }) =>
        renderMenuItem(id, displayName)
    )

    return renderedMenuItems
}

function createCallbackWithFakeEventFromMaterialSelectField(callback) {
    return (event, index, value) => callback({ target: { value } })
}

function D2UiDropdown({ onChange, value, disabled, menuItems, ...other }) {
    const menuItemArray = Array.isArray(menuItems)
        ? menuItems
        : menuItems.toArray()
    const hasOptions = menuItemArray.length > 0
    return (
        <SelectField
            value={hasOptions ? value : 1}
            fullWidth={false}
            onChange={createCallbackWithFakeEventFromMaterialSelectField(
                onChange
            )}
            disabled={!hasOptions || disabled}
            {...other}
        >
            {hasOptions ? (
                renderMenuItems(menuItemArray)
            ) : (
                <MenuItem value={1} primaryText="-" />
            )}
        </SelectField>
    )
}

D2UiDropdown.propTypes = {
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    menuItems: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
    ]),
}

D2UiDropdown.defaultProps = {
    value: null,
    menuItems: [],
    disabled: false,
}

export default D2UiDropdown
