import React from 'react';

// Internatinalization: i18next
import { translate } from 'react-i18next';

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

const HomePage = () => {
    const GridSectionComponent = translate()(GridSection);
    const gridElements = sections.filter(section => section.key !== HOME_SECTION_KEY).map(section => (
        <GridSectionComponent key={section.key} section={section} />
    ));

    return (
        <div>
            <GridList className="grid-container" cellHeight={218} cols={3} padding={8}>
                {gridElements}
            </GridList>
        </div>
    );
};

export default HomePage;
