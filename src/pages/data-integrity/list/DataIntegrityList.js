import { Card, CircularLoader } from '@dhis2/ui'
import React, { useState, useMemo } from 'react'
import { useDataIntegrityChecks } from '../use-data-integrity-checks.js'
import { CheckDetails } from '../CheckDetails/CheckDetails.js'
import { List } from './List.js'
import css from './List.module.css'
import { ListToolbar } from './ListToolbar.js'
import i18n from '@dhis2/d2-i18n'
import { useDataIntegrity } from '../use-data-integrity.js'
import { useDataIntegritySummary } from '../use-data-integrity-summary.js'
import { SORT } from './sorter.js'
import { CircularLoaderCentered } from '../../../components/Loading/CircularLoaderCentered.js'

export const DataIntegrityList = () => {
    const [filter, setFilter] = useState('')
    const [selectedSort, setSelectedSort] = useState(SORT['A-Z'].value)

    console.log({ sort: selectedSort })
    const sorter = useMemo(() => SORT[selectedSort].sorter, [selectedSort])
    const [selectedCheck, setSelectedCheck] = useState(null)

    const { startDataIntegrityCheck, checks, loadingChecks, runningCheck } =
        useDataIntegritySummary()
    // const { startDataIntegrityCheck, loading: running, error } = useDataIntegrity()

    const filteredChecks = useMemo(
        () =>
            checks
                ?.filter(
                    (check) => !filter || check.displayName.includes(filter)
                )
                .sort(sorter),
        [checks, filter, sorter]
    )
    // console.log({running, error})
    return (
        <Card>
            <ListToolbar
                setFilter={setFilter}
                filter={filter}
                onRunAll={() => {
                    console.log('ON RUN ALL')
                    startDataIntegrityCheck()
                }}
                runningAll={runningCheck}
                sort={selectedSort}
                setSort={setSelectedSort}
            />
            <ListDetailsLayout>
                {loadingChecks ? (
                    <CircularLoaderCentered  />
                ) : (
                    <List
                        selectedCheck={selectedCheck}
                        setSelectedCheck={setSelectedCheck}
                        checks={filteredChecks}
                    />
                )}
                {selectedCheck ? (
                    <CheckDetails
                        key={selectedCheck.name}
                        check={selectedCheck}
                    />
                ) : (
                    <ChooseCheck />
                )}
            </ListDetailsLayout>
        </Card>
    )
}

const ChooseCheck = () => (
    <div className={css.chooseCheckMessage}>
        {i18n.t(
            'Choose a check to run from the list, or run all checks form the toolbar above'
        )}
    </div>
)

const ListDetailsLayout = ({ children }) => {
    return <div className={css.listDetailsWrapper}>{children}</div>
}
