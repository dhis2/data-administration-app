import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CenteredContent,
    CircularLoader,
    NoticeBox,
    Button,
    Pagination,
    ButtonStrip,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LockExceptionsTable from '../../components/LockExceptionsTable/LockExceptionsTable.jsx'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import RemoveLockExceptionModal from '../../components/RemoveLockExceptionModal/RemoveLockExceptionModal.jsx'
import { i18nKeys } from '../../i18n-keys.js'
import { parseLockExceptions } from '../../parse-lock-exceptions.js'
import styles from './LockExceptions.module.css'

const query = {
    lockExceptions: {
        resource: 'lockExceptions',
        params: (params) => ({
            ...params,
            fields: [
                'name',
                'period[id,displayName]',
                'organisationUnit[id,displayName]',
                'dataSet[id,displayName]',
            ],
            order: 'name:asc',
        }),
    },
}

const LockExceptions = ({ sectionKey }) => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const { loading, called, error, data, refetch } = useDataQuery(query, {
        lazy: true,
    })
    const [removeLockExceptionModal, setRemoveLockExceptionModal] = useState({
        visible: false,
        lockException: null,
    })

    useEffect(() => {
        refetch({
            page,
            pageSize,
        })
    }, [page, pageSize])

    const lockExceptions =
        data && parseLockExceptions(data.lockExceptions.lockExceptions)
    const renderPagination = () => {
        const { total, pageCount } = data.lockExceptions.pager
        return (
            <div className={styles.pagination}>
                <Pagination
                    total={total}
                    pageCount={pageCount}
                    page={page}
                    pageSize={pageSize}
                    onPageSizeChange={(pageSize) => {
                        setPage(1)
                        setPageSize(pageSize)
                    }}
                    onPageChange={(page) => setPage(page)}
                />
            </div>
        )
    }
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
        <div className={styles.lockExceptions}>
            <div className={styles.headerContainer}>
                <PageHeader
                    sectionKey={sectionKey}
                    title={i18nKeys.lockExceptions.title}
                />
                <ButtonStrip>
                    <Link
                        className={styles.linkButton}
                        to="/lock-exceptions/add"
                        tabIndex="-1"
                    >
                        <Button primary>{i18n.t('Add lock exception')}</Button>
                    </Link>
                    <Link
                        className={styles.linkButton}
                        to="/lock-exceptions/batch-deletion"
                        tabIndex="-1"
                    >
                        <Button>{i18n.t('Batch deletion')}</Button>
                    </Link>
                </ButtonStrip>
            </div>
            {error ? (
                <NoticeBox error>{error.message}</NoticeBox>
            ) : loading || !called ? (
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            ) : lockExceptions.length > 0 ? (
                <>
                    {renderPagination()}
                    <LockExceptionsTable
                        columns={['organisationUnit', 'dataSet', 'period']}
                        rows={lockExceptions}
                        onRemoveLockException={
                            handleShowRemoveLockExceptionModal
                        }
                        atBatchDeletionPage={false}
                    />
                    {renderPagination()}
                </>
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
        </div>
    )
}

LockExceptions.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default LockExceptions
