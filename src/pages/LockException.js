import React from 'react';
import PropTypes from 'prop-types';
import PageContainer from './PageContainer';

const LockException = props => (
    <PageContainer header={props.t(props.pageInfo.label)}>LockException</PageContainer>
);

LockException.propTypes = {
    t: PropTypes.func.isRequired,
    pageInfo: PropTypes.object.isRequired,
};

export default LockException;
