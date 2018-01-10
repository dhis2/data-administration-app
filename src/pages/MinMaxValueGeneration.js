import React from 'react';
import PropTypes from 'prop-types';
import PageContainer from './PageContainer';

const MinMaxValueGeneration = props => (
    <PageContainer header={props.t(props.pageInfo.label)}>MinMaxValueGeneration</PageContainer>
);

MinMaxValueGeneration.propTypes = {
    t: PropTypes.func.isRequired,
    pageInfo: PropTypes.object.isRequired,
};

export default MinMaxValueGeneration;
