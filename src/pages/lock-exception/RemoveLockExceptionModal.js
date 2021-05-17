import { useAlert } from '@dhis2/app-runtime'
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
import React, { useState } from 'react'

const RemoveLockExceptionModal = ({ onRemove, onClose }) => {
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
    const [isLoading, setIsLoading] = useState(false)
    const handleRemove = async () => {
        setIsLoading(true)
        try {
            await onRemove()
            successAlert.show()
            onClose()
        } catch (error) {
            errorAlert.show({ error })
        }
        setIsLoading(false)
    }

    return (
        <Modal onClose={onClose}>
            <ModalTitle>{i18n.t('Remove lock exception')}</ModalTitle>
            <ModalContent>
                {i18n.t('Are you sure you want to remove this lock exception?')}
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button disabled={isLoading} onClick={onClose}>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button
                        destructive
                        disabled={isLoading}
                        onClick={handleRemove}
                    >
                        {isLoading ? (
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
    onClose: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
}

export default RemoveLockExceptionModal
