import PropTypes from 'prop-types'
import React from 'react'
import { i18nKeys } from '../../../i18n-keys'
import IssueCard from './IssueCard'
import styles from './Issues.module.css'

const { controls } = i18nKeys.dataIntegrity

const Issues = ({ issues }) => {
    const errorElementskeys = Object.keys(issues)

    return (
        <div className={styles.issues}>
            {errorElementskeys.map(element => {
                const label = controls[element]?.label
                if (!label) {
                    return null
                }
                return (
                    <IssueCard
                        key={element}
                        title={label}
                        content={issues[element]}
                    />
                )
            })}
            {Object.keys(controls)
                .filter(element => !errorElementskeys.includes(element))
                .map(element => (
                    <IssueCard key={element} title={controls[element].label} />
                ))}
        </div>
    )
}

Issues.propTypes = {
    issues: PropTypes.object.isRequired,
}

export default Issues
