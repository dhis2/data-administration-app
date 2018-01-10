import React from 'react';
import PropTypes from 'prop-types';

import PageContainer from '../PageContainer';
import ResourceTableContainer from './ResourceTableContainer';

const ResourceTablePage = props => (
    <PageContainer header={props.pageInfo.label}>
        <ResourceTableContainer t={props.t} showSnackbar={props.showSnackbar} />
    </PageContainer>
);

ResourceTablePage.propTypes = {
    t: PropTypes.func.isRequired,
    showSnackbar: PropTypes.func.isRequired,
    pageInfo: PropTypes.object.isRequired,
};

export default ResourceTablePage;
