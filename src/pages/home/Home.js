import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

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

    render() {
        const gridElements = sections.filter(section => section.key !== HOME_SECTION_KEY).map(section => (
            <div key={section.key} className={classNames('col-sm-12 col-md-6 col-lg-4', styles.gridContainer)}>
                <GridSection key={section.key} t={this.props.t} section={section} />
            </div>
        ));

        return (
            <div id="grid-list-id" className="row">
                {gridElements}
            </div>
        );
    }
}

export default Home;
