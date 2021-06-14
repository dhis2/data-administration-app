import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from '../../pages/home/Home'
import AddLockException from '../../pages/lock-exception/AddLockException.js'
import BatchDeleteLockExceptions from '../../pages/lock-exception/BatchDeleteLockExceptions'
import { sections } from '../../pages/sections.conf'

const Routes = () => (
    <Switch>
        <Route exact path="/" component={Home} />
        {sections.map(section => (
            <Route
                key={section.key}
                exact
                path={section.path}
                component={props => (
                    <section.component sectionKey={section.key} {...props} />
                )}
            />
        ))}
        <Route
            path="/lock-exception/batch-deletion"
            component={BatchDeleteLockExceptions}
        />
        <Route path="/lock-exception/add" component={AddLockException} />
        <Redirect from="*" to="/" />
    </Switch>
)

export default Routes
