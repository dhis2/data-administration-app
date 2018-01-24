import React from 'react';
import PropTypes from 'prop-types';

import Page from '../Page';
import PageContainer from '../PageContainer';

class MinMaxValueGeneration extends Page {
    static propTypes = {
        t: PropTypes.func.isRequired,
        pageInfo: PropTypes.object.isRequired,
    }

    render() {
        return (
            <PageContainer header={this.props.t(this.props.pageInfo.label)}>MinMaxValueGeneration</PageContainer>
        );
    }
}

export default MinMaxValueGeneration;
