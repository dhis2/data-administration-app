import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { Card, CardText } from 'material-ui/Card';

import Page from '../Page';

class DataIntegrity extends Page {
    static propTypes = {
        t: PropTypes.func.isRequired,
        pageInfo: PropTypes.object.isRequired,
    }

    render() {
        return (
            <div className="page-wrapper">
                <h1>{this.props.t(this.props.pageInfo.label)}</h1>
                <Card>
                    <CardText>{this.props.t(this.props.pageInfo.label)}</CardText>
                </Card>
            </div>
        );
    }
}

export default DataIntegrity;
