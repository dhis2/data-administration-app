import React from 'react';

import { Card, CardText } from 'material-ui/Card';
import { RaisedButton } from 'material-ui';

import Page from '../Page';
import PageHelper from '../../components/page-helper/PageHelper';
import { getDocsKeyForSection } from '../sections.conf';

// i18n
import { i18nKeys } from '../../i18n';

class Analytics extends Page {
    static STATE_PROPERTIES = [
        'loading',
    ];

    constructor() {
        super();

        this.state = {
            intervalId: null,
            loading: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        const nextState = {};

        Object.keys(nextProps).forEach((property) => {
            if (nextProps.hasOwnProperty(property) && Analytics.STATE_PROPERTIES.includes(property)) {
                nextState[property] = nextProps[property];
            }
        });

        if (nextState !== {}) {
            this.setState(nextState);
        }
    }

    render() {
        const translator = this.context.translator;
        return (
            <div>
                <h1>
                    { translator(i18nKeys.analytics.title) }
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
                    />
                </h1>
                <Card>
                    <CardText>
                        <RaisedButton
                            primary
                            label={translator(i18nKeys.analytics.actionButton)}
                            disabled={this.state.loading}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default Analytics;
