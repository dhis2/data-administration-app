import React from 'react';
import PropTypes from 'prop-types';

import Page from '../Page';
import PageContainer from '../PageContainer';

class DataIntegrity extends Page {
    static propTypes = {
        t: PropTypes.func.isRequired,
        pageInfo: PropTypes.object.isRequired,
    }

    render() {
        return (
            <PageContainer header={this.props.t(this.props.pageInfo.label)}>Data Integrity</PageContainer>
        );
    }
}

export default DataIntegrity;
