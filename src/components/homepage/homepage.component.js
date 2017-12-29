import React, { Component } from 'react';

// Material UI
import {GridList} from 'material-ui/GridList';

// Components
import GridSectionComponent from './gridSection.component';

import './homepage.css';

// App configs
import {
  sections,
  HOME_SECTION_KEY,
} from '../../configs/sections.conf';

class HomePageComponent extends Component {
  render() {
    const setContainer = this.props.setContainer;
    const gridElements = sections.filter(section => section.key !== HOME_SECTION_KEY).map((section) => {
      return (
        <GridSectionComponent t={this.props.t} key={section.key} section={section} setContainer={setContainer} />
      );
    });

    return (
      <div>
        <GridList className="grid-container" cellHeight={218} cols={3} padding={8}>
          {gridElements}
        </GridList>
      </div>
    );
  }
}

export default HomePageComponent;
