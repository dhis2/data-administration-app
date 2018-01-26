import React from 'react';

import classNames from 'classnames';

// Components
import Page from '../Page';
import GridSection from './grid-section/GridSection';

import styles from './Home.css';

// App configs
import { sections } from '../sections.conf';


class Home extends Page {
    render() {
        const gridElements = sections.map(section => (
            <div key={section.key} className={classNames('col-sm-12 col-md-6 col-lg-4', styles.gridContainer)}>
                <GridSection key={section.key} section={section} />
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
