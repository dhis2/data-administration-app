import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { GridList } from 'material-ui/GridList';

// Components
import GridSection from './grid-section/GridSection';

import styles from './Homepage.css';

// App configs
import {
    sections,
    HOME_SECTION_KEY,
} from '../sections.conf';

const HomePage = (props) => {
    const gridElements = sections.filter(section => section.key !== HOME_SECTION_KEY).map(section => (
        <GridSection key={section.key} t={props.t} section={section} />
    ));

    return (
        <GridList className={styles.gridContainer} cellHeight={218} cols={3} padding={8}>
            {gridElements}
        </GridList>
    );
};

HomePage.propTypes = {
    t: PropTypes.func.isRequired,
};

export default HomePage;
