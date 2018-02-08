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
        const info = [];
        let expandable = true;
        let titleColor = jsStyles.errorColor;
        let cardTxt = null;
        let iconTypeClose = 'keyboard_arrow_down';
        let iconTypeOpen = 'keyboard_arrow_up';

        if (!Array.isArray(this.props.content)) {
            const keys = Object.keys(this.props.content);
            for (let i = 0; i < keys.length; i++) {
                info.push(
                    <span key={keys[i]}>
                        <h4>{keys[i]}</h4>
                        <p>{this.props.content[keys[i]]}</p>
                    </span>,
                );
            }
            cardTxt = (
                <CardText
                    style={{ paddingTop: 0 }}
                    expandable={expandable}
                >
                    {info}
                </CardText>
            );
        } else if (this.props.content.length) {
            cardTxt = (
                <CardText
                    style={{ paddingTop: 0 }}
                    expandable={expandable}
                >
                    {this.props.content.map(string => <p key={string}>{string}</p>)}
                </CardText>
            );
        } else {
            expandable = false;
            titleColor = jsStyles.noErrorColor;
            iconTypeClose = 'done';
            iconTypeOpen = 'done';
        }

        const iconClose = (
            <FontIcon className={'material-icons'}>
                {iconTypeClose}
            </FontIcon>
        );
        const iconOpen = (
            <FontIcon className={'material-icons'}>
                {iconTypeOpen}
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
                        closeIcon={iconClose}
                        openIcon={iconOpen}
                        iconStyle={!expandable ? jsStyles.iconStyle : {}}
                    />
                    {cardTxt}
                </Card>
            </Paper>
        );
    }
}

export default DataIntegrityCard;
