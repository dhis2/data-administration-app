import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Card, CardText, CardHeader } from 'material-ui/Card';
import { FontIcon, Paper } from 'material-ui';

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
        t: PropTypes.func,
    };

    render() {
        const showIcon = true;
        const translator = this.context.t;
        let expandable = true;
        let titleColor = jsStyles.errorColor;
        let closeIcon = 'keyboard_arrow_down';
        let openIcon = 'keyboard_arrow_up';
        let cardText = null;

        if (!Array.isArray(this.props.content)) {
            cardText = (
                <CardText style={jsStyles.noPaddingTop} expandable={expandable}>
                    {
                        Object.keys(this.props.content).map(element => (
                            <span key={element}>
                                <h4>element</h4>
                                <p>{this.props.content[element]}</p>
                            </span>
                        ))
                    };
                </CardText>
            );
        } else if (this.props.content.length) {
            cardText = (
                <CardText style={jsStyles.noPaddingTop} expandable={expandable}>
                    {
                        this.props.content.map(string =>
                            <p key={string}>{string}</p>,
                        )
                    }
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
            <Paper className={styles.paper} zDepth={2}>
                <Card>
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
            </Paper>
        );
    }
}

export default DataIntegrityCard;
