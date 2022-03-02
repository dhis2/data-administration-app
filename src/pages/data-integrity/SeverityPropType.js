import PropTypes from 'prop-types'

const SeverityPropType = PropTypes.oneOf([
    'INFO',
    'WARNING',
    'SEVERE',
    'CRITICAL',
])

export default SeverityPropType
