import i18n from '@dhis2/d2-i18n'
import {
    Button,
    IconInfo16,
    Input,
    SingleSelect,
    SingleSelectOption,
    Tab,
    TabBar,
} from '@dhis2/ui'
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
    selectedSlow,
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
            {selectedSlow && (
                <span className={css.slowCheckInfo}>
                    <IconInfo16 />
                    {i18n.t('Slow checks must be run individually')}
                </span>
            )}
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
    selectedSlow: PropTypes.bool,
}

export const ToolbarTabs = ({ selectedTab, setSelectedTab }) => {
    return (
        <TabBar className={css.toolbarTabs}>
            <Tab
                selected={selectedTab === 'standard'}
                onClick={() => setSelectedTab('standard')}
            >
                {i18n.t('Standard checks')}
            </Tab>
            <Tab
                selected={selectedTab === 'slow'}
                onClick={() => setSelectedTab('slow')}
            >
                {i18n.t('Slow checks')}
            </Tab>
        </TabBar>
    )
}

ToolbarTabs.propTypes = {
    selectedTab: PropTypes.string.isRequired,
    setSelectedTab: PropTypes.func.isRequired,
}
