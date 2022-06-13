import React from 'react'
import { sections } from '../sections.conf.js'
import styles from './Home.module.css'
import HomeCard from './HomeCard/HomeCard.js'

const Home = () => (
    <div className={styles.grid}>
        {sections.map((section) => (
            <HomeCard
                key={section.key}
                to={section.path}
                titleText={section.info.label}
                bodyText={section.info.description}
                linkText={section.info.actionText}
            />
        ))}
    </div>
)

export default Home
