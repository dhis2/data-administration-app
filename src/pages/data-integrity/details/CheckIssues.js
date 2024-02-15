import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import css from './CheckDetails.module.css'
import { checkProps } from './checkProps.js'
import { getIssueLink } from './getIssueLink.js'
import { Notice } from './Notice.js'

export const CheckIssues = ({ detailsCheck }) => {
    const { baseUrl } = useConfig()

    const numberOfErrors = detailsCheck.issues.length
    return (
        <Notice
            title={i18n.t('{{ numberOfErrors }} errors', { numberOfErrors })}
            status="error"
        >
            <ul className={css.issuesList}>
                {detailsCheck.issues?.map((issue) => (
                    <Issue
                        key={issue.id || issue.name}
                        issue={issue}
                        issuesIdType={detailsCheck.issuesIdType}
                        baseUrl={baseUrl}
                    />
                ))}
            </ul>
        </Notice>
    )
}

CheckIssues.propTypes = {
    detailsCheck: checkProps,
}

const Issue = ({ issue, issuesIdType, baseUrl }) => {
    const { id, name } = issue

    return (
        <li key={id || name}>
            {issuesIdType ? (
                <IssueLink href={getIssueLink(baseUrl, { issuesIdType, id })}>
                    {name}
                </IssueLink>
            ) : (
                name
            )}
        </li>
    )
}

Issue.propTypes = {
    baseUrl: PropTypes.string,
    issue: PropTypes.shape({ id: PropTypes.string, name: PropTypes.string }),
    issuesIdType: PropTypes.string,
}

const IssueLink = ({ href, children }) => {
    if (!href) {
        return children
    }
    return (
        <a target="_blank" href={href} rel="noreferrer">
            {children}
        </a>
    )
}

IssueLink.propTypes = {
    children: PropTypes.node,
    href: PropTypes.string,
}
