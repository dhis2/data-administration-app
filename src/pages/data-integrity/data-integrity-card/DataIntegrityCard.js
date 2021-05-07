import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import { FontIcon } from 'material-ui'
import { Card, CardText, CardHeader } from 'material-ui/Card'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import styles from './DataIntegrityCard.module.css'

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
    noPaddingTop: {
        paddingTop: 0,
    },
}

class DataIntegrityCard extends PureComponent {
    static propTypes = {
        cardId: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    }

    static defaultProps = {
        content: [],
    }

    render() {
        const { content } = this.props
        const elementsCount = Array.isArray(content)
            ? content.length
            : Object.keys(content).length
        const showIcon = true
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
                <CardText style={jsStyles.noPaddingTop} expandable={expandable}>
                    <div id={'elementDescription'}>
                        {this.props.content.map(element => (
                            <p key={element}>
                                {Array.isArray(element)
                                    ? element.join(', ')
                                    : element}
                            </p>
                        ))}
                    </div>
                </CardText>
            )
        } else {
            cardText = (
                <CardText style={jsStyles.noPaddingTop} expandable={expandable}>
                    <div id={'elementDescription'}>
                        {Object.entries(content).map(([element, value]) => (
                            <span key={element}>
                                <h4>{element}</h4>
                                <p>
                                    {Array.isArray(value)
                                        ? value.join(', ')
                                        : value}
                                </p>
                            </span>
                        ))}
                    </div>
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
            <Card id={this.props.cardId} className={styles.card}>
                <CardHeader
                    title={
                        i18n.t(this.props.title) +
                        (elementsCount > 0 ? ` (${elementsCount})` : '')
                    }
                    titleColor={titleColor}
                    titleStyle={jsStyles.titleStyle}
                    actAsExpander={expandable}
                    showExpandableButton={showIcon}
                    closeIcon={closeFontIcon}
                    openIcon={openFontIcon}
                    iconStyle={!expandable ? jsStyles.iconStyle : {}}
                />
                {cardText}
            </Card>
        )
    }
}

export default DataIntegrityCard
