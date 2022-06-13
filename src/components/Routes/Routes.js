import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import AddLockException from '../../pages/add-lock-exception/AddLockException.js'
import BatchDeleteLockExceptions from '../../pages/batch-delete-lock-exceptions/BatchDeleteLockExceptions.js'
import Home from '../../pages/home/Home.js'
import { sections } from '../../pages/sections.conf.js'

const Routes = () => (
    <Switch>
        <Route exact path="/" component={Home} />
        {sections.map((section) => (
            <Route
                key={section.key}
                exact
                path={section.path}
                component={(props) => (
                    <section.component sectionKey={section.key} {...props} />
                )}
            />
        ))}
        {/* These routes are not in `sections.conf.js` as we are deprecating
            this pattern (see https://jira.dhis2.org/browse/DHIS2-11344) */}
        <Route
            path="/lock-exceptions/batch-deletion"
            component={BatchDeleteLockExceptions}
        />
        <Route path="/lock-exceptions/add" component={AddLockException} />
        <Redirect from="*" to="/" />
    </Switch>
)

export default Routes
