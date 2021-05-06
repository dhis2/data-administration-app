import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from '../../pages/home/Home'
import { sections } from '../../pages/sections.conf'

const Routes = () => (
    <Switch>
        <Route exact path="/" component={Home} />
        {sections.map(section => (
            <Route
                key={section.key}
                path={section.path}
                component={section.component}
            />
        ))}
        <Redirect from="*" to="/" />
    </Switch>
)

export default Routes
