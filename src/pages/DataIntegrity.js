import React from 'react';
import PropTypes from 'prop-types';
import PageContainer from './PageContainer';

const DataIntegrity = props => (
    <PageContainer header={props.t(props.pageInfo.label)}>Data Integrity</PageContainer>
);

DataIntegrity.propTypes = {
    t: PropTypes.func.isRequired,
    pageInfo: PropTypes.object.isRequired,
};

export default DataIntegrity;
