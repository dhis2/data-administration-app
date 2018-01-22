import React from 'react';
import PropTypes from 'prop-types';

import PageContainer from '../PageContainer';
import MaintenanceContainer from './MaintenanceContainer';

const Maintenance = props => (
    <PageContainer header={props.pageInfo.label}>
        <MaintenanceContainer
            t={props.t}
            toggleLoading={props.toggleLoading}
        />
    </PageContainer>
);

Maintenance.propTypes = {
    t: PropTypes.func.isRequired,
    pageInfo: PropTypes.shape({
        label: PropTypes.string,
    }).isRequired,
    toggleLoading: PropTypes.func.isRequired,
};

export default Maintenance;
