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

   componentWillMount() {
       this.props.updateAppState({
           loading: true,
           currentSection: this.props.sectionKey,
       });
   }

   componentDidMount() {
       this.props.updateAppState({
           loading: false,
       });
   }

   render() {
       return (
           <PageContainer header={this.props.pageInfo.label}>
               <MaintenanceContainer
                   t={this.props.t}
                   updateAppState={this.props.updateAppState}
               />
           </PageContainer>
       );
   }
}

export default Maintenance;
