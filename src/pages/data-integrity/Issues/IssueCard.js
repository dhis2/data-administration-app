import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { FontIcon } from 'material-ui'
import { Card, CardText, CardHeader } from 'material-ui/Card'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './IssueCard.module.css'

const jsStyles = {
    errorColor: colors.red600,
    noErrorColor: colors.green600,
    titleStyle: {
        fontSize: 16,
        fontWeight: 'normal',
    },
    iconStyle: {
        color: '#1c9d17',
        cursor: 'auto',
    },
}

const IssueCard = ({ title, content }) => {
    const elementsCount = Array.isArray(content)
        ? content.length
        : Object.keys(content).length
    let expandable = true
    let titleColor = jsStyles.errorColor
    let closeIcon = 'keyboard_arrow_down'
    let openIcon = 'keyboard_arrow_up'
    let cardText = null

    if (elementsCount === 0) {
        expandable = false
        titleColor = jsStyles.noErrorColor
        closeIcon = 'done'
        openIcon = 'done'
    } else if (Array.isArray(content)) {
        cardText = (
            <CardText className={styles.cardText} expandable={expandable}>
                {content.map(element => (
                    <p key={element}>
                        {Array.isArray(element) ? element.join(', ') : element}
                    </p>
                ))}
            </CardText>
        )
    } else {
        cardText = (
            <CardText className={styles.cardText} expandable={expandable}>
                {Object.entries(content).map(([element, value]) => (
                    <span key={element}>
                        <h4>{element}</h4>
                        <p>{Array.isArray(value) ? value.join(', ') : value}</p>
                    </span>
                ))}
            </CardText>
        )
    }

    const closeFontIcon = (
        <FontIcon className={'material-icons'}>{closeIcon}</FontIcon>
    )
    const openFontIcon = (
        <FontIcon className={'material-icons'}>{openIcon}</FontIcon>
    )

    return (
        <Card className={styles.card}>
            <CardHeader
                title={
                    i18n.t(title) +
                    (elementsCount > 0 ? ` (${elementsCount})` : '')
                }
                titleColor={titleColor}
                titleStyle={jsStyles.titleStyle}
                actAsExpander={expandable}
                showExpandableButton={true}
                closeIcon={closeFontIcon}
                openIcon={openFontIcon}
                iconStyle={!expandable ? jsStyles.iconStyle : {}}
            />
            {cardText}
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
