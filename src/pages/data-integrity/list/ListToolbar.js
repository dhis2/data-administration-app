import i18n from '@dhis2/d2-i18n'
import { Button, Input, SingleSelect, SingleSelectOption } from '@dhis2/ui'
import React from 'react'
import css from './List.module.css'

export const ListToolbar = ({ filter, setFilter, sort, setSort, onRunAll, runningAll }) => {
    return (
        <div className={css.listToolbar}>
            <Input
            dense
                className={css.searchInput}
                placeholder={i18n.t('Search')}
                name="search"
                onChange={({ value }) => setFilter(value)}
                value={filter}
            />
            <SingleSelect dense placeholder="Sort" className={css.searchInput}>
                <SingleSelectOption label="A-Z" value="name" />
                <SingleSelectOption label="Last run" value="lastRun" />
                <SingleSelectOption label="Section" value="section" />
                <SingleSelectOption label="Number of errors" value="errors" />
            </SingleSelect>
            <Button disabled={runningAll} onClick={onRunAll}>{i18n.t('Run all checks')}</Button>
        </div>
    )
}
