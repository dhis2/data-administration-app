import i18n from '@dhis2/d2-i18n'
import { Button, Input, SingleSelect, SingleSelectOption } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import css from './List.module.css'
import { SORT_OPTIONS } from './sorter.js'

export const ListToolbar = ({
    filter,
    setFilter,
    sort,
    setSort,
    onRunAll,
    runningAll,
}) => {
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
            <SingleSelect
                selected={sort}
                dense
                placeholder={i18n.t('Sort')}
                prefix={i18n.t('Sort')}
                className={css.searchInput}
                onChange={({ selected }) => setSort(selected)}
            >
                {SORT_OPTIONS.map(({ label, value }) => (
                    <SingleSelectOption
                        key={value}
                        label={label}
                        value={value}
                    />
                ))}
            </SingleSelect>
            <Button disabled={runningAll} onClick={onRunAll}>
                {i18n.t('Run integrity checks')}
            </Button>
        </div>
    )
}

ListToolbar.propTypes = {
    filter: PropTypes.string.isRequired,
    runningAll: PropTypes.bool.isRequired,
    setFilter: PropTypes.func.isRequired,
    setSort: PropTypes.func.isRequired,
    sort: PropTypes.string.isRequired,
    onRunAll: PropTypes.func.isRequired,
}
