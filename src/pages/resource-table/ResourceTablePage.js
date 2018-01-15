import React from 'react';
import PropTypes from 'prop-types';

import PageContainer from '../PageContainer';
import ResourceTableContainer from './ResourceTableContainer';

const ResourceTablePage = props => (
    <PageContainer header={props.pageInfo.label}>
        <ResourceTableContainer t={props.t} />
    </PageContainer>
);

ResourceTablePage.propTypes = {
    t: PropTypes.func.isRequired,
    pageInfo: PropTypes.object.isRequired,
};

export default ResourceTablePage;
