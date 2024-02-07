import cx from 'classnames'
import React from 'react'
import { LastRunTime } from './LastRunTime.js'
import css from './List.module.css'
import { StatusIcon } from './StatusIcon.js'

export const List = ({ setSelectedCheck, selectedCheck, checks }) => {

    return (
        <div className={css.list}>
            {checks?.map((check) => (
                    <ListItem
                        key={check.name}
                        setSelectedCheck={setSelectedCheck}
                        check={check}
                        selected={check.name === selectedCheck?.name}
                    />
                ))}
        </div>
    )
}

export const ListItem = ({ setSelectedCheck, check, selected }) => {
    return (
        <div
            className={cx(css.listItem, { [css.selected]: selected })}
            onClick={() => setSelectedCheck(check)}
        >
            <div className={css.checkInfo}>
                <header>{check.displayName}</header>
                <div className={css.subtitle}>
                    <LastRunTime value={check.runInfo?.finishedTime} />
                    {check.section}
                </div>
            </div>
            <span className={css.statusIcon}>
                <StatusIcon count={check?.runInfo?.count} loading={check.loading} />
            </span>
        </div>
    )
}
