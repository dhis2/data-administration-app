import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import React, { useState } from 'react'
import LockExceptionsSubpageHeader from '../../components/LockExceptionsSubpageHeader/LockExceptionsSubpageHeader.jsx'
import LockExceptionsTable from '../../components/LockExceptionsTable/LockExceptionsTable.jsx'
import RemoveLockExceptionModal from '../../components/RemoveLockExceptionModal/RemoveLockExceptionModal.jsx'
import { parseLockExceptions } from '../../parse-lock-exceptions.js'

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
    const handleShowRemoveLockExceptionModal = (lockException) => {
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
            <LockExceptionsSubpageHeader title={i18n.t('Batch Deletion')} />
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
