import { Card, CircularLoader } from '@dhis2/ui'
import React, { useState, useMemo } from 'react'
import { useDataIntegrityChecks } from '../use-data-integrity-checks.js'
import { CheckDetails } from './CheckDetails.js'
import { List } from './List.js'
import css from './List.module.css'
import { ListToolbar } from './ListToolbar.js'
import i18n from '@dhis2/d2-i18n'

export const DataIntegrityList = () => {
    const [filter, setFilter] = useState('')
    const [selectedCheck, setSelectedCheck] = useState(null)

    const { checks, loading } = useDataIntegrityChecks()

    const filteredChecks = useMemo(
        () =>
            checks?.filter(
                (check) => !filter || check.displayName.includes(filter)
            ),
        [checks, filter]
    )
    return (
        <Card>
            <ListToolbar setFilter={setFilter} filter={filter} />
            {loading ? (
                <CircularLoader />
            ) : (
                <ListDetailsLayout>
                    <List
                        selectedCheck={selectedCheck}
                        setSelectedCheck={setSelectedCheck}
                        checks={filteredChecks}
                    />
                    {selectedCheck ? (
                        <CheckDetails check={selectedCheck} />
                    ) : (
                        <ChooseCheck />
                    )}
                </ListDetailsLayout>
            )}
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
