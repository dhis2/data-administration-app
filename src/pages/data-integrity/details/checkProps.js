import propTypes from 'prop-types'

export const checkProps = {
    name: propTypes.string.isRequired,
    displayName: propTypes.string.isRequired,
    description: propTypes.string,
    intoduction: propTypes.string,
    recommendation: propTypes.string,
    startTime: propTypes.string,
    finishedTime: propTypes.string,
    Selection: propTypes.string,
    isSlow: propTypes.bool,
}
