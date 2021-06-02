import { useAlert } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import { ButtonStrip, Button, CircularLoader } from '@dhis2/ui'
import Dialog from 'material-ui/Dialog'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import AddLockExceptionForm from './AddLockExceptionForm'

const AddLockExceptionModal = ({
    levels,
    groups,
    dataSets,
    onAdd,
    onClose,
}) => {
    const successAlert = useAlert(i18n.t('Lock exception added'), {
        success: true,
    })
    const errorAlert = useAlert(
        ({ error }) =>
            i18n.t('Error adding lock exception: {{error}}', {
                error,
                nsSeparator: null,
            }),
        { critical: true }
    )
    const [isLoading, setIsLoading] = useState(false)
    const [selectedOrgUnits, setSelectedOrgUnits] = useState([])
    const [selectedDataSetId, setSelectedDataSetId] = useState(null)
    const [selectedPeriodId, setSelectedPeriodId] = useState(null)
    const { d2 } = useD2()
    const handleAdd = async () => {
        setIsLoading(true)
        try {
            await onAdd({
                selectedOrgUnits,
                selectedDataSetId,
                selectedPeriodId,
            })
            successAlert.show()
            onClose()
        } catch (error) {
            errorAlert.show({ error })
        }
        setIsLoading(false)
    }
    const isAddActionDisabled =
        isLoading ||
        !(selectedOrgUnits.length > 0 && selectedDataSetId && selectedPeriodId)

    // TODO: Need to use material UI Dialog component instead of @dhis2/ui Modal
    // component due to z-index issues - z-index of select fields used by d2-ui
    // organisation selection components is less than that of @dhis2/ui modal
    // and so appear behind
    return (
        <Dialog
            title={i18n.t('Add lock exception')}
            actions={
                <div data-test="add-lock-exception-modal-actions">
                    <ButtonStrip end>
                        <Button disabled={isLoading} onClick={onClose}>
                            {i18n.t('Cancel')}
                        </Button>
                        <Button
                            primary
                            disabled={isAddActionDisabled}
                            onClick={handleAdd}
                        >
                            {isLoading ? (
                                <>
                                    {i18n.t('Adding lock exception...')}
                                    <CircularLoader small />
                                </>
                            ) : (
                                i18n.t('Add lock exception')
                            )}
                        </Button>
                    </ButtonStrip>
                </div>
            }
            open={true}
            contentStyle={{ maxWidth: '80%' }}
            bodyStyle={{ overflowY: 'scroll' }}
            onRequestClose={onClose}
        >
            <div data-test="add-lock-exception-modal">
                <AddLockExceptionForm
                    d2={d2}
                    levels={levels}
                    groups={groups}
                    dataSets={dataSets}
                    updateSelectedOrgUnits={setSelectedOrgUnits}
                    updateSelectedDataSetId={setSelectedDataSetId}
                    updateSelectedPeriodId={setSelectedPeriodId}
                />
            </div>
        </Dialog>
    )
}

AddLockExceptionModal.propTypes = {
    dataSets: PropTypes.any.isRequired,
    groups: PropTypes.any.isRequired,
    levels: PropTypes.any.isRequired,
    onAdd: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default AddLockExceptionModal
