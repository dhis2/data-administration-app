import React from 'react';
import PropTypes from 'prop-types';

import PageContainer from '../PageContainer';
import MaintenanceContainer from './MaintenanceContainer';

const MaintenancePage = props => (
    <PageContainer header={props.pageInfo.label}>
        <MaintenanceContainer
            t={props.t}
            toggleLoading={props.toggleLoading}
        />
    </PageContainer>
);

MaintenancePage.propTypes = {
    t: PropTypes.func.isRequired,
    pageInfo: PropTypes.object.isRequired,
    toggleLoading: PropTypes.func.isRequired,
};

export default MaintenancePage;
