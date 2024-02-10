import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { useMergedCheck } from '../checkDetailsStore.js'
import { getSeverityTranslation } from '../severityTranslation.js'
import { LastRunTime } from './LastRunTime.js'
import css from './List.module.css'
import { StatusIcon } from './StatusIcon.js'

export const List = ({ setSelectedCheck, selectedCheck, checks }) => {
    return (
        <div className={css.list}>
            {checks?.length === 0 ? (
                <p className={css.noItemsMessage}>
                    {i18n.t('No integrity check matches your search criteria.')}
                </p>
            ) : null}
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

List.propTypes = {
    setSelectedCheck: PropTypes.func.isRequired,
    checks: PropTypes.array,
    selectedCheck: PropTypes.object,
}

export const ListItem = memo(function ListItem({
    setSelectedCheck,
    check,
    selected,
}) {
    const mergedCheck = useMergedCheck(check)

    return (
        <div
            className={cx(css.listItem, { [css.selected]: selected })}
            onClick={() => setSelectedCheck(check)}
        >
            <div className={css.checkInfo}>
                <header>{mergedCheck.displayName}</header>
                <div className={css.subtitle}>
                    <span>{getSeverityTranslation(mergedCheck.severity)}</span>
                    <VerticalDivider />
                    <span className={css.subtitleSection}>
                        {mergedCheck.section}
                    </span>
                    {mergedCheck.runInfo?.finishedTime ? (
                        <>
                            <VerticalDivider />
                            <LastRunTime
                                value={mergedCheck.runInfo?.finishedTime}
                            />
                        </>
                    ) : null}
                </div>
            </div>
            <span className={css.statusIcon}>
                <StatusIcon
                    count={mergedCheck.runInfo?.count}
                    loading={check.loading}
                />
            </span>
        </div>
    )
})

ListItem.propTypes = {
    check: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    setSelectedCheck: PropTypes.func.isRequired,
}

const VerticalDivider = () => <span>|</span>
