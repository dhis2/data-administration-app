import React, { useState } from 'react'
import css from './List.module.css'
import { ListToolbar } from './ListToolbar.js'
import { LastRunTime } from './LastRunTime.js'
import i18n from '../../../locales/index.js'
import { IconError16 } from '@dhis2/ui'
import { StatusIcon } from './StatusIcon.js'
import cx from 'classnames'

export const List = ({ filter, setSelectedCheck, selectedCheck, checks }) => {
    console.log('selected', selectedCheck)
    return (
        <div className={css.list}>
            {checks
                ?.filter(
                    (check) => !filter || check.displayName.includes(filter)
                )
                .map((check) => (
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
                <StatusIcon count={check?.runInfo.count} loading={check.loading} />
            </span>
        </div>
    )
}
