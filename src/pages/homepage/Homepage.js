import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { GridList } from 'material-ui/GridList';

// Components
import GridSection from './GridSection';

import './Homepage.css';

// App configs
import {
    sections,
    HOME_SECTION_KEY,
} from '../../configs/sections.conf';

const HomePage = (props) => {
    const setContainer = props.setContainer;
    const gridElements = sections.filter(section => section.key !== HOME_SECTION_KEY).map(section => (
        <GridSection t={props.t} key={section.key} section={section} setContainer={setContainer} />
    ));

    return (
        <div>
            <GridList className="grid-container" cellHeight={218} cols={3} padding={8}>
                {gridElements}
            </GridList>
        </div>
    );
};

HomePage.propTypes = {
    setContainer: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
};


export default HomePage;
