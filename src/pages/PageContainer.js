import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { Card, CardText } from 'material-ui/Card';

const PageContainer = props => (
    <div className="page-wrapper">
        <h1>{props.header}</h1>
        <Card>
            <CardText>{props.children}</CardText>
        </Card>
    </div>
);

PageContainer.propTypes = {
    header: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default PageContainer;
