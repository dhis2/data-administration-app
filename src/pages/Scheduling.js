import React from 'react';
import PropTypes from 'prop-types';
import PageContainer from './PageContainer';

const Scheduling = props => (
    <PageContainer header={props.t(props.pageInfo.label)}>Scheduling</PageContainer>
);

Scheduling.propTypes = {
    t: PropTypes.func.isRequired,
    pageInfo: PropTypes.object.isRequired,
};

export default Scheduling;
