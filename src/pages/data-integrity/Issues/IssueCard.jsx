import i18n from '@dhis2/d2-i18n'
import { Card } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './IssueCard.module.css'

const Content = ({ content }) => {
    const renderValue = (value) =>
        Array.isArray(value) ? value.join(', ') : value

    if (Array.isArray(content)) {
        return content.map((element) => (
            <p key={element}>{renderValue(element)}</p>
        ))
    } else {
        return Object.entries(content).map(([element, value]) => (
            <div key={element}>
                <h3>{element}</h3>
                <p>{renderValue(value)}</p>
            </div>
        ))
    }
}

Content.propTypes = {
    content: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
}

const Title = ({ title, type }) => (
    <h2
        data-test="issue-card-title"
        className={type === 'invalid' ? styles.invalidTitle : styles.validTitle}
    >
        {title}
    </h2>
)

Title.propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
}

const countElements = (content) => {
    const sum = (arr) =>
        arr.reduce((acc, element) => {
            return acc + countElements(element)
        }, 0)

    if (Array.isArray(content)) {
        return sum(content)
    } else if (typeof content === 'object') {
        return sum(Object.values(content))
    } else {
        return 1
    }
}

const IssueCard = ({ title, content }) => {
    const elementsCount = countElements(content)

    return (
        <Card className={styles.card}>
            {elementsCount > 0 ? (
                <details>
                    <summary className={styles.cardHeader}>
                        <Title
                            title={i18n.t(
                                '{{issueTitle}} ({{issueElementsCount}})',
                                {
                                    issueTitle: title,
                                    issueElementsCount: elementsCount,
                                }
                            )}
                            type="invalid"
                        />
                    </summary>
                    <div className={styles.cardText}>
                        <Content content={content} />
                    </div>
                </details>
            ) : (
                <Title title={title} type="valid" />
            )}
        </Card>
    )
}

IssueCard.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
}

IssueCard.defaultProps = {
    content: [],
}

export default IssueCard
