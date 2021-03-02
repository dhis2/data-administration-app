import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'

const FormattedNumber = props => (
    <span>{new Intl.NumberFormat(i18n.language).format(props.value)}</span>
)

FormattedNumber.propTypes = {
    value: PropTypes.number.isRequired,
}

export default FormattedNumber
