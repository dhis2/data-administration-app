import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Card, CardText, CardHeader } from 'material-ui/Card';
import { FontIcon } from 'material-ui';

import styles from './DataIntegrityCard.css';

const jsStyles = {
    errorColor: '#ff5722',
    noErrorColor: '#1c9d17',
    titleStyle: {
        fontSize: 14,
        fontWeight: 'normal',
    },
    iconStyle: {
        color: '#1c9d17',
        cursor: 'auto',
    },
    noPaddingTop: {
        paddingTop: 0,
    },
};

class DataIntegrityCard extends PureComponent {
    static propTypes = {
        cardId: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object,
        ]),
    }

    static defaultProps = {
        content: [],
    }

    static contextTypes = {
        translator: PropTypes.func,
    };

    render() {
        const showIcon = true;
        const translator = this.context.translator;
        let expandable = true;
        let titleColor = jsStyles.errorColor;
        let closeIcon = 'keyboard_arrow_down';
        let openIcon = 'keyboard_arrow_up';
        let cardText = null;

        if (!Array.isArray(this.props.content)) {
            cardText = (
                <CardText style={jsStyles.noPaddingTop} expandable={expandable}>
                    <div id={'elementDescription'}>
                        {
                            Object.keys(this.props.content).map(element => (
                                <span key={element}>
                                    <h4>{element}</h4>
                                    <p>
                                        {
                                            Array.isArray(this.props.content[element]) ?
                                                this.props.content[element].join(', ') :
                                                this.props.content[element]
                                        }
                                    </p>
                                </span>
                            ))
                        }
                    </div>
                </CardText>
            );
        } else if (this.props.content.length) {
            cardText = (
                <CardText style={jsStyles.noPaddingTop} expandable={expandable}>
                    <div id={'elementDescription'}>
                        {
                            this.props.content.map(element => (
                                <p key={element}>
                                    {
                                        Array.isArray(element) ?
                                            element.join(', ') :
                                            element
                                    }
                                </p>
                            ))
                        }
                    </div>
                </CardText>
            );
        } else {
            expandable = false;
            titleColor = jsStyles.noErrorColor;
            closeIcon = 'done';
            openIcon = 'done';
        }

        const closeFontIcon = (
            <FontIcon className={'material-icons'}>
                {closeIcon}
            </FontIcon>
        );
        const openFontIcon = (
            <FontIcon className={'material-icons'}>
                {openIcon}
            </FontIcon>
        );

        return (
            <Card id={this.props.cardId} className={styles.card}>
                <CardHeader
                    title={translator(this.props.title)}
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
        );
    }
}

export default DataIntegrityCard;
