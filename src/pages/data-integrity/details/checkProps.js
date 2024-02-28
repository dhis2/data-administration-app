import propTypes from 'prop-types'

export const checkProps = propTypes.shape({
    displayName: propTypes.string.isRequired,
    name: propTypes.string.isRequired,
    description: propTypes.string,
    finishedTime: propTypes.string,
    intoduction: propTypes.string,
    isSlow: propTypes.bool,
    issues: propTypes.arrayOf(
        propTypes.shape({
            comment: propTypes.string,
            id: propTypes.string,
            name: propTypes.string,
            refs: propTypes.array,
        })
    ),
    issuesIdType: propTypes.string,
    recommendation: propTypes.string,
    section: propTypes.string,
    severity: propTypes.string,
    startTime: propTypes.string,
})
