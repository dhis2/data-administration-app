import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui-constants'
import { FontIcon } from 'material-ui'
import { Card, CardText, CardHeader } from 'material-ui/Card'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './DataIntegrityCard.module.css'

const Content = ({ content }) => {
    const renderValue = value =>
        Array.isArray(value) ? value.join(', ') : value

    if (Array.isArray(content)) {
        return content.map(element => (
            <p key={element}>{renderValue(element)}</p>
        ))
    } else {
        return Object.entries(content).map(([element, value]) => (
            <div key={element}>
                <h4>{element}</h4>
                <p>{renderValue(value)}</p>
            </div>
        ))
    }
}

const jsStyles = {
    titleStyle: {
        fontSize: 16,
        fontWeight: 'normal',
    },
}

const errorStyles = {
    titleColor: colors.red600,
    openIcon: 'keyboard_arrow_up',
    closeIcon: 'keyboard_arrow_down',
    iconStyle: {},
}

const noErrorStyles = {
    titleColor: colors.green600,
    openIcon: 'done',
    closeIcon: 'done',
    iconStyle: {
        color: colors.green600,
        cursor: 'auto',
    },
}

const countElements = content => {
    const sum = arr =>
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

const DataIntegrityCard = ({ title, content }) => {
    const elementsCount = countElements(content)
    const expandable = elementsCount > 0
    const { titleColor, openIcon, closeIcon, iconStyle } =
        elementsCount > 0 ? errorStyles : noErrorStyles

    const openFontIcon = (
        <FontIcon className="material-icons">{openIcon}</FontIcon>
    )
    const closeFontIcon = (
        <FontIcon className="material-icons">{closeIcon}</FontIcon>
    )

    return (
        <Card className={styles.card}>
            <CardHeader
                title={
                    <div data-test="issue-card-title">
                        {elementsCount > 0
                            ? i18n.t(
                                  '{{issueTitle}} ({{issueElementsCount}})',
                                  {
                                      issueTitle: title,
                                      issueElementsCount: elementsCount,
                                  }
                              )
                            : title}
                    </div>
                }
                titleColor={titleColor}
                titleStyle={jsStyles.titleStyle}
                actAsExpander={expandable}
                showExpandableButton={true}
                closeIcon={closeFontIcon}
                openIcon={openFontIcon}
                iconStyle={iconStyle}
            />
            {elementsCount > 0 && (
                <CardText className={styles.cardText} expandable={expandable}>
                    <Content content={content} />
                </CardText>
            )}
        </Card>
    )
}

DataIntegrityCard.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
}

DataIntegrityCard.defaultProps = {
    content: [],
}

export default DataIntegrityCard
