import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    CircularLoader,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const mutation = {
    resource: 'lockExceptions',
    type: 'delete',
    params: params => params,
}

const RemoveLockExceptionModal = ({ lockException, onRemove, onClose }) => {
    const successAlert = useAlert(i18n.t('Lock exception removed'), {
        success: true,
    })
    const errorAlert = useAlert(
        ({ error }) =>
            i18n.t('Error removing lock exception: {{error}}', {
                error,
                nsSeparator: null,
            }),
        { critical: true }
    )
    const [mutate, { loading }] = useDataMutation(mutation, {
        onComplete: () => {
            successAlert.show()
            onRemove()
            onClose()
        },
        onError: error => errorAlert.show({ error }),
    })

    const handleRemoveLockException = () => {
        const params = {
            pe: lockException.periodId,
            ds: lockException.dataSetId,
        }
        if (lockException.organisationUnitId) {
            params.ou = lockException.organisationUnitId
        }
        mutate(params)
    }

    return (
        <Modal onClose={onClose}>
            <ModalTitle>{i18n.t('Remove lock exception')}</ModalTitle>
            <ModalContent>
                {i18n.t('Are you sure you want to remove this lock exception?')}
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button disabled={loading} onClick={onClose}>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button
                        destructive
                        disabled={loading}
                        onClick={handleRemoveLockException}
                    >
                        {loading ? (
                            <>
                                {i18n.t('Removing lock exception...')}
                                <CircularLoader small />
                            </>
                        ) : (
                            i18n.t('Yes, remove lock exception')
                        )}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

RemoveLockExceptionModal.propTypes = {
    lockException: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
}

export default RemoveLockExceptionModal
