import PropTypes from 'prop-types'
import React, { useState, useMemo, useEffect } from 'react'
import { ErrorOrLoading } from '../../../components/Loading/ErrorOrLoading.js'
import { CheckDetailsView } from '../details/CheckDetailsView.js'
import { useDataIntegritySummary } from '../use-data-integrity-summary.js'
import { useSelectedCheck } from '../use-selected-check.js'
import { List } from './List.js'
import css from './List.module.css'
import { ListToolbar, ToolbarTabs } from './ListToolbar.js'
import { SORT } from './sorter.js'

const filterCheck = (check, filter) => {
    if (!filter || !filter.trim().length === 0) {
        return true
    }
    return check.displayName?.toLowerCase().includes(filter.toLowerCase())
}

export const DataIntegrityList = () => {
    const [filter, setFilter] = useState('')
    const [selectedTab, setSelectedTab] = useState('standard')
    const [selectedSort, setSelectedSort] = useState(SORT['A-Z'].value)

    const sorter = useMemo(() => SORT[selectedSort].sorter, [selectedSort])
    const {
        startDataIntegrityCheck,
        checks,
        checksError,
        loading,
        runningCheck,
    } = useDataIntegritySummary()

    const [selectedCheck, setSelectedCheck] = useSelectedCheck(checks)
    const selectedSlow = selectedTab === 'slow'

    // keep selected-tab in sync
    useEffect(() => {
        if(selectedTab !== 'slow' && selectedCheck?.isSlow) {
            setSelectedTab('slow')
        }
    }, [selectedCheck, selectedTab])

    const filteredChecks = useMemo(
        () =>
            checks
                ?.filter(
                    (check) =>
                        (selectedSlow ? check.isSlow : !check.isSlow) &&
                        filterCheck(check, filter)
                )
                .sort(sorter),
        [checks, filter, sorter, selectedSlow]
    )

    return (
        <div className={css.listWrapper}>
            <ToolbarTabs
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
            />
            <ListToolbar
                setFilter={setFilter}
                filter={filter}
                onRunAll={() => {
                    startDataIntegrityCheck()
                }}
                runningAll={runningCheck}
                sort={selectedSort}
                setSort={setSelectedSort}
                selectedSlow={selectedSlow}
            />
            <ListDetailsLayout>
                <ErrorOrLoading error={checksError} loading={loading}>
                    <List
                        selectedCheck={selectedCheck}
                        setSelectedCheck={setSelectedCheck}
                        checks={filteredChecks}
                    />
                </ErrorOrLoading>
                <CheckDetailsView
                    key={selectedCheck?.name}
                    selectedCheck={selectedCheck}
                />
            </ListDetailsLayout>
        </div>
    )
}

const ListDetailsLayout = ({ children }) => {
    return <div className={css.listDetailsWrapper}>{children}</div>
}

ListDetailsLayout.propTypes = {
    children: PropTypes.node,
}
