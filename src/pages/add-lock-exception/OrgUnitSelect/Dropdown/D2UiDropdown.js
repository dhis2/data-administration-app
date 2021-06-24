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

function D2UiDropdown({
    menuItems,
    value,
    floatingLabelText,
    disabled,
    onChange,
}) {
    const hasOptions = menuItems.length > 0
    return (
        <SelectField
            fullWidth={false}
            value={hasOptions ? value : 1}
            floatingLabelText={floatingLabelText}
            disabled={!hasOptions || disabled}
            onChange={createCallbackWithFakeEventFromMaterialSelectField(
                onChange
            )}
        >
            {hasOptions ? (
                renderMenuItems(menuItems)
            ) : (
                <MenuItem value={1} primaryText="-" />
            )}
        </SelectField>
    )
}

D2UiDropdown.propTypes = {
    floatingLabelText: PropTypes.string.isRequired,
    menuItems: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
        .isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    value: PropTypes.string,
}

D2UiDropdown.defaultProps = {
    value: null,
    menuItems: [],
    disabled: false,
}

export default D2UiDropdown
