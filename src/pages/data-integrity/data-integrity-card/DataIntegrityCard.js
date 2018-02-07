import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Card, CardText, CardHeader } from 'material-ui/Card';
import { Paper } from 'material-ui';

import styles from './DataIntegrityCard.css';

class DataIntegrityCard extends PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        content: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.object,
        ]).isRequired,
    }

    static contextTypes = {
        t: PropTypes.func,
    };

    render() {
        const expandable = true;
        const translator = this.context.t;
        let info = [];
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
        } else {
            info = this.props.content;
        }
        return (
            <Paper className={styles.paper} zDepth={2}>
                <Card>
                    <CardHeader
                        titleColor={'#ff5722'}
                        titleStyle={{ fontSize: 14, fontWeight: 'normal' }}
                        title={translator(this.props.title)}
                        actAsExpander={expandable}
                        showExpandableButton={expandable}
                    />
                    <CardText
                        style={{ paddingTop: 0 }}
                        expandable={expandable}
                    >
                        {info}
                    </CardText>
                </Card>
            </Paper>
        );
    }
}

export default DataIntegrityCard;
