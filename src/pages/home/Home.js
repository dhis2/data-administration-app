import React from 'react';
import PropTypes from 'prop-types';

// Material UI
import { GridList } from 'material-ui/GridList';

// Components
import Page from '../Page';
import GridSection from './grid-section/GridSection';

import styles from './Home.css';

// App configs
import {
    sections,
    HOME_SECTION_KEY,
} from '../sections.conf';


class Home extends Page {
    static propTypes = {
        t: PropTypes.func.isRequired,
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
        const gridElements = sections.filter(section => section.key !== HOME_SECTION_KEY).map(section => (
            <GridSection key={section.key} t={this.props.t} section={section} />
        ));

        return (
            <GridList className={styles.gridContainer} cellHeight={218} cols={3} padding={8}>
                {gridElements}
            </GridList>
        );
    }
}

export default Home;
