import i18n from '@dhis2/d2-i18n'
import { Button, IconSync16, Divider } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useLayoutEffect, useState, useRef } from 'react'
import { getSeverityTranslation } from '../severityTranslation.js'
import css from './CheckDetails.module.css'

export const CheckInfo = ({
    check,
    disableRun,
    onStartDetailsCheck,
    hasRun,
}) => {
    return (
        <div className={css.checkInfo}>
            <CheckHeader name={check.displayName}>
                <Button
                    small
                    disabled={disableRun}
                    icon={<IconSync16 />}
                    onClick={onStartDetailsCheck}
                >
                    {i18n.t('Re-run')}
                </Button>
            </CheckHeader>
            <Divider dense />

            <div className={css.keyInfoWrapper}>
                <CheckKeyInfoItem
                    label={i18n.t('Severity')}
                    value={getSeverityTranslation(check.severity)}
                />
                <CheckKeyInfoItem
                    label={i18n.t('Section')}
                    value={check.section}
                />
            </div>

            <CheckIntroduction introduction={check.introduction} />
        </div>
    )
}

CheckInfo.propTypes = {
    check: PropTypes.shape({
        displayName: PropTypes.string,
        introduction: PropTypes.string,
        name: PropTypes.string,
        severity: PropTypes.string,
    }).isRequired,
    hasRun: PropTypes.bool,
    isRunning: PropTypes.bool,
    onStartDetailsCheck: PropTypes.func,
}

const CheckHeader = ({ name, children }) => {
    return (
        <header>
            <h2>{name}</h2>
            {children}
        </header>
    )
}

const CheckKeyInfoItem = ({ label, value }) => {
    return (
        <div className={css.keyInfo}>
            <h3>{label}</h3>
            <span>{value}</span>
        </div>
    )
}

const CheckIntroduction = ({ introduction }) => {
    const [expanded, setExpanded] = useState(false)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const textRef = useRef(null)

    useLayoutEffect(() => {
        if (!textRef.current) {
            return
        }
        // handle dynamic overflowing
        // hiding the "fade" and "Show more" button when there's enough space
        const observer = new ResizeObserver(() => {
            if (!textRef.current) {
                return
            }
            setIsOverflowing(
                textRef.current.offsetHeight < textRef.current.scrollHeight
            )
        })
        observer.observe(textRef.current)
        return () => observer.disconnect()
    }, [expanded])

    return (
        <div className={css.introduction}>
            <h3>{i18n.t('About this check')}</h3>
            <p
                ref={textRef}
                className={cx(css.introductionText, {
                    [css.overflowing]: isOverflowing,
                    [css.expanded]: expanded,
                })}
            >
                {introduction}
            </p>
            {isOverflowing && (
                <div className={css.showMoreButton}>
                    <Button small onClick={() => setExpanded(true)}>
                        {i18n.t('Show more')}
                    </Button>
                </div>
            )}
        </div>
    )
}
