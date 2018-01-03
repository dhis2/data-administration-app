import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { GridList } from 'material-ui/GridList';

// Components
import GridSectionComponent from './gridSection.component';

import './homepage.css';

// App configs
import {
    sections,
    HOME_SECTION_KEY,
} from '../../configs/sections.conf';

const HomePageComponent = (props) => {
    const setContainer = props.setContainer;
    const gridElements = sections.filter(section => section.key !== HOME_SECTION_KEY).map(section => (
        <GridSectionComponent t={props.t} key={section.key} section={section} setContainer={setContainer} />
    ));

    return (
        <div>
            <GridList className="grid-container" cellHeight={218} cols={3} padding={8}>
                {gridElements}
            </GridList>
        </div>
    );
};

HomePageComponent.propTypes = {
    setContainer: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
};


export default HomePageComponent;
