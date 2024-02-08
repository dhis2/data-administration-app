import React, { useState, useMemo } from 'react'
import { CircularLoaderCentered } from '../../../components/Loading/CircularLoaderCentered.js'
import { CheckDetailsView } from '../details/CheckDetailsView.js'
import { useDataIntegritySummary } from '../use-data-integrity-summary.js'
import { List } from './List.js'
import css from './List.module.css'
import { ListToolbar } from './ListToolbar.js'
import { SORT } from './sorter.js'

const filterCheck = (check, filter) => {
    if (!filter || !filter.trim().length === 0) {
        return true
    }
    return check.displayName?.toLowerCase().includes(filter.toLowerCase())
}

export const DataIntegrityList = () => {
    const [filter, setFilter] = useState('')
    const [selectedSort, setSelectedSort] = useState(SORT['A-Z'].value)

    const sorter = useMemo(() => SORT[selectedSort].sorter, [selectedSort])
    const [selectedCheck, setSelectedCheck] = useState(null)

    const { startDataIntegrityCheck, checks, loadingChecks, runningCheck } =
        useDataIntegritySummary()

    const filteredChecks = useMemo(
        () =>
            checks?.filter((check) => filterCheck(check, filter)).sort(sorter),
        [checks, filter, sorter]
    )

    return (
        <div className={css.listWrapper}>
            <ListToolbar
                setFilter={setFilter}
                filter={filter}
                onRunAll={() => {
                    startDataIntegrityCheck()
                }}
                runningAll={runningCheck}
                sort={selectedSort}
                setSort={setSelectedSort}
            />
            <ListDetailsLayout>
                {loadingChecks ? (
                    <CircularLoaderCentered />
                ) : (
                    <List
                        selectedCheck={selectedCheck}
                        setSelectedCheck={setSelectedCheck}
                        checks={filteredChecks}
                    />
                )}
                <CheckDetailsView key={selectedCheck?.name} selectedCheck={selectedCheck} />
            </ListDetailsLayout>
        </div>
    )
}

const ListDetailsLayout = ({ children }) => {
    return <div className={css.listDetailsWrapper}>{children}</div>
}
