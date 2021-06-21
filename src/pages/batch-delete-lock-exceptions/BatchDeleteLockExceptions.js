import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import classnames from 'classnames'
import FontIcon from 'material-ui/FontIcon'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LockExceptionsTable from '../../components/LockExceptionsTable/LockExceptionsTable'
import RemoveLockExceptionModal from '../../components/RemoveLockExceptionModal/RemoveLockExceptionModal'
import { parseLockExceptions } from '../../parse-lock-exceptions'
import lockExceptionsStyles from '../lock-exceptions/LockExceptions.module.css'

const query = {
    batchedLockExceptions: {
        resource: 'lockExceptions/combinations',
        params: {
            fields: 'name,period[id,displayName],dataSet[id,displayName]',
        },
    },
}

const BatchDeleteLockExceptions = () => {
    const { loading, error, data, refetch } = useDataQuery(query)
    const [removeLockExceptionModal, setRemoveLockExceptionModal] = useState({
        visible: false,
        lockException: null,
    })

    const lockExceptions =
        data && parseLockExceptions(data.batchedLockExceptions.lockExceptions)
    const handleShowRemoveLockExceptionModal = lockException => {
        setRemoveLockExceptionModal({
            visible: true,
            lockException,
        })
    }
    const handleCloseRemoveLockExceptionModal = () => {
        setRemoveLockExceptionModal({
            visible: false,
            lockException: null,
        })
    }

    return (
        <>
            <div className={lockExceptionsStyles.headerContainer}>
                <Link to="/lock-exception">
                    <span title={i18n.t('Go back to all lock exceptions')}>
                        <FontIcon
                            className={classnames(
                                'material-icons',
                                lockExceptionsStyles.backArrowIcon
                            )}
                        >
                            arrow_back
                        </FontIcon>
                    </span>
                </Link>
                <h1 className={lockExceptionsStyles.header}>
                    <span>{i18n.t('Lock Exception')}</span>
                    <span className={lockExceptionsStyles.headerDivider}>
                        {' '}
                        |{' '}
                    </span>
                    <span className={lockExceptionsStyles.subHeader}>
                        {i18n.t('Batch Deletion')}
                    </span>
                </h1>
            </div>
            {error ? (
                <NoticeBox error>{error.message}</NoticeBox>
            ) : loading ? (
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            ) : lockExceptions.length > 0 ? (
                <LockExceptionsTable
                    columns={['dataSet', 'period']}
                    rows={lockExceptions}
                    onRemoveLockException={handleShowRemoveLockExceptionModal}
                    atBatchDeletionPage={true}
                />
            ) : (
                <em>{i18n.t('No lock exceptions to show.')}</em>
            )}
            {removeLockExceptionModal.visible && (
                <RemoveLockExceptionModal
                    lockException={removeLockExceptionModal.lockException}
                    onRemove={refetch}
                    onClose={handleCloseRemoveLockExceptionModal}
                />
            )}
        </>
    )
}

export default BatchDeleteLockExceptions
