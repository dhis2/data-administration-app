import React from 'react';
import PropTypes from 'prop-types';

import Page from '../Page';
import PageContainer from '../PageContainer';
import MaintenanceContainer from './MaintenanceContainer';

class Maintenance extends Page {
   static propTypes = {
       t: PropTypes.func.isRequired,
       pageInfo: PropTypes.shape({
           label: PropTypes.string,
       }).isRequired,
   }

   render() {
       return (
           <PageContainer header={this.props.pageInfo.label}>
               <MaintenanceContainer
                   t={this.props.t}
                   updateAppState={this.props.updateAppState}
                   {...this.props.pageState}
               />
           </PageContainer>
       );
   }
}

export default Maintenance;
